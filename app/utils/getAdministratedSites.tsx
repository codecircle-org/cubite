import { prisma } from "@/prisma/client";

// Utility function to get administrated sites by a user
export const getAdministratedSites = async (userEmail: string) => {
  // Find the user by email
  const user = await prisma.user.findUnique({
    where: {
      email: userEmail,
    },
  });

  // Ensure user exists
  if (!user) {
    return {
      status: 400,
      message: "User not found.",
    };
  }

  let sites = [];

  if(user.isGlobalAdmin){
    sites = await prisma.site.findMany({
      include: {
        pages: true,
      },
    });
    return {
      status: 200,
      message: "Successfully fetched administrated sites",
      sites,
    };
  } else {
    // Get the sites where the user is an admin or has MANAGER/INSTRUCTOR role
    sites = await prisma.site.findMany({
      where: {
        OR: [
          {
            admins: {
              some: {
                id: user.id,
              },
            },
          },
          {
            siteRoles: {
              some: {
                userId: user.id,
                role: {
                  in: ['MANAGER', 'INSTRUCTOR'],
                },
              },
            },
          },
        ],
      },
      include: {
        pages: true,
      },
    });
  }


  return {
    status: 200,
    message: "Successfully fetched administrated sites",
    sites,
  };
};
