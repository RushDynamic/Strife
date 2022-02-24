import { ADD_STAGE } from '../types/loading-types.js';

const finishStage = (stage) => {
  return {
    type: ADD_STAGE,
    payload: stage,
  };
};
export { finishStage };
