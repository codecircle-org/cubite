import { prisma } from "@/prisma/client";

export const deletePage = async (pageId: string) => {
  try {
    const page = await prisma.page.delete({
      where: { id: pageId },
    });

    return {
      status: 200,
      message: "page deleted successfully",
      page,
    };
  } catch (error) {
    console.error(error);
    return {
      status: 500,
      message: "An error occurred while deleting the page.",
      error: error.message,
    };
  }
};
