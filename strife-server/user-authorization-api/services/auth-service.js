import jwt from 'jsonwebtoken';
import { AuthToken } from '../models/auth-token-model.js';

export function generateAccessToken(username) {
    return jwt.sign({ username: username }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10m' });
}

export async function generateRefreshToken(username) {
    const refreshToken = jwt.sign({ username: username }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '20d' });
    console.log(`Generated refreshToken, saving to db...`);
    const authToken = new AuthToken({
        username: username,
        refreshToken: refreshToken
    });
    return authToken.save();
}

export function verifyAccessToken(accessToken) {
    if (accessToken == null || accessToken == "") return false;
    try {
        jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
        return true;
    }
    catch (err) {
        console.log("An error occured: ", err);
        return false;
    }
}

export async function verifyRefreshToken(username, refreshToken) {
    const storedRefreshToken = await AuthToken.findOne({
        refreshToken: refreshToken
    });
    if (storedRefreshToken == null) return false;
    if (storedRefreshToken.username != username) return false;
    try {
        jwt.verify(storedRefreshToken.refreshToken, process.env.REFRESH_TOKEN_SECRET);
        return true;
    }
    catch (err) {
        console.log("An error occured: ", err);
        return false;
    }
}