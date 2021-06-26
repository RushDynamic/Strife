const accountMgmtApiClient = require('./clients/account-management-api-client.js');

const io = require("socket.io")(5000, {
    cors: {
        origin: ["http://localhost:3000"]
    }
})

var onlineUsersMap = new Map();
// io.emit
// socket.broadcast.emit
io.on('connect', socket => {
    socket.on('username', (username) => {
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
                //console.log("Sending friendsList:", friends.friendsList);
                socket.emit('friends-list', onlineFriends);
            })
            .catch((err) => console.log("An error occurred while sending friends list", err));
    });

    console.log("New connection ", socket.id)
    socket.on('add-msg', (message, socketid) => {
        const newMsg = { message: message, avatar: null, systemMsg: false };
        console.log(`${socketid} says: ${message}`);
        socket.broadcast.emit('echo-msg', newMsg, socketid);
    })

    socket.on('disconnect', () => {
        updateOnlineUsers({ removeUser: true }, socket.username, socket.id);
        const userLeftAnnouncementMsg = `User ${socket.username} has left`;
        socket.broadcast.emit('system-msg', userLeftAnnouncementMsg)
        // Send updated onlineUsers list to all users
        io.emit('new-user-online', Array.from(onlineUsersMap.keys()));
    })
})

function updateOnlineUsers(operation, username, socketid) {
    if (operation.addUser == true) {
        if (!onlineUsersMap.has(username)) {
            onlineUsersMap.set(username, [socketid])
        }
        else {
            if (!(onlineUsersMap.get(username).includes(socketid))) {
                onlineUsersMap.get(username).push(socketid);
            }
        }
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
    console.log("friendsListWithStatus:", friendsListWithStatus);
    return friendsListWithStatus;
}
