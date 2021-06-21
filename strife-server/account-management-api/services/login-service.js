import bcrypt from 'bcrypt';
import { generateAccessToken } from '../clients/user-authorization-api-client.js';
import { checkIfUserExists } from './registration-service.js';

export async function loginUser(userInfo) {
    try {
        const registeredUser = await checkIfUserExists(userInfo.username);
        if (registeredUser == null) {
            throw { validUser: false };
        }
        console.log("Username is valid");
        // Proceed if it's a valid user
        if (bcrypt.compareSync(userInfo.password, registeredUser.password)) {
            const accessTokenResponse = await generateAccessToken(registeredUser.username);
            // TODO: Generate new refresh token here
            // TODO: Set refresh token in HttpOnly cookie
            const user = { username: registeredUser.username, accessToken: accessTokenResponse.accessToken };
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