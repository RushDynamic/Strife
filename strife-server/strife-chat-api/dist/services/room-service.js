"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.manage = exports.getUserRooms = exports.getTotalRooms = void 0;
var onlineRoomsMap = new Map();
var userRoomsMap = new Map();
const getTotalRooms = () => {
    return onlineRoomsMap.size;
};
exports.getTotalRooms = getTotalRooms;
const getUserRooms = (username) => {
    return userRoomsMap.get(username);
};
exports.getUserRooms = getUserRooms;
const create = (roomname, username, callback) => {
    console.log('Creating room:', roomname);
    if (!onlineRoomsMap.has(roomname)) {
        onlineRoomsMap.set(roomname, []);
        callback({
            status: 'success',
            members: [username],
        });
    }
    else {
        callback({
            status: 'failure',
        });
    }
};
// TODO: fix this after creating messaging service (userMessagesMap is not defined)
// const remove = (roomname) => {
//   onlineRoomsMap.delete(roomname);
//   if (userMessagesMap.has(roomname)) {
//     userMessagesMap.delete(roomname);
//   }
//   io.emit('rooms-list', 'rooms-count-update', onlineRoomsMap.size);
// };
const join = (roomname, socket, callback) => {
    if (onlineRoomsMap.has(roomname)) {
        socket.join(roomname);
        if (!onlineRoomsMap.get(roomname).includes(socket.username)) {
            onlineRoomsMap.get(roomname).push(socket.username);
        }
        // Update userRoomsMap as well
        var userRoomsList = [];
        if (userRoomsMap.has(socket.username))
            userRoomsList = userRoomsMap.get(socket.username);
        if (!userRoomsList.includes(roomname)) {
            userRoomsList.push(roomname);
            userRoomsMap.set(socket.username, userRoomsList);
        }
        // Send updated memberslist to client
        socket
            .to(roomname)
            .emit('updated-room-members', roomname, onlineRoomsMap.get(roomname));
        callback({
            status: 'success',
            members: onlineRoomsMap.get(roomname),
        });
    }
    else {
        callback({
            status: 'failure',
        });
    }
};
const leave = (roomname, socket) => {
    if (onlineRoomsMap.has(roomname) &&
        onlineRoomsMap.get(roomname).includes(socket.username)) {
        socket.leave(roomname);
        var onlineUsersInRoom = onlineRoomsMap.get(roomname);
        onlineUsersInRoom = onlineUsersInRoom.filter((user) => user != socket.username);
        // TODO: disband room if no one is online
        // if (onlineUsersInRoom.length == 0) {
        //   onlineRoomsMap.delete(roomname);
        //   if (userMessagesMap.has(roomname)) {
        //     userMessagesMap.delete(roomname);
        //   }
        //   io.emit('rooms-list', 'rooms-count-update', onlineRoomsMap.size);
        // } else
        onlineRoomsMap.set(roomname, onlineUsersInRoom);
        // Update userRoomsMap as well
        var userRoomsList = [];
        if (userRoomsMap.has(socket.username))
            userRoomsList = userRoomsMap.get(socket.username);
        userRoomsList = userRoomsList.filter((room) => room != roomname);
        userRoomsMap.set(socket.username, userRoomsList);
        // Send updated memberslist to client
        socket
            .to(roomname)
            .emit('updated-room-members', roomname, onlineRoomsMap.get(roomname));
    }
};
const leaveAll = (socket) => {
    if (!userRoomsMap.has(socket === null || socket === void 0 ? void 0 : socket.username))
        return;
    const userRoomsList = userRoomsMap.get(socket.username);
    userRoomsList.map((room) => {
        socket.leave(room);
        var onlineUsersInRoom = onlineRoomsMap.get(room);
        onlineUsersInRoom = onlineUsersInRoom.filter((user) => user != socket.username);
        socket.to(room).emit('updated-room-members', room, onlineUsersInRoom);
        // Disband room if no one is online
        if (onlineUsersInRoom.length == 0) {
            //remove(room);
        }
        else
            onlineRoomsMap.set(room, onlineUsersInRoom);
    });
    userRoomsMap.delete(socket.username);
};
const manage = (action, roomname, socket, callback) => {
    switch (action) {
        case 'create':
            create(roomname, socket.username, callback);
            break;
        case 'join':
            join(roomname, socket, callback);
            break;
        case 'leave':
            leave(roomname, socket);
            break;
        case 'leaveAll':
            leaveAll(socket);
        // case 'remove':
        //   remove(roomname);
        //   break;
    }
};
exports.manage = manage;
