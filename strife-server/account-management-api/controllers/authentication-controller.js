import bcrypt from 'bcrypt';
import Account from '../models/account-model.js';
import { registerUser } from '../services/registration-service.js';

export async function handleUserRegistration(req, res) {
    const userInfo = ({
        email: req.body.email,
        username: req.body.username,
        password: req.body.password
    });
    try {
        const registrationResult = await registerUser(userInfo);
        if (registrationResult.success == true) {
            res.status(200).json({
                success: true,
                username: registrationResult.user.username,
                accessToken: registrationResult.user.accessToken // send generated access token here
            })
        }
        if (registrationResult.success == false && registrationResult.duplicate == true) {
            res.status(400).json({
                duplicate: true,
                success: false,
                msg: "Username unavailable"
            });
        }
    }
    catch (err) {
        res.status(400).json({
            duplicate: false,
            success: false,
            msg: "Error occured during registration"
        });
    }
}



export function handleUserLogin(req, res) {
    res.status(200).send("Entered: handleUserRegistration()");
}

export function handleUserLogout(req, res) {
    res.status(200).send("Entered: handleUserRegistration()");
}

async function hashPassword(rawPassword) {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(rawPassword, salt);
    return hashedPassword;
}