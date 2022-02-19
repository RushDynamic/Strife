import { CREATE, EMIT, LISTEN } from '../types/socket-types.js';

const create = (socketApiUrl) => {
  return {
    type: CREATE,
    payload: socketApiUrl,
  };
};

const emit = (e, msg) => {
  return {
    type: EMIT,
    payload: {
      event: e,
      message: msg,
    },
  };
};

const listen = (e, cb) => {
  return {
    type: LISTEN,
    payload: {
      event: e,
      callback: cb,
    },
  };
};

export { create, emit, listen };
