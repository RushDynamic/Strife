import { registerUser } from '../services/registration-service.js';
import { loginUser, checkLoggedIn } from '../services/login-service.js';

export async function handleUserRegistration(req, res) {
    const userInfo = ({
        email: req.body.email,
        username: req.body.username.toLowerCase(),
        password: req.body.password,
        publicKey: req.body.publicKey,
        localStorageKey: req.body.localStorageKey
    });
    console.log("UserInfo: ", userInfo);
    try {
        const registrationResponse = await registerUser(userInfo);
        if (registrationResponse.success == true) {
            res.cookie('refreshToken', registrationResponse.user.refreshToken, { sameSite: 'strict', path: '/', httpOnly: true });
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
        username: req.body.username.toLowerCase(),
        password: req.body.password,
        publicKey: req.body.publicKey,
        localStorageKey: req.body.localStorageKey
    };
    try {
        const loginResponse = await loginUser(userInfo);
        if (loginResponse.success == true) {
            // TODO: Set refresh token in HttpOnly cookie here
            res.cookie('refreshToken', loginResponse.user.refreshToken, { sameSite: 'strict', path: '/', httpOnly: true });
            res.status(200).json({
                success: true,
                username: loginResponse.user.username,
                avatar: loginResponse.user.avatar,
                accessToken: loginResponse.user.accessToken,
                localStorageKey: loginResponse.user.localStorageKey
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

export async function handleCheckLoggedIn(req, res) {
    const refreshToken = req.cookies.refreshToken;
    const isUserLoggedIn = await checkLoggedIn(refreshToken);
    if (isUserLoggedIn.success) {
        res.status(200).json({
            success: true,
            username: isUserLoggedIn.username,
            avatar: isUserLoggedIn.avatar,
            accessToken: isUserLoggedIn.accessToken,
            localStorageKey: isUserLoggedIn.localStorageKey,
            publicKey: isUserLoggedIn.publicKey
        });
    }
    else {
        res.status(401).json({
            success: false,
            username: null,
            accessToken: null
        });
    }
}