import React, {
  useState,
  useEffect,
  useRef,
  useContext,
  useCallback,
} from 'react';
import * as CONSTANTS from '../../constants/strife-constants.js';
import { useHistory } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { addUnseen, removeUnseen } from '../../actions/notification-actions.js';
import { checkLoggedIn } from '../../services/login-service.js';
import * as cryptoService from '../../services/crypto-service.js';
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
import { finishStage } from '../../actions/loading-actions.js';
import { updateSocket } from '../../actions/socket-actions.js';
import PhoneBox from './ChatBox/Recipient/PhoneBox.jsx';
import Drawer from '@mui/material/Drawer';
import useAudio from '../../hooks/useAudio.jsx';
import usePhone from '../../hooks/usePhone.jsx';
import useRoom from '../../hooks/useRoom.jsx';
import * as socketService from '../../services/socket-service.js';

export default function Chat() {
  const dispatch = useDispatch();
  const history = useHistory();
  const { user, setUser } = useContext(UserContext);
  const recipient = useSelector((state) => state.recipient);
  const callData = useSelector((state) => state.callData);
  const loading = useSelector((state) => state.loading);
  const socket = useSelector((state) => state.socket);
  const [showChatAlreadyOpen, setShowChatAlreadyOpen] = useState(false);
  const [msgList, setMsgList] = useState([]);
  const msgMap = useRef(new Map());
  const [newMsg, setNewMsg] = useState({});
  const remoteAudioRef = useRef(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [msgNotify] = useAudio(CONSTANTS.urls.notificationSoundSrc);
  const [
    createCall,
    acceptCall,
    endCall,
    muteMic,
    { callError, setCallError },
  ] = usePhone(socket, remoteAudioRef);
  const [manageRoom, roomMembers, roomsUser, roomsGlobal] = useRoom(user);

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

        // If the user is logged in, setup the socket connection
        // TODO: clean this up
        const socketOptions = {
          username: isUserLoggedIn.username,
          setNewMsg: setNewMsg,
          setUserRoomsList: roomsUser.set,
          setGlobalRoomsCount: roomsGlobal.set,
          setRoomMembers: roomMembers.set,
          roomMembers: roomMembers.map,
          setShowChatAlreadyOpen: setShowChatAlreadyOpen,
        };

        dispatch(updateSocket(socketService.init(dispatch, socketOptions)));
      } else {
        console.log("You're NOT logged in!");
        setUser({ username: null, accessToken: null });
        history.push('/login');
      }
    })();
  }, []);

  // Load message history once user is logged in
  useEffect(() => {
    if (user.username && user.privateKey) {
      importMsgMap();

      // Encrypt and save msgHistory in local storage before page closes
      window.addEventListener('beforeunload', exportEncryptedMsgMap);
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

  function requestFriendsList(usernameList) {
    socketService.emit(socket, 'request-friends-list', usernameList);
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
      socketService.emit(socket, 'add-msg', encMsg);
    }
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

  const exportEncryptedMsgMap = useCallback(() => {
    /*  
            Convert msgMap to string
            Encrypt string with user.privateKey using symmetric enc
            Store encrypted string in localStorage
        */
    if (msgMap.current.size > 0) {
      const msgMapObj = Object.fromEntries(msgMap.current);
      const encMsgMapStr = cryptoService.encryptSymmetric(
        JSON.stringify(msgMapObj),
        user.privateKey,
        false,
      );
      localStorage.setItem('encryptedMsgMap', encMsgMapStr);
    }
  }, [user.privateKey]);

  const importMsgMap = useCallback(() => {
    const encMsgMapStr = localStorage.getItem('encryptedMsgMap');
    if (encMsgMapStr === null || encMsgMapStr.length === 0) return;
    const decMsgObjBase64 = cryptoService.decryptSymmetric(
      encMsgMapStr,
      user.privateKey,
      false,
    );
    const decMsgObjStr = cryptoService.convertBase64toUTF8(decMsgObjBase64);
    msgMap.current = new Map(Object.entries(JSON.parse(decMsgObjStr)));
  }, [user.privateKey]);

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
            onlineRoomsCount={roomsGlobal.count}
            roomsList={roomsUser.list != null ? roomsUser.list : []}
            manageRooms={manageRoom}
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
            manageRooms={manageRoom}
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
                    endCall,
                  }}
                  muteMic={muteMic}
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
                    roomMembers.map.has(recipient.username)
                      ? roomMembers.map.get(recipient.username)
                      : [user.username]
                  }
                  manageRooms={manageRoom}
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
