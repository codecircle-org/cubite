import { prisma } from "@/prisma/client";

interface PageData {
  id: string; // Add id for updating the specific course
  title?: string;
  description?: string;
  subjects?: { id?: string; name: string }[]; // array of subject objects with name property
  topics?: { id?: string; name: string }[]; // array of topic objects with name property
  permalink?: string;
  image?: string;
  blurb?: string;
  authors?: { user: { id: string } }[]; // array of user IDs
  sites?: { id: string }[]; // array of site IDs
  isBlog?: boolean;
}

export const updatePage = async (pageData: PageData) => {
  try {
    const {
      id,
      title,
      description,
      subjects,
      topics,
      permalink,
      blurb,
      image,
      authors,
      sites,
      isBlog,
    } = pageData;

    // Create or find subjects
    const subjectRecords = await Promise.all(
      subjects.map(async (subject) => {
        return await prisma.subject.upsert({
          where: { name: subject.name },
          update: {},
          create: { name: subject.name },
        });
      })
    );

    // Create or find topics
    const topicRecords = await Promise.all(
      topics.map(async (topic) => {
        return await prisma.topic.upsert({
          where: { name: topic.name },
          update: {},
          create: { name: topic.name },
        });
      })
    );

    // Update the course with all attributes
    const page = await prisma.page.update({
      where: { id },
      data: {
        title,
        description,
        image,
        permalink,
        blurb,
        isBlog,
        subjects: {
          set: [], // Clear existing subjects
          connect: subjectRecords.map((subject) => ({ id: subject.id })),
        },
        topics: {
          set: [], // Clear existing topics
          connect: topicRecords.map((topic) => ({ id: topic.id })),
        },
        authors: authors
          ? {
              deleteMany: {}, // Clear existing authors
              create: authors.map((author) => ({
                user: { connect: { id: author.id } },
              })),
            }
          : undefined,
        sites: sites
          ? {
              set: [], // Clear existing sites
              connect: sites.map((site) => ({ id: site.id })),
            }
          : undefined,
      },
    });

    return {
      status: 201,
      message: "page updated successfully",
      page,
    };
  } catch (error) {
    console.error(error);
    return {
      status: 500,
      message: "An error occurred while updating the course.",
      error: error.message,
    };
  }
};
