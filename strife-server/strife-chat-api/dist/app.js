"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const accountMgmtApiClient = __importStar(require("./clients/account-management-api-client.js"));
const twilio_1 = __importDefault(require("twilio"));
const twilio = (0, twilio_1.default)(process.env.TWILIO_ACC_SID, process.env.TWILIO_AUTH_TOKEN);
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const httpServer = (0, http_1.createServer)();
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: process.env.CORS_ORIGIN_URL_ARRAY.split(','),
    },
});
httpServer.listen(5000);
const roomService = __importStar(require("./services/room-service.js"));
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
        socket.broadcast.emit('update-user-status', Array.from(onlineUsersMap.keys()));
        socket.username = username;
        // Send friends list
        fetchFriendsList(username)
            .then((friends) => {
            const onlineFriends = prepareFriendsList(friends.friendsList);
            socket.emit('friends-list', onlineFriends);
        })
            .catch((err) => console.log('An error occurred while sending friends list', err));
        // Send user's roomslist
        socket.emit('rooms-list', roomService.getUserRooms(socket.username), roomService.getTotalRooms());
    });
    console.log('New connection ', socket.id);
    socket.on('add-msg', (msgData) => {
        const newMsg = Object.assign({ systemMsg: false }, msgData);
        // Check if recipient is a room
        socket
            .to(msgData.isRoom
            ? msgData.recipientUsername
            : onlineUsersMap.get(msgData.recipientUsername))
            .emit('echo-msg', newMsg);
        console.log(`${msgData.senderUsername} says: "${msgData.message}" to ${msgData.recipientUsername}`);
        updateMsgList(newMsg);
    });
    socket.on('get-twilio-token', (callback) => __awaiter(void 0, void 0, void 0, function* () {
        const token = yield twilio.tokens.create();
        callback(token.iceServers);
    }));
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
        }
        else {
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
        socket.broadcast.emit('update-user-status', Array.from(onlineUsersMap.keys()));
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
            .catch((err) => console.log('An error occurred while sending friends list', err));
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
                if (userMessagesMap.has(recipientUser) &&
                    userMessagesMap.get(recipientUser).has(username)) {
                    userMessagesMap.get(recipientUser).delete(username);
                }
            }
        });
    }
}
function endCallIfActive(socket) {
    var _a;
    const receiver = userCallsMap.get(socket.username);
    (_a = socket.to(onlineUsersMap.get(receiver))) === null || _a === void 0 ? void 0 : _a.emit('end-call');
    userCallsMap.delete(socket.username);
    userCallsMap.delete(receiver);
}
function updateMsgList(newMsg) {
    // TODO: Clean up and optimize this code
    if (newMsg.isRoom) {
        if (userMessagesMap.has(newMsg.recipientUsername)) {
            // Get the msgMap for that particular room
            userMessagesMap.get(newMsg.recipientUsername).push(newMsg);
        }
        else {
            userMessagesMap.set(newMsg.recipientUsername, [newMsg]);
        }
    }
    else if (userMessagesMap.has(newMsg.senderUsername)) {
        if (userMessagesMap.get(newMsg.senderUsername).has(newMsg.recipientUsername)) {
            userMessagesMap
                .get(newMsg.senderUsername)
                .get(newMsg.recipientUsername)
                .push(newMsg);
        }
        else {
            var msgMap = userMessagesMap.get(newMsg.senderUsername);
            msgMap.set(newMsg.recipientUsername, [newMsg]);
            userMessagesMap.get(newMsg.senderUsername).set(msgMap);
        }
    }
    else {
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
function fetchFriendsList(username) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield accountMgmtApiClient.fetchFriendsList(username);
    });
}
function getOnlineFriends(friendsList) {
    return friendsList
        .filter((value) => Array.from(onlineUsersMap.keys()).includes(value.username))
        .map((result) => result.username);
}
function prepareFriendsList(friendsList) {
    const onlineFriends = getOnlineFriends(friendsList);
    const friendsListWithStatus = [];
    friendsList.map((friend) => {
        const friendStatus = Object.assign(Object.assign({}, friend), { status: onlineFriends.includes(friend.username) ? 'online' : 'offline' });
        friendsListWithStatus.push(friendStatus);
    });
    friendsListWithStatus.sort((a) => {
        if (a.status == 'offline')
            return 1;
        else
            return -1;
    });
    return friendsListWithStatus;
}
