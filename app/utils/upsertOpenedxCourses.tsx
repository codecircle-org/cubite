import { prisma } from "@/prisma/client";
import { createCourse } from "./createCourse";

interface OpenEdXCourse {
  id: string;
  name: string;
  course_id: string;
  org: string;
  short_description: string;
  media: {
    image: {
      raw: string;
    };
    course_video?: {
      uri: string;
    };
  };
  start: string;
  end: string;
  blocks_url: string;
}

export const upsertOpenedxCourses = async (openEdXURL: string, siteId: string) => {
    try {
        if (!openEdXURL) {
            return {
                status: 400,
                message: "Please provide an OpenEdX URL"
            }
        }

        if (!siteId) {
            return {
                status: 400,
                message: "Please provide a site ID"
            }
        }

        // Format the URL
        let formattedURL = openEdXURL;
        if (!formattedURL.startsWith('http://') && !formattedURL.startsWith('https://')) {
            formattedURL = 'https://' + formattedURL;
        }
        formattedURL = formattedURL.replace(/\/$/, '');

        // Fetch courses from OpenEdX
        const response = await fetch(`${formattedURL}/api/courses/v1/courses/`);

        if (!response.ok) {
            return {
                status: response.status,
                message: `Failed to fetch courses: ${response.statusText}`
            }
        }

        const data = await response.json();
        const courses: OpenEdXCourse[] = data.results;
        // Process each course
        const results = await Promise.all(courses.map(async (openEdXCourse) => {
            try {
                // Check if course exists
                const existingCourse = await prisma.course.findFirst({
                    where: {
                        externalId: openEdXCourse.course_id,
                    }
                });
                // Prepare course data according to your model
                const courseData = {
                    name: openEdXCourse.name,
                    description: openEdXCourse.short_description || null,
                    startDate: openEdXCourse.start ? new Date(openEdXCourse.start) : null,
                    endDate: openEdXCourse.end ? new Date(openEdXCourse.end) : null,
                    introVideo: openEdXCourse.media?.course_video?.uri,
                    sites: [siteId],
                    externalId: openEdXCourse.course_id,
                    externalUrl: `${formattedURL}/courses/${openEdXCourse.course_id}/about`,
                    externalRootUrl: formattedURL,
                    externalBlocksUrl: openEdXCourse.blocks_url,
                    externalImageUrl: `${openEdXCourse.media.image.raw}`
                };

                if (existingCourse) {
                    // Update existing course
                    const updatedCourse = await prisma.course.update({
                        where: {
                            id: existingCourse.id
                        },
                        data: {
                            ...courseData,
                            sites: {
                                connect: { id: siteId }
                            }
                        }
                    });

                    return {
                        status: 200,
                        message: `Updated course: ${openEdXCourse.name}`,
                        course: updatedCourse
                    };
                } else {
                    // Create new course
                    const result = await createCourse({
                        ...courseData,
                        sites: [siteId]
                    });

                    return {
                        status: 201,
                        message: `Created course: ${openEdXCourse.name}`,
                        course: result.course
                    };
                }
            } catch (error) {
                console.error(`Error processing course ${openEdXCourse.name}:`, error);
                return {
                    status: 500,
                    message: `Failed to process course ${openEdXCourse.name}: ${error.message}`,
                    error: error
                };
            }
        }));

        // Count successes and failures
        const successful = results.filter(r => r.status === 200 || r.status === 201).length;
        const failed = results.filter(r => r.status === 500).length;

        return {
            status: 200,
            message: `Processed ${results.length} courses. ${successful} successful, ${failed} failed.`,
            results: results
        };

    } catch (error) {
        console.error('Error in upsertOpenedxCourses:', error);
        return {
            status: 500,
            message: `Error syncing courses: ${error.message}`,
            error: error
        };
    }
};