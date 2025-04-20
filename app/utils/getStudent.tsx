import { prisma } from "@/prisma/client";

export const getStudentData = async (userId: string) => {
  const student = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      siteRoles: true,
      name: true,
      email: true,
      username: true,
      image: true,
      extraInfo: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
      CourseEnrollment: true,
    },
  });
  if (!student) {
    return {
      status: 404,
      message: "student not found",
    };
  }
  return {
    status: 200,
    message: "Successfully fetched student id",
    student: student,
  };
};
