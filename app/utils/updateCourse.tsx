import { prisma } from "@/prisma/client";

interface CourseData {
  id: string; // Add id for updating the specific course
  name?: string;
  description?: string;
  banner?: string;
  isWaitList?: boolean;
  isOnDemand?: boolean;
  isVisibleInCatalog?: boolean;
  isSyllabusVisible?: boolean;
  waitListMessage?: string;
  subjects?: { id?: string; name: string }[]; // array of subject objects with name property
  topics?: { id?: string; name: string }[]; // array of topic objects with name property
  duration?: number;
  startDate?: string;
  endDate?: string;
  price?: number;
  coverImage?: string;
  introVideo?: string;
  instructors?: { user: { id: string } }[]; // array of user IDs
  sites?: { id: string }[]; // array of site IDs
  level?: string;
  certificateTitle?: string;
  certificateDescription?: string;
  certificateBackground?: string;
  xp?: Number;
  requirements?: {}
}

export const updateCourse = async (courseData: CourseData) => {
  try {
    const {
      id,
      name,
      description,
      banner,
      isWaitList,
      isOnDemand,
      waitListMessage,
      isVisibleInCatalog,
      isSyllabusVisible,
      subjects,
      topics,
      duration,
      startDate,
      endDate,
      price,
      coverImage,
      introVideo,
      instructors,
      sites,
      level,
      certificateTitle,
      certificateDescription,
      certificateBackground,
      xp,
      requirements,
    } = courseData;

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
    const course = await prisma.course.update({
      where: { id },
      data: {
        name,
        description,
        banner,
        isWaitList,
        isOnDemand,
        waitListMessage,
        isVisibleInCatalog,
        isSyllabusVisible,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        price,
        duration,
        xp,
        coverImage,
        introVideo,
        level,
        certificateTitle,
        certificateDescription,
        certificateBackground,
        requirements,
        subjects: {
          set: [], // Clear existing subjects
          connect: subjectRecords.map((subject) => ({ id: subject.id })),
        },
        topics: {
          set: [], // Clear existing topics
          connect: topicRecords.map((topic) => ({ id: topic.id })),
        },
        instructors: instructors
          ? {
              deleteMany: {}, // Clear existing instructors
              create: instructors.map((instructor) => ({
                user: { connect: { id: instructor.id } },
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
      message: "Course updated successfully",
      course,
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
