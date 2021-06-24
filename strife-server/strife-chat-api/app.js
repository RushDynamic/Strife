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
    })
    console.log("New connection ", socket.id)
    socket.on('add-msg', (message, socketid) => {
        console.log(`${socketid} says: ${message}`);
        socket.broadcast.emit('echo-msg', message, socketid);
    })
})

