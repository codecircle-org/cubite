import { prisma } from "@/prisma/client";

export const getSiteCourses = async (siteId: string) => {
  try {
    const courses = await prisma.course.findMany({
      where: {
        sites: {
        some: {
          id: siteId,
        },
      },
    },
  });
    return {
      status: 200,
      courses,
    };
  } catch (error) {
    console.error("Error fetching courses:", error);
    return {
      status: 500,
      message: "Internal server error",
    };
  }
};
