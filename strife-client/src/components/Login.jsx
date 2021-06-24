import React, { useState, useContext, useEffect } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { Grid, Typography, TextField, Button, Card, CardContent, CardHeader, Container } from '@material-ui/core';
import useStyles from './styles/login-styles.js';
import { UserContext } from '../UserContext.js';
import { loginUser, checkLoggedIn } from '../services/login-service.js';

function Login() {
    const classes = useStyles();
    const { user, setUser } = useContext(UserContext);
    const [currentData, setCurrentData] = useState({ username: "", password: "" });
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
    }, []);

    async function handleLoginBtnClick() {
        const loginResult = await loginUser(currentData);
        if (loginResult.success == true) {
            setUser({ username: loginResult.username, accessToken: loginResult.accessToken });
            history.push('/');
        }
        else if (loginResult.validUser == false) {
            console.log("User does not exist!")
            // Show user does not exist error
        }
        else {
            console.log("Invalid credentials!")
            // Show invalid credentials error
        }
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
                        title="Login"
                        subheader="or don't, whatever"
                        style={{ paddingTop: '3vh' }}
                    />
                    <CardContent>
                        <Grid container spacing={1} style={{ display: 'block' }}>
                            <Grid item>
                                <TextField id="outlined-basic" label="Username" variant="outlined" size="small" fullWidth style={{
                                    paddingBottom: '1vh',
                                }}
                                    onChange={event => setCurrentData({ username: event.target.value, password: currentData.password })}
                                />
                            </Grid>
                            <Grid item>
                                <TextField id="outlined-basic" label="Password" variant="outlined" size="small" fullWidth type="password" style={{
                                    paddingBottom: '1vh',
                                }}
                                    onChange={event => setCurrentData({ username: currentData.username, password: event.target.value })}
                                />
                            </Grid>
                            <Grid item>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between'
                                }}>
                                    <Button variant="contained" color="primary" style={{ width: '80%', marginRight: '1vh' }} onClick={() => handleLoginBtnClick()}>Login</Button>
                                    <Button variant="outlined" color="primary" component={Link} to="/register">Register</Button>
                                </div>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default Login;