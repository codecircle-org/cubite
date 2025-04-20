import { prisma } from "@/prisma/client";

export const deleteCourse = async (courseId: string) => {
  try {
    const course = await prisma.course.delete({
      where: { id: courseId },
    });

    return {
      status: 200,
      message: "Course deleted successfully",
      course,
    };
  } catch (error) {
    console.error(error);
    return {
      status: 500,
      message: "An error occurred while deleting the course.",
      error: error.message,
    };
  }
};
