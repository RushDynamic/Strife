import React from 'react';
import Avatar from './Avatar.jsx';
import chatStyles from '../styles/chat-styles.js';

export default function MessageBox(props) {
    const colors = ['#6ee429', '#4ab2a7', '##2366cb', '#3abefb', '#730a36', '#b12da4', '#d7db05', '#f97a12', '#a186e1', '#d11265'];
    const classes = chatStyles();
    return (
        <>
            <div className={classes.messageBoxContainer}>
                <div className={classes.outerMessageBoxContainer} style={{ display: 'flex', alignItems: 'center' }}>
                    <div className={classes.avatarMessageBoxContainer} style={{ padding: '10px' }}>
                        <Avatar avatarUrl={props.message.avatar} />
                    </div>
                    <div className={classes.innerMessageBoxContainer} style={{ padding: '10px' }}>
                        <div className={classes.usernameMessageBox} style={{
                            fontWeight: 'bold',
                            fontVariant: 'small-caps',
                            fontFamily: "'Syne', sans-serif",
                            color: colors[(props.message.senderUsername.length + props.message.senderUsername.charCodeAt(0) + new Date().getDate()) % 10]
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
            </div>
        </>
    );
}