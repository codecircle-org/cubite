const getOpenedxUserInfo = async (accessToken: string, site: any, email: string) => {
  const encodedEmail = encodeURIComponent(email);
  const requestUrl = `${site.openedxSiteUrl}/cubite/api/v1/get_user_info?email=${encodedEmail}`;
    try {
        const response = await fetch(requestUrl, {
            headers: {
            Authorization: `JWT ${accessToken}`,
            },
        });
        const result = await response.json();
        if(result.user_id){
            return result;
        }
        return null;
    } catch (error) {
        return null;
    }
}

export default getOpenedxUserInfo;