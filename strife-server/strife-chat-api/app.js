const accountMgmtApiClient = require('./clients/account-management-api-client.js');

const io = require("socket.io")(5000, {
    cors: {
        origin: ["http://localhost:3000"]
    }
})

var onlineUsersMap = new Map();
var userMessagesMap = new Map();
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
            io.emit('new-user-online', Array.from(onlineUsersMap.keys()));
            // console.log("Online Users: ", onlineUsersMap);
            socket.username = username;
            const newUserAnnouncementMsg = `User ${username} has joined`;
            socket.broadcast.emit('system-msg', newUserAnnouncementMsg)

            // Send friends list
            fetchFriendsList(username)
                .then((friends) => {
                    const onlineFriends = prepareFriendsList(friends.friendsList);
                    socket.emit('friends-list', onlineFriends);
                })
                .catch((err) => console.log("An error occurred while sending friends list", err));
        }
    });

    console.log("New connection ", socket.id)
    socket.on('add-msg', (message, senderUsername, recipientUsername) => {
        const newMsg = {
            message: message,
            avatar: null,
            systemMsg: false,
            senderUsername: senderUsername,
            recipientUsername: recipientUsername
        };

        // Send message to only a particular user
        socket.to(onlineUsersMap.get(recipientUsername)).emit('echo-msg', newMsg, senderUsername);
        console.log(`${senderUsername} says: ${message} to ${recipientUsername}`);
        updateMsgList(message, senderUsername, recipientUsername);
    })

    // For sending the chat history back to the requested user
    socket.on('request-msg-history', (senderUsername, recipientUsername) => {
        const msgList = getMsgList(senderUsername, recipientUsername);
        socket.emit('receive-msg-history', msgList);
    });

    // Send updated friendslist everytime a user connects/disconnects
    socket.on('request-friends-list', (username) => {
        fetchFriendsList(username)
            .then((friends) => {
                const onlineFriends = prepareFriendsList(friends.friendsList);
                socket.emit('friends-list', onlineFriends);
            })
            .catch((err) => console.log("An error occurred while sending friends list", err));
    })

    socket.on('disconnect', () => {
        updateOnlineUsers({ removeUser: true }, socket.username, socket.id);
        const userLeftAnnouncementMsg = `User ${socket.username} has left`;
        socket.broadcast.emit('system-msg', userLeftAnnouncementMsg)
        // Send updated onlineUsers list to all users
        io.emit('new-user-online', Array.from(onlineUsersMap.keys()));
    })
})

function updateMsgList(message, senderUsername, recipientUsername) {
    if (userMessagesMap.has(senderUsername)) {
        if (userMessagesMap.get(senderUsername).has(recipientUsername)) {
            userMessagesMap.get(senderUsername).get(recipientUsername).push({ message: message, senderUsername: senderUsername, timestamp: new Date().getTime() });
        }
        else {
            messagesMap = new Map().set(recipientUsername, [{ message: message, senderUsername: senderUsername, timestamp: new Date().getTime() }]);
            userMessagesMap.get(senderUsername).set(messagesMap)
        }
    }
    else {
        messagesMap = new Map().set(recipientUsername, [{ message: message, senderUsername: senderUsername, timestamp: new Date().getTime() }]);
        userMessagesMap.set(senderUsername, messagesMap);
    }
    //getMsgList(senderUsername, recipientUsername);
    //console.log("UserMessagesMap:", userMessagesMap.get(senderUsername));
}

function getMsgList(senderUsername, recipientUsername) {
    // TODO: Clean up this code
    var msgList = [];
    //console.log(userMessagesMap);
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
    msgList = msgList.sort((a, b) => a.timestamp - b.timestamp);
    //console.log(msgList);
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
    return friendsList.filter(value => Array.from(onlineUsersMap.keys()).includes(value));
}

function prepareFriendsList(friendsList) {
    const onlineFriends = getOnlineFriends(friendsList);
    const friendsListWithStatus = [];
    friendsList.map(friend => {
        var friendStatus = { username: "", status: "" };
        if (onlineFriends.includes(friend)) {
            friendStatus = { username: friend, status: "online" };
        }
        else {
            friendStatus = { username: friend, status: "offline" };
        }
        friendsListWithStatus.push(friendStatus);
    });
    //console.log("friendsListWithStatus:", friendsListWithStatus);
    return friendsListWithStatus;
}
