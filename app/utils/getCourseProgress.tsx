import { prisma } from "@/prisma/client";

export const getCourseProgress = async ({
  userId,
  courseId,
  siteId,
}: {
  userId: string;
  courseId: string;
  siteId: string;
}) => {
  try {
    const progress = await prisma.courseProgress.findUnique({
      where: {
        courseId_userId_siteId: {
          userId,
          courseId,
          siteId,
        },
      },
    });

    if (!progress) {
      return {
        status: 404,
        message: "Progress not found.",
      };
    }

    return {
      status: 200,
      progress,
    };
  } catch (error) {
    console.error(error);
    return {
      status: 500,
      message: "An error occurred while fetching the progress.",
      error: error.message,
    };
  }
};
