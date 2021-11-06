import React, { useState, useContext, useEffect } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { Grid, Typography, TextField, Button, Card, CardContent, CardHeader, Snackbar } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import useStyles from './styles/login-styles.js';
import { registerUser } from '../services/registration-service.js';
import { checkLoggedIn } from '../services/login-service.js';
import * as cryptoService from '../services/crypto-service.js';
import { UserContext } from '../UserContext.js';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function Register() {
    const classes = useStyles();
    const [currentUserData, setCurrentUserData] = useState({ email: "", username: "", password: "", encodedKeyPair: null });
    const { user, setUser } = useContext(UserContext);
    const [showRegistrationFailure, setShowRegistrationFailure] = useState({ showError: false, msg: "Could not register your account, please try again later!" });
    const history = useHistory();

    useEffect(() => {
        (async function () {
            const isUserLoggedIn = await checkLoggedIn();
            console.log("isUserLoggedIn: ", isUserLoggedIn);
            if (isUserLoggedIn.username != null && isUserLoggedIn.username.length !== 0) {
                console.log("You're logged in!");
                setUser({ username: isUserLoggedIn.username, accessToken: isUserLoggedIn.accessToken });
                history.push('/');
            }
            else {
                console.log("You're NOT logged in!");
                setUser({ username: null, accessToken: null })
            }
        })();
    }, [])

    const generateKeyPair = (password) => {
        const keyPair = cryptoService.generateKeyPair();
        const publicKeyBase64 = cryptoService.bytesToBase64(keyPair.publicKey);
        const privateKeyBase64 = cryptoService.bytesToBase64(keyPair.secretKey);
        const encryptedPrivateKey = cryptoService.encryptSymmetric(privateKeyBase64, password);
        return { publicKey: publicKeyBase64, encryptedPrivateKey: encryptedPrivateKey };
    }

    async function handleRegisterBtnClick() {
        currentUserData.encodedKeyPair = generateKeyPair(currentUserData.password);
        const registrationResult = await registerUser(currentUserData);
        console.log("registrationResult: ", registrationResult);
        if (registrationResult.success == false) {
            if (registrationResult.duplicate == true) setShowRegistrationFailure({ showError: true, msg: "Sorry, that username is not available!" })
            else setShowRegistrationFailure(...showRegistrationFailure, { showError: true });
        }
        else {
            setUser({ username: registrationResult.username, accessToken: registrationResult.accessToken });
            // redirect to homepage
            history.push('/');
        }
    }

    return (
        <>
            <video src="http://localhost:3000/media/bgclips/clip1_mop_guy.mp4" muted loop autoPlay={true} style={{ position: 'absolute', height: '100%', width: '100%', objectFit: 'cover', opacity: 0.2, top: 0, left: 0 }}></video>

            <div className={classes.loginContainer}>
                <div className={classes.loginPanelLeft}>
                    <div className={classes.blurredBackground}>
                        <Typography variant="h1" className={classes.mainText}>Welcome to <span style={{ color: '#1fd1f9' }}>Strife</span></Typography>
                        <Typography variant="h4" className={classes.mainText}>where all the cool kids hangout</Typography>
                    </div>
                </div>
                <div className={`${classes.loginPanelRight} ${classes.flexItem}`} style={{ zIndex: 9 }}>
                    <Card className={classes.loginCard}>
                        <CardHeader
                            title="Register"
                            subheader="please do"
                            style={{ paddingTop: '3vh' }}
                        />
                        <CardContent>
                            <Grid container spacing={1} style={{ display: 'block' }}>
                                <Grid item>
                                    <TextField
                                        id="outlined-basic"
                                        label="Email"
                                        variant="outlined"
                                        size="small"
                                        fullWidth
                                        required={true}
                                        onChange={
                                            event => {
                                                setCurrentUserData({ username: currentUserData.username, email: event.target.value, password: currentUserData.password });
                                            }
                                        }
                                        style={{
                                            paddingBottom: '1vh',
                                        }} />
                                </Grid>
                                <Grid item>
                                    <TextField
                                        id="outlined-basic"
                                        label="Username"
                                        variant="outlined"
                                        size="small"
                                        fullWidth
                                        required={true}
                                        onChange={
                                            event => {
                                                setCurrentUserData({ username: event.target.value, email: currentUserData.email, password: currentUserData.password });
                                            }
                                        }
                                        style={{
                                            paddingBottom: '1vh',
                                        }} />
                                </Grid>
                                <Grid item>
                                    <TextField
                                        id="outlined-basic"
                                        label="Password"
                                        variant="outlined"
                                        size="small"
                                        fullWidth
                                        required={true}
                                        onChange={
                                            event => {
                                                setCurrentUserData({ username: currentUserData.username, email: currentUserData.email, password: event.target.value })
                                            }
                                        }
                                        type="password"
                                        style={{
                                            paddingBottom: '1vh',
                                        }} />
                                </Grid>
                                <Grid item>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between'
                                    }}>
                                        <Button variant="contained" color="primary" style={{ width: '80%', marginRight: '1vh' }} onClick={() => handleRegisterBtnClick()}>Register</Button>
                                        <Button variant="outlined" color="primary" component={Link} to="/login">Login</Button>
                                    </div>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </div>
                <Snackbar open={showRegistrationFailure.showError} autoHideDuration={3000} onClose={() => setShowRegistrationFailure(false)}>
                    <Alert severity="error">
                        {showRegistrationFailure.msg}
                    </Alert>
                </Snackbar>
            </div>
        </>
    );
}

export default Register;