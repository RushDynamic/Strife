import { CHANGE_RECIPIENT } from '../actions/types.js';

const initialState = {
  username: '',
  avatar: '',
  publicKey: '',
  isRoom: false,
  isCallIncoming: false,
};

export default function recipientUpdate(state = initialState, action) {
  switch (action.type) {
    case CHANGE_RECIPIENT:
      return {
        username: action.payload.username,
        avatar: action.payload.avatar,
        publicKey: action.payload.publicKey,
        isRoom: action.payload.isRoom,
        isCallIncoming: action.payload?.isCallIncoming,
      };
    default:
      return state;
  }
}
