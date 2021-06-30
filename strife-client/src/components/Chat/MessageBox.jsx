import React from 'react';
import { Paper } from '@material-ui/core';
import Avatar from './Avatar.jsx';
import chatStyles from '../styles/chat-styles.js';

export default function MessageBox(props) {
    const classes = chatStyles();

    return (
        <>
            <div className={classes.messageBoxContainer}>
                <Paper elevation={0} style={{ borderRadius: '0 15px 15px 15px' }}>
                    <div className={classes.outerMessageBoxContainer} style={{ display: 'flex', alignItems: 'center' }}>
                        <div className={classes.avatarMessageBoxContainer} style={{ padding: '10px' }}>
                            <Avatar avatarUrl={props.message.avatar} />
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
                </Paper>
            </div>
        </>
    );
}