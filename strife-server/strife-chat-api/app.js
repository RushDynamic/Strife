const accountMgmtApiClient = require('./clients/account-management-api-client.js');

const io = require("socket.io")(5000, {
    cors: {
        origin: ["http://localhost:3000"]
    }
})

var onlineRoomsMap = new Map();
var onlineUsersMap = new Map();
var userMessagesMap = new Map();
var userRoomsMap = new Map();
var messagesMap = new Map();

// io.emit
// socket.broadcast.emit
io.on('connect', socket => {
    socket.on('username', (username) => {
        if (onlineUsersMap.has(username)) {
            socket.emit('chat-already-open');
        }
        else {
            updateOnlineUsers({ addUser: true }, username, socket.id);
            socket.broadcast.emit('new-user-online', Array.from(onlineUsersMap.keys()));
            // console.log("Online Users: ", onlineUsersMap);
            socket.username = username;
            const newUserAnnouncementMsg = `User ${username} has joined`;
            //socket.broadcast.emit('system-msg', newUserAnnouncementMsg)

            // Send friends list
            fetchFriendsList(username)
                .then((friends) => {
                    const onlineFriends = prepareFriendsList(friends.friendsList);
                    socket.emit('friends-list', onlineFriends);
                })
                .catch((err) => console.log("An error occurred while sending friends list", err));

            // Send user's roomslist
            socket.emit('rooms-list', userRoomsMap.get(username), onlineRoomsMap.size);

        }
    });

    console.log("New connection ", socket.id)
    socket.on('add-msg', (msgData) => {
        const newMsg = {
            message: msgData.message,
            avatar: msgData.avatar,
            systemMsg: false,
            senderUsername: msgData.senderUsername,
            recipientUsername: msgData.recipientUsername,
            timestamp: msgData.timestamp,
            isRoom: msgData.isRoom
        };

        // Check if recipient is a room
        if (msgData.isRoom) {
            // Send to all users in room
            socket.to(msgData.recipientUsername).emit('echo-msg', newMsg);
        }
        else {
            // Send message to only a particular user
            socket.to(onlineUsersMap.get(msgData.recipientUsername)).emit('echo-msg', newMsg);
        }
        console.log(`${msgData.senderUsername} says: "${msgData.message}" to ${msgData.recipientUsername}`);
        updateMsgList(newMsg);
    })

    // For sending the chat history back to the requested user
    socket.on('request-msg-history', (senderUsername, recipientUsername, isRoom) => {
        const msgList = getMsgList(senderUsername, recipientUsername, isRoom);
        socket.emit('receive-msg-history', msgList, recipientUsername);
    });

    // Send updated friendslist everytime a user connects/disconnects
    socket.on('request-friends-list', (usernameList) => {
        sendUpdatedFriendsList(usernameList, socket);
    })

    //Create a room
    socket.on('create-room', (roomname, username, callback) => {
        console.log('Creating room:', roomname);
        if (!onlineRoomsMap.has(roomname)) {
            onlineRoomsMap.set(roomname, []);
            callback({
                status: "success",
                members: [username]
            });
        }
        else {
            callback({
                status: "failure"
            })
        }
        io.emit('rooms-list', 'rooms-count-update', onlineRoomsMap.size);
    });

    // Join a room when user clicks on Chat button
    socket.on('join-room', (roomname, username, callback) => {
        updateRoomsList("join", roomname, username, socket, callback);
    })

    // Leave room
    socket.on('leave-room', (roomname, username) => {
        console.log(`Leaving room ${roomname}`, username);
        updateRoomsList("leave", roomname, username, socket);
    });

    socket.on('disconnect', () => {
        updateOnlineUsers({ removeUser: true }, socket.username, socket.id);
        const userLeftAnnouncementMsg = `User ${socket.username} has left`;
        //socket.broadcast.emit('system-msg', userLeftAnnouncementMsg)

        // Leave all connected rooms
        leaveAllRooms(socket.username, socket);

        // Delete message history
        deleteUserMsgHistory(socket.username);

        // Send updated onlineUsers list to all users
        socket.broadcast.emit('new-user-online', Array.from(onlineUsersMap.keys()));
    })
})

function sendUpdatedFriendsList(usernameList, socket) {
    usernameList.map((username) => {
        fetchFriendsList(username)
            .then((friends) => {
                const onlineFriends = prepareFriendsList(friends.friendsList);
                if (onlineUsersMap.get(username) == socket.id) socket.emit('friends-list', onlineFriends);
                else socket.to(onlineUsersMap.get(username)).emit('friends-list', onlineFriends);
            })
            .catch((err) => console.log("An error occurred while sending friends list", err));
    })
}

function updateRoomsList(action, roomname, username, socket, callback) {
    switch (action) {
        case 'join':
            if (onlineRoomsMap.has(roomname)) {
                socket.join(roomname);
                if (!onlineRoomsMap.get(roomname).includes(username)) {
                    onlineRoomsMap.get(roomname).push(username);
                }

                // Update userRoomsMap as well
                var userRoomsList = [];
                if (userRoomsMap.has(username)) userRoomsList = userRoomsMap.get(username);
                if (!userRoomsList.includes(roomname)) {
                    userRoomsList.push(roomname);
                    userRoomsMap.set(username, userRoomsList);
                }

                // Send updated memberslist to client
                socket.to(roomname).emit('updated-room-members', roomname, onlineRoomsMap.get(roomname));
                callback({
                    status: "success",
                    members: onlineRoomsMap.get(roomname)
                });
            }
            else {
                callback({
                    status: "failure"
                });
            }
            break;
        case 'leave':
            if (onlineRoomsMap.has(roomname) && onlineRoomsMap.get(roomname).includes(username)) {
                socket.leave(roomname);
                var onlineUsersInRoom = onlineRoomsMap.get(roomname);
                onlineUsersInRoom = onlineUsersInRoom.filter(user => user != username);

                // Disband room if no one is online
                if (onlineUsersInRoom.length == 0) {
                    onlineRoomsMap.delete(roomname);
                    if (userMessagesMap.has(roomname)) {
                        userMessagesMap.delete(roomname);
                    }
                    io.emit('rooms-list', 'rooms-count-update', onlineRoomsMap.size);
                }
                else onlineRoomsMap.set(roomname, onlineUsersInRoom);

                // Update userRoomsMap as well
                var userRoomsList = [];
                if (userRoomsMap.has(username)) userRoomsList = userRoomsMap.get(username);
                userRoomsList = userRoomsList.filter(room => room != roomname);
                userRoomsMap.set(username, userRoomsList);

                // Send updated memberslist to client
                socket.to(roomname).emit('updated-room-members', roomname, onlineRoomsMap.get(roomname));
            }
            break;
    }
    //console.log("userRoomsMap:", userRoomsMap);
    //console.log("onlineRoomsMap:", onlineRoomsMap);
    socket.emit('rooms-list', userRoomsMap.get(username), onlineRoomsMap.size);
}

function leaveAllRooms(username, socket) {
    if (userRoomsMap.has(username)) {
        const userRoomsList = userRoomsMap.get(username);
        userRoomsList.map(room => {
            socket.leave(room);
            var onlineUsersInRoom = onlineRoomsMap.get(room);
            onlineUsersInRoom = onlineUsersInRoom.filter(user => user != username);
            socket.to(room).emit('updated-room-members', room, onlineUsersInRoom);

            // Disband room if no one is online
            if (onlineUsersInRoom.length == 0) {
                onlineRoomsMap.delete(room);
                if (userMessagesMap.has(room)) {
                    userMessagesMap.delete(room);
                }
                io.emit('rooms-list', 'rooms-count-update', onlineRoomsMap.size);
            }
            else onlineRoomsMap.set(room, onlineUsersInRoom);
        });
        userRoomsMap.delete(username);
    }
}

function deleteUserMsgHistory(username) {
    const onlineUsers = Array.from(onlineUsersMap.keys());
    if (userMessagesMap.has(username)) {
        const recipientUsersList = Array.from(userMessagesMap.get(username).keys());
        recipientUsersList.map(recipientUser => {
            if (!onlineUsers.includes(recipientUser)) {
                // Recipient user is offline
                userMessagesMap.get(username).delete(recipientUser);
                if (userMessagesMap.has(recipientUser) && userMessagesMap.get(recipientUser).has(username)) {
                    userMessagesMap.get(recipientUser).delete(username);
                }
            }
        })
    }
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
            userMessagesMap.get(newMsg.senderUsername).get(newMsg.recipientUsername).push(newMsg);
        }
        else {
            var msgMap = userMessagesMap.get(newMsg.senderUsername);
            msgMap.set(newMsg.recipientUsername, [newMsg]);
            userMessagesMap.get(newMsg.senderUsername).set(msgMap)
        }
    }
    else {
        messagesMap = new Map().set(newMsg.recipientUsername, [newMsg]);
        userMessagesMap.set(newMsg.senderUsername, messagesMap);
    }
    //getMsgList(senderUsername, recipientUsername);
    //console.log("Updated UserMessagesMap:", userMessagesMap.get(newMsg.senderUsername));
}

function getMsgList(senderUsername, recipientUsername, isRoom) {
    // TODO: Clean up this code
    var msgList = [];
    if (isRoom) {
        msgList = userMessagesMap.get(recipientUsername);
    }
    else {
        if (userMessagesMap.has(senderUsername)) {
            if (userMessagesMap.get(senderUsername).has(recipientUsername)) {
                msgList = userMessagesMap.get(senderUsername).get(recipientUsername)
            }
        }
        if (userMessagesMap.has(recipientUsername)) {
            if (userMessagesMap.get(recipientUsername).has(senderUsername)) {
                msgList = msgList.concat(userMessagesMap.get(recipientUsername).get(senderUsername));
            }
        }
    }
    //console.log(userMessagesMap);
    msgList = msgList != undefined && msgList.length > 0 ? msgList.sort((a, b) => a.timestamp - b.timestamp) : [];
    return msgList;
}

function updateOnlineUsers(operation, username, socketid) {
    if (operation.addUser == true) {
        onlineUsersMap.set(username, socketid);
    }

    if (operation.removeUser == true) {
        onlineUsersMap.delete(username);
    }
}

async function fetchFriendsList(username) {
    return await accountMgmtApiClient.fetchFriendsList(username);
}

function getOnlineFriends(friendsList) {
    return friendsList.filter(value => Array.from(onlineUsersMap.keys()).includes(value.username)).map((result) => result.username);
}

function prepareFriendsList(friendsList) {
    const onlineFriends = getOnlineFriends(friendsList);
    const friendsListWithStatus = [];
    friendsList.map(friend => {

        var friendStatus = { username: "", avatar: "", status: "" };
        if (onlineFriends.includes(friend.username)) {
            friendStatus = { username: friend.username, avatar: friend.avatar, status: "online" };
        }
        else {
            friendStatus = { username: friend.username, avatar: friend.avatar, status: "offline" };
        }
        friendsListWithStatus.push(friendStatus);
    });
    friendsListWithStatus.sort((a) => {
        if (a.status == "offline") return 1;
        else return -1;
    });
    return friendsListWithStatus;
}
