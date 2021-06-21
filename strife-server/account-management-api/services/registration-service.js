import bcrypt from 'bcrypt';
import { generateAccessToken } from '../clients/user-authorization-api-client.js';
import Account from '../models/account-model.js';

export async function registerUser(userInfo) {
    try {
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
        // TODO: Generate new access and refresh tokens here
        const accessTokenResponse = await generateAccessToken(userInfo.username);
        const user = { username: savedUser.username, accessToken: accessTokenResponse.accessToken };
        console.log("User registered successfully");
        return ({ success: true, user: user });
    }
    catch (ex) {
        console.log("An error occurred: ", ex);
        return ({ success: false, duplicate: ex.duplicate });
    }
}

export async function checkIfUserExists(username) {
    return await Account.findOne({
        username: username
    });
}

async function hashPassword(rawPassword) {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(rawPassword, salt);
    return hashedPassword;
}