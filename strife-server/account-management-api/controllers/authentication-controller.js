import { registerUser } from '../services/registration-service.js';
import { loginUser } from '../services/login-service.js';

export async function handleUserRegistration(req, res) {
    const userInfo = ({
        email: req.body.email,
        username: req.body.username,
        password: req.body.password
    });
    try {
        const registrationResponse = await registerUser(userInfo);
        if (registrationResponse.success == true) {
            res.status(200).json({
                success: true,
                username: registrationResponse.user.username,
                accessToken: registrationResponse.user.accessToken // send generated access token here
            });
        }
        if (registrationResponse.success == false && registrationResponse.duplicate == true) {
            res.status(400).json({
                duplicate: true,
                success: false,
                msg: "Username unavailable"
            });
        }
    }
    catch (ex) {
        console.log("An exception occured during registration: ", ex);
        res.status(400).json({
            duplicate: false,
            success: false,
            msg: "Error occured during registration"
        });
    }
}



export async function handleUserLogin(req, res) {
    const userInfo = {
        username: req.body.username,
        password: req.body.password
    };
    try {
        const loginResponse = await loginUser(userInfo);
        console.log("loginResponse: ", loginResponse);
        if (loginResponse.success == true) {
            res.status(200).json({
                username: loginResponse.user.username,
                accessToken: loginResponse.user.accessToken
            });
        }
        if (loginResponse.success == false && loginResponse.validUser == false) {
            res.status(400).json({
                success: false,
                validUser: false
            })
        }
        else if (loginResponse.success == false) {
            res.status(400).json({
                success: false,
                validUser: true
            })
        }
    }
    catch (ex) {
        console.log("An exception occured during login: ", ex);
        res.status(400).json({
            success: false,
            validUser: true
        });
    }
}

export function handleUserLogout(req, res) {
    res.status(200).send("Entered: handleUserRegistration()");
}