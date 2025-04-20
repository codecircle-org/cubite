import { prisma } from "@/prisma/client";
import bcrypt from "bcrypt";
import crypto from "crypto";

interface UserData {
  name: string;
  username: string;
  email: string;
  siteId: string;
}

const createSSOStudentUser = async (userData: UserData) => {
  const password = crypto.randomBytes(16).toString('base64');
  const hashedPassword = await bcrypt.hash(password, 12);

  // Check if email or username already exists
  const existingEmail = await prisma.user.findUnique({
    where: {
      email: userData.email,
    },
  });
  const existingUsername = await prisma.user.findUnique({
    where: {
      username: userData.username,
    },
  });

  // Check if site exists
  const existingSite = await prisma.site.findUnique({
    where: {
      id: userData.siteId,
    },
  });

  if (!existingSite) {
    return {
      status: 404,
      message: "Site not found.",
    };
  }

  // If user exists by email or username, check if they are already linked to the site
  if (existingEmail || existingUsername) {
    const existingUser = existingEmail || existingUsername;
    const existingSiteRole = await prisma.siteRole.findUnique({
      where: {
        userId_siteId: {
          userId: existingUser.id,
          siteId: userData.siteId,
        },
      },
    });

    if (existingSiteRole) {
      return {
        status: 409,
        message: "User already exists in the site.",
        user: {
          id: existingUser.id,
          email: existingUser.email,
        },
      };
    } else {
      // Link existing user to the site
      await prisma.siteRole.create({
        data: {
          userId: existingUser.id,
          siteId: userData.siteId,
          role: "STUDENT"
        },
      });

      return {
        status: 200,
        message: "Existing user linked to the site.",
        user: {
          id: existingUser.id,
          email: existingUser.email,
        },
      };
    }
  }

  // If no existing user, create new user and link to site
  const newUser = await prisma.user.create({
    data: {
      name: userData.name,
      email: userData.email,
      username: userData.username,
      hashedPassword,
      isActive: true,
      extraInfo: {},
      siteRoles: {
        create: {
          siteId: userData.siteId,
          role: "STUDENT",
        },
      },
    },
  });

  return {
    status: 201,
    message: "Successfully created a user and linked to the site.",
    user: {
      id: newUser.id,
      email: newUser.email,
    },
  };
};

export default createSSOStudentUser;
