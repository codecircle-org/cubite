import { prisma } from "@/prisma/client";

interface AddSiteMemberResponse {
  status: number;
  message: string;
  siteRole?: any; // Define more specific type as needed
}

/**
 * Adds a member to a site. If the user does not exist, creates a new user first.
 * @param siteId The ID of the site to which the member will be added.
 * @param username The username of the new member.
 * @param name The name of the new member.
 * @param email The email of the new member.
 * @param role The role of the new member.
 * @returns Promise<AddSiteMemberResponse>
 */
export const addSiteMember = async (
  siteId: string,
  username: string,
  name: string,
  email: string,
  role: string
): Promise<AddSiteMemberResponse> => {
  try {
    // Check if the email already exists in the database
    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Create a new user if one does not exist
      user = await prisma.user.create({
        data: {
          name,
          email,
          username,
          isActive: true, // Set to true or false based on your business logic
        },
      });
    } else {
      // Check if the existing user already has the role in the site
      const existingRole = await prisma.siteRole.findUnique({
        where: {
          userId_siteId: {
            userId: user.id,
            siteId,
          },
        },
      });

      if (existingRole) {
        return {
          status: 400,
          message: "This user already has a role in this site.",
        };
      }
    }

    // Adding the user as a member with the specified role to the site
    const updatedSiteRole = await prisma.siteRole.create({
      data: {
        userId: user.id,
        siteId,
        role: role as any, // Assuming role is a valid enum value
      },
      include: {
        user: true, // Optionally include other relations you want to return
      },
    });

    return {
      status: 200,
      message: "Member added successfully.",
      siteRole: updatedSiteRole,
    };
  } catch (error) {
    console.error("Error creating member and linking to site:", error);
    return {
      status: 500,
      message: "Failed to create member due to an internal error.",
    };
  }
};
