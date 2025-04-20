const getOpenedxUserCertificatesByCourse = async (
  accessToken: string,
  site: any,
  username: string,
  courseId: string
) => {
  const requestUrl = `${site.openedxSiteUrl}/api/certificates/v0/certificates/${username}/courses/${courseId}/`;
  try {
    const response = await fetch(requestUrl, {
      headers: {
        Authorization: `JWT ${accessToken}`,
      },
    });
    const result = await response.json();
    if(result.error_code || result.status === 404){
      return null;
    }
    return result;
  } catch (error) {
    return null;
  }
};

export default getOpenedxUserCertificatesByCourse;
