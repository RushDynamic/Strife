import bcrypt from 'bcrypt';
import Account from '../models/account-model.js';

export async function registerUser(userInfo) {
    try {
        // const userUniqueResult = await checkIfUserExists(userInfo.username);
        // console.log("userUniqueResult", userUniqueResult);
        if (await checkIfUserExists(userInfo.username) != null) {
            // Username already exists
            throw { duplicate: true };
        }

        // Proceed if username is valid
        const hashedPassword = await hashPassword(userInfo.password);
        const newAccount = new Account({
            email: userInfo.email,
            username: userInfo.username,
            password: hashedPassword
        });

        const savedUser = await newAccount.save();
        const user = ({ username: savedUser.username, accessToken: "" });
        console.log("User registered successfully");
        return ({ success: true, user: user });
    }
    catch (err) {
        return ({ success: false, duplicate: err.duplicate });
    }

}

async function checkIfUserExists(username) {
    return await Account.findOne({
        username: username
    });
}

async function hashPassword(rawPassword) {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(rawPassword, salt);
    return hashedPassword;
}