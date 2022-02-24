import { ADD_UNSEEN, REMOVE_UNSEEN } from '../types/notification-types.js';

export const addUnseen = (username) => {
  return {
    type: ADD_UNSEEN,
    payload: username,
  };
};

export const removeUnseen = (username) => {
  return {
    type: REMOVE_UNSEEN,
    payload: username,
  };
};
