import React from 'react';
import { Typography } from '@mui/material';
import chatStyles from '../styles/chat-styles';

function Announcement(props) {
  const classes = chatStyles();

  return (
    <>
      <div className={classes.announcementMsg}>
        <Typography style={{ fontFamily: "'Rubik', sans-serif" }}>
          Announcement: {props.msg}
        </Typography>
      </div>
    </>
  );
}

export default Announcement;
