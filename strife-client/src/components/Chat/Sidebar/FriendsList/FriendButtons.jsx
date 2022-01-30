import React from 'react';
import { useDispatch } from 'react-redux';
import { ListItemIcon, IconButton, Badge } from '@material-ui/core';
import { BiPhone } from 'react-icons/bi';
import { BsFillChatSquareFill, BsFillChatSquareTextFill } from 'react-icons/bs';
import changeRecipient from '../../../../actions/recipient-actions.js';

function FriendButtons(props) {
  const dispatch = useDispatch();
  const dispatchChangeRecipient = () => {
    dispatch(
      changeRecipient({
        username: props.friend.username,
        avatar: props.friend.avatar,
        publicKey: props.friend.publicKey,
        isRoom: false,
        isCallIncoming: false,
      }),
    );
  };
  return (
    <>
      <ListItemIcon onClick={() => dispatchChangeRecipient()}>
        {returnChatButton(props.unseen, props.friend.status)}
      </ListItemIcon>
      <ListItemIcon
        onClick={() => {
          dispatchChangeRecipient();
          props.createCall();
        }}
      >
        {returnCallButton(props.friend.status)}
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

const returnCallButton = (status) => {
  return (
    <>
      <IconButton size="medium" disabled={status !== 'online'}>
        <BiPhone fontSize="small" />
      </IconButton>
    </>
  );
};

export default FriendButtons;
