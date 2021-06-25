import React from 'react';
import chatStyles from '../styles/chat-styles.js';
import { IconButton } from '@material-ui/core';
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import Paper from '@material-ui/core/Paper';

function ChatMenu() {
    const classes = chatStyles();
    return (
        <>
            <Paper>
                <div className={classes.chatMenuContainer}>

                    <IconButton className={classes.chatMenuIcon}>
                        <PersonAddIcon />
                    </IconButton>
                    <IconButton className={classes.chatMenuIcon}>
                        <GroupAddIcon />
                    </IconButton>
                </div>
            </Paper>
        </>
    )
}

export default ChatMenu;