import React from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Paper, Typography } from '@mui/material';
import NoFriends from './NoFriends.jsx';
import FriendButtons from './FriendButtons.jsx';
import useStyles from '../../../styles/sidebar-styles.js';
import Avatar from '../../Avatar.jsx';
import { deepCompare } from '../../../../utils/utils.js';
function FriendsList(props) {
  const classes = useStyles();
  const unseenMsgUserList = useSelector(
    (state) => state.notifications.unseenMsgUserList,
  );
  console.log('Friends list: ', props.friendsList);

  function returnAvatar(status, avatarUrl) {
    if (status === 'offline') return <Avatar avatarUrl={avatarUrl} />;
    else return <Avatar avatarUrl={avatarUrl} online={true} />;
  }

  function returnFriendButtons(friend) {
    return (
      <FriendButtons
        unseen={unseenMsgUserList.includes(friend.username)}
        friend={friend}
        createCall={props.createCall}
      />
    );
  }

  return (
    <Paper elevation={2}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={classes.onlineUsersCard}
      >
        {props.friendsList.length > 0 ? (
          <>
            <div className={classes.cardTitleTextContainer}>
              <Typography className={classes.cardTitleText}>friends</Typography>
              <Typography className={classes.cardSubTitleText}>
                {props.friendsList
                  .filter((friend) => friend.status === 'online')
                  .reduce((total, friend) => total + 1, 0) +
                  ' / ' +
                  props.friendsList.length}
              </Typography>
            </div>
            <div>
              {props.friendsList.map((friend) => (
                <div className={classes.singleRowContainer}>
                  <div className={classes.avatarNameContainer}>
                    {returnAvatar(friend.status, friend.avatar)}
                    <Typography className={classes.nameText}>
                      {friend.username}
                    </Typography>
                  </div>
                  <div>{returnFriendButtons(friend)}</div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <NoFriends />
        )}
      </motion.div>
    </Paper>
  );
}

export default React.memo(FriendsList, (prevProps, curProps) =>
  deepCompare(prevProps.friendsList, curProps.friendsList),
);
