import React from 'react';
import { useDispatch } from 'react-redux';
import { ListItemIcon, IconButton, Badge } from '@material-ui/core';
import ChatBubbleIcon from '@material-ui/icons/ChatBubble';
import ChatIcon from '@material-ui/icons/Chat';
import CallIcon from '@material-ui/icons/Call';
import changeRecipient from '../../../../actions/recipient-actions.js';

function FriendButtons(props) {
  const dispatch = useDispatch();
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
        {returnButtons(props.unseen, props.friend.status)}
      </ListItemIcon>
    </>
  );
}

const returnButtons = (unseen, status) => {
  if (unseen && status === 'online')
    return (
      <>
        <IconButton size="medium">
          <Badge color="primary" variant="dot">
            <ChatIcon fontSize="small" />
          </Badge>
        </IconButton>
        <IconButton size="medium">
          <CallIcon fontSize="small" />
        </IconButton>
      </>
    );
  if (status === 'online')
    return (
      <>
        <IconButton size="medium">
          <ChatBubbleIcon fontSize="small" />
        </IconButton>
        <IconButton size="medium">
          <CallIcon fontSize="small" />
        </IconButton>
      </>
    );
  return (
    <>
      <IconButton size="medium" disabled>
        <ChatBubbleIcon fontSize="small" />
      </IconButton>
      <IconButton size="medium" disabled>
        <CallIcon fontSize="small" />
      </IconButton>
    </>
  );
};

export default FriendButtons;
