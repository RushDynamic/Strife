import bcrypt from 'bcrypt';
import Account from '../models/account-model.js';

export function handleUserRegistration(req, res) {
    Account.findOne({
        username: req.body.username
    }).then((result) => {
        if (result != null) {
            // Username already exists
            res.status(400).json({
                duplicate: true,
                success: false,
                msg: "Username unavailable"
            });
        }

        // Proceed if username is valid
        hashPassword(req.body.password)
            .then((hashedPassword) => {
                const newAccount = new Account({
                    email: req.body.email,
                    username: req.body.username,
                    password: hashedPassword
                });

                newAccount.save()
                    .then((savedUser) => {
                        const username = savedUser.username;
                        // TODO: Generate access and refresh tokens here
                        res.status(200).json({
                            username: username,
                            accessToken: "" // send generated access token here
                        })
                        console.log("User registered successfully");
                    })
            })
    })
        .catch((err) => res.status(400).json({
            msg: "An error occured during registration",
            success: false
        }))
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