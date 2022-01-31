import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Divider } from '@material-ui/core';
import chatStyles from '../../styles/chat-styles.js';
import CreateMessage from './CreateMessage.jsx';
import MessageBox from './MessageBox.jsx';
import Announcement from '../Announcement.jsx';
import TalkingTo from './Recipient/TalkingTo.jsx';
import PhoneBox from './Recipient/PhoneBox.jsx';
import OnlineRoomMembers from './Recipient/RoomDetails/OnlineRoomMembers.jsx';
import changeRecipient from '../../../actions/recipient-actions.js';

function ChatBox(props) {
  // For automatically scrolling to the bottom of the chat
  const bottomOfChatDiv = useRef(null);

  const recipient = useSelector((state) => state.recipient);
  const dispatch = useDispatch();
  var processedMsgListForUsers = [];
  var processedMsgListForRooms = [];

  useEffect(() => {
    bottomOfChatDiv.current.scrollIntoView({ behavior: 'smooth' });
  });

  function handleLeaveRoomClicked() {
    props.manageRooms('leave', recipient.username);
    dispatch(changeRecipient({ username: '', avatar: '', isRoom: false }));
  }

  const classes = chatStyles();
  return (
    <>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <TalkingTo
          recipient={recipient}
          handleLeaveRoomClicked={handleLeaveRoomClicked}
        />
      </div>
      {recipient.isRoom && (
        <OnlineRoomMembers onlineMembers={props.onlineMembers} />
      )}
      <Divider light={true} style={{ width: '100%' }} />
      <div
        className={classes.messagesContainer}
        style={{ height: '70vh', overflowY: 'auto', overflowX: 'hidden' }}
      >
        {
          // TODO: Clean and optimize this block
          props.msgList.map((message, index) => {
            if (message.isRoom) {
              if (recipient.username === message.recipientUsername) {
                if (
                  !processedMsgListForRooms.includes(
                    props.msgList[index].message,
                  )
                ) {
                  let newIndex = index + 1;
                  let combinedMsgList = [message.message];
                  while (
                    newIndex <= props.msgList.length - 1 &&
                    props.msgList[newIndex].senderUsername ===
                      message.senderUsername &&
                    props.msgList[newIndex].isRoom === true
                  ) {
                    if (
                      recipient.username ===
                      props.msgList[newIndex].recipientUsername
                    ) {
                      combinedMsgList.push(props.msgList[newIndex].message);
                      processedMsgListForRooms.push(
                        props.msgList[newIndex].message,
                      );
                    }
                    newIndex++;
                  }
                  if (
                    recipient.username === message.senderUsername ||
                    recipient.username === message.recipientUsername
                  ) {
                    if (message.systemMsg) {
                      return <Announcement key={index} msg={message.message} />;
                    }
                    return (
                      <MessageBox
                        key={index}
                        message={message}
                        combinedMsgList={combinedMsgList}
                      />
                    );
                  }
                }
              }
            } else {
              if (!processedMsgListForUsers.includes(index)) {
                let newIndex = index + 1;
                let combinedMsgList = [message.message];
                while (
                  newIndex <= props.msgList.length - 1 &&
                  props.msgList[newIndex].senderUsername ===
                    message.senderUsername &&
                  props.msgList[newIndex].isRoom !== true
                ) {
                  combinedMsgList.push(props.msgList[newIndex].message);
                  processedMsgListForUsers.push(newIndex);
                  newIndex++;
                }
                if (
                  recipient.username === message.senderUsername ||
                  recipient.username === message.recipientUsername
                ) {
                  if (message.systemMsg) {
                    return <Announcement key={index} msg={message.message} />;
                  }
                  return (
                    <MessageBox
                      key={index}
                      message={message}
                      combinedMsgList={combinedMsgList}
                    />
                  );
                }
              }
            }
          })
        }
        <div ref={bottomOfChatDiv} />
      </div>
      <div>
        <CreateMessage sendMessage={props.sendMessage} sender={props.sender} />
      </div>
    </>
  );
}

export default ChatBox;
