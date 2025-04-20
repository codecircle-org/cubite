import { prisma } from "@/prisma/client";

export const getPage = async (id: string) => {
  try {
    const page = await prisma.page.findUnique({
      where: { id },
      include: {
        subjects: true,
        topics: true,
        authors: {
          include: {
            user: true,
          },
        },
        sites: true,
      },
    });

    if (!page) {
      return {
        status: 404,
        message: "Course not found.",
      };
    }

    return {
      status: 200,
      page,
    };
  } catch (error) {
    console.error(error);
    return {
      status: 500,
      message: "An error occurred while fetching the course.",
      error: error.message,
    };
  }
};
