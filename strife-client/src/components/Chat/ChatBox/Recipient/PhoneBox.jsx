import React, { useState } from 'react';
import {
  BiPhone,
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
  Paper,
} from '@material-ui/core';
import { motion } from 'framer-motion';
import useStyles from '../../../styles/chat-styles.js';

export default function PhoneBox(props) {
  const classes = useStyles();
  const [micMuted, setMicMuted] = useState(false);
  return (
    <>
      <Paper elevation={2} style={{ marginBottom: '10px' }}>
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
                          {props.recipientName}
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
            {returnCallButton(
              props.callData,
              props.createCall,
              props.acceptCall,
              props.recipientName,
              micMuted,
              setMicMuted,
              classes,
            )}
          </div>
        </motion.div>
      </Paper>
    </>
  );
}

function returnCallButton(
  callData,
  createCall,
  acceptCall,
  recipientName,
  micMuted,
  setMicMuted,
  classes,
) {
  return (
    <>
      {callData.isCallIncoming && !callData.isCallConnected && (
        <IconButton onClick={() => acceptCall(recipientName)}>
          <BiPhoneIncoming
            fontSize="xx-large"
            className={classes.shakeCallBtn}
          />
        </IconButton>
      )}
      {!callData.isCallActive && (
        <IconButton onClick={() => createCall(recipientName)}>
          <BiPhone fontSize="xx-large" />
        </IconButton>
      )}
      {callData.isCallActive && !callData.isCallConnected && (
        <IconButton>
          <BiPhoneOff
            fontSize="xx-large"
            className={!callData.isCallIncoming && classes.shakeCallBtn}
          />
        </IconButton>
      )}
      {callData.isCallConnected && (
        <div className={classes.callOptionsContainer}>
          <IconButton
            onClick={() => (micMuted ? setMicMuted(false) : setMicMuted(true))}
          >
            {micMuted ? (
              <BiMicrophone fontSize="medium" />
            ) : (
              <BiMicrophoneOff fontSize="medium" />
            )}
          </IconButton>
          <IconButton>
            <BiPhoneOff fontSize="medium" />
          </IconButton>
        </div>
      )}
    </>
  );
}
