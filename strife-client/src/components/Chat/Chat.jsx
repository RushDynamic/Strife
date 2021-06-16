import * as React from 'react';
import { Typography } from '@material-ui/core';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import OnlineUsers from './OnlineUsers.jsx'
import Header from './Header.jsx';
import MessageBox from './MessageBox.jsx';
import CreateMessage from './CreateMessage.jsx';
import chatStyles from '../styles/chat-styles.js';

export default function Chat() {
    const classes = chatStyles();

    const messageRows = [
        { message: "Hey there", avatar: <AccountCircleIcon /> },
        { message: "whatsup", avatar: <AccountCircleIcon /> },
        { message: "yyyy", avatar: <AccountCircleIcon /> },
        { message: "asde", avatar: <AccountCircleIcon /> },
        { message: "whatsup", avatar: <AccountCircleIcon /> },
        { message: "yyyy", avatar: <AccountCircleIcon /> },
        { message: "asde", avatar: <AccountCircleIcon /> },
        { message: "whatsup", avatar: <AccountCircleIcon /> },
        { message: "yyyy", avatar: <AccountCircleIcon /> },
        { message: "asde", avatar: <AccountCircleIcon /> },
        { message: "beginswhatsupwhatsupwhatsupwhatsupwhatsupwhatsupwhatsup whatsupwhatsupwhatsupwhatsupwtsupwhatsupw hatsupwtsupwhatsupwhatsupwtsupwhatsupwhatsupwtsupwhatsupwhatsupwtsupwhatsupwhatsupwhatsupwhatsupwhatsupwhatsupwhatsupwhatsupwhatsupwhatsupwhatsupwhatsupwhatsup123123", avatar: <AccountCircleIcon /> },
        { message: "yyyy", avatar: <AccountCircleIcon /> },
        { message: "asde", avatar: <AccountCircleIcon /> },
        { message: "whatsup", avatar: <AccountCircleIcon /> },
        { message: "yyyy", avatar: <AccountCircleIcon /> },
        { message: "asde", avatar: <AccountCircleIcon /> },
        { message: "Heheeeeere", avatar: <AccountCircleIcon /> },
    ]

    return (
        <Grid container spacing={2} style={{
            maxHeight: '100vh', margin: 0,
            width: '100%',
        }}>
            <Grid item xs={12} style={{ height: '20vh' }}>
                <Header />
            </Grid>

            <Grid item xs={2} style={{ height: '80vh' }}>
                <OnlineUsers />
            </Grid>
            <Grid item xs={10} style={{ height: '80vh', display: 'flex', flexFlow: 'column' }}>
                <Paper style={{ height: '10vh' }}><Typography>Menu Options</Typography></Paper>
                <div className={classes.messagesContainer} style={{ overflowY: 'auto', overflowX: 'hidden' }}>
                    {
                        messageRows.map((message) => (
                            <MessageBox message={message} />
                        ))
                    }
                </div>
                <div>
                    <CreateMessage />
                </div>
            </Grid>

        </Grid>
    );
}
