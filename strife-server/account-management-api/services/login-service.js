import bcrypt from 'bcrypt';
import { generateAccessToken, generateAll, validateRefreshToken } from '../clients/user-authorization-api-client.js';
import { checkIfUserExists } from './registration-service.js';
import { updateUserKeyPair } from './encryption-service.js'

export async function loginUser(userInfo) {
    try {
        const registeredUser = await checkIfUserExists(userInfo.username);
        if (registeredUser == null) {
            throw { validUser: false };
        }
        console.log("Username is valid");
        // Proceed if it's a valid user
        if (bcrypt.compareSync(userInfo.password, registeredUser.password)) {
            // Save keys to DB here
            const updateKeyResult = await updateUserKeyPair(registeredUser, userInfo.publicKey, userInfo.privateKeyAccessStr)
            if (!updateKeyResult) {
                throw { validUser: true };
            }
            const authTokenData = await generateAll(registeredUser.username);
            const user = {
                username: registeredUser.username,
                accessToken: authTokenData.accessToken,
                refreshToken: authTokenData.refreshToken,
                privateKeyAccessStr: registeredUser.privateKeyAccessStr,
            };
            return ({ success: true, user: user });
        }
        else {
            console.log("Credentials are invalid, throwing error");
            throw { validUser: true };
        }
    }
    catch (ex) {
        console.log("An exception occurred during login: ", ex)
        return ({ success: false, validUser: ex.validUser });
    }
}

export async function checkLoggedIn(refreshToken) {
    // If the refresh token is valid, return the username and a new auth token
    if (refreshToken == null || refreshToken == "") return false;
    const rtVerificationResult = await validateRefreshToken(refreshToken);
    if (!rtVerificationResult.success) return ({ success: false });
    const newAccessToken = await generateAccessToken(rtVerificationResult.username);
    const user = await checkIfUserExists(rtVerificationResult.username);
    return ({ success: true, username: rtVerificationResult.username, avatar: user.avatar, accessToken: newAccessToken.accessToken });
}