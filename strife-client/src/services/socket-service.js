import { io } from 'socket.io-client';
import { finishStage } from '../actions/loading-actions.js';
import { updateFriendsList } from '../actions/friendslist-actions.js';
import * as CONSTANTS from '../constants/strife-constants.js';

const init = (dispatch, options) => {
  const socket = io.connect(process.env.REACT_APP_SC_API_URL);
  socket.on('connect', () => {
    // Send username to server
    socket.emit('username', options.username);
    dispatch(finishStage(CONSTANTS.loading.socketConnected));
  });

  socket.on('echo-msg', (echoMsg) => {
    options.setNewMsg(echoMsg);
  });

  socket.on('update-user-status', () => {
    socket.emit('request-friends-list', [options.username]);
  });

  socket.on('friends-list', (friendsListFromServer) => {
    console.log('friendsListFromServer:', friendsListFromServer);
    dispatch(updateFriendsList(friendsListFromServer));
    dispatch(finishStage(CONSTANTS.loading.fetchedFriendsList));
  });

  // Receive rooms list from server
  socket.on('rooms-list', (roomsList, totalRoomsCount) => {
    if (roomsList !== 'rooms-count-update') {
      roomsList = roomsList != null ? roomsList : [];
      options.setUserRoomsList([...roomsList]);
    }
    options.setGlobalRoomsCount(totalRoomsCount);
  });

  // Receive updated room members list from server
  socket.on('updated-room-members', (roomname, updatedMembersList) => {
    updatedMembersList =
      updatedMembersList !== null && updatedMembersList !== undefined
        ? updatedMembersList
        : [];
    options.setRoomMembers(
      new Map(options.roomMembers.set(roomname, updatedMembersList)),
    );
  });

  // Receive error from server if user is already online elsewhere
  socket.on('chat-already-open', () => {
    options.setShowChatAlreadyOpen(true);
  });

  return socket;
};

const addEventListener = (socket, event, cb) => {
  socket.on(event, cb);
};

const emit = (socket, event, message, args) => {
  if (args) {
    socket.emit(event, message, ...args);
    return;
  }

  socket.emit(event, message);
};

export { init, emit, addEventListener };
