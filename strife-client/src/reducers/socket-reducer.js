import { UPDATE_SOCKET } from '../types/socket-types.js';

const initialState = null;

const updateSocket = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_SOCKET:
      return action.payload;
    default:
      return state;
  }
};

export default updateSocket;
