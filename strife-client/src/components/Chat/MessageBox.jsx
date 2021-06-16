import React from 'react';
import { ListItem, ListItemAvatar, ListItemText, Paper } from '@material-ui/core';
import chatStyles from '../styles/chat-styles.js';

export default function MessageBox(props) {
    const classes = chatStyles();

    return (
        <>
            <div className={classes.messageBoxContainer}>
                <Paper style={{ borderRadius: '0 15px 15px 15px' }}>
                    <ListItem>
                        <ListItemAvatar>
                            {props.message.avatar}
                        </ListItemAvatar>
                        <ListItemText style={{ whiteSpace: 'normal' }}>
                            {props.message.message}
                        </ListItemText>
                    </ListItem>
                </Paper>
            </div>
        </>
    );
}