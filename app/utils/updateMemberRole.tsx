import { prisma } from "@/prisma/client";

// Utility function to update the role of a member in a site
export const updateMemberRole = async (userId, siteId, newRole) => {
  try {
    await prisma.siteRole.update({
      where: {
        userId_siteId: {
          userId,
          siteId,
        },
      },
      data: {
        role: newRole,
      },
    });
    return {
      status: 200,
      message: "Role updated successfully",
    };
  } catch (error) {
    console.error("Error updating role:", error);
    return {
      status: 500,
      message: "Failed to update role",
    };
  }
};
