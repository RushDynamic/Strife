import { CHANGE_RECIPIENT } from '../actions/types.js';

const initialState = {
  username: '',
  avatar: '',
  publicKey: '',
  isRoom: false,
};

export default function recipientUpdate(state = initialState, action) {
  switch (action.type) {
    case CHANGE_RECIPIENT:
      return {
        username: action.payload.username,
        avatar: action.payload.avatar,
        publicKey: action.payload.publicKey,
        isRoom: action.payload.isRoom,
      };
    default:
      return state;
  }
}
