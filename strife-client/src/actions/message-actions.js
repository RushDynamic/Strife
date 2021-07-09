import { UPDATE_MESSAGES } from "./types.js";

const updateMessages = (newMsg) => {
    return {
        type: UPDATE_MESSAGES,
        payload: newMsg
    }
}

export default updateMessages;