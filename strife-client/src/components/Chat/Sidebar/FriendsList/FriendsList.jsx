import React from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import {
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Paper,
  Typography,
} from '@mui/material';
import NoFriends from './NoFriends.jsx';
import FriendButtons from './FriendButtons.jsx';
import useStyles from '../../../styles/chat-styles.js';
import Avatar from '../../Avatar.jsx';

function FriendsList(props) {
  const classes = useStyles();
  //const recipient = useSelector(state => state.recipient);
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
    <>
      <Paper elevation={2}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className={classes.onlineUsersContainer}
          style={{ overflow: 'auto' }}
        >
          {props.friendsList.length > 0 ? (
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
                      friends
                    </Typography>
                  }
                  secondary={
                    <Typography
                      style={{
                        fontVariant: 'small-caps',
                        fontFamily: "'Syne', sans-serif",
                      }}
                    >
                      {props.friendsList
                        .filter((friend) => friend.status === 'online')
                        .reduce((total, friend) => total + 1, 0) +
                        ' / ' +
                        props.friendsList.length}
                    </Typography>
                  }
                />
              </ListItem>
              {props.friendsList.map((friend) => (
                <ListItem key={friend.username}>
                  <ListItemAvatar>
                    {returnAvatar(friend.status, friend.avatar)}
                  </ListItemAvatar>
                  <ListItemText
                    disableTypography
                    primary={
                      <Typography style={{ fontFamily: "'Rubik', sans-serif" }}>
                        {friend.username}
                      </Typography>
                    }
                  />
                  {returnFriendButtons(friend)}
                </ListItem>
              ))}
            </List>
          ) : (
            <NoFriends />
          )}
        </motion.div>
      </Paper>
    </>
  );
}

export default React.memo(FriendsList);
