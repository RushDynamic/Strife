import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ListItemIcon, IconButton, Badge } from '@mui/material';
import { BiPhone } from 'react-icons/bi';
import { BsFillChatSquareFill, BsFillChatSquareTextFill } from 'react-icons/bs';
import changeRecipient from '../../../../actions/recipient-actions.js';

function FriendButtons(props) {
  const dispatch = useDispatch();
  const callData = useSelector((state) => state.callData);
  return (
    <>
      <ListItemIcon
        onClick={() =>
          dispatch(
            changeRecipient({
              username: props.friend.username,
              avatar: props.friend.avatar,
              publicKey: props.friend.publicKey,
              isRoom: false,
            }),
          )
        }
      >
        {returnChatButton(props.unseen, props.friend.status)}
      </ListItemIcon>
      <ListItemIcon
        onClick={() => {
          props.createCall(props.friend.username);
        }}
      >
        {returnCallButton(props.friend.status, callData)}
      </ListItemIcon>
    </>
  );
}

const returnChatButton = (unseen, status) => {
  return (
    <>
      <IconButton size="medium" disabled={status !== 'online'}>
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

const returnCallButton = (status, callData) => {
  return (
    <>
      <IconButton
        size="medium"
        disabled={status !== 'online' || callData.isCallActive}
      >
        <BiPhone fontSize="small" />
      </IconButton>
    </>
  );
};

export default FriendButtons;
