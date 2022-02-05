export async function registerUser(currentUserData) {
  const registrationResponse = await fetch(
    `${process.env.REACT_APP_AM_API_URL}/account/register`,
    {
      method: 'POST',
      body: JSON.stringify({
        email: currentUserData.email,
        username: currentUserData.username,
        password: currentUserData.password,
        encodedKeyPair: currentUserData.encodedKeyPair,
      }),
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    },
  );
  const registrationData = await registrationResponse.json();
  if (registrationData.success === true) {
    return {
      username: registrationData.username,
      accessToken: registrationData.accessToken,
      avatar: registrationData.avatar,
    };
  }
  return { success: false, duplicate: registrationData.duplicate };
}
