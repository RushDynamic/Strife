import { CHANGE_CALL_DATA } from '../types/calldata-types.js';

const changeCallData = (callData) => {
  return {
    type: CHANGE_CALL_DATA,
    payload: callData,
  };
};

export default changeCallData;
