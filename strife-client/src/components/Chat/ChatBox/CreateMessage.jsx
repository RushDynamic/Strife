import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import chatSyles from '../../styles/chat-styles';
import { TextField, IconButton } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

export default function CreateMessage(props) {
  const classes = chatSyles();
  const recipient = useSelector((state) => state.recipient);
  const friendsList = useSelector((state) => state.friendsList);
  const [msgText, setMsgText] = useState('');
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
      sendMessage();
    }
  }

  function sendMessage() {
    props.sendMessage(newMsg);
    setMsgText('');
    setNewMsg({ message: '' });
  }

  const isRecipientOnline = () => {
    try {
      if (recipient.isRoom) return true;
      return (
        friendsList.filter(
          (friend) => friend.username === recipient.username,
        )[0].status === 'online'
      );
    } catch (err) {
      return false;
    }
  };

  return (
    <>
      <div className={classes.createMessageContainer}>
        <TextField
          id="filled-basic"
          value={msgText}
          label={
            isRecipientOnline()
              ? 'Say something'
              : `${recipient.username} is offline`
          }
          variant="filled"
          fullWidth
          onKeyDown={handleOnKeyDown}
          autoComplete="off"
          onChange={(event) => setMsgText(event.target.value)}
          autoFocus
          disabled={!isRecipientOnline()}
        />
        <IconButton
          onClick={() => sendMessage()}
          style={{ backgroundColor: 'transparent', margin: '0 0.5em 0 0.5em' }}
          size="large"
        >
          <SendIcon />
        </IconButton>
      </div>
    </>
  );
}
