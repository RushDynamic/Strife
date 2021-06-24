import React, { useState, useContext, useEffect } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { Grid, Typography, TextField, Button, Card, CardContent, CardHeader, Container } from '@material-ui/core';
import useStyles from './styles/login-styles.js';
import { registerUser } from '../services/registration-service.js';
import { checkLoggedIn } from '../services/login-service.js';
import { UserContext } from '../UserContext.js';

function Register() {
    const classes = useStyles();
    const [currentUserData, setCurrentUserData] = useState({ email: "", username: "", password: "" });
    const { user, setUser } = useContext(UserContext);
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

    async function handleRegisterBtnClick() {
        const registrationResult = await registerUser(currentUserData);
        console.log("registrationResult: ", registrationResult);
        if (registrationResult == false) {
            // throw error and return to regpage
        }
        setUser({ username: registrationResult.username, accessToken: registrationResult.accessToken });
        // redirect to homepage
        history.push('/');
    }

    return (
        <div className={classes.loginContainer}>
            <div className={classes.loginPanelLeft}>
                <div className={classes.blurredBackground}>
                    <Typography variant="h1" className={classes.mainText}>Welcome to Strife</Typography>
                    <Typography variant="h2" className={classes.mainText}>VoIP for gamers</Typography>
                </div>
            </div>
            <div className={`${classes.loginPanelRight} ${classes.flexItem}`}>
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
        </div>
    );
}

export default Register;