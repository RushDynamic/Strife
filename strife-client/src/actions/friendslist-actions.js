import { UPDATE_FRIENDSLIST } from '../types/friendslist-types';

const updateFriendsList = (friendsList) => {
  return {
    type: UPDATE_FRIENDSLIST,
    payload: friendsList,
  };
};

export { updateFriendsList };
