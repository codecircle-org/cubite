import { prisma } from "@/prisma/client";

export const getPendingPaidEnrollments = async ({siteId, email}: {siteId: string, email: string}) => {
    try {
        // check if there is any paid enrollment for this user which the isEnrolled is false
        const pendingEnrollments = await prisma.payment.findMany({
            where: {
                siteId: siteId,
                email: email,
                status: "paid",
                isEnrolled: false
            },
            select: {
                courseId: true,
                status: true,
                isEnrolled: true,
                course: true,
                siteId: true,
                email: true
            }
        });

        return {
            status: 200,
            data: pendingEnrollments
        };
    } catch (error) {
        console.error("Error getting pending paid enrollments", error);
        return {
            status: 500,
            data: []
        };
    }
}