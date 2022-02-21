import React from 'react';
import {
  BiPhoneIncoming,
  BiPhoneOff,
  BiMicrophoneOff,
  BiMicrophone,
} from 'react-icons/bi';
import { IconButton, Typography, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import useStyles from '../../../styles/chat-styles.js';

export default function PhoneBox(props) {
  const classes = useStyles();
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={classes.callContainer}
      >
        <Paper elevation={2} style={{ margin: '0 0.5rem 0.5rem 0.5rem' }}>
          {
            <>
              <div className={classes.callInfoContainer}>
                {props.callData.isCallIncoming &&
                  !props.callData.isCallConnected && (
                    <Typography
                      style={{
                        fontVariant: 'small-caps',
                        fontFamily: "'Syne', sans-serif",
                        fontWeight: 'bold',
                        letterSpacing: '1px',
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center' }}>
                        incoming call from
                        <Typography
                          style={{
                            marginLeft: '5px',
                            color: '#1fd1f9',
                            fontSize: '1.2rem',
                            fontWeight: 'bold',
                          }}
                        >
                          {props.callData.participant}
                        </Typography>
                      </span>
                    </Typography>
                  )}
                {props.callData.isCallActive &&
                  !props.callData.isCallIncoming &&
                  !props.callData.isCallConnected && (
                    <Typography
                      style={{
                        fontVariant: 'small-caps',
                        fontFamily: "'Syne', sans-serif",
                        fontWeight: 'bold',
                        letterSpacing: '1px',
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center' }}>
                        calling
                        <Typography
                          style={{
                            marginLeft: '5px',
                            color: '#1fd1f9',
                            fontSize: '1.2rem',
                            fontWeight: 'bold',
                          }}
                        >
                          {props.callData.participant}
                        </Typography>
                      </span>
                    </Typography>
                  )}
                {props.callData.isCallConnected && (
                  <Typography
                    style={{
                      fontVariant: 'small-caps',
                      fontFamily: "'Syne', sans-serif",
                      fontWeight: 'bold',
                      letterSpacing: '1px',
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center' }}>
                      on call with
                      <Typography
                        style={{
                          marginLeft: '5px',
                          color: '#1fd1f9',
                          fontSize: '1.2rem',
                          fontWeight: 'bold',
                        }}
                      >
                        {props.callData.participant}
                      </Typography>
                    </span>
                  </Typography>
                )}
              </div>
            </>
          }
          <div className={classes.callButtonsContainer}>
            {returnCallButton(props, classes)}
          </div>
        </Paper>
      </motion.div>
    </>
  );
}

function returnCallButton(props, classes) {
  return (
    <>
      {props.callData.isCallIncoming && !props.callData.isCallConnected && (
        <IconButton
          onClick={() =>
            props.callOptions.acceptCall(props.callData.participant)
          }
          size="large"
          style={{
            backgroundColor: 'transparent',
          }}
        >
          <BiPhoneIncoming
            fontSize="x-large"
            className={classes.shakeCallBtn}
            style={{ color: '#A6BF4B' }}
          />
        </IconButton>
      )}
      {props.callData.isCallActive && !props.callData.isCallConnected && (
        <IconButton
          onClick={() => props.callOptions.endCall(true)}
          size="large"
          style={{
            backgroundColor: 'transparent',
          }}
        >
          <BiPhoneOff
            fontSize="x-large"
            className={!props.callData.isCallIncoming && classes.shakeCallBtn}
            style={{ color: '#BB2020' }}
          />
        </IconButton>
      )}
      {props.callData.isCallConnected && (
        <div className={classes.callOptionsContainer}>
          <IconButton
            onClick={() =>
              props.muteMic.status
                ? props.muteMic.toggle(false)
                : props.muteMic.toggle(true)
            }
            size="large"
            style={{
              backgroundColor: 'transparent',
            }}
          >
            {props.muteMic.status ? (
              <BiMicrophoneOff fontSize="medium" style={{ color: '#BB2020' }} />
            ) : (
              <BiMicrophone fontSize="medium" style={{ color: '#A6BF4B' }} />
            )}
          </IconButton>
          <IconButton
            onClick={() => props.callOptions.endCall(true)}
            size="large"
            style={{
              backgroundColor: 'transparent',
            }}
          >
            <BiPhoneOff fontSize="medium" style={{ color: '#BB2020' }} />
          </IconButton>
        </div>
      )}
    </>
  );
}
