import React, { useEffect, useRef } from 'react';
import { Typography } from '@material-ui/core';
import chatStyles from '../styles/chat-styles.js';
import CreateMessage from './CreateMessage.jsx';
import MessageBox from './MessageBox.jsx';

function ChatBox(props) {
    // For automatically scrolling to the bottom of the chat
    const bottomOfChatDiv = useRef(null);
    useEffect(() => {
        bottomOfChatDiv.current.scrollIntoView({ behavior: 'smooth' });
    });

    const classes = chatStyles();
    return (
        <>
            <div>
                <Typography>
                    Talking to: {props.targetUser}
                </Typography>
            </div>
            <div className={classes.messagesContainer} style={{ height: '70vh', overflowY: 'auto', overflowX: 'hidden' }}>
                {
                    props.msgList.map((message) => {
                        if (message.systemMsg) {
                            return (<Typography>Announcement: {message.message}</Typography>)
                        }
                        return (<MessageBox message={message} />)
                    })
                }
                <div ref={bottomOfChatDiv} />
            </div>
            <div>
                <CreateMessage addMessage={props.sendMessage} />
            </div>
        </>
    );
}

export default ChatBox;