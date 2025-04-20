import { prisma } from "@/prisma/client";

interface AddSiteAdminResponse {
  status: number;
  message: string;
  user?: any; // Define more specific type as needed
}

/**
 * Creates a new user and adds them as an admin to a site.
 * @param siteId The ID of the site to which the admin will be added.
 * @param username The username of the new admin.
 * @param name The name of the new admin.
 * @param email The email of the new admin.
 * @returns Promise<AddSiteAdminResponse>
 */
export const addSiteAdmin = async (
  siteId: string,
  username: string,
  name: string,
  email: string
): Promise<AddSiteAdminResponse> => {
  try {
    // Check if the email already exists in the database
    let user = await prisma.user.findUnique({
      where: { email },
      include: { administratedSites: true }, // Include administratedSites to check if the user is already an admin
    });

    if (!user) {
      // Create a new user if one does not exist
      user = await prisma.user.create({
        data: {
          name,
          email,
          username,
          isActive: true, // Set to true or false based on your business logic
          image: null,
        },
        include: { administratedSites: true }, // Include administratedSites to check if the user is already an admin
      });
    } else {
      // Check if the existing user is already an admin of the site
      const isAdmin = user.administratedSites.some(
        (site) => site.id === siteId
      );

      if (isAdmin) {
        return {
          status: 400,
          message: "This user is already an admin of this site.",
        };
      }
    }

    // Adding the user as an admin to the site
    const updatedSite = await prisma.site.update({
      where: { id: siteId },
      data: {
        admins: {
          connect: { id: user.id },
        },
      },
      include: {
        admins: true, // Optionally include other relations you want to return
      },
    });

    return {
      status: 200,
      message: "Admin added successfully.",
      user: user,
    };
  } catch (error) {
    console.error("Error creating admin and linking to site:", error);
    return {
      status: 500,
      message: "Failed to create admin due to an internal error.",
    };
  }
};
