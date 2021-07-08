import { combineReducers } from "redux";
import recipientReducer from './recipient-reducer.js';

export default combineReducers({
    recipient: recipientReducer
});