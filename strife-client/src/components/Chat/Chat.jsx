import React, { useState, useEffect, useRef, useContext } from 'react';
import { useHistory } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { addUnseen, removeUnseen } from '../../actions/notification-actions.js';
import { checkLoggedIn } from '../../services/login-service.js';
import * as cryptoService from '../../services/crypto-service.js';
import { io } from 'socket.io-client';
import { Box } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Loading from './Loading.jsx';
import RoomsList from './Sidebar/RoomsList.jsx';
import FriendsList from './Sidebar/FriendsList/FriendsList.jsx';
import Header from './Header/Header.jsx';
import ChatBox from './ChatBox/ChatBox.jsx';
import LandingChatBox from './ChatBox/LandingChatBox.jsx';
import ChatAlreadyOpen from './ChatAlreadyOpen.jsx';
import { UserContext } from '../../UserContext.js';

var privateKey = '';
export default function Chat() {
  const dispatch = useDispatch();
  const history = useHistory();
  const socket = useRef();
  const recipient = useSelector((state) => state.recipient);
  const socketConnected = useRef(false);
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
  const [msgList, setMsgList] = useState([]);
  const msgMap = useRef(new Map());
  const [newMsg, setNewMsg] = useState({});

  useEffect(() => {
    // TODO: Probably find a better way to do this
    if (
      loadingStages.includes('loggedIn') &&
      loadingStages.includes('socketConnected') &&
      loadingStages.includes('fetchedFriendsList')
    ) {
      setLoaded(true);
    }
  }, [loadingStages]);

  useEffect(() => {
    (async function () {
      const isUserLoggedIn = await checkLoggedIn();
      console.log('isUserLoggedIn: ', isUserLoggedIn);
      if (
        isUserLoggedIn.username != null &&
        isUserLoggedIn.username.length !== 0
      ) {
        console.log("You're logged in!");
        setLoadingStages((oldList) => [...oldList, 'loggedIn']);
        setUser({ ...isUserLoggedIn });
        privateKey = isUserLoggedIn.privateKey;
        // If the user is logged in, setup the socket connection
        socket.current = io.connect('http://localhost:5000');
        socket.current.on('connect', () => {
          // Send username to server
          socket.current.emit('username', isUserLoggedIn.username);
          setLoadingStages((oldList) => [...oldList, 'socketConnected']);
          socketConnected.current = true;
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
          setFriendsList(friendsListFromServer);
          setLoadingStages((oldList) => [...oldList, 'fetchedFriendsList']);
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
    if (newMsg.isRoom) {
      if (newMsg.recipientUsername !== recipient.username) {
        dispatch(addUnseen(newMsg.recipientUsername));
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
      }
    }
    updateMessageList(newMsg);
  }, [newMsg]);

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

  function createCall() {
    const callInfo = {
      caller: user.username,
      receiver: recipient.username,
    };
    socket.current.emit('create-call', callInfo);
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

  return (
    // Show error dialog if multiple instances of Strife are running (user is already online)
    <div>
      <ChatAlreadyOpen showChatAlreadyOpen={showChatAlreadyOpen} />
      <Grid
        container
        spacing={2}
        style={{
          maxHeight: '100vh',
          margin: 0,
          width: '100%',
        }}
      >
        <Grid item xs={12} style={{ height: '20vh', padding: '0px' }}>
          <Header
            requestFriendsList={requestFriendsList}
            manageRooms={manageRooms}
          />
        </Grid>
        {loaded ? (
          <>
            <Grid
              item
              xs={2}
              style={{
                height: '80vh',
                overflow: 'auto',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
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
                createCall={createCall}
              />
            </Grid>
            <Grid
              item
              xs={10}
              style={{ height: '80vh', display: 'flex', flexFlow: 'column' }}
            >
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
