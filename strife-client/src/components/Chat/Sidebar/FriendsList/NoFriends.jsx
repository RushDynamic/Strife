import React from 'react';
import { Typography } from '@mui/material';
import useStyles from '../../../styles/sidebar-styles.js';

function NoFriends() {
  const classes = useStyles();
  return (
    <>
      <Typography className={classes.cardTitleText}>friends</Typography>
      <div className={classes.noFriendsContainer}>
        <img
          alt="error_nofriends"
          src={process.env.PUBLIC_URL + '/images/uhoh.svg'}
          height="150"
          width="150"
        />
        <Typography className={classes.noFriendsText}>
          You don't have any friends
        </Typography>
      </div>
    </>
  );
}

export default NoFriends;
