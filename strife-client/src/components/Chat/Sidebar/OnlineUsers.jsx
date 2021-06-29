import React from 'react';
import { List, ListItem, ListItemText, ListItemIcon, ListItemAvatar, Paper } from '@material-ui/core';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import ChatBubbleIcon from '@material-ui/icons/ChatBubble';
import useStyles from '../../styles/chat-styles.js';

function OnlineUsers(props) {
    const classes = useStyles();
    console.log("Online users: ", props.onlineUsers);
    return (
        <>
            <Paper>
                <div className={classes.onlineUsersContainer} style={{ maxHeight: '38vh', overflow: 'auto' }}>
                    <List>
                        <ListItem>
                            <ListItemText primary="Online Users" />
                        </ListItem>
                        {
                            props.onlineUsers.map(onlineUser => (
                                <ListItem>
                                    <ListItemAvatar><AccountCircleIcon style={{ color: 'green' }} /></ListItemAvatar>
                                    <ListItemText primary={onlineUser} />
                                    <ListItemIcon><ChatBubbleIcon /></ListItemIcon>
                                </ListItem>
                            ))
                        }
                    </List>
                </div>
            </Paper>
        </>
    )
}

export default OnlineUsers;