import { useSelector, useDispatch } from 'react-redux';
import { create, emit, listen } from '../../actions/socket-actions.js';

const useSocket = (socketApiUrl) => {
  const dispatch = useDispatch();
  dispatch(create(socketApiUrl));
  const socket = useSelector((state) => state.socket);
};

export { useSocket };
