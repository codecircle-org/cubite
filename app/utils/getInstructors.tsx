import { prisma } from "@/prisma/client";

interface Instructor {
  id: string;
  name: string;
  email: string;
  username: string;
  createdAt: Date;
  image?: string;
}

export const getInstructors = async (userEmail: string) => {
  // Find the user by email
  const user = await prisma.user.findUnique({
    where: {
      email: userEmail,
    },
  });

  if (!user) {
    return {
      status: 400,
      message: "User not found.",
    };
  }

  // Get the sites where the user is an admin or has a non-student role

  const sites = await prisma.site.findMany({
    where: {
      OR: [
        { admins: { some: { id: user.id } } },
        {
          siteRoles: {
            some: { userId: user.id, role: { in: ["MANAGER", "INSTRUCTOR"] } },
          },
        },
      ],
    },
    include: {
      admins: true,
      siteRoles: {
        include: {
          user: true,
        },
      },
    },
  });

  const users: Instructor[] = [];

  sites.forEach((site) => {
    site.admins.forEach((admin) => {
      users.push({
        id: admin.id,
        name: admin.name,
        email: admin.email,
        username: admin.username,
        createdAt: admin.createdAt,
        image: admin.image,
      });
    });

    site.siteRoles.forEach((role) => {
      if (role.role !== "STUDENT") {
        users.push({
          id: role.user.id,
          name: role.user.name,
          email: role.user.email,
          username: role.user.username,
          createdAt: role.user.createdAt,
          image: role.user.image,
        });
      }
    });
  });

  // Remove duplicate users based on email
  const instructors = Array.from(new Set(users.map((u) => u.email))).map(
    (email) => {
      return users.find((u) => u.email === email);
    }
  );

  return {
    status: 200,
    instructors,
  };
};
