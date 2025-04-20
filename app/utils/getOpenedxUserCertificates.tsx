const getOpenedxUserCertificates = async (
  accessToken: string,
  site: any,
  username: string
) => {
  const requestUrl = `${site.openedxSiteUrl}/api/certificates/v0/certificates/${username}/`;
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

export default getOpenedxUserCertificates;
