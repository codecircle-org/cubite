import { prisma } from "@/prisma/client";

interface PageContentData {
  pageId: string;
  content: any;
  authorId: string;
}

export const createPageContent = async (data: PageContentData) => {
  try {
    const { pageId, content, authorId } = data;

    // Get the current highest version for the course
    const currentVersion = await prisma.pageContent.findMany({
      where: { pageId },
      orderBy: { version: "desc" },
      take: 1,
    });

    const newVersion =
      currentVersion.length > 0 ? currentVersion[0].version + 1 : 1;

    // Save the new content
    const pageContent = await prisma.pageContent.create({
      data: {
        pageId,
        content,
        version: newVersion,
        authorId,
      },
    });

    return {
      status: 201,
      message: "Course content saved successfully",
      pageContent,
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
