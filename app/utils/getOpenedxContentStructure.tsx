const getOpenedxContentStructure = async (
  accessToken: string,
  openedxUrl: string,
  openedxCourseId: string,
  email: string,
  courseId: string
) => {
  try {
    // get the openedx course outline
    const encodedEmail = encodeURIComponent(email);
    const encodedCourseId = encodeURIComponent(openedxCourseId);
    
    // First try the Cubite endpoint
    const outlineEndpoint = `${openedxUrl}/cubite/api/v1/get_course_outline?course_id=${encodedCourseId}&email=${encodedEmail}`;
    let courseOutlineResponse = await fetch(outlineEndpoint, {
      headers: {
        Authorization: `JWT ${accessToken}`,
      },
    });

    if (!courseOutlineResponse.ok) {
      throw new Error(`Failed to fetch course outline: ${courseOutlineResponse.statusText}`);
    }

    const courseOutlineData = await courseOutlineResponse.json();

    // Validate the response structure
    if (!courseOutlineData?.course_blocks?.blocks) {
      console.error('Invalid course outline data structure:', courseOutlineData);
      throw new Error('Invalid course outline data structure');
    }

    // Get the course root block
    const rootBlockId = Object.keys(courseOutlineData.course_blocks.blocks).find(
      (key: string) =>
        courseOutlineData.course_blocks.blocks[key].type === "course"
    );

    if (!rootBlockId) {
      throw new Error('Could not find course root block');
    }

    const rootBlock = courseOutlineData.course_blocks.blocks[rootBlockId];

    // Build the course structure with internal URLs
    const courseStructure = {
      title: rootBlock.display_name,
      completed: rootBlock.complete,
      chapters: rootBlock.children.map((chapterId: string) => {
        const chapter = courseOutlineData.course_blocks.blocks[chapterId];
        if (!chapter) {
          console.warn(`Chapter block not found for ID: ${chapterId}`);
          return null;
        }

        return {
          id: chapter.id,
          title: chapter.display_name,
          completed: chapter.complete,
          subsections: chapter.children.map((subsectionId: string) => {
            const subsection = courseOutlineData.course_blocks.blocks[subsectionId];
            if (!subsection) {
              console.warn(`Subsection block not found for ID: ${subsectionId}`);
              return null;
            }

            return {
              id: subsection.id,
              title: subsection.display_name,
              completed: subsection.complete,
              url: `/course/${courseId}/learning/block/${subsection.id}`,
              units: subsection.units?.map((unit: any) => ({
                id: unit.id,
                title: unit.display_name,
                type: unit.type,
                completion: unit.completion,
                childBlocks: unit.child_blocks?.map((block: any) => ({
                  id: block.id,
                  title: block.display_name,
                  type: block.type,
                  completion: block.completion
                })) || []
              })) || []
            };
          }).filter(Boolean), // Remove null subsections
        };
      }).filter(Boolean), // Remove null chapters
    };
    
    return courseStructure;
  } catch (error) {
    console.error("Error getting course structure", error);
    return null;
  }
};

export default getOpenedxContentStructure;
