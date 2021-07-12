import Account from '../models/account-model.js';
import path from 'path';
const __dirname = path.resolve();

export async function uploadAvatar(file, username) {
    try {
        const extension = (path.extname(file.name)).toLowerCase();
        const newFileName = `${username}${extension}`;
        await file.mv(`${__dirname}/public/images/uploads/avatars/${newFileName}`);
        console.log("Avatar upload was successful");
        return {
            success: true,
            fileName: newFileName,
        };
    }
    catch (ex) {
        console.log("An error occurred while moving the file:", ex.toString());
        return { success: false, msg: ex.toString() };
    }
}

export async function changeAvatar(avatarName, username) {
    try {
        const avatarUrl = `http://localhost:3001/images/uploads/avatars/${avatarName}`;
        const updatedAccount = await Account.findOneAndUpdate({
            username: username
        },
            {
                avatar: avatarUrl
            });
        if (updatedAccount == null) throw err;
        return { success: true, avatarUrl: avatarUrl };
    }
    catch (err) {
        console.log("An error occurred:", err);
        return { success: false }
    }
}