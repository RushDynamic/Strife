import { ADD_UNSEEN, REMOVE_UNSEEN } from "../actions/types";

export default function notificationUpdate(state = { unseenMsgUserList: [] }, action) {
    switch (action.type) {
        case ADD_UNSEEN: return {
            unseenMsgUserList: [...state.unseenMsgUserList, action.payload]
        };

        case REMOVE_UNSEEN: return {
            unseenMsgUserList: state.unseenMsgUserList.filter(username => username !== action.payload)
        }

        default: return state;
    }
}