import React, { useState, useEffect } from 'react';
import chatSyles from '../styles/chat-styles';
import { TextField, IconButton } from '@material-ui/core';
import NoteAddIcon from '@material-ui/icons/NoteAdd';
import SendIcon from '@material-ui/icons/Send';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

export default function CreateMessage(props) {
    const classes = chatSyles();
    const [msgText, setMsgText] = useState("");
    const [newMsg, setNewMsg] = useState({ message: "", avatar: null, systemMsg: false });

    useEffect(() => {
        setNewMsg({ message: msgText, avatar: <AccountCircleIcon />, systemMsg: false })
    }, [msgText])

    function handleOnKeyDown(e) {
        if (e.keyCode == 13) {
            props.addMessage(newMsg)
            setMsgText("");
        }
    }

    return (
        <>
            <div className={classes.createMessageContainer}>
                <TextField id="filled-basic" value={msgText} label="Say something" variant="filled" fullWidth onKeyDown={handleOnKeyDown} autoComplete="off" onChange={event => setMsgText(event.target.value)} />
                <IconButton style={{ marginLeft: '15px' }} onClick={() => props.addMessage(newMsg)}>
                    <SendIcon />
                </IconButton>
                <IconButton style={{ marginLeft: '15px' }}>
                    <NoteAddIcon />
                </IconButton>
            </div>
        </>
    );
}