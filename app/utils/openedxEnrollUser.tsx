import { decryptSecret } from "./secretManager";

interface Site {
    openedxOauthClientId: string;
    openedxOauthClientSecret: string;
    openedxSiteUrl: string;
  };

interface Course {
  externalId: string;
}

const openedxEnrollUser = async (
  site: Site,
  course: Course,
  email: string
) => {
  // get the openedx access token
  const formData = new URLSearchParams({
    client_id: decryptSecret(site.openedxOauthClientId),
    client_secret: decryptSecret(site.openedxOauthClientSecret),
    grant_type: "client_credentials",
    token_type: "jwt",
  });
  const accessTokenResponse = await fetch(
    `${site.openedxSiteUrl}/oauth2/access_token`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
    }
  );
  const accessToken = await accessTokenResponse.json();
  // enroll user in the open edx course if not already enrolled
  const openedxEnrollmentEndpoint = `${site.openedxSiteUrl}/cubite/api/v1/enrollment`;
  const openedxEnrollmentResponse = await fetch(openedxEnrollmentEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `JWT ${accessToken.access_token}`,
    },
    body: JSON.stringify({
      course_id: course.externalId,
      email: email,
    }),
  });
  const openedxEnrollmentResult = await openedxEnrollmentResponse.json();
  return openedxEnrollmentResult;
};

export default openedxEnrollUser;