import { uploadAvatar, changeAvatar } from "../services/profile-service.js";

export async function handleEditAvatar(req, res) {
  const username = req.headers["username"];
  if (req.files === null || username === null) {
    return res.status(400).json({
      success: false,
      msg: "No file uploaded",
    });
  }
  try {
    const uploadResult = await uploadAvatar(req.files.file, username);
    if (!uploadResult?.success) {
      console.log(uploadResult);
      throw err;
    }
    const avatarChangeResult = await changeAvatar(
      uploadResult?.data?.key,
      username
    );
    if (avatarChangeResult.success != true) throw err;
    return res.status(200).json({
      success: true,
      filePath: avatarChangeResult.avatarUrl,
    });
    // TODO: delete previous avatar async
  } catch (err) {
    return res.status(500).json({
      success: false,
      msg: "An error occurred at the server",
    });
  }
}
