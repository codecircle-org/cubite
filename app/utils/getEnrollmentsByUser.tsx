import { prisma } from "@/prisma/client";

export const getEnrollmentsByUser = async (userId: string) => {
  try {
    const enrollments = await prisma.courseEnrollment.findMany({
      where: { userId },
      include: {
        course: {
          include: {
            CourseProgress: true,
          },
        },
      },
    });
    return {
      status: 200,
      message: "Enrollments fetched successfully",
      enrollments,
    };
  } catch (error) {
    console.error(error);
    return {
      status: 500,
      message: "An error occurred while fetching the enrollments.",
      error: error.message,
    };
  }
};
