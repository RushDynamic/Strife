import React from 'react';
import { List, ListItem, ListItemText, ListItemIcon, ListItemAvatar, Paper, IconButton, Typography } from '@material-ui/core';
import NoFriends from './NoFriends.jsx';
import ChatBubbleIcon from '@material-ui/icons/ChatBubble';
import useStyles from '../../styles/chat-styles.js';
import Avatar from '../Avatar.jsx';

function FriendsList(props) {
    const classes = useStyles();
    console.log("Friends list: ", props.friendsList);

    function returnAvatar(status, avatarUrl) {
        if (status == "offline") return (<Avatar avatarUrl={avatarUrl} />);
        else return (<Avatar avatarUrl={avatarUrl} online={true} />);
    }

    function returnChatButton(friend) {
        if (friend.status == "offline") return (<ListItemIcon><IconButton disabled><ChatBubbleIcon /></IconButton></ListItemIcon>);
        else return (<ListItemIcon onClick={() => props.setRecipient({ username: friend.username, avatar: friend.avatar })}><IconButton><ChatBubbleIcon /></IconButton></ListItemIcon>);
    }

    return (
        <>
            <Paper elevation={2}>
                <div className={classes.onlineUsersContainer} style={{ overflow: 'auto' }}>
                    {props.friendsList.length > 0 ? <List>
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
                                    }}>friends</Typography>
                                }

                                secondary={
                                    props.friendsList.filter((friend) => friend.status == "online").reduce((total, friend) => total + 1, 0)
                                    + ' / '
                                    + props.friendsList.length
                                }
                            />
                        </ListItem>
                        {
                            props.friendsList.map(friend => (
                                <ListItem>
                                    <ListItemAvatar>{returnAvatar(friend.status, friend.avatar)}</ListItemAvatar>
                                    <ListItemText disableTypography primary={<Typography style={{ fontFamily: "'Rubik', sans-serif" }}>{friend.username}</Typography>} />
                                    {returnChatButton(friend)}
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