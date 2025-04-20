import { prisma } from "@/prisma/client";

interface DeleteSiteAdminResponse {
  status: number;
  message: string;
}

/**
 * Deletes an admin from a site.
 * @param siteId The ID of the site from which the admin will be removed.
 * @param userId The ID of the admin to be removed.
 * @returns Promise<DeleteSiteAdminResponse>
 */
export const deleteSiteAdmin = async (
  siteId: string,
  userId: string
): Promise<DeleteSiteAdminResponse> => {
  try {
    // Disconnect the user from the site's admins relation
    await prisma.site.update({
      where: { id: siteId },
      data: {
        admins: {
          disconnect: { id: userId },
        },
      },
    });

    return {
      status: 200,
      message: "Admin removed successfully.",
    };
  } catch (error) {
    console.error("Error removing admin from site:", error);
    return {
      status: 500,
      message: "Failed to remove admin due to an internal error.",
    };
  }
};
