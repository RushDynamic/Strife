import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import chatSyles from '../../styles/chat-styles';
import { TextField, IconButton } from '@material-ui/core';
import NoteAddIcon from '@material-ui/icons/NoteAdd';
import SendIcon from '@material-ui/icons/Send';

export default function CreateMessage(props) {
  const classes = chatSyles();
  const recipient = useSelector((state) => state.recipient);
  const [msgText, setMsgText] = useState('');
  // TODO: Remove this default avatar URL and fetch user's own avatar
  const [newMsg, setNewMsg] = useState({
    message: '',
    avatar: props.sender.avatar,
    systemMsg: false,
    recipientUsername: recipient.username,
    senderUsername: props.sender.username,
  });

  useEffect(() => {
    if (msgText !== '') {
      setNewMsg({
        message: msgText,
        avatar: props.sender.avatar,
        systemMsg: false,
        recipientUsername: recipient.username,
        senderUsername: props.sender.username,
        senderPubKey: props.sender.publicKey,
        timestamp: new Date().getTime(),
        isRoom: recipient.isRoom,
      });
    }
  }, [msgText]);

  function handleOnKeyDown(e) {
    if (e.keyCode === 13) {
      props.sendMessage(newMsg);
      setMsgText('');
    }
  }

  return (
    <>
      <div className={classes.createMessageContainer}>
        <TextField
          id="filled-basic"
          value={msgText}
          label="Say something"
          variant="filled"
          fullWidth
          onKeyDown={handleOnKeyDown}
          autoComplete="off"
          onChange={(event) => setMsgText(event.target.value)}
          autoFocus
        />
        <IconButton
          onClick={() => props.sendMessage(newMsg)}
          style={{ backgroundColor: 'transparent', marginLeft: '15px' }}
        >
          <SendIcon />
        </IconButton>
        <IconButton
          style={{ backgroundColor: 'transparent', marginLeft: '15px' }}
        >
          <NoteAddIcon />
        </IconButton>
      </div>
    </>
  );
}
