import { prisma } from "@/prisma/client";

export const upsertCourseProgress = async ({
  userId,
  courseId,
  siteId,
  lastUnitId,
  progress,
  progressPercentage,
}: {
  userId: string;
  courseId: string;
  siteId: string;
  lastUnitId: string;
  progress: Record<string, any>;
  progressPercentage: number;
}) => {
  try {
    const existingProgress = await prisma.courseProgress.findUnique({
      where: {
        courseId_userId_siteId: {
          userId,
          courseId,
          siteId,
        },
      },
    });

    if (existingProgress) {
      const updatedProgress = await prisma.courseProgress.update({
        where: {
          courseId_userId_siteId: {
            userId,
            courseId,
            siteId,
          },
        },
        data: {
          lastUnitId,
          progress,
          progressPercentage,
        },
      });

      return {
        status: 200,
        progress: updatedProgress,
      };
    } else {
      const newProgress = await prisma.courseProgress.create({
        data: {
          userId,
          courseId,
          siteId,
          lastUnitId,
          progress,
          progressPercentage,
        },
      });

      return {
        status: 201,
        progress: newProgress,
      };
    }
  } catch (error) {
    console.error("Error in upsertCourseProgress:", error);
    return {
      status: 500,
      message: "An error occurred while saving the progress.",
      error: error.message,
    };
  }
};
