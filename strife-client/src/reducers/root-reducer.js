import { combineReducers } from 'redux';
import recipientReducer from './recipient-reducer.js';
import notificationReducer from './notification-reducer.js';
import callDataReducer from './calldata-reducer.js';
import friendsListReducer from './friendslist-reducer.js';
import loadingReducer from './loading-reducer.js';
import socketReducer from './socket-reducer.js';

export default combineReducers({
  recipient: recipientReducer,
  notifications: notificationReducer,
  callData: callDataReducer,
  friendsList: friendsListReducer,
  loading: loadingReducer,
  socket: socketReducer,
});
