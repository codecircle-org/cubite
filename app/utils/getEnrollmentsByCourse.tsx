import { prisma } from "@/prisma/client";

export const getEnrollmentsByCourse = async (courseId: string) => {
  try {
    const enrollments = await prisma.courseEnrollment.findMany({
      where: { courseId },
      include: {
        user: true,
        site: true,
        course: true,
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
