import { prisma } from "@/prisma/client";

interface CourseContentData {
  courseId: string;
  content: any;
  authorId: string;
}

export const createCourseContent = async (data: CourseContentData) => {
  try {
    const { courseId, content, authorId } = data;

    // Get the current highest version for the course
    const currentVersion = await prisma.courseContent.findMany({
      where: { courseId },
      orderBy: { version: "desc" },
      take: 1,
    });

    const newVersion =
      currentVersion.length > 0 ? currentVersion[0].version + 1 : 1;

    // Save the new content
    const courseContent = await prisma.courseContent.create({
      data: {
        courseId,
        content,
        version: newVersion,
        authorId,
      },
    });

    return {
      status: 201,
      message: "Course content saved successfully",
      courseContent,
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
