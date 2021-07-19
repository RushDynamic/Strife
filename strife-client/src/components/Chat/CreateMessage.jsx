import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import chatSyles from '../styles/chat-styles';
import { TextField, IconButton } from '@material-ui/core';
import NoteAddIcon from '@material-ui/icons/NoteAdd';
import SendIcon from '@material-ui/icons/Send';

export default function CreateMessage(props) {
    const classes = chatSyles();
    const recipient = useSelector(state => state.recipient);
    const [msgText, setMsgText] = useState("");
    const [newMsg, setNewMsg] = useState({
        message: "",
        avatar: props.sender.avatar,
        systemMsg: false,
        recipientUsername: recipient.username,
        recipientPublicKey: recipient.publicKey,
        senderUsername: props.sender.username,
        senderPublicKey: props.sender.publicKey
    });

    useEffect(() => {
        setNewMsg({
            message: msgText,
            avatar: props.sender.avatar,
            systemMsg: false,
            recipientUsername: recipient.username,
            recipientPublicKey: recipient.publicKey,
            senderUsername: props.sender.username,
            senderPublicKey: props.sender.publicKey,
            timestamp: new Date().getTime(),
            isRoom: recipient.isRoom
        })
    }, [msgText]);

    function handleOnKeyDown(e) {
        if (e.keyCode == 13) {
            props.sendMessage(newMsg)
            setMsgText("");
        }
    }

    return (
        <>
            <div className={classes.createMessageContainer}>
                <TextField
                    id="filled-basic"
                    value={msgText}
                    label="Say something"
                    variant="filled"
                    fullWidth
                    onKeyDown={handleOnKeyDown}
                    autoComplete="off"
                    onChange={event => setMsgText(event.target.value)}
                    autoFocus
                />
                <IconButton style={{ marginLeft: '15px' }} onClick={() => props.sendMessage(newMsg)} style={{ backgroundColor: 'transparent' }}>
                    <SendIcon />
                </IconButton>
                <IconButton style={{ marginLeft: '15px' }} style={{ backgroundColor: 'transparent' }}>
                    <NoteAddIcon />
                </IconButton>
            </div>
        </>
    );
}