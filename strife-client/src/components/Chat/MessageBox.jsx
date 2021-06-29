import React from 'react';
import { ListItem, ListItemAvatar, ListItemText, Paper } from '@material-ui/core';
import chatStyles from '../styles/chat-styles.js';

export default function MessageBox(props) {
    const classes = chatStyles();

    return (
        <>
            <div className={classes.messageBoxContainer}>
                <Paper elevation={0} style={{ borderRadius: '0 15px 15px 15px' }}>
                    <div className={classes.outerMessageBoxContainer} style={{ display: 'flex', alignItems: 'center' }}>
                        <div className={classes.avatarMessageBoxContainer} style={{ padding: '10px' }}>
                            {props.message.avatar}
                        </div>
                        <div className={classes.innerMessageBoxContainer} style={{ padding: '10px' }}>
                            <div className={classes.usernameMessageBox} style={{
                                fontWeight: 'bold',
                                fontVariant: 'small-caps',
                                fontFamily: "'Syne', sans-serif"
                            }}>
                                {props.message.senderUsername}
                            </div>
                            <div className={classes.messageTextContainer} style={{
                                fontFamily: "'Rubik', sans-serif",
                                fontSize: '1rem'
                            }}>
                                {props.message.message}

                            </div>
                        </div>
                    </div>
                    {/* <ListItem>
                        <ListItemAvatar>
                            {props.message.avatar}
                        </ListItemAvatar>
                        <ListItemText style={{ whiteSpace: 'normal' }}>
                            {props.message.message}
                        </ListItemText>
                    </ListItem> */}

                </Paper>
            </div>
        </>
    );
}