import { io } from 'socket.io-client';
import { CREATE, EMIT, LISTEN } from '../types/socket-types.js';

const initialState = null;
export default function socketUpdate(state = initialState, action) {
  switch (action.type) {
    case CREATE:
      state = io.connect(action.payload);
      return state;
    case EMIT:
      state.emit(state, action.payload);
      return state;
    case LISTEN:
      state.on(action.payload.event, (args) => {
        action.payload.callback(args);
      });
      return state;
    default:
      return state;
  }
}
