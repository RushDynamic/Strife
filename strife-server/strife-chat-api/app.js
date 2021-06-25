const io = require("socket.io")(5000, {
    cors: {
        origin: ["http://localhost:3000"]
    }
})

var onlineUsers = new Map();
// io.emit
// socket.broadcast.emit
io.on('connect', socket => {
    socket.on('username', (username) => {
        updateOnlineUsers({ addUser: true }, username, socket.id);
        io.emit('new-user-online', Array.from(onlineUsers.keys()));
        console.log("Online Users: ", onlineUsers);
        socket.username = username;
        const newUserAnnouncementMsg = `User ${username} has joined`;
        socket.broadcast.emit('system-msg', newUserAnnouncementMsg)
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
    })
})

function updateOnlineUsers(operation, username, socketid) {
    if (operation.addUser == true) {
        if (!onlineUsers.has(username)) {
            onlineUsers.set(username, [socketid])
        }
        else {
            if (!(onlineUsers.get(username).includes(socketid))) {
                onlineUsers.get(username).push(socketid);
            }
        }
    }

    if (operation.removeUser == true) {
        onlineUsers.delete(username);
    }
}
