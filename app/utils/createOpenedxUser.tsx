const createOpenedxUser = async (
  openedxUrl: string,
  accessToken: string,
  email: string,
  name: string,
  username: string
) => {
  try {
    const createUserEndpoint = `${openedxUrl}/cubite/api/v1/accounts`;
    const createUserResponse = await fetch(createUserEndpoint, {
      method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `JWT ${accessToken}`,
    },
    body: JSON.stringify({
      email: email,
        name: name,
        username: username,
      }),
    });
    if (!createUserResponse.ok) {
      throw new Error(`HTTP error! status: ${createUserResponse.status}`);
      return;
    }
    const data = await createUserResponse.json();
    return data;
  } catch (error) {
    console.error("Error creating OpenEdX user:", error);
  }
};

export default createOpenedxUser;
