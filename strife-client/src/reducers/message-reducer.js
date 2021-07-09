import { ADD_MESSAGE, UPDATE_MESSAGES } from "../actions/types.js";

export default function (state = { msgList: [] }, action) {
    switch (action.type) {
        case ADD_MESSAGE:
            return { msgList: [...state.msgList, action.payload] };
        case UPDATE_MESSAGES:
            return { msgList: action.payload }
        default: return state;
    }
}