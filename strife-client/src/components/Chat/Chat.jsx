import React, { useState, useEffect, useRef, useContext } from 'react';
import { useHistory } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { addUnseen, removeUnseen } from '../../actions/notification-actions.js';
import { checkLoggedIn } from '../../services/login-service.js';
import { io } from 'socket.io-client';
import { Typography, Dialog, DialogContent, DialogTitle, Box } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Loading from './Loading.jsx';
import RoomsList from './Sidebar/RoomsList.jsx';
import FriendsList from './Sidebar/FriendsList.jsx';
import Header from './Header/Header.jsx';
import ChatBox from './ChatBox.jsx';
import LandingChatBox from './LandingChatBox.jsx';
import chatStyles from '../styles/chat-styles.js';
import { UserContext } from '../../UserContext.js';
import { encryptData, decryptData, decryptPrivateKey, encryptMessage, decryptMessage } from '../../services/crypto-service.js';

export default function Chat() {
    const classes = chatStyles();
    const dispatch = useDispatch();
    const history = useHistory();
    const socket = useRef();
    const recipient = useSelector(state => state.recipient);
    const [socketConnected, setSocketConnected] = useState(false);
    const { user, setUser } = useContext(UserContext);
    const [loadingStages, setLoadingStages] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const [showChatAlreadyOpen, setShowChatAlreadyOpen] = useState(false);
    const [onlineRoomsList, setOnlineRoomsList] = useState([]);
    const [onlineRoomsCount, setOnlineRoomsCount] = useState([]);
    const [onlineMembers, setOnlineMembers] = useState(new Map());
    const [friendsList, setFriendsList] = useState([]);
    const [unseenMsgUsersList, setUnseenMsgUsersList] = useState([]);
    // TODO: Convert msgList into a hashmap
    const msgMap = useRef(new Map());
    const [msgList, setMsgList] = useState([])
    const [newMsg, setNewMsg] = useState(null);

    useEffect(() => {
        // TODO: Probably find a better way to do this
        if (loadingStages.includes("loggedIn")
            && loadingStages.includes("socketConnected")
            && loadingStages.includes("fetchedFriendsList")) {
            setLoaded(true);
        }
    }, [loadingStages])

    useEffect(() => {
        (async function () {
            if (user.username == null || user.username == undefined) {

            }
            const isUserLoggedIn = await checkLoggedIn();
            console.log("isUserLoggedIn: ", isUserLoggedIn);
            if (isUserLoggedIn.username != null &&
                isUserLoggedIn.username.length > 0 &&
                isUserLoggedIn.encryptedPvtKey.length > 0 &&
                isUserLoggedIn.localStorageKey.length > 0) {
                console.log("You're logged in!", isUserLoggedIn);
                const decryptedPvtKey = decryptPrivateKey(isUserLoggedIn.encryptedPvtKey, isUserLoggedIn.localStorageKey);
                setLoadingStages(oldList => [...oldList, "loggedIn"]);
                setUser({
                    username: isUserLoggedIn.username,
                    privateKey: decryptedPvtKey,
                    localStorageKey: isUserLoggedIn.localStorageKey,
                    publicKey: isUserLoggedIn.publicKey,
                    avatar: isUserLoggedIn.avatar,
                    accessToken: isUserLoggedIn.accessToken
                });
                // If the user is logged in, setup the socket connection
                socket.current = io.connect("http://localhost:5000");
                socket.current.on("connect", () => {
                    // Send username to server
                    socket.current.emit("username", isUserLoggedIn.username);
                    setLoadingStages(oldList => [...oldList, "socketConnected"]);
                    setSocketConnected(true);
                });

                // Receive new messages from the server
                socket.current.on("echo-msg", (echoMessage) => {
                    setNewMsg(echoMessage);
                });

                socket.current.on('new-user-online', (newOnlineUsersList) => {
                    //console.log("newOnlineUsersList: ", newOnlineUsersList);
                    requestFriendsList([isUserLoggedIn.username]);
                });

                // Receive announcements from the server
                socket.current.on('system-msg', (systemMsg) => {
                    const newSystemMsg = { message: systemMsg, avatar: null, systemMsg: true }
                    updateMessages(newSystemMsg, false);
                })

                // Receive friends list from server
                socket.current.on('friends-list', (friendsListFromServer) => {
                    console.log("friendsListFromServer:", friendsListFromServer);
                    setFriendsList(friendsListFromServer);
                    setLoadingStages(oldList => [...oldList, "fetchedFriendsList"]);
                });

                // Receive msg history from server
                socket.current.on('receive-msg-history', (msgHistory) => {
                    console.log("Received msg history from server: ", msgHistory);
                    setMsgList([...msgHistory]);
                });

                // Receive rooms map from server
                socket.current.on('rooms-list', (roomsList, totalRoomsCount) => {
                    if (roomsList != 'rooms-count-update') {
                        roomsList = roomsList != null ? roomsList : [];
                        setOnlineRoomsList([...roomsList]);
                    }
                    setOnlineRoomsCount(totalRoomsCount);
                });

                // Receive updated room members list from server
                socket.current.on('updated-room-members', (roomname, updatedMembersList) => {
                    updatedMembersList = updatedMembersList != null && updatedMembersList != undefined ? updatedMembersList : [];
                    setOnlineMembers(new Map(onlineMembers.set(roomname, updatedMembersList)));
                });

                // Receive error from server if user is already online elsewhere
                socket.current.on('chat-already-open', () => {
                    setShowChatAlreadyOpen(true);
                })
                // TODO: Decrypt messages from localStorage and intialize msgMap
                // TODO: Add loading stage for decrypting messages from msgMap
                // TODO: Handle window.onunload event and store encrypted msgMap to localStorage

                window.addEventListener('beforeunload', saveEncryptedMsgMap);
            }
            else {
                console.log("You're NOT logged in!");
                setUser({ username: null, accessToken: null })
                history.push('/login');
            }
        })();
    }, [])

    // Get message history for the new recipient
    useEffect(() => {
        setMsgList([]);
        // TODO: Only start listening for recipient change after socket has finished connecting
        console.log("Changed recipient:", recipient);
        if (socketConnected) {
            socket.current.emit('request-msg-history', user.username, recipient.username, recipient.isRoom);
        }
        dispatch(removeUnseen(recipient.username));
    }, [recipient])

    useEffect(() => {
        if (user.username != null) {
            importMsgMap();
            console.log("USER:", user);
        }
    }, [user])

    // Push new message to the msgList
    useEffect(() => {
        if (newMsg != null) {
            if (newMsg.isRoom) {
                if (newMsg.recipientUsername != recipient.username) {
                    dispatch(addUnseen(newMsg.recipientUsername))
                }
            }
            else {
                if (newMsg.senderUsername != recipient.username) {
                    dispatch(addUnseen(newMsg.senderUsername))
                }
            }
            updateMessages(newMsg, true);
        }
    }, [newMsg])

    function manageRooms(action, roomname, callback) {
        switch (action) {
            case 'join': console.log('Joining room:', roomname);
                socket.current.emit('join-room', roomname, user.username, (response) => {
                    if (response.status == "success") {
                        const updatedRoomMembers = response.members != null && response.members != undefined ? response.members : [];
                        setOnlineMembers(new Map(onlineMembers.set(roomname, updatedRoomMembers)));
                        callback(true, roomname);
                    }
                    else callback(false, roomname);
                });
                break;

            case 'create': console.log('Creating room:', roomname);
                socket.current.emit('create-room', roomname, user.username, (response) => {
                    if (response.status == "success") {
                        const updatedRoomMembers = response.members != null && response.members != undefined ? response.members : [];
                        setOnlineMembers(new Map(onlineMembers.set(roomname, updatedRoomMembers)));
                        callback(true, roomname);
                    }
                    else callback(false, roomname);
                });
                break;

            case 'leave': console.log('Leaving room:', roomname);
                socket.current.emit('leave-room', roomname, user.username);
                break;
        }
    }

    function requestFriendsList(usernameList) {
        socket.current.emit('request-friends-list', usernameList);
    }

    function sendMessage(msgData) {
        if (!msgData.message.match(/^ *$/) && msgData.message != null) {
            // Store unencrypted messages in msgMap
            updateMessages(msgData, false);
            const encryptedMsg = { ...msgData };
            // Encrypt message before sending to server
            const encryptedMsgData = encryptMessage(encryptedMsg.message, encryptedMsg.recipientPublicKey, user.privateKey);
            encryptedMsg.message = encryptedMsgData;
            socket.current.emit('add-msg', encryptedMsg);
            //updateMessages(msgData);
        }
    }

    function updateMessages(msgData, encrypted) {
        if (!msgData.isRoom && encrypted) {
            msgData.message = decryptMessage(msgData.message, msgData.senderPublicKey, user.privateKey);
        }
        if (msgMap.current.has(msgData.recipientUsername)) msgMap.current.get(msgData.recipientUsername).push(msgData);
        else msgMap.current.set(msgData.recipientUsername, [msgData]);
        console.log("msgMap:", msgMap.current);
        setMsgList(oldList => [...oldList, msgData]);
    }

    function saveEncryptedMsgMap() {
        if (loadingStages.includes("loggedIn")) {
            localStorage.setItem("user_before_enc", JSON.stringify(user));
            const mapStr = JSON.stringify(Array.from(msgMap.current.entries()));
            localStorage.setItem("MAPSTR", mapStr);
            const encryptedMsgMap = encryptData(new TextEncoder().encode(mapStr), user.localStorageKey);
            localStorage.setItem('encrypted_msg_store', encryptedMsgMap.encryptedDataWithNonceBase64);
            localStorage.setItem('key', user.localStorageKey)
        }
    }

    function importMsgMap() {
        const encryptedMsgMap = localStorage.getItem('encrypted_msg_store');
        if (!!encryptedMsgMap != false) {
            console.log('encryptedMsgMap:', encryptedMsgMap);
            console.log("user:", user);
            const decryptedMsgMap = decryptData(encryptedMsgMap, user.localStorageKeyOld);
            console.log("decryptedMsgMap:", decryptedMsgMap);
            msgMap = new Map(decryptedMsgMap);
        }
        else {
            console.log("No stored messages found.");
        }
    }

    return (
        // Show error dialog if multiple instances of Strife are running (user is already online)
        <div>
            <Dialog open={showChatAlreadyOpen} style={{
                backdropFilter: "blur(15px)",
                backgroundColor: 'rgba(0,0,30,0.4)'
            }}>
                <DialogTitle style={{
                    fontWeight: 'bold',
                    fontFamily: "'Syne', sans-serif",
                    fontVariant: 'small-caps',
                    letterSpacing: '15px'
                }}>uh oh</DialogTitle>
                <DialogContent>
                    <div style={{ margin: '50px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <img src={process.env.PUBLIC_URL + '/images/uhoh.svg'} height="150" width="150" />
                        <Typography variant="h4" style={{
                            fontWeight: 'bold',
                            fontFamily: "'Syne', sans-serif"
                        }}>You already have Strife open somewhere</Typography>
                        <Typography style={{
                            fontFamily: "'Rubik', sans-serif"
                        }}>You can only run one instance of Strife at a time :c</Typography>
                    </div>
                </DialogContent>
            </Dialog>
            <Grid container spacing={2} style={{
                maxHeight: '100vh', margin: 0,
                width: '100%',
            }}>
                <Grid item xs={12} style={{ height: '20vh', padding: '0px' }}>
                    <Header requestFriendsList={requestFriendsList} manageRooms={manageRooms} />
                </Grid>
                {loaded ? <><Grid item xs={2} style={{ height: '80vh', overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
                    <RoomsList
                        onlineRoomsCount={onlineRoomsCount}
                        roomsList={onlineRoomsList != null ? onlineRoomsList : []}
                        manageRooms={manageRooms}
                        unseenMsgUsersList={unseenMsgUsersList}
                        setUnseenMsgUsersList={setUnseenMsgUsersList}
                    />
                    <Box m={0.5} />
                    <FriendsList
                        friendsList={friendsList}
                        unseenMsgUsersList={unseenMsgUsersList}
                        setUnseenMsgUsersList={setUnseenMsgUsersList}
                    />
                </Grid>
                    <Grid item xs={10} style={{ height: '80vh', display: 'flex', flexFlow: 'column' }}>
                        {
                            recipient.username == "" ? <LandingChatBox /> :
                                <ChatBox
                                    msgList={msgList}
                                    sendMessage={sendMessage}
                                    sender={user}
                                    onlineMembers={onlineMembers.has(recipient.username) ? onlineMembers.get(recipient.username) : [user.username]}
                                    manageRooms={manageRooms}
                                />
                        }
                    </Grid></> :
                    <Grid item xs={12} style={{ height: '80vh' }}>
                        <Loading />
                    </Grid>
                }
            </Grid>
        </div>
    );
}
