import React, { useState, useEffect, useRef, useContext } from 'react';
import * as CONSTANTS from '../../constants/strife-constants.js';
import { useHistory } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { addUnseen, removeUnseen } from '../../actions/notification-actions.js';
import { checkLoggedIn } from '../../services/login-service.js';
import * as cryptoService from '../../services/crypto-service.js';
import { io } from 'socket.io-client';
import { Box, Paper, Button, Grid, Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import ErrorIcon from '@mui/icons-material/Error';
import Loading from './Loading.jsx';
import RoomsList from './Sidebar/RoomsList/RoomsList.jsx';
import FriendsList from './Sidebar/FriendsList/FriendsList.jsx';
import Header from './Header/Header.jsx';
import ChatBox from './ChatBox/ChatBox.jsx';
import LandingChatBox from './ChatBox/LandingChatBox.jsx';
import ChatAlreadyOpen from './ChatAlreadyOpen.jsx';
import { UserContext } from '../../UserContext.js';
import changeCallData from '../../actions/calldata-actions.js';
import { updateFriendsList } from '../../actions/friendslist-actions.js';
import { finishStage } from '../../actions/loading-actions.js';
import { StrifeLive } from '../../services/strife-live.js';
import PhoneBox from './ChatBox/Recipient/PhoneBox.jsx';
import Drawer from '@mui/material/Drawer';
import useAudio from '../../hooks/useAudio.jsx';

var privateKey = '';
export default function Chat() {
  const dispatch = useDispatch();
  const history = useHistory();
  const socket = useRef();
  const recipient = useSelector((state) => state.recipient);
  const callData = useSelector((state) => state.callData);
  const socketConnected = useRef(false);
  const { user, setUser } = useContext(UserContext);
  const loading = useSelector((state) => state.loading);
  const [showChatAlreadyOpen, setShowChatAlreadyOpen] = useState(false);
  const [onlineRoomsList, setOnlineRoomsList] = useState([]);
  const [onlineRoomsCount, setOnlineRoomsCount] = useState([]);
  const [onlineMembers, setOnlineMembers] = useState(new Map());
  // TODO: Convert msgList into a hashmap
  const [msgList, setMsgList] = useState([]);
  const msgMap = useRef(new Map());
  const [newMsg, setNewMsg] = useState({});
  const [peerConnection, setPeerConnection] = useState(null);
  const remoteAudioRef = useRef(null);
  const [iceCandidates, setIceCandidates] = useState([]);
  const [micMuted, setMicMuted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [callError, setCallError] = useState(false);
  const [msgNotify] = useAudio(CONSTANTS.urls.notificationSoundSrc);
  const [callNotify, stopCallNotify] = useAudio(
    CONSTANTS.urls.phoneCallSoundSrc,
  );

  const handleDrawerToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  useEffect(() => {
    (async function () {
      let isUserLoggedIn = { ...user };
      if (!user.privateKey) {
        isUserLoggedIn = await checkLoggedIn();
      }
      console.log('isUserLoggedIn: ', isUserLoggedIn);
      if (
        isUserLoggedIn.username != null &&
        isUserLoggedIn.username.length !== 0
      ) {
        console.log("You're logged in!");
        dispatch(finishStage(CONSTANTS.loading.loggedIn));
        setUser({ ...isUserLoggedIn });
        privateKey = isUserLoggedIn.privateKey;
        // If the user is logged in, setup the socket connection
        socket.current = io.connect(process.env.REACT_APP_SC_API_URL);
        socket.current.on('connect', () => {
          // Send username to server
          socket.current.emit('username', isUserLoggedIn.username);
          dispatch(finishStage(CONSTANTS.loading.socketConnected));
          socketConnected.current = true;
        });

        socket.current.on('error', (err) => {
          console.log('Socket.IO Error');
          console.log(err);
        });

        socket.current.on('connect_failed', () => {
          console.log('Socket.IO Error');
          console.log('connect_failed handler invoked');
        });

        // Receive new messages from the server
        socket.current.on('echo-msg', (echoMessage) => {
          setNewMsg(echoMessage);
        });

        socket.current.on('update-user-status', (newOnlineUsersList) => {
          //console.log("newOnlineUsersList: ", newOnlineUsersList);
          requestFriendsList([isUserLoggedIn.username]);
        });

        // Receive friends list from server
        socket.current.on('friends-list', (friendsListFromServer) => {
          console.log('friendsListFromServer:', friendsListFromServer);
          dispatch(updateFriendsList(friendsListFromServer));
          dispatch(finishStage(CONSTANTS.loading.fetchedFriendsList));
        });

        // Receive announcements from the server
        socket.current.on('system-msg', (systemMsg) => {
          const newSystemMsg = {
            message: systemMsg,
            avatar: null,
            systemMsg: true,
          };
          updateMessageList(newSystemMsg);
        });

        // Receive rooms map from server
        socket.current.on('rooms-list', (roomsList, totalRoomsCount) => {
          if (roomsList !== 'rooms-count-update') {
            roomsList = roomsList != null ? roomsList : [];
            setOnlineRoomsList([...roomsList]);
          }
          setOnlineRoomsCount(totalRoomsCount);
        });

        // Receive updated room members list from server
        socket.current.on(
          'updated-room-members',
          (roomname, updatedMembersList) => {
            updatedMembersList =
              updatedMembersList !== null && updatedMembersList !== undefined
                ? updatedMembersList
                : [];
            setOnlineMembers(
              new Map(onlineMembers.set(roomname, updatedMembersList)),
            );
          },
        );

        await setupPeerConnection();

        // Receive updated ice candidates
        socket.current.on('get-ice-candidate', async (candidateInfo) => {
          console.log('Received new ICE candidate from server', candidateInfo);
          if (callData.isCallIncoming || callData.isCallConnected) {
            await StrifeLive.addIceCandidate(candidateInfo.candidate);
          } else {
            console.log('Offer not set, caching ICE candidate');
            setIceCandidates((prev) => [...prev, candidateInfo.candidate]);
          }
        });

        // Receive offer from incoming call
        socket.current.on('get-offer', async (offerData) => {
          changeCallData({
            isCallActive: true,
          });
          console.log('Received offer from server:', offerData);

          await StrifeLive.setOffer(offerData.offer);
          dispatch(
            changeCallData({
              participant: offerData.caller.username,
              callDuration: 0,
              isCallIncoming: true,
              isCallActive: true,
              isCallConnected: false,
            }),
          );
          callNotify(true);
        });

        socket.current.on('end-call', () => {
          endCall();
        });

        // Receive error from server if user is already online elsewhere
        socket.current.on('chat-already-open', () => {
          setShowChatAlreadyOpen(true);
        });

        // Encrypt and save msgHistory in local storage before page closes
        window.addEventListener('beforeunload', exportEncryptedMsgMap);
      } else {
        console.log("You're NOT logged in!");
        setUser({ username: null, accessToken: null });
        history.push('/login');
      }
    })();
  }, []);

  // Load message history once user is logged in
  useEffect(() => {
    if (user.username !== null) {
      importMsgMap();
    }
  }, [user]);

  // Get message history for the new recipient
  useEffect(() => {
    if (recipient.username !== '' && recipient.username !== null) {
      const savedMsgList = msgMap.current.get(recipient.username);
      if (savedMsgList && savedMsgList.length > 0) {
        setMsgList([...savedMsgList]);
      } else {
        setMsgList([]);
      }
      dispatch(removeUnseen(recipient.username));
    }
  }, [recipient]);

  // Push new message to the msgList
  useEffect(() => {
    if (!newMsg?.message) return;
    if (newMsg.isRoom) {
      if (newMsg.recipientUsername !== recipient.username) {
        dispatch(addUnseen(newMsg.recipientUsername));
        msgNotify();
      }
    } else if (newMsg?.senderUsername) {
      // NOT required -- Fetch sender's publicKey from the friend's list and decrypt the message
      //const senderPubKey = friendsList.filter(friend => friend.username == newMsg.senderUsername)[0].publicKey;
      newMsg.message = cryptoService.decryptAsymmetric(
        newMsg.message,
        user.privateKey,
        newMsg.senderPubKey,
      );
      if (newMsg.senderUsername !== recipient.username) {
        dispatch(addUnseen(newMsg.senderUsername));
        msgNotify();
      }
    }
    updateMessageList(newMsg);
  }, [newMsg]);

  useEffect(() => {
    if (!peerConnection) return;
    peerConnection.onaddstream = (e) => {
      console.log('Setting remote audio stream');
      remoteAudioRef.current.srcObject = e?.stream;
    };

    if (callData.participant) {
      peerConnection.onicecandidate = (e) => {
        if (!e.candidate) return;
        const candidateInfo = {
          candidate: e.candidate,
          receiver: callData.participant,
        };
        console.log('Sending ICE candidate to:', callData.participant);
        socket.current.emit('new-ice-candidate', candidateInfo);
      };
    }
  }, [peerConnection, callData]);

  // Handle mic mute/unmute
  useEffect(() => {
    if (callData.isCallConnected) StrifeLive.muteAudio(!micMuted);
  }, [micMuted]);

  function manageRooms(action, roomname, callback) {
    switch (action) {
      case 'join':
        console.log('Joining room:', roomname);
        socket.current.emit(
          'join-room',
          roomname,
          user.username,
          (response) => {
            if (response.status === 'success') {
              const updatedRoomMembers =
                response.members !== null && response.members !== undefined
                  ? response.members
                  : [];
              setOnlineMembers(
                new Map(onlineMembers.set(roomname, updatedRoomMembers)),
              );
              callback(true, roomname);
            } else callback(false, roomname);
          },
        );
        break;

      case 'create':
        console.log('Creating room:', roomname);
        socket.current.emit(
          'create-room',
          roomname,
          user.username,
          (response) => {
            if (response.status === 'success') {
              const updatedRoomMembers =
                response.members !== null && response.members !== undefined
                  ? response.members
                  : [];
              setOnlineMembers(
                new Map(onlineMembers.set(roomname, updatedRoomMembers)),
              );
              callback(true, roomname);
            } else callback(false, roomname);
          },
        );
        break;

      case 'leave':
        console.log('Leaving room:', roomname);
        socket.current.emit('leave-room', roomname, user.username);
        break;
      default:
        console.log('Invalid room action');
    }
  }

  function requestFriendsList(usernameList) {
    socket.current.emit('request-friends-list', usernameList);
  }

  function sendMessage(rawMsgData) {
    if (!rawMsgData.message.match(/^ *$/) && rawMsgData.message != null) {
      updateMessageList(rawMsgData);
      // Stringify and parse to create a deep copy of the raw msg object
      let encMsg = rawMsgData;
      if (!rawMsgData.isRoom) {
        encMsg = JSON.parse(JSON.stringify(rawMsgData));
        encMsg.message = cryptoService.encryptAsymmetric(
          encMsg.message,
          recipient.publicKey,
          user.privateKey,
        );
      }
      socket.current.emit('add-msg', encMsg);
    }
  }

  async function setupPeerConnection() {
    let myAudioStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });
    setPeerConnection(StrifeLive.createPeerConnection(myAudioStream));
  }

  async function createCall(recipientName) {
    dispatch(
      changeCallData({
        participant: recipientName,
        callDuration: 0,
        isCallIncoming: false,
        isCallActive: true,
        isCallConnected: false,
      }),
    );
    const offer = await StrifeLive.createOffer();
    const offerData = {
      caller: user,
      receiver: recipientName,
      offer: offer,
    };

    socket.current.on('get-answer', async (answerData) => {
      console.log('Received answer from server');
      await StrifeLive.setAnswer(answerData.answer);
      dispatch(
        changeCallData({
          participant: recipientName,
          callDuration: 0,
          isCallIncoming: false,
          isCallActive: true,
          isCallConnected: true,
        }),
      );

      if (iceCandidates.length > 0) {
        console.log('Found cached ICE candidates');
        iceCandidates.forEach(async (candidate) => {
          await StrifeLive.addIceCandidate(candidate);
        });
        setIceCandidates([]);
      }
    });
    socket.current.emit('get-offer', offerData, (status) => {
      if (!status) {
        // means the recipient is on another call
        setCallError(true);
        setTimeout(() => {
          endCall();
        }, 1000);
      }
    });
    console.log('Sent offer to:', recipientName);
  }

  async function acceptCall() {
    const answer = await StrifeLive.createAnswer();
    const answerData = {
      caller: callData.participant,
      receiver: user.username,
      answer: answer,
    };

    socket.current.emit('get-answer', answerData);
    dispatch(
      changeCallData({
        participant: callData.participant,
        callDuration: 0,
        isCallIncoming: false,
        isCallActive: true,
        isCallConnected: true,
      }),
    );
    stopCallNotify();

    if (iceCandidates.length > 0) {
      console.log('Found cached ICE candidates');
      iceCandidates.forEach(async (candidate) => {
        await StrifeLive.addIceCandidate(candidate);
      });
      setIceCandidates([]);
    }
  }

  function broadcastAndEndCall() {
    socket.current.emit('end-call');
    endCall();
  }

  function endCall() {
    StrifeLive.endCall();
    dispatch(
      changeCallData({
        participant: '',
        callDuration: 0,
        isCallIncoming: false,
        isCallActive: false,
        isCallConnected: false,
      }),
    );
    stopCallNotify();
    setupPeerConnection();
  }

  function updateMessageList(msgData) {
    if (msgData.recipientUsername === undefined || msgData.systemMsg) return;
    setMsgList((oldList) => [...oldList, msgData]);
    let keyUsername =
      msgData.senderUsername === user.username
        ? msgData.recipientUsername
        : msgData.senderUsername;
    let curMsgList = msgMap.current.has(keyUsername)
      ? msgMap.current.get(keyUsername)
      : [];
    curMsgList.push(msgData);
    msgMap.current = new Map([...msgMap.current, [keyUsername, curMsgList]]);
  }

  function exportEncryptedMsgMap() {
    /*  
            Convert msgMap to string
            Encrypt string with user.privateKey using symmetric enc
            Store encrypted string in localStorage
        */
    if (msgMap.current.size > 0) {
      const msgMapObj = Object.fromEntries(msgMap.current);
      const encMsgMapStr = cryptoService.encryptSymmetric(
        JSON.stringify(msgMapObj),
        privateKey,
        false,
      );
      localStorage.setItem('encryptedMsgMap', encMsgMapStr);
    }
  }

  function importMsgMap() {
    const encMsgMapStr = localStorage.getItem('encryptedMsgMap');
    if (encMsgMapStr === null || encMsgMapStr.length === 0) return;
    const decMsgObjBase64 = cryptoService.decryptSymmetric(
      encMsgMapStr,
      privateKey,
      false,
    );
    const decMsgObjStr = cryptoService.convertBase64toUTF8(decMsgObjBase64);
    msgMap.current = new Map(Object.entries(JSON.parse(decMsgObjStr)));
  }

  const drawerContent = () => {
    return (
      <>
        <audio
          id="remote-audio"
          ref={remoteAudioRef}
          autoPlay
          controls
          style={{ display: 'none' }}
        />

        <Paper elevation={2} style={{ margin: '0 0.5rem 0.5rem 0.5rem' }}>
          <RoomsList
            onlineRoomsCount={onlineRoomsCount}
            roomsList={onlineRoomsList != null ? onlineRoomsList : []}
            manageRooms={manageRooms}
            setSidebarOpen={setSidebarOpen}
          />
          <FriendsList
            createCall={createCall}
            acceptCall={acceptCall}
            setSidebarOpen={setSidebarOpen}
          />
        </Paper>
      </>
    );
  };
  return (
    // Show error dialog if multiple instances of Strife are running (user is already online)
    <div>
      <ChatAlreadyOpen showChatAlreadyOpen={showChatAlreadyOpen} />
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        open={callError}
        autoHideDuration={3000}
        onClose={() => setCallError(false)}
      >
        <Alert icon={<ErrorIcon fontSize="inherit" />} severity="error">
          {'Call failed, user is on another call!'}
        </Alert>
      </Snackbar>
      <Grid
        container
        spacing={2}
        style={{
          maxHeight: '100vh',
          margin: 0,
          width: '100%',
          zIndex: '1300',
        }}
      >
        <Grid
          item
          xs={12}
          style={{ height: '20vh', padding: '0px', zIndex: '1300' }}
        >
          <Header
            requestFriendsList={requestFriendsList}
            manageRooms={manageRooms}
            loaded={loading.loaded}
            handleDrawerToggle={handleDrawerToggle}
          />
        </Grid>

        {loading.loaded ? (
          <>
            <Box
              component={Grid}
              item
              xs={2}
              sx={{
                display: { xs: 'none', md: 'none', lg: 'block' },
              }}
              style={{ height: '80vh', overflowY: 'auto' }}
            >
              {drawerContent()}
            </Box>
            <Drawer
              variant="temporary"
              open={sidebarOpen}
              onClose={handleDrawerToggle}
              ModalProps={{
                keepMounted: true, // Better open performance on mobile.
              }}
              sx={{
                display: { xs: 'block', sm: 'block', md: 'block' },
                '& .MuiDrawer-paper': {
                  boxSizing: 'border-box',
                  width: 300,
                },
                zIndex: '1500',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  margin: '1rem',
                }}
              >
                <Button
                  variant="contained"
                  onClick={() => handleDrawerToggle()}
                >
                  Close
                </Button>
              </div>
              {drawerContent()}
            </Drawer>
            <Grid
              item
              xs={12}
              md={12}
              lg={10}
              style={{
                height: '80vh',
                display: 'flex',
                flexFlow: 'column',
                paddingLeft: 0,
              }}
            >
              {(callData.isCallActive || callData.isCallIncoming) && (
                <PhoneBox
                  callData={callData}
                  callOptions={{
                    createCall,
                    acceptCall,
                    broadcastAndEndCall,
                  }}
                  micMuted={micMuted}
                  setMicMuted={setMicMuted}
                />
              )}
              {recipient.username === '' ? (
                <LandingChatBox />
              ) : (
                <ChatBox
                  msgList={msgList}
                  sendMessage={sendMessage}
                  sender={user}
                  onlineMembers={
                    onlineMembers.has(recipient.username)
                      ? onlineMembers.get(recipient.username)
                      : [user.username]
                  }
                  manageRooms={manageRooms}
                  callData={callData}
                  createCall={createCall}
                />
              )}
            </Grid>
          </>
        ) : (
          <Grid item xs={12} style={{ height: '80vh' }}>
            <Loading />
          </Grid>
        )}
      </Grid>
    </div>
  );
}
