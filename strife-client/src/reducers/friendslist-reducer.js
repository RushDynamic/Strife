import { UPDATE_FRIENDSLIST } from '../types/friendslist-types';

const initialState = [];

export default function updateFriendsList(state = initialState, action) {
  switch (action.type) {
    case UPDATE_FRIENDSLIST:
      return action.payload;
    default:
      return state;
  }
}
