import { ADD_MESSAGE, UPDATE_MESSAGES } from "./types.js";

export const addMessage = (newMsg) => {
    return {
        type: ADD_MESSAGE,
        payload: newMsg
    }
}

export const updateMessages = (newMsgList) => {
    return {
        type: UPDATE_MESSAGES,
        payload: newMsgList
    }
}