import { CHANGE_CALL_DATA } from '../types/calldata-types.js';

const initialState = {
  participant: '',
  callDuration: '',
  isCallIncoming: false,
  isCallActive: false,
  isCallConnected: false,
};

export default function callDataUpdate(state = initialState, action) {
  switch (action?.type) {
    case CHANGE_CALL_DATA:
      return {
        participant: action?.payload?.participant,
        callDuration: action?.payload?.callDuration,
        isCallIncoming: action?.payload?.isCallIncoming,
        isCallActive: action?.payload?.isCallActive,
        isCallConnected: action?.payload?.isCallConnected,
      };
    default:
      return state;
  }
}
