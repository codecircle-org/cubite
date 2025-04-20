import { prisma } from "@/prisma/client";

export const getLastVisitedContent = async (
  courseId: string,
  userId: string
) => {
  const lastVisitedContent = await prisma.courseEnrollment.findFirst({
    where: { courseId, userId },
    select: {
      lastVisitedContent: true,
    },
  });
  return lastVisitedContent;
};
