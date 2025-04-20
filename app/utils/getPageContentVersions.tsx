import { prisma } from "@/prisma/client";

export const getPageContentVersions = async (pageId: string) => {
  try {
    const changeLog = await prisma.pageContent.findMany({
      where: { pageId },
      include: {
        author: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return {
      status: 200,
      message: "Successfully fetched change log",
      changeLog,
    };
  } catch (error) {
    console.error(error);
    return {
      status: 500,
      message: "An error occurred while fetching the change log.",
      error: error.message,
    };
  }
};
