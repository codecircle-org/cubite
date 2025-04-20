import { prisma } from "@/prisma/client";

// Utility function to update student information
export const updateStudent = async (studentId, updateData) => {
  try {
    const updatedStudent = await prisma.user.update({
      where: {
        id: studentId,
      },
      data: updateData,
    });
    return {
      status: 201,
      message: "Student updated successfully",
      student: updatedStudent,
    };
  } catch (error) {
    console.error("Error updating student:", error);
    return {
      status: 500,
      message: "Failed to update student",
    };
  }
};
