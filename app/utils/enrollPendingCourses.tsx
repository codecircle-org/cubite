import { prisma } from "@/prisma/client";

export const enrollPendingCourses = async (pendingEnrollments: any[], userId: string) => {
  try {
    await Promise.all(
      pendingEnrollments.map(async (enrollment) => {
        // Create course enrollment
        await prisma.courseEnrollment.create({
          data: {
            courseId: enrollment.courseId,
            userId: userId,
            siteId: enrollment.siteId,
          },
        });
        
        // Update payment record to mark as enrolled
        await prisma.payment.updateMany({
          where: {
            courseId: enrollment.courseId,
            email: enrollment.email,
            siteId: enrollment.siteId,
            isEnrolled: false,
            status: 'paid'
          },
          data: {
            isEnrolled: true
          }
        });
      })
    );

    return {
      status: 201,
      message: "Successfully enrolled in pending courses",
    };
  } catch (error) {
    console.error("Error enrolling in pending courses:", error);
    return {
      status: 500,
      message: "Error enrolling in pending courses",
    };
  }
};
