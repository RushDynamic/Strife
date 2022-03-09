import dotenv from 'dotenv';
dotenv.config();
import * as accountMgmtApiClient from './clients/account-management-api-client.js';
import Twilio from 'twilio';
const twilio = Twilio(
  process.env.TWILIO_ACC_SID,
  process.env.TWILIO_AUTH_TOKEN,
);

import { createServer } from 'http';
import { Server } from 'socket.io';
const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN_URL_ARRAY.split(','),
  },
});
httpServer.listen(5000);
import * as roomService from './services/room-service.js';

var onlineUsersMap = new Map();
var userMessagesMap = new Map();
var userCallsMap = new Map();
var messagesMap = new Map();

// io.emit
// socket.broadcast.emit
io.on('connect', (socket) => {
  socket.on('error', function (err) {
    console.log('Socket.IO Error');
    console.log(err);
  });

  socket.on('connect_failed', function () {
    console.log('Socket.IO Error');
    console.log('connect_failed handler invoked');
  });

  socket.on('username', (username) => {
    if (onlineUsersMap.has(username)) {
      socket.emit('chat-already-open');
      return;
    }
    updateOnlineUsers({ addUser: true }, username, socket.id);
    socket.broadcast.emit(
      'update-user-status',
      Array.from(onlineUsersMap.keys()),
    );
    socket.username = username;

    // Send friends list
    fetchFriendsList(username)
      .then((friends) => {
        const onlineFriends = prepareFriendsList(friends.friendsList);
        socket.emit('friends-list', onlineFriends);
      })
      .catch((err) =>
        console.log('An error occurred while sending friends list', err),
      );

    // Send user's roomslist
    socket.emit(
      'rooms-list',
      roomService.getUserRooms(socket.username),
      roomService.getTotalRooms(),
    );
  });

  console.log('New connection ', socket.id);
  socket.on('add-msg', (msgData) => {
    const newMsg = {
      systemMsg: false,
      ...msgData,
    };

    // Check if recipient is a room
    socket
      .to(
        msgData.isRoom
          ? msgData.recipientUsername
          : onlineUsersMap.get(msgData.recipientUsername),
      )
      .emit('echo-msg', newMsg);
    console.log(
      `${msgData.senderUsername} says: "${msgData.message}" to ${msgData.recipientUsername}`,
    );
    updateMsgList(newMsg);
  });

  socket.on('get-twilio-token', async (callback) => {
    const token = await twilio.tokens.create();
    callback(token.iceServers);
  });

  socket.on('new-ice-candidate', (candidateInfo) => {
    console.log('Received new ICE candidates for:', candidateInfo.receiver);
    candidateInfo.sender = socket.username;
    socket
      .to(onlineUsersMap.get(candidateInfo.receiver))
      .emit('get-ice-candidate', candidateInfo);
  });

  socket.on('get-offer', (offerData, callback) => {
    if (userCallsMap.has(offerData.receiver)) {
      callback(false);
    } else {
      userCallsMap.set(socket.username, offerData.receiver);
      userCallsMap.set(offerData.receiver, socket.username);
      socket
        .to(onlineUsersMap.get(offerData.receiver))
        .emit('get-offer', offerData);
    }
  });

  socket.on('get-answer', (answerData) => {
    socket
      .to(onlineUsersMap.get(answerData.caller))
      .emit('get-answer', answerData);
  });

  socket.on('end-call', () => {
    endCallIfActive(socket);
  });

  // Send updated friendslist everytime a user connects/disconnects
  // usernameList required to update friendsList for both parties after adding/removing a friend
  socket.on('request-friends-list', (usernameList) => {
    sendUpdatedFriendsList(usernameList, socket);
  });

  // TODO: remove username from input
  //Create a room
  socket.on('create-room', (roomname, username, callback) => {
    roomService.manage('create', roomname, socket, callback);
    io.emit('rooms-list', 'rooms-count-update', roomService.getTotalRooms());
  });

  // Join a room when user clicks on Chat button
  socket.on('join-room', (roomname, username, callback) => {
    roomService.manage('join', roomname, socket, callback);
  });

  // Leave room
  socket.on('leave-room', (roomname, username) => {
    console.log(`Leaving room ${roomname}`, username);
    roomService.manage('leave', roomname, socket);
  });

  socket.on('disconnect', () => {
    updateOnlineUsers({ removeUser: true }, socket.username, socket.id);
    const userLeftAnnouncementMsg = `User ${socket.username} has left`;
    //socket.broadcast.emit('system-msg', userLeftAnnouncementMsg)

    // Leave all connected rooms
    //leaveAllRooms(socket.username, socket);
    roomService.manage('leaveAll', socket);

    // Delete message history
    deleteUserMsgHistory(socket.username);

    // End any active call
    endCallIfActive(socket);

    // Send updated onlineUsers list to all users
    socket.broadcast.emit(
      'update-user-status',
      Array.from(onlineUsersMap.keys()),
    );
  });
});

function sendUpdatedFriendsList(usernameList, socket) {
  usernameList.map((username) => {
    fetchFriendsList(username)
      .then((friends) => {
        const onlineFriends = prepareFriendsList(friends.friendsList);
        if (onlineUsersMap.get(username) == socket.id)
          socket.emit('friends-list', onlineFriends);
        else
          socket
            .to(onlineUsersMap.get(username))
            .emit('friends-list', onlineFriends);
      })
      .catch((err) =>
        console.log('An error occurred while sending friends list', err),
      );
  });
}

function deleteUserMsgHistory(username) {
  const onlineUsers = Array.from(onlineUsersMap.keys());
  if (userMessagesMap.has(username)) {
    const recipientUsersList = Array.from(userMessagesMap.get(username).keys());
    recipientUsersList.map((recipientUser) => {
      if (!onlineUsers.includes(recipientUser)) {
        // Recipient user is offline
        userMessagesMap.get(username).delete(recipientUser);
        if (
          userMessagesMap.has(recipientUser) &&
          userMessagesMap.get(recipientUser).has(username)
        ) {
          userMessagesMap.get(recipientUser).delete(username);
        }
      }
    });
  }
}

function endCallIfActive(socket) {
  const receiver = userCallsMap.get(socket.username);
  socket.to(onlineUsersMap.get(receiver))?.emit('end-call');
  userCallsMap.delete(socket.username);
  userCallsMap.delete(receiver);
}

function updateMsgList(newMsg) {
  // TODO: Clean up and optimize this code
  if (newMsg.isRoom) {
    if (userMessagesMap.has(newMsg.recipientUsername)) {
      // Get the msgMap for that particular room
      userMessagesMap.get(newMsg.recipientUsername).push(newMsg);
    } else {
      userMessagesMap.set(newMsg.recipientUsername, [newMsg]);
    }
  } else if (userMessagesMap.has(newMsg.senderUsername)) {
    if (
      userMessagesMap.get(newMsg.senderUsername).has(newMsg.recipientUsername)
    ) {
      userMessagesMap
        .get(newMsg.senderUsername)
        .get(newMsg.recipientUsername)
        .push(newMsg);
    } else {
      var msgMap = userMessagesMap.get(newMsg.senderUsername);
      msgMap.set(newMsg.recipientUsername, [newMsg]);
      userMessagesMap.get(newMsg.senderUsername).set(msgMap);
    }
  } else {
    messagesMap = new Map().set(newMsg.recipientUsername, [newMsg]);
    userMessagesMap.set(newMsg.senderUsername, messagesMap);
  }
  //getMsgList(senderUsername, recipientUsername);
  //console.log("Updated UserMessagesMap:", userMessagesMap.get(newMsg.senderUsername));
}

function updateOnlineUsers(operation, username, socketid) {
  switch (true) {
    case operation.addUser:
      onlineUsersMap.set(username, socketid);
      break;
    case operation.removeUser:
      onlineUsersMap.delete(username);
      break;
  }
}

async function fetchFriendsList(username) {
  return await accountMgmtApiClient.fetchFriendsList(username);
}

function getOnlineFriends(friendsList) {
  return friendsList
    .filter((value) =>
      Array.from(onlineUsersMap.keys()).includes(value.username),
    )
    .map((result) => result.username);
}

function prepareFriendsList(friendsList) {
  const onlineFriends = getOnlineFriends(friendsList);
  const friendsListWithStatus = [];
  friendsList.map((friend) => {
    const friendStatus = {
      ...friend,
      status: onlineFriends.includes(friend.username) ? 'online' : 'offline',
    };
    friendsListWithStatus.push(friendStatus);
  });
  friendsListWithStatus.sort((a) => {
    if (a.status == 'offline') return 1;
    else return -1;
  });
  return friendsListWithStatus;
}
