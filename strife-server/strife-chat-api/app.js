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
        if (!onlineUsers.has(username)) {
            onlineUsers.set(username, [socket.id])
        }
        else {
            if (!(onlineUsers.get(username).includes(socket.id))) {
                onlineUsers.get(username).push(socket.id);
            }
        }
        io.emit('new-user-online', Array.from(onlineUsers.keys()));
        console.log("Online Users: ", onlineUsers);
        const newUserAnnouncementMsg = `User ${username} has joined`;
        socket.broadcast.emit('system-msg', newUserAnnouncementMsg)
    })
    console.log("New connection ", socket.id)
    socket.on('add-msg', (message, socketid) => {
        const newMsg = { message: message, avatar: null, systemMsg: false };
        console.log(`${socketid} says: ${message}`);
        socket.broadcast.emit('echo-msg', newMsg, socketid);
    })
})

