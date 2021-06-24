import React, { useState, useEffect, useRef, useContext } from 'react';
import { useHistory } from 'react-router';
import { checkLoggedIn } from '../../services/login-service.js';
import { io } from 'socket.io-client';
import { Typography } from '@material-ui/core';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import OnlineUsers from './OnlineUsers.jsx'
import Header from './Header.jsx';
import MessageBox from './MessageBox.jsx';
import CreateMessage from './CreateMessage.jsx';
import chatStyles from '../styles/chat-styles.js';
import { UserContext } from '../../UserContext.js';

export default function Chat() {
    const classes = chatStyles();
    const socket = useRef();
    const { user, setUser } = useContext(UserContext);
    const divRef = useRef(null);
    const history = useHistory();
    const [onlineUsersList, setOnlineUsersList] = useState([]);
    const newMsg = { message: "", avatar: null, systemMsg: false };
    const dummyMessageRows = [
        { message: "Hey there", avatar: <AccountCircleIcon />, systemMsg: false },
        { message: "whatsup", avatar: <AccountCircleIcon />, systemMsg: false },
        { message: "yyyy", avatar: <AccountCircleIcon />, systemMsg: true },
        { message: "asde", avatar: <AccountCircleIcon />, systemMsg: false },
        { message: "Heheeeeere", avatar: <AccountCircleIcon />, systemMsg: false },
    ]
    const [msgList, setMsgList] = useState(dummyMessageRows)

    useEffect(() => {
        divRef.current.scrollIntoView({ behavior: 'smooth' });
    });

    useEffect(() => {
        (async function () {
            const isUserLoggedIn = await checkLoggedIn();
            console.log("isUserLoggedIn: ", isUserLoggedIn);
            if (isUserLoggedIn.username != null && isUserLoggedIn.username.length !== 0) {
                console.log("You're logged in!");
                setUser({ username: isUserLoggedIn.username, accessToken: isUserLoggedIn.accessToken });
                // If the user is logged in, setup the socket connection
                socket.current = io.connect("http://localhost:5000");
                socket.current.on("connect", () => {
                    // TODO: Send announcement to server
                    //const announcement = { message: `User ${isUserLoggedIn.username} has joined`, avatar: null, systemMsg: true }
                    // Send username to server
                    socket.current.emit("username", isUserLoggedIn.username);
                    // updateMessageList(announcement);
                });

                socket.current.on("echo-msg", (echoMessage, socketid) => {
                    console.log(`echo message: ${echoMessage} user: ${socketid}`);
                    updateMessageList(echoMessage);
                });

                socket.current.on('new-user-online', (newOnlineUsersList) => {
                    console.log("newOnlineUsersList: ", newOnlineUsersList);
                    setOnlineUsersList(newOnlineUsersList);
                });

                socket.current.on('system-msg', (systemMsg) => {
                    newMsg.message = systemMsg;
                    newMsg.avatar = null;
                    newMsg.systemMsg = true;
                    updateMessageList(newMsg);
                })
            }
            else {
                console.log("You're NOT logged in!");
                setUser({ username: null, accessToken: null })
                history.push('/login');
            }
        })();
    }, [])

    function sendMessage(msgData) {
        if (!msgData.message.match(/^ *$/) && msgData.message != null) {
            socket.current.emit('add-msg', msgData.message, user.username);
            updateMessageList(msgData);
            console.log("Added a new message");
        }
    }

    function updateMessageList(msgData) {
        setMsgList(oldList => [...oldList, msgData]);
    }

    return (
        <Grid container spacing={2} style={{
            maxHeight: '100vh', margin: 0,
            width: '100%',
        }}>
            <Grid item xs={12} style={{ height: '20vh' }}>
                <Header />
            </Grid>

            <Grid item xs={2} style={{ height: '80vh' }}>
                <OnlineUsers onlineUsers={onlineUsersList} />
            </Grid>
            <Grid item xs={10} style={{ height: '80vh', display: 'flex', flexFlow: 'column' }}>
                <Paper style={{ height: '10vh' }}><Typography>Menu Options</Typography></Paper>
                <div className={classes.messagesContainer} style={{ height: '70vh', overflowY: 'auto', overflowX: 'hidden' }}>
                    {
                        msgList.map((message) => {
                            if (message.systemMsg) {
                                return (<Typography>Announcement: {message.message}</Typography>)
                            }
                            return (<MessageBox message={message} />)
                        })
                    }
                    <div ref={divRef} />
                </div>
                <div>
                    <CreateMessage addMessage={sendMessage} />
                </div>
            </Grid>
        </Grid>
    );
}
