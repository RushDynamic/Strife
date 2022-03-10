import dotenv from 'dotenv';
dotenv.config();
import Twilio from 'twilio';
const twilio = Twilio(
  process.env.TWILIO_ACC_SID,
  process.env.TWILIO_AUTH_TOKEN,
);

import { createServer } from 'http';
import { Server } from 'socket.io';

import * as roomService from './services/room-service';
import * as friendService from './services/friend-service';
import { Callback } from './types/common-types';
import { Message } from './types/socket-types';
import { IceCandidate, OfferData, AnswerData } from './types/phone-types';

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: (process.env.CORS_ORIGIN_URL_ARRAY || '').split(','),
  },
});
httpServer.listen(5000, () => {
  console.log('Strife Chat API started listening on port 5000');
});

var onlineUsersMap = new Map();
var userMessagesMap = new Map();
var userCallsMap = new Map();
var messagesMap = new Map();

// io.emit
// socket.broadcast.emit
io.on('connect', (socket: any) => {
  socket.on('error', function (err: string) {
    console.log('Socket.IO Error');
    console.log(err);
  });

  socket.on('connect_failed', function () {
    console.log('Socket.IO Error');
    console.log('connect_failed handler invoked');
  });

  socket.on('username', (username: string) => {
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
    friendService
      .prepareFriendsList(username, onlineUsersMap)
      .then((onlineFriends) => {
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
  socket.on('add-msg', (msgData: Message) => {
    const newMsg: Message = {
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

  socket.on('get-twilio-token', async (callback: Callback) => {
    const token = await twilio.tokens.create();
    callback(token.iceServers);
  });

  socket.on('new-ice-candidate', (candidateInfo: IceCandidate) => {
    console.log('Received new ICE candidates for:', candidateInfo.receiver);
    candidateInfo.sender = socket.username;
    socket
      .to(onlineUsersMap.get(candidateInfo.receiver))
      .emit('get-ice-candidate', candidateInfo);
  });

  socket.on('get-offer', (offerData: OfferData, callback: Callback) => {
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

  socket.on('get-answer', (answerData: AnswerData) => {
    socket
      .to(onlineUsersMap.get(answerData.caller))
      .emit('get-answer', answerData);
  });

  socket.on('end-call', () => {
    endCallIfActive(socket);
  });

  // Send updated friendslist everytime a user connects/disconnects
  // usernameList required to update friendsList for both parties after adding/removing a friend
  socket.on('request-friends-list', (usernameList: []) => {
    sendUpdatedFriendsList(usernameList, socket);
  });

  // TODO: remove username from input
  //Create a room
  socket.on(
    'create-room',
    (roomname: string, username: string, callback: Callback) => {
      roomService.manage('create', socket, roomname, callback);
      io.emit('rooms-list', 'rooms-count-update', roomService.getTotalRooms());
    },
  );

  // Join a room when user clicks on Chat button
  socket.on(
    'join-room',
    (roomname: string, username: string, callback: Callback) => {
      roomService.manage('join', socket, roomname, callback);
    },
  );

  // Leave room
  socket.on('leave-room', (roomname: string, username: string) => {
    console.log(`Leaving room ${roomname}`, username);
    roomService.manage('leave', socket, roomname);
  });

  socket.on('disconnect', () => {
    updateOnlineUsers({ removeUser: true }, socket.username, socket.id);
    const userLeftAnnouncementMsg = `User ${socket.username} has left`;
    //socket.broadcast.emit('system-msg', userLeftAnnouncementMsg)

    // Leave all connected rooms
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

type SendUpdatedFriendsList = (
  usernameList: Array<string>,
  socket: any,
) => void;
const sendUpdatedFriendsList: SendUpdatedFriendsList = (
  usernameList,
  socket,
) => {
  usernameList.map((username: string) => {
    friendService
      .prepareFriendsList(username, onlineUsersMap)
      .then((onlineFriends) => {
        // TODO: revisit this if-else logic
        if (onlineUsersMap.get(username) == socket.id) {
          socket.emit('friends-list', onlineFriends);
        } else {
          socket
            .to(onlineUsersMap.get(username))
            .emit('friends-list', onlineFriends);
        }
      })
      .catch((err) =>
        console.log('An error occurred while sending friends list', err),
      );
  });
};

function deleteUserMsgHistory(username: string) {
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

function endCallIfActive(socket: any) {
  const receiver = userCallsMap.get(socket.username);
  socket.to(onlineUsersMap.get(receiver))?.emit('end-call');
  userCallsMap.delete(socket.username);
  userCallsMap.delete(receiver);
}

const updateMsgList = (newMsg: Message) => {
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
};

interface Operation {
  addUser?: boolean;
  removeUser?: boolean;
}
type UpdateOnlineUsers = (
  operation: Operation,
  username: string,
  socketid: string,
) => void;
const updateOnlineUsers: UpdateOnlineUsers = (op, user, sid) => {
  switch (true) {
    case op.addUser:
      onlineUsersMap.set(user, sid);
      break;
    case op.removeUser:
      onlineUsersMap.delete(user);
      break;
  }
};
