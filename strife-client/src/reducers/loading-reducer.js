import { ADD_STAGE } from '../types/loading-types.js';
import { loading as CONSTANTS } from '../constants/strife-constants.js';
const initialState = {
  stages: [],
  loaded: false,
};

export default function updateLoadingStages(state = initialState, action) {
  switch (action.type) {
    case ADD_STAGE:
      const stages = state.stages.includes(action.payload)
        ? [...state.stages]
        : [...state.stages, action.payload];
      const loaded =
        stages.includes(CONSTANTS.loggedIn) &&
        stages.includes(CONSTANTS.socketConnected) &&
        stages.includes(CONSTANTS.fetchedFriendsList)
          ? true
          : false;
      return {
        stages: stages,
        loaded: loaded,
      };
    default:
      return state;
  }
}
