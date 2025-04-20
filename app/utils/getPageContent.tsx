import { prisma } from "@/prisma/client";

export const getPageContent = async (pageId: string) => {
  try {
    const contents = await prisma.pageContent.findFirst({
      where: { pageId },
      orderBy: { version: "desc" },
    });
    if (!contents) {
      return {
        status: 404,
        message: "Content not found.",
      };
    }
    return {
      status: 200,
      message: "successfully fetched course content",
      contents,
    };
  } catch (error) {
    console.log(error);
    return {
      status: 500,
      message: "An error occurred while fetching the course.",
      error: error.message,
    };
  }
};
