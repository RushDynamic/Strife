import React from 'react';
import { useDispatch } from 'react-redux';
import changeRecipient from '../../../actions/recipient-actions.js'
import { List, ListItem, ListItemText, ListItemIcon, ListItemAvatar, Paper, IconButton, Typography } from '@material-ui/core';
import ChatBubbleIcon from '@material-ui/icons/ChatBubble';
import PeopleIcon from '@material-ui/icons/People';
import useStyles from '../../styles/chat-styles.js';

function RoomsList(props) {
    const classes = useStyles();
    const dispatch = useDispatch();

    function handleChatButtonOnClick(roomname) {
        props.manageRooms("join", roomname, isUserInRoom);
    }

    function isUserInRoom(status, roomname) {
        if (status) {
            dispatch(changeRecipient({ username: roomname, isRoom: true }));
        }
    }

    return (
        <>
            <Paper elevation={2}>
                <div className={classes.onlineUsersContainer} style={{ overflow: 'auto' }}>
                    <List>
                        <ListItem>
                            <ListItemText
                                disableTypography
                                primary={
                                    <Typography style={{
                                        color: "#1fd1f9",
                                        fontVariant: 'small-caps',
                                        fontFamily: "'Syne', sans-serif",
                                        fontSize: '1.3rem',
                                        letterSpacing: '3px'
                                    }}>rooms</Typography>
                                }
                                secondary={
                                    "Online: " + props.roomsList.length
                                }
                            />
                        </ListItem>
                        {
                            props.roomsList.length == 0 ? <Typography style={{
                                padding: '15px',
                                fontFamily: "'Syne', sans-serif",
                                fontSize: '0.9rem',
                            }} >You have not joined any online rooms right now</Typography> :
                                props.roomsList.map(room => (
                                    <ListItem>
                                        <ListItemAvatar><PeopleIcon /></ListItemAvatar>
                                        <ListItemText disableTypography primary={<Typography style={{ fontFamily: "'Rubik', sans-serif" }}>{room}</Typography>} />
                                        <ListItemIcon onClick={() => handleChatButtonOnClick(room)}><IconButton><ChatBubbleIcon /></IconButton></ListItemIcon>
                                    </ListItem>
                                ))
                        }
                    </List>
                </div>
            </Paper>
        </>
    )
}

export default RoomsList;