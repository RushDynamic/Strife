import Account from '../models/account-model.js';
import s3, { bucketName } from '../clients/s3-client.js';
import path from 'path';
import fs from 'fs';
const __dirname = path.resolve();

export async function uploadAvatar(file, username) {
  try {
    const extension = path.extname(file.name).toLowerCase();
    const newFileName = `${username}${new Date().getTime()}${extension}`;
    const filePath = `${__dirname}/public/images/uploads/avatars`;
    // create avatars dir if it doesn't exist
    if (!fs.existsSync(filePath)) {
      fs.mkdirSync(filePath, { recursive: true });
    }
    await file.mv(`${filePath}/${newFileName}`);
    const fileStream = fs.createReadStream(filePath);
    const uploadParams = {
      Bucket: bucketName,
      Body: fileStream,
      Key: 'avatars/' + newFileName,
    };
    const result = await s3.upload(uploadParams).promise();
    return { success: true, data: result };
  } catch (error) {
    console.log(
      'An error occurred while uploading the avatar:',
      error.toString(),
    );
    return { success: false, error: error };
  }
}

export async function changeAvatar(avatarName, username) {
  try {
    const avatarUrl = `https://strife-playground.s3.ap-south-1.amazonaws.com/${avatarName}`;
    const updatedAccount = await Account.findOneAndUpdate(
      {
        username: username,
      },
      {
        avatar: avatarName,
      },
    );
    if (updatedAccount == null) throw err;
    return { success: true, avatarUrl };
  } catch (err) {
    console.log('An error occurred:', err);
    return { success: false };
  }
}
