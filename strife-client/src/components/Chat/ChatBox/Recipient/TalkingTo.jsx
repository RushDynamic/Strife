import React from 'react';
import chatStyles from '../../../styles/chat-styles.js';
import { Typography, IconButton, Tooltip } from '@material-ui/core';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

export default function TalkingTo(props) {
  const classes = chatStyles();
  return (
    <div
      className={classes.talkingToContainer}
      style={{ display: 'flex', alignItems: 'center' }}
    >
      <img
        alt="user_avatar"
        hidden={props.recipient.isRoom}
        className={classes.expandFastOnHover}
        src={props.recipient.avatar}
        // TODO: replace URL string with constant
        onError={({ target }) => {
          target.onerror = null;
          target.src = 'http://localhost:3001/images/default_avatar.jpg';
        }}
        style={{ borderRadius: '20%', margin: '15px' }}
        height="50px"
        width="50px"
      />
      <Typography
        variant="h5"
        style={{
          fontWeight: 'bold',
          fontFamily: "'Syne', sans-serif",
          letterSpacing: '2px',
          margin: '15px',
          marginBottom: '15px',
        }}
      >
        {props.recipient.username}
      </Typography>
      {props.recipient.isRoom && (
        <Tooltip title="Leave Room" arrow>
          <IconButton>
            <ExitToAppIcon onClick={props.handleLeaveRoomClicked} />
          </IconButton>
        </Tooltip>
      )}
    </div>
  );
}
