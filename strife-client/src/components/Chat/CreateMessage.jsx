import React from 'react';
import chatSyles from '../styles/chat-styles';
import { TextField, IconButton } from '@material-ui/core';
import NoteAddIcon from '@material-ui/icons/NoteAdd';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';

export default function CreateMessage() {
    const classes = chatSyles();
    return (
        <>
            <div className={classes.createMessageContainer}>
                <TextField id="filled-basic" label="Say something" variant="filled" fullWidth />
                <IconButton style={{ marginLeft: '15px' }}>
                    <InsertEmoticonIcon />
                </IconButton>
                <IconButton style={{ marginLeft: '15px' }}>
                    <NoteAddIcon />
                </IconButton>
            </div>
        </>
    );
}