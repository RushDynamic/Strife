import React from 'react';
import {
  BiPhoneIncoming,
  BiPhoneOff,
  BiMicrophoneOff,
  BiMicrophone,
} from 'react-icons/bi';
import {
  List,
  ListItem,
  ListItemText,
  IconButton,
  Typography,
} from '@mui/material';
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
        {
          <>
            <List>
              <ListItem>
                <ListItemText
                  disableTypography
                  primary={
                    <Typography
                      style={{
                        color: '#1fd1f9',
                        fontVariant: 'small-caps',
                        fontFamily: "'Syne', sans-serif",
                        fontSize: '1.3rem',
                        letterSpacing: '3px',
                      }}
                    >
                      voice chat
                    </Typography>
                  }
                />
              </ListItem>
            </List>
            <div className={classes.callInfoContainer}>
              {props.callData.isCallIncoming &&
                !props.callData.isCallConnected && (
                  <Typography
                    style={{
                      fontVariant: 'small-caps',
                      fontFamily: "'Syne', sans-serif",
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      incoming call from
                      <Typography
                        style={{
                          marginLeft: '5px',
                          color: '#1fd1f9',
                          fontSize: '1.2rem',
                        }}
                      >
                        {props.callData.participant}
                      </Typography>
                    </div>
                  </Typography>
                )}
              {props.callData.isCallActive &&
                !props.callData.isCallIncoming &&
                !props.callData.isCallConnected && (
                  <Typography
                    style={{
                      fontVariant: 'small-caps',
                      fontFamily: "'Syne', sans-serif",
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      calling
                      <Typography
                        style={{
                          marginLeft: '5px',
                          color: '#1fd1f9',
                          fontSize: '1.2rem',
                        }}
                      >
                        {props.callData.participant}
                      </Typography>
                    </div>
                  </Typography>
                )}
              {props.callData.isCallConnected && (
                <Typography
                  style={{
                    fontVariant: 'small-caps',
                    fontFamily: "'Syne', sans-serif",
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    on call with
                    <Typography
                      style={{
                        marginLeft: '5px',
                        color: '#1fd1f9',
                        fontSize: '1.2rem',
                      }}
                    >
                      {props.callData.participant}
                    </Typography>
                  </div>
                </Typography>
              )}
            </div>
          </>
        }
        <div className={classes.callButtonsContainer}>
          {returnCallButton(props, classes)}
        </div>
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
        >
          <BiPhoneIncoming
            fontSize="xx-large"
            className={classes.shakeCallBtn}
            style={{ color: '#A6BF4B' }}
          />
        </IconButton>
      )}
      {props.callData.isCallActive && !props.callData.isCallConnected && (
        <IconButton
          onClick={() => props.callOptions.broadcastAndEndCall()}
          size="large"
        >
          <BiPhoneOff
            fontSize="xx-large"
            className={!props.callData.isCallIncoming && classes.shakeCallBtn}
            style={{ color: '#BB2020' }}
          />
        </IconButton>
      )}
      {props.callData.isCallConnected && (
        <div className={classes.callOptionsContainer}>
          <IconButton
            onClick={() =>
              props.micMuted
                ? props.setMicMuted(false)
                : props.setMicMuted(true)
            }
            size="large"
          >
            {props.micMuted ? (
              <BiMicrophoneOff fontSize="medium" style={{ color: '#BB2020' }} />
            ) : (
              <BiMicrophone fontSize="medium" style={{ color: '#A6BF4B' }} />
            )}
          </IconButton>
          <IconButton
            onClick={() => props.callOptions.broadcastAndEndCall()}
            size="large"
          >
            <BiPhoneOff fontSize="medium" style={{ color: '#BB2020' }} />
          </IconButton>
        </div>
      )}
    </>
  );
}
