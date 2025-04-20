import { prisma } from "@/prisma/client";

interface DeleteeEnrollmentData {
  courseId: string;
  userId: string;
  siteId: string;
}

export const deleteEnrollment = async (deleteData: DeleteeEnrollmentData) => {
  try {
    const { courseId, userId, siteId } = deleteData;

    await prisma.courseEnrollment.delete({
      where: {
        courseId_userId_siteId: {
          courseId,
          userId,
          siteId,
        },
      },
    });

    return {
      status: 200,
      message: "Enrollment removed successfully",
    };
  } catch (error) {
    console.error(error);
    return {
      status: 500,
      message: "An error occurred while removing the enrollment.",
      error: error.message,
    };
  }
};
