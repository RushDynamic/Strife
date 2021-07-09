import { combineReducers } from "redux";
import recipientReducer from './recipient-reducer.js';
import messageReducer from "./message-reducer.js";

export default combineReducers({
    recipient: recipientReducer,
    messages: messageReducer
});