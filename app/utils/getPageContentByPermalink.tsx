import { prisma } from "@/prisma/client";

export const getPageContentByPermalink = async (permalink: string, siteId: string) => {
  try {
    const page = await prisma.page.findFirst({
      where: { permalink, sites: { some: { id: siteId } } },
      select: { id: true },
    });
    if (!page) {
      return {
        status: 404,
        message: "Page not found.",
      };
    }
    const contents = await prisma.pageContent.findFirst({
      where: { pageId: page.id },
      orderBy: { version: "desc" },
    });
    return {
      status: 200,
      message: "successfully fetched page content",
      contents,
      permalink,
      pageId: page.id,
    };
  } catch (error) {
    console.log(error);
  }
};