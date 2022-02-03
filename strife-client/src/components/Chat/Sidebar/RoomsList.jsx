import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import changeRecipient from '../../../actions/recipient-actions.js';
import {
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemAvatar,
  Paper,
  IconButton,
  Typography,
  Badge,
} from '@mui/material';
import { BsFillChatSquareFill, BsFillChatSquareTextFill } from 'react-icons/bs';
import PeopleIcon from '@mui/icons-material/People';
import useStyles from '../../styles/chat-styles.js';

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
        <ListItemIcon onClick={() => handleChatButtonOnClick(roomname)}>
          <IconButton>
            <Badge color="primary" variant="dot">
              <BsFillChatSquareTextFill fontSize="large" />
            </Badge>
          </IconButton>
        </ListItemIcon>
      );
    }
    return (
      <ListItemIcon onClick={() => handleChatButtonOnClick(roomname)}>
        <IconButton>
          <BsFillChatSquareFill fontSize="large" />
        </IconButton>
      </ListItemIcon>
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
                    rooms
                  </Typography>
                }
                secondary={
                  <Typography
                    style={{
                      fontVariant: 'small-caps',
                      fontFamily: "'Syne', sans-serif",
                      letterSpacing: '2px',
                    }}
                  >
                    {'online: ' + props.onlineRoomsCount}
                  </Typography>
                }
              />
            </ListItem>
            {props.roomsList.length === 0 ? (
              <Typography
                style={{
                  padding: '15px',
                  fontFamily: "'Syne', sans-serif",
                  fontSize: '0.9rem',
                }}
              >
                You have not joined any online rooms right now
              </Typography>
            ) : (
              props.roomsList.map((room) => (
                <ListItem>
                  <ListItemAvatar>
                    <PeopleIcon />
                  </ListItemAvatar>
                  <ListItemText
                    disableTypography
                    primary={
                      <Typography style={{ fontFamily: "'Rubik', sans-serif" }}>
                        {room}
                      </Typography>
                    }
                  />
                  {returnChatButton(room)}
                </ListItem>
              ))
            )}
          </List>
        </motion.div>
      </Paper>
    </>
  );
}

export default RoomsList;
