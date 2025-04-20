import { prisma } from "@/prisma/client";

export const getCourse = async (id: string) => {
  try {
    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        contents: {
          orderBy: {
            createdAt: "desc",
          },
          take: 1, // Fetch the latest version
        },
        subjects: true,
        topics: true,
        instructors: {
          include: {
            user: true,
          },
        },
        sites: true,
      },
    });

    if (!course) {
      return {
        status: 404,
        message: "Course not found.",
      };
    }

    return {
      status: 200,
      course,
    };
  } catch (error) {
    console.error(error);
    return {
      status: 500,
      message: "An error occurred while fetching the course.",
      error: error.message,
    };
  }
};
