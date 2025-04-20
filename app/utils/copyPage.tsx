import { prisma } from "@/prisma/client";

export const copyPage = async (pageId: string, currentUserId: string) => {
  try {
    // Fetch the page along with its related data
    const page = await prisma.page.findUnique({
      where: { id: pageId },
      include: {
        subjects: true,
        topics: true,
        authors: true,
        sites: true,
      },
    });

    if (!page) {
      return {
        status: 404,
        message: "Page not found.",
      };
    }

    // Add current user to the authors list
    const authorIds = new Set(page.authors.map((author) => author.userId));
    authorIds.add(currentUserId);

    // Duplicate the page
    const newPage = await prisma.page.create({
      data: {
        title: `${page.title} (Copy)`,
        description: page.description,
        permalink: `${page.permalink}-copy-${Date.now()}`, // Ensure uniqueness
        image: page.image,
        subjects: {
          connect: page.subjects.map((subject) => ({ id: subject.id })),
        },
        topics: {
          connect: page.topics.map((topic) => ({ id: topic.id })),
        },
        authors: {
          create: Array.from(authorIds).map((userId) => ({
            user: { connect: { id: userId } },
          })),
        },
        sites: {
          connect: page.sites.map((site) => ({ id: site.id })),
        },
        blurb: page.blurb,
      },
    });

    return {
      status: 201,
      message: "Page duplicated successfully",
      newPage,
    };
  } catch (error) {
    console.error(error);
    return {
      status: 500,
      message: "An error occurred while duplicating the page.",
      error: error.message,
    };
  }
};
