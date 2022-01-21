export async function editAvatar(avatarFile, username) {
  const formData = new FormData();
  formData.append('file', avatarFile);
  try {
    const res = await fetch('http://localhost:3001/profile/edit/avatar', {
      method: 'POST',
      body: formData,
      headers: {
        username: username,
      },
    });
    const data = await res.json();
    return { success: true, ...data };
  } catch (err) {
    return { success: false };
  }
}
