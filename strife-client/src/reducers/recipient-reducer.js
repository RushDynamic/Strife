import { CHANGE_RECIPIENT } from '../actions/types.js';

const initialState = {
    username: "",
    publicKey: "",
    avatar: "",
    isRoom: false
}

export default function (state = initialState, action) {
    switch (action.type) {
        case CHANGE_RECIPIENT:
            return {
                username: action.payload.username, publicKey: action.payload.publicKey, avatar: action.payload.avatar, isRoom: action.payload.isRoom
            }
        default:
            return state;
    }
}