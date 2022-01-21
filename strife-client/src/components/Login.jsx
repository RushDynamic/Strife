import React, { useState, useContext, useEffect } from 'react';
import { useHistory, Link } from 'react-router-dom';
import {
  Grid,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  CardHeader,
  Snackbar,
} from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import useStyles from './styles/login-styles.js';
import { UserContext } from '../UserContext.js';
import { loginUser, checkLoggedIn } from '../services/login-service.js';
import * as cryptoService from '../services/crypto-service.js';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function Login() {
  const classes = useStyles();
  const { setUser } = useContext(UserContext);
  const [currentData, setCurrentData] = useState({
    username: '',
    password: '',
  });
  const [loginStatus, setLoginStatus] = useState({ failure: false, msg: '' });
  const history = useHistory();

  useEffect(() => {
    (async function () {
      const isUserLoggedIn = await checkLoggedIn();
      console.log('isUserLoggedIn: ', isUserLoggedIn);
      if (
        isUserLoggedIn.username != null &&
        isUserLoggedIn.username.length !== 0
      ) {
        console.log("You're logged in!");
        setUser({
          username: isUserLoggedIn.username,
          accessToken: isUserLoggedIn.accessToken,
        });
        history.push('/');
      } else {
        console.log("You're NOT logged in!");
        setUser({ username: null, accessToken: null });
      }
    })();
  }, []);

  async function handleLoginBtnClick() {
    const loginResult = await loginUser(currentData);
    if (loginResult.success === true) {
      // Decrypt secureStorageKey key and store it in localStorage
      // Decrypt private key and store it in UserContext
      const encodedKeyPair = JSON.parse(loginResult.encodedKeyPair);
      const secureStorageKey = cryptoService.decryptSymmetric(
        encodedKeyPair.privateKey.encryptedSecureStorageKey,
        currentData.password,
      );
      const decryptedPrivateKey = cryptoService.decryptSymmetric(
        encodedKeyPair.privateKey.encryptedPrivateKey,
        secureStorageKey,
        true,
      );
      localStorage.setItem('secureStorageKey', secureStorageKey);
      setLoginStatus({
        success: true,
        msg: `You have successfully logged in as ${loginResult.username}`,
      });
      setUser({
        username: loginResult.username,
        publicKey: encodedKeyPair.publicKey,
        privateKey: decryptedPrivateKey,
        accessToken: loginResult.accessToken,
      });
      history.push('/');
    } else if (loginResult.validUser === false) {
      setLoginStatus({ failure: true, msg: `That user does not exist!` });
      console.log('User does not exist!');
    } else {
      setLoginStatus({
        failure: true,
        msg: `Your credentials are invalid, please try again`,
      });
      console.log('Invalid credentials!');
    }
  }

  return (
    <>
      <video
        onContextMenu="return false;"
        src="http://localhost:3000/media/bgclips/clip1_mop_guy.mp4"
        muted
        loop
        autoPlay={true}
        style={{
          position: 'absolute',
          height: '100%',
          width: '100%',
          objectFit: 'cover',
          opacity: 0.5,
          top: 0,
          left: 0,
        }}
      ></video>
      <div className={classes.loginContainer}>
        <div className={classes.loginPanelLeft}>
          <div className={classes.blurredBackground}>
            <Typography variant="h1" className={classes.mainText}>
              Welcome to <span style={{ color: '#1fd1f9' }}>Strife</span>
            </Typography>
            <Typography variant="h4" className={classes.mainText}>
              where all the cool kids hangout
            </Typography>
          </div>
        </div>
        <div
          className={`${classes.loginPanelRight} ${classes.flexItem}`}
          style={{ zIndex: 9 }}
        >
          <Card className={classes.loginCard}>
            <CardHeader
              title="Login"
              subheader="or don't, whatever"
              style={{ paddingTop: '3vh' }}
            />
            <CardContent>
              <Grid container spacing={1} style={{ display: 'block' }}>
                <Grid item>
                  <TextField
                    id="outlined-basic"
                    label="Username"
                    variant="outlined"
                    size="small"
                    fullWidth
                    style={{
                      paddingBottom: '1vh',
                    }}
                    onChange={(event) =>
                      setCurrentData({
                        username: event.target.value,
                        password: currentData.password,
                      })
                    }
                  />
                </Grid>
                <Grid item>
                  <TextField
                    id="outlined-basic"
                    label="Password"
                    variant="outlined"
                    size="small"
                    fullWidth
                    type="password"
                    style={{
                      paddingBottom: '1vh',
                    }}
                    onChange={(event) =>
                      setCurrentData({
                        username: currentData.username,
                        password: event.target.value,
                      })
                    }
                  />
                </Grid>
                <Grid item>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      style={{ width: '80%', marginRight: '1vh' }}
                      onClick={() => handleLoginBtnClick()}
                    >
                      Login
                    </Button>
                    <Button
                      variant="outlined"
                      color="primary"
                      component={Link}
                      to="/register"
                    >
                      Register
                    </Button>
                  </div>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </div>
        <Snackbar
          open={loginStatus.failure}
          autoHideDuration={3000}
          onClose={() => setLoginStatus({ failure: false, msg: '' })}
        >
          <Alert severity="error">{loginStatus.msg}</Alert>
        </Snackbar>
        <Snackbar
          open={loginStatus.success}
          autoHideDuration={3000}
          onClose={() => setLoginStatus({ success: false, msg: '' })}
        >
          <Alert severity="success">{loginStatus.msg}</Alert>
        </Snackbar>
      </div>
    </>
  );
}

export default Login;
