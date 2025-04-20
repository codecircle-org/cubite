import { prisma } from "@/prisma/client";

interface CourseData {
  name: string;
  description?: string;
  subjects?: { name: string }[]; // array of subject objects with name property
  topics?: { name: string }[]; // array of topic objects with name property
  startDate?: string;
  endDate?: string;
  price?: number;
  coverImage?: string;
  introVideo?: string;
  instructors?: string[]; // array of user IDs
  sites?: string[]; // array of site IDs
  level?: string;
  externalId?: string;
  externalUrl?: string;
  externalBlocksUrl?: string;
  externalImageUrl?: string;
}

export const createCourse = async (courseData: CourseData) => {
  try {
    const {
      name,
      description,
      subjects,
      topics,
      startDate,
      endDate,
      price,
      coverImage,
      introVideo,
      instructors,
      sites,
      level,
      externalId,
      externalUrl,
      externalBlocksUrl,
      externalImageUrl,
    } = courseData;

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

    // Create the course with all attributes
    const course = await prisma.course.create({
      data: {
        name,
        description,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        price,
        coverImage,
        introVideo,
        level,
        externalId,
        externalUrl,
        externalBlocksUrl,
        externalImageUrl,
        subjects: {
          connect: subjectRecords.map((subject) => ({ id: subject.id })),
        },
        topics: {
          connect: topicRecords.map((topic) => ({ id: topic.id })),
        },
        instructors: instructors
          ? {
              create: instructors.map((userId) => ({
                user: { connect: { id: userId } },
              })),
            }
          : undefined,
        sites: sites
          ? {
              connect: sites.map((siteId) => ({ id: siteId })),
            }
          : undefined,
      },
    });

    return {
      status: 201,
      message: "Course created successfully",
      course,
    };
  } catch (error) {
    console.error(error);
    return {
      status: 500,
      message: "An error occurred while creating the course.",
      error: error.message,
    };
  }
};
