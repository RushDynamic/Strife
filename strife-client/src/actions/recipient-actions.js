import { CHANGE_RECIPIENT } from '../types/recipient-types.js';

const changeRecipient = (recipient) => {
  return {
    type: CHANGE_RECIPIENT,
    payload: recipient,
  };
};

export default changeRecipient;
