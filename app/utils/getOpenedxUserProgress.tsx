const getOpenedxUserProgress = async (
  accessToken: string,
  site: any,
  userId: string,
  openedxCourseId: string
) => {
  const requestUrl = `${site.openedxSiteUrl}/api/course_home/v1/progress/${openedxCourseId}/${userId}`;
  try {
    const response = await fetch(requestUrl, {
      headers: {
        Authorization: `JWT ${accessToken}`,
      },
    });
    const result = await response.json();
    return result;
  } catch (error) {
    return [];
  }
};

export default getOpenedxUserProgress;
