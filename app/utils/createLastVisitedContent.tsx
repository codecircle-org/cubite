import { prisma } from "@/prisma/client";

export const createLastVisitedContent = async (
  courseId: string,
  userId: string,
  siteId: string,
  lastVisitedContent: string
) => {
  try {
    const result = await prisma.courseEnrollment.upsert({
      where: { courseId_userId_siteId: { courseId, userId, siteId } },
      update: { lastVisitedContent },
      create: { courseId, userId, siteId, lastVisitedContent },
    });
    return result;
  } catch (error) {
    return { error: "Failed to create last visited content" };
  }
};
