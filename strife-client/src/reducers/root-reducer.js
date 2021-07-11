import { combineReducers } from "redux";
import recipientReducer from './recipient-reducer.js';
import notificationReducer from "./notification-reducer.js";

export default combineReducers({
    recipient: recipientReducer,
    notifications: notificationReducer
});