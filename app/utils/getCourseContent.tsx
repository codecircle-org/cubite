import { prisma } from "@/prisma/client";

export const getCourseContent = async (courseId: string) => {
  try {
    const contents = await prisma.courseContent.findFirst({
      where: { courseId },
      orderBy: { version: "desc" },
    });
    if (!contents) {
      return {
        status: 404,
        message: "Content not found.",
      };
    }
    return {
      status: 200,
      message: "successfully fetched course content",
      contents,
    };
  } catch (error) {
    console.log(error);
    return {
      status: 500,
      message: "An error occurred while fetching the course.",
      error: error.message,
    };
  }
};
