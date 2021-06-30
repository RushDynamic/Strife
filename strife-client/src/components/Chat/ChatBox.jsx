import React, { useEffect, useRef, useState } from 'react';
import { Typography, Divider } from '@material-ui/core';
import chatStyles from '../styles/chat-styles.js';
import CreateMessage from './CreateMessage.jsx';
import MessageBox from './MessageBox.jsx';
import Announcement from './Announcement.jsx';

function ChatBox(props) {

    // For automatically scrolling to the bottom of the chat
    const bottomOfChatDiv = useRef(null);
    useEffect(() => {
        bottomOfChatDiv.current.scrollIntoView({ behavior: 'smooth' });
    });

    const classes = chatStyles();
    return (
        <>
            <div className={classes.talkingToContainer} style={{ display: 'flex', alignItems: 'center' }}>
                <img src={props.recipient.avatar} style={{ borderRadius: '50%', margin: '15px' }} height="50px" width="50px" />
                <Typography variant="h4" style={{
                    fontWeight: 'bold',
                    fontFamily: "'Syne', sans-serif",
                    letterSpacing: '2px'
                }}>
                    {props.recipient.username}
                </Typography>
                <Divider />
            </div>
            <div className={classes.messagesContainer} style={{ height: '70vh', overflowY: 'auto', overflowX: 'hidden' }}>
                {
                    props.msgList.map((message) => {
                        if (message.systemMsg) {
                            return (<Announcement msg={message.message} />)
                        }
                        return (<MessageBox message={message} />)
                    })
                }
                <div ref={bottomOfChatDiv} />
            </div>
            <div>
                <CreateMessage sendMessage={props.sendMessage} recipient={props.recipient} senderUsername={props.senderUsername} />
            </div>
        </>
    );
}

export default ChatBox;