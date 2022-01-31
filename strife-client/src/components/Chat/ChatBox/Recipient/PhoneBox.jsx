import React from 'react';
import { BiPhone, BiPhoneCall } from 'react-icons/bi';
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
                        Incoming call from
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
                    {'on call with: ' + props.callData.participant}
                  </Typography>
                )}
              </div>
            </>
          }
          <div className={classes.callButtonsContainer}>
            {returnCallButton(
              props.callData.isCallIncoming,
              props.createCall,
              props.acceptCall,
              props.recipientName,
              classes,
            )}
          </div>
          <audio
            id="remote-audio"
            ref={props.remoteAudioRef}
            autoPlay
            controls
            style={{ display: 'none' }}
          />
        </motion.div>
      </Paper>
    </>
  );
}

function returnCallButton(
  isCallIncoming,
  createCall,
  acceptCall,
  recipientName,
  classes,
) {
  return (
    <>
      {isCallIncoming ? (
        <>
          <IconButton onClick={() => acceptCall(recipientName)}>
            <BiPhoneCall
              fontSize="xx-large"
              className={classes.acceptCallBtn}
            />
          </IconButton>
        </>
      ) : (
        <>
          <IconButton onClick={() => createCall(recipientName)}>
            <BiPhone fontSize="xx-large" />
          </IconButton>
        </>
      )}
    </>
  );
}
