const io = require("socket.io")(5000, {
    cors: {
        origin: ["http://localhost:3000"]
    }
})

io.on('connect', socket => {
    console.log("New connection ", socket.id)
    socket.on('add-msg', (message, socketid) => {
        console.log(`${socketid} says: ${message}`);
        socket.broadcast.emit('echo-msg', message, socketid);
    })
})

