import React from 'react';
import { List, ListItem, ListItemText, ListItemIcon, ListItemAvatar, Paper, IconButton } from '@material-ui/core';
import NoFriends from './NoFriends.jsx';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import ChatBubbleIcon from '@material-ui/icons/ChatBubble';
import useStyles from '../../styles/chat-styles.js';

function FriendsList(props) {
    const classes = useStyles();
    console.log("Friends list: ", props.friendsList);

    function returnAvatar(status) {
        if (status == "offline") return (<AccountCircleIcon />);
        else return (<AccountCircleIcon style={{ color: 'green' }} />);
    }

    // function returnChatButton(status) {
    //     if (status == "offline") return (<IconButton disabled><ChatBubbleIcon /></IconButton>);
    //     else return (<IconButton><ChatBubbleIcon /></IconButton>);
    // }


    function returnChatButton(status, username) {
        if (status == "offline") return (<ListItemIcon><IconButton disabled><ChatBubbleIcon /></IconButton></ListItemIcon>);
        else return (<ListItemIcon onClick={() => props.setRecipient(username)}><IconButton><ChatBubbleIcon /></IconButton></ListItemIcon>);
    }

    return (
        <>
            <Paper elevation={2}>
                <div className={classes.onlineUsersContainer} style={{ overflow: 'auto' }}>
                    {props.friendsList.length > 0 ? <List>
                        <ListItem>
                            <ListItemText primary="Friends" />
                        </ListItem>
                        {
                            props.friendsList.map(friend => (
                                <ListItem>
                                    <ListItemAvatar>{returnAvatar(friend.status)}</ListItemAvatar>
                                    <ListItemText primary={friend.username} style={{ fontFamily: "'Rubik', sans-serif" }} />
                                    {returnChatButton(friend.status, friend.username)}
                                </ListItem>
                            ))
                        }

                    </List> : <NoFriends />}

                </div>
            </Paper>

        </>
    )
}

export default FriendsList;