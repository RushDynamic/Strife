import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { IconButton, Badge } from '@mui/material';
import { BiPhone } from 'react-icons/bi';
import { BsFillChatSquareFill, BsFillChatSquareTextFill } from 'react-icons/bs';
import changeRecipient from '../../../../actions/recipient-actions.js';

function FriendButtons(props) {
  const dispatch = useDispatch();
  const callData = useSelector((state) => state.callData);

  const handleClickChat = () => {
    dispatch(
      changeRecipient({
        username: props.friend.username,
        avatar: props.friend.avatar,
        publicKey: props.friend.publicKey,
        isRoom: false,
      }),
    );
  };

  const handleCreateCall = () => {
    props.createCall(props.friend.username);
  };

  return (
    <div style={{ display: 'flex' }}>
      {returnChatButton(props.unseen, props.friend.status, handleClickChat)}
      {returnCallButton(props.friend.status, callData, handleCreateCall)}
    </div>
  );
}

const returnChatButton = (unseen, status, handleClickChat) => {
  return (
    <>
      <IconButton
        size="medium"
        disabled={status !== 'online'}
        onClick={() => handleClickChat()}
      >
        {unseen && status === 'online' ? (
          <Badge color="primary" variant="dot">
            <BsFillChatSquareTextFill fontSize="small" />
          </Badge>
        ) : (
          <BsFillChatSquareFill fontSize="small" />
        )}
      </IconButton>
    </>
  );
};

const returnCallButton = (status, callData, handleCreateCall) => {
  return (
    <>
      <IconButton
        size="medium"
        disabled={status !== 'online' || callData.isCallActive}
        onClick={() => handleCreateCall()}
      >
        <BiPhone fontSize="small" />
      </IconButton>
    </>
  );
};

export default FriendButtons;
