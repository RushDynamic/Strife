import { useState } from 'react';
import { useSelector } from 'react-redux';
import * as socketService from '../services/socket-service.js';

const useRoom = (user) => {
  const socket = useSelector((state) => state.socket);
  const [userRoomsList, setUserRoomsList] = useState([]);
  const [onlineMembers, setOnlineMembers] = useState(new Map());
  const [onlineRoomsCount, setOnlineRoomsCount] = useState([]);

  function manageRoom(action, roomname, callback) {
    switch (action) {
      case 'join':
        console.log('Joining room:', roomname);
        socketService.emit(socket, 'join-room', roomname, [
          user.username,
          (response) => {
            if (response.status === 'success') {
              const updatedRoomMembers =
                response.members !== null && response.members !== undefined
                  ? response.members
                  : [];
              setOnlineMembers(
                new Map(onlineMembers.set(roomname, updatedRoomMembers)),
              );
              callback(true, roomname);
            } else callback(false, roomname);
          },
        ]);
        break;

      case 'create':
        console.log('Creating room:', roomname);
        socketService.emit(socket, 'create-room', roomname, [
          user.username,
          (response) => {
            if (response.status === 'success') {
              const updatedRoomMembers =
                response.members !== null && response.members !== undefined
                  ? response.members
                  : [];
              setOnlineMembers(
                new Map(onlineMembers.set(roomname, updatedRoomMembers)),
              );
              callback(true, roomname);
            } else callback(false, roomname);
          },
        ]);
        break;

      case 'leave':
        console.log('Leaving room:', roomname);
        socketService.emit(socket, 'leave-room', roomname, [user.username]);
        break;
      default:
        console.log('Invalid room action');
    }
  }

  const roomMembers = {
    map: onlineMembers,
    set: setOnlineMembers,
  };

  const roomsUser = {
    list: userRoomsList,
    set: setUserRoomsList,
  };

  const roomsGlobal = {
    count: onlineRoomsCount,
    set: setOnlineRoomsCount,
  };

  return [manageRoom, roomMembers, roomsUser, roomsGlobal];
};

export default useRoom;
