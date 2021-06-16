import React from 'react';
import { Grid, Typography, TextField, Button, Card, CardContent, CardHeader, Container } from '@material-ui/core';
import useStyles from './styles/login-styles.js';

function Login() {
    const classes = useStyles();
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
                                }} />
                            </Grid>
                            <Grid item>
                                <TextField id="outlined-basic" label="Password" variant="outlined" size="small" fullWidth style={{
                                    paddingBottom: '1vh',
                                }} />
                            </Grid>
                            <Grid item>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between'
                                }}>
                                    <Button variant="contained" color="primary" style={{ width: '70%', marginRight: '1vh' }}>Login</Button>
                                    <Button variant="outlined" color="primary">Register</Button>
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