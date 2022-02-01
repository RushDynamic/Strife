import { combineReducers } from 'redux';
import recipientReducer from './recipient-reducer.js';
import notificationReducer from './notification-reducer.js';
import callDataReducer from './call-data-reducer.js';

export default combineReducers({
  recipient: recipientReducer,
  notifications: notificationReducer,
  callData: callDataReducer,
});
