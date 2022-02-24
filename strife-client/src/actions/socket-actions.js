import { UPDATE_SOCKET } from '../types/socket-types.js';

const updateSocket = (socket) => {
  return {
    type: UPDATE_SOCKET,
    payload: socket,
  };
};

export { updateSocket };
