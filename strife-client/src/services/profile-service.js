export async function editAvatar(avatarFile, username) {
  const formData = new FormData();
  formData.append('file', avatarFile);
  try {
    const res = await fetch(
      `${process.env.REACT_APP_AM_API_URL}/profile/edit/avatar`,
      {
        method: 'POST',
        body: formData,
        headers: {
          username: username,
        },
      },
    );
    const data = await res.json();
    return { success: true, ...data };
  } catch (err) {
    return { success: false };
  }
}
