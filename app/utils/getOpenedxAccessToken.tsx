import { decryptSecret } from "@/app/utils/secretManager";

const getOpenedxAccessToken = async (site: any) => {
    const formData = new URLSearchParams({
      client_id: decryptSecret(site.openedxOauthClientId),
      client_secret: decryptSecret(site.openedxOauthClientSecret),
      grant_type: 'client_credentials',
      token_type: 'jwt'
    });

    const accessTokenResponse = await fetch(`${site.openedxSiteUrl}/oauth2/access_token`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });
    
    const accessTokenResponseJson = await accessTokenResponse.json();
    return accessTokenResponseJson.access_token;
  }

  export default getOpenedxAccessToken;