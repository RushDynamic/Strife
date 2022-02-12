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
  InputAdornment,
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import MuiAlert from '@mui/material/Alert';
import { BiUser, BiKey } from 'react-icons/bi';
import { AiOutlineMail } from 'react-icons/ai';
import useStyles from './styles/login-styles.js';
import { registerUser } from '../services/registration-service.js';
import { checkLoggedIn } from '../services/login-service.js';
import * as cryptoService from '../services/crypto-service.js';
import { UserContext } from '../UserContext.js';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function Register() {
  const classes = useStyles();
  const [currentUserData, setCurrentUserData] = useState({
    email: '',
    username: '',
    password: '',
    encodedKeyPair: null,
  });
  const { setUser } = useContext(UserContext);
  const [fetchingData, setFetchingData] = useState(false);
  const [showRegistrationFailure, setShowRegistrationFailure] = useState({
    showError: false,
    msg: 'Could not register your account, please try again later!',
  });
  const history = useHistory();

  useEffect(() => {
    (async function () {
      setFetchingData(true);
      const isUserLoggedIn = await checkLoggedIn();
      console.log('isUserLoggedIn: ', isUserLoggedIn);
      if (
        isUserLoggedIn.username != null &&
        isUserLoggedIn.username.length !== 0
      ) {
        console.log("You're logged in!");
        setUser({
          ...isUserLoggedIn,
        });
        history.push('/');
      } else {
        console.log("You're NOT logged in!");
        setUser({ username: null, accessToken: null });
      }
      setFetchingData(false);
    })();
  }, []);

  const generateKeyPair = (password) => {
    const keyPair = cryptoService.generateKeyPair();
    const publicKeyBase64 = cryptoService.bytesToBase64(keyPair.publicKey);
    const privateKeyBase64 = cryptoService.bytesToBase64(keyPair.secretKey);
    // const encryptedPrivateKey = cryptoService.encryptSymmetric(privateKeyBase64, password);
    const encryptedPrivateKey =
      cryptoService.encryptSymmetricWithNewKey(privateKeyBase64);
    const encryptedSecureStorageKey = cryptoService.encryptSymmetric(
      encryptedPrivateKey.secureStoragekeyBase64,
      password,
      true,
    );
    return {
      publicKey: publicKeyBase64,
      privateKey: privateKeyBase64,
      encryptedPrivateKey: encryptedPrivateKey.encInputWithNonceBase64,
      secureStorageKey: encryptedPrivateKey.secureStoragekeyBase64,
      encryptedSecureStorageKey: encryptedSecureStorageKey,
    };
  };

  async function handleRegisterBtnClick() {
    setFetchingData(true);
    const keyPairData = generateKeyPair(currentUserData.password);
    // Store raw Secure Storage Key in local storage
    localStorage.setItem('secureStorageKey', keyPairData.secureStorageKey);
    currentUserData.encodedKeyPair = {
      publicKey: keyPairData.publicKey,
      privateKey: {
        encryptedPrivateKey: keyPairData.encryptedPrivateKey,
        encryptedSecureStorageKey: keyPairData.encryptedSecureStorageKey,
      },
    };
    // currentUserData.encodedKeyPair = generateKeyPair(currentUserData.password);
    const registrationResult = await registerUser(currentUserData);
    console.log('registrationResult: ', registrationResult);
    if (registrationResult.success === false) {
      if (registrationResult.duplicate === true)
        setShowRegistrationFailure({
          showError: true,
          msg: 'Sorry, that username is not available!',
        });
      else
        setShowRegistrationFailure(...showRegistrationFailure, {
          showError: true,
        });
    } else {
      setUser({
        username: registrationResult.username,
        accessToken: registrationResult.accessToken,
        publicKey: keyPairData.publicKey,
        privateKey: keyPairData.privateKey,
      });
      // redirect to homepage
      history.push('/');
    }
    setFetchingData(false);
  }

  return (
    <>
      <video
        onContextMenu={() => {
          return false;
        }}
        src={`${process.env.REACT_APP_S3_BUCKET_URL}/static/bgclips/clip1_mop_guy.mp4`}
        muted
        loop
        autoPlay={true}
        style={{
          position: 'absolute',
          height: '100%',
          width: '100%',
          objectFit: 'cover',
          opacity: 0.2,
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
            <Typography variant="h4" className={classes.subText}>
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
              title="Register"
              subheader="please do"
              style={{ paddingTop: '3vh' }}
            />
            <CardContent>
              <Grid container spacing={1} style={{ display: 'block' }}>
                <Grid item>
                  <TextField
                    id="outlined-email"
                    label="Email"
                    variant="outlined"
                    size="small"
                    fullWidth
                    required={true}
                    style={{
                      paddingBottom: '1vh',
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AiOutlineMail style={{ color: '#a8a8a8' }} />
                        </InputAdornment>
                      ),
                    }}
                    onChange={(event) => {
                      setCurrentUserData({
                        username: currentUserData.username,
                        email: event.target.value,
                        password: currentUserData.password,
                      });
                    }}
                  />
                </Grid>
                <Grid item>
                  <TextField
                    id="outlined-username"
                    label="Username"
                    variant="outlined"
                    size="small"
                    fullWidth
                    required={true}
                    style={{
                      paddingBottom: '1vh',
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <BiUser style={{ color: '#a8a8a8' }} />
                        </InputAdornment>
                      ),
                    }}
                    onChange={(event) => {
                      setCurrentUserData({
                        username: event.target.value,
                        email: currentUserData.email,
                        password: currentUserData.password,
                      });
                    }}
                  />
                </Grid>
                <Grid item>
                  <TextField
                    id="outlined-password"
                    label="Password"
                    variant="outlined"
                    size="small"
                    fullWidth
                    required={true}
                    type="password"
                    style={{
                      paddingBottom: '1vh',
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <BiKey style={{ color: '#a8a8a8' }} />
                        </InputAdornment>
                      ),
                    }}
                    onChange={(event) => {
                      setCurrentUserData({
                        username: currentUserData.username,
                        email: currentUserData.email,
                        password: event.target.value,
                      });
                    }}
                  />
                </Grid>
                <Grid item>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                    }}
                  >
                    <LoadingButton
                      loading={fetchingData}
                      variant="contained"
                      color="primary"
                      style={{ width: '80%', marginRight: '1vh' }}
                      onClick={() => handleRegisterBtnClick()}
                    >
                      Register
                    </LoadingButton>
                    <Button
                      variant="outlined"
                      color="primary"
                      component={Link}
                      to="/login"
                    >
                      Login
                    </Button>
                  </div>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </div>
        <Snackbar
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          open={showRegistrationFailure.showError}
          autoHideDuration={3000}
          onClose={() =>
            setShowRegistrationFailure({
              ...showRegistrationFailure,
              showError: false,
            })
          }
        >
          <Alert severity="error">{showRegistrationFailure.msg}</Alert>
        </Snackbar>
      </div>
    </>
  );
}

export default Register;
