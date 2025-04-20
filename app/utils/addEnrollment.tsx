import { prisma } from "@/prisma/client";

interface EnrollmentData {
  courseId: string;
  name: string;
  email: string;
  username: string;
  siteId: string;
  expiresAt?: string;
  enrolledInOpenedxCourse?: boolean;
  isWaitListed?: boolean;
  status?: string;
}

export const addEnrollment = async (enrollmentData: EnrollmentData) => {
  try {
    const { courseId, name, email, username, siteId, expiresAt, enrolledInOpenedxCourse, isWaitListed, status } =
      enrollmentData;

    // Check if the user exists
    let user = await prisma.user.findUnique({ where: { email } });

    // If user does not exist, create a new user
    if (!user) {
      user = await prisma.user.create({
        data: {
          name,
          email,
          username,
          isActive: true,
        },
      });

      // Assign site role as student for the selected site
      await prisma.siteRole.create({
        data: {
          userId: user.id,
          siteId,
          role: "STUDENT",
        },
      });
    }
    // check if enrollment already exists and if yes only update it with the recieved data
    const existingEnrollment = await prisma.courseEnrollment.findFirst({
      where: {
        courseId,
        userId: user.id,
        siteId,
      },
    });

    if (existingEnrollment) {
      const updatedEnrollment = await prisma.courseEnrollment.update({
        where: { courseId_userId_siteId: { courseId, userId: user.id, siteId } },
        data: {
          status: status ? status : "pending",
        },
        include: {
          user: true,
          site: true,
        },
      });
      return {
        status: 200,
        message: "Enrollment updated successfully",
        enrollment: updatedEnrollment,
      };
    } else {
    // Create the enrollment
    const enrollment = await prisma.courseEnrollment.create({
      data: {
        courseId,
        userId: user.id,
        siteId,
        expiresAt: expiresAt ? new Date(expiresAt) : undefined,
        enrolledInOpenedxCourse: enrolledInOpenedxCourse ? true : false,
        isWaitListed: isWaitListed ? isWaitListed : false,
        status: status ? status : "pending",
      },
      include: {
        user: true,
        site: true,
      },
    });

    return {
      status: 201,
      message: "Enrollment added successfully",
      enrollment,
    };
  }
  } catch (error) {
    console.error(error);
    return {
      status: 500,
      message: "An error occurred while adding the enrollment.",
      error: error.message,
    };
  }
};
