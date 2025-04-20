// utils/deleteSiteMember.ts
import { prisma } from "@/prisma/client";

interface DeleteSiteMemberResponse {
  status: number;
  message: string;
}

export const deleteSiteMember = async (
  userId: string,
  siteId: string
): Promise<DeleteSiteMemberResponse> => {
  try {
    // Delete the site role for the user
    await prisma.siteRole.deleteMany({
      where: {
        userId,
        siteId,
      },
    });

    return {
      status: 200,
      message: "Member deleted successfully.",
    };
  } catch (error) {
    console.error("Error deleting member:", error);
    return {
      status: 500,
      message: "Failed to delete member due to an internal error.",
    };
  }
};
