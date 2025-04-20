import { prisma } from "@/prisma/client";
import bcrypt from "bcrypt";

interface UserData {
  name: string;
  username: string;
  email: string;
  password: string;
  organization: string;
}

const createAdminUser = async (userData: UserData) => {
  const hashedPassword = await bcrypt.hash(userData.password, 12);

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
  if (existingEmail && existingUsername) {
    return {
      status: 400,
      message: "Both Email and Username exist.",
    };
  }
  if (existingEmail) {
    return {
      status: 400,
      message: "Email already exists.",
    };
  }
  if (existingUsername) {
    return {
      status: 400,
      message: "Username already exists.",
    };
  }

  // Check if organization exists
  const existingOrganization = await prisma.organization.findUnique({
    where: {
      name: userData.organization,
    },
  });

  if (existingOrganization) {
    return {
      status: 400,
      message:
        "Organization already exists. Please contact the organization admin to add you.",
    };
  }

  // Create new organization and associate user with it
  const newUser = await prisma.user.create({
    data: {
      name: userData.name,
      email: userData.email,
      username: userData.username,
      hashedPassword,
      isActive: false,
      organizations: {
        create: {
          name: userData.organization,
        },
      },
    },
  });

  return {
    status: 201,
    message: "Successfully created a user and organization.",
    user: {
      id: newUser.id,
      email: newUser.email,
    },
  };
};

export default createAdminUser;
