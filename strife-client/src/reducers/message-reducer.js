import { UPDATE_MESSAGES } from "../actions/types.js";

export default function (state = { msgList: [] }, action) {
    switch (action.type) {
        case UPDATE_MESSAGES:
            return { msgList: [...state.msgList, action.payload] };
        default: return state;
    }
}