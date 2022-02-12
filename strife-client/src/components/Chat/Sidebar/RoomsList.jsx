import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import changeRecipient from '../../../actions/recipient-actions.js';
import { Paper, IconButton, Typography, Badge } from '@mui/material';
import { BsFillChatSquareFill, BsFillChatSquareTextFill } from 'react-icons/bs';
import PeopleIcon from '@mui/icons-material/People';
import useStyles from '../../styles/sidebar-styles.js';

function RoomsList(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const unseenMsgUserList = useSelector(
    (state) => state.notifications.unseenMsgUserList,
  );

  function handleChatButtonOnClick(roomname) {
    props.manageRooms('join', roomname, isUserInRoom);
  }

  function isUserInRoom(status, roomname) {
    if (status) {
      dispatch(changeRecipient({ username: roomname, isRoom: true }));
    }
  }

  function returnChatButton(roomname) {
    if (unseenMsgUserList.includes(roomname)) {
      return (
        <IconButton onClick={() => handleChatButtonOnClick(roomname)}>
          <Badge color="primary" variant="dot">
            <BsFillChatSquareTextFill fontSize="large" />
          </Badge>
        </IconButton>
      );
    }
    return (
      <IconButton onClick={() => handleChatButtonOnClick(roomname)}>
        <BsFillChatSquareFill fontSize="large" />
      </IconButton>
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
          <>
            <div className={classes.cardTitleTextContainer}>
              <Typography className={classes.cardTitleText}>rooms</Typography>
              <Typography className={classes.cardSubTitleText}>
                {'online: ' + props.onlineRoomsCount}
              </Typography>
            </div>
            <div>
              {props.roomsList.length === 0 ? (
                <Typography className={classes.noFriendsText}>
                  You have not joined any online rooms right now
                </Typography>
              ) : (
                props.roomsList.map((room) => (
                  <div className={classes.singleRowContainer}>
                    <div className={classes.avatarNameContainer}>
                      <PeopleIcon />
                      <Typography className={classes.nameText}>
                        {room}
                      </Typography>
                    </div>
                    {returnChatButton(room)}
                  </div>
                ))
              )}
            </div>
          </>
        </motion.div>
      </Paper>
    </>
  );
}

export default RoomsList;
