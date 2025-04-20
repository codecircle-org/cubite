import { prisma } from "@/prisma/client";

export const updateUser = async (userId: string, updateData: any) => {
  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });
    return {
      status: 200,
      message: "User updated successfully",
      user: updatedUser,
    };
  } catch (error) {
    console.error("Error updating user:", error);
    return {
      status: 500,
      message: `Failed to update user ${error} ${userId}`,
    };
  }
};
