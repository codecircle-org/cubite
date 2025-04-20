import { prisma } from "@/prisma/client";

export const copyCourse = async (courseId: string, currentUserId: string) => {
  try {
    // Fetch the course along with its related data
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        subjects: true,
        topics: true,
        instructors: true,
        sites: true,
      },
    });

    if (!course) {
      return {
        status: 404,
        message: "Course not found.",
      };
    }

    // Add current user to the instructors list
    const instructorIds = new Set(
      course.instructors.map((instructor) => instructor.userId)
    );
    instructorIds.add(currentUserId);
    // Duplicate the course
    const newCourse = await prisma.course.create({
      data: {
        name: `${course.name} (Copy)`,
        description: course.description,
        coverImage: course.coverImage,
        introVideo: course.introVideo,
        price: course.price,
        startDate: course.startDate,
        endDate: course.endDate,
        level: course.level,
        subjects: {
          connect: course.subjects.map((subject) => ({ id: subject.id })),
        },
        topics: {
          connect: course.topics.map((topic) => ({ id: topic.id })),
        },
        instructors: {
          create: Array.from(instructorIds).map((userId) => ({
            userId,
          })),
        },
      },
    });

    return {
      status: 201,
      message: "Course duplicated successfully",
      newCourse,
    };
  } catch (error) {
    console.error(error);
    return {
      status: 500,
      message: "An error occurred while duplicating the course.",
      error: error.message,
    };
  }
};
