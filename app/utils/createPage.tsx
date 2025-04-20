import { prisma } from "@/prisma/client";

interface PageData {
  title: string;
  description?: string;
  permalink: string;
  subjects?: { name: string }[]; // array of subject objects with name property
  topics?: { name: string }[]; // array of topic objects with name property
  image?: string;
  authors?: string[]; // array of user IDs
  sites?: string[]; // array of site IDs
  blurb?: string;
  isBlog?: boolean;
  isPublished?: boolean;
}

export const createPage = async (pageData: PageData) => {
  try {
    const {
      title,
      description,
      permalink,
      subjects,
      topics,
      image,
      authors,
      sites,
      blurb,
      isBlog,
      isPublished,
    } = pageData;
    // Extract name strings from subjects and topics
    const subjectNames = subjects
      ? subjects.map((subject) => subject.name)
      : [];
    const topicNames = topics ? topics.map((topic) => topic.name) : [];

    // Create or find subjects
    const subjectRecords = await Promise.all(
      subjectNames.map(async (subject) => {
        return await prisma.subject.upsert({
          where: { name: subject },
          update: {},
          create: { name: subject },
        });
      })
    );

    // Create or find topics
    const topicRecords = await Promise.all(
      topicNames.map(async (topic) => {
        return await prisma.topic.upsert({
          where: { name: topic },
          update: {},
          create: { name: topic },
        });
      })
    );

    // Create the page with all attributes
    const page = await prisma.page.create({
      data: {
        title,
        description,
        permalink,
        image,
        blurb,
        isBlog,
        isPublished,
        subjects: {
          connect: subjectRecords.map((subject) => ({ id: subject.id })),
        },
        topics: {
          connect: topicRecords.map((topic) => ({ id: topic.id })),
        },
        authors: authors
          ? {
              create: authors.map((userId) => ({
                user: { connect: { id: userId } },
              })),
            }
          : undefined,
        sites: sites
          ? {
              connect: sites.map((site) => ({ id: site.id })),
            }
          : undefined,
      },
    });

    return {
      status: 201,
      message: "Page created successfully",
      page,
    };
  } catch (error) {
    console.error(error);
    return {
      status: 500,
      message: "An error occurred while creating the page.",
      error: error.message,
    };
  }
};
