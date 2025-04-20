import { prisma } from "@/prisma/client";

interface UpdateEnrollmentData {
  courseId: string;
  userId: string;
  siteId: string;
  expiresAt?: string;
  enrolledInOpenedxCourse?: boolean;
}

export const updateEnrollment = async (updateData: UpdateEnrollmentData) => {
  try {
    const { courseId, userId, siteId, expiresAt, enrolledInOpenedxCourse, isWaitListed, status } = updateData;

    const enrollment = await prisma.courseEnrollment.update({
      where: {
        courseId_userId_siteId: {
          courseId,
          userId,
          siteId,
        },
      },
      data: {
        ...(expiresAt && { expiresAt: new Date(expiresAt) }),
        updatedAt: new Date(),
        ...(enrolledInOpenedxCourse !== undefined && { enrolledInOpenedxCourse }),
        ...(isWaitListed !== undefined && { isWaitListed }),
        ...(status && { status }),
      },
    });

    return {
      status: 200,
      message: "Enrollment updated successfully",
      enrollment,
    };
  } catch (error) {
    console.error(error);
    return {
      status: 500,
      message: "An error occurred while updating the enrollment.",
      error: error.message,
    };
  }
};
