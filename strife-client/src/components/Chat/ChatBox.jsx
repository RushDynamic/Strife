import React, { useEffect, useRef } from 'react';
import { Typography, Divider, IconButton } from '@material-ui/core';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import chatStyles from '../styles/chat-styles.js';
import CreateMessage from './CreateMessage.jsx';
import MessageBox from './MessageBox.jsx';
import Announcement from './Announcement.jsx';

function ChatBox(props) {

    // For automatically scrolling to the bottom of the chat
    const bottomOfChatDiv = useRef(null);
    var processedMsgListForUsers = [];
    var processedMsgListForRooms = [];

    useEffect(() => {
        bottomOfChatDiv.current.scrollIntoView({ behavior: 'smooth' });
    });

    function handleLeaveRoomClicked() {
        props.manageRooms("leave", props.recipient.username);
        props.setRecipient("");
    }

    function returnMemberNameComponent(memberName) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', marginLeft: '10px', marginBottom: '10px', boxSizing: 'border-box' }}>
                <FiberManualRecordIcon style={{ fontSize: '15px', color: 'green', paddingRight: '5px' }} />
                <Typography style={{
                    paddingRight: '10px',
                    letterSpacing: '1px',
                    fontFamily: "'Syne', sans-serif",
                    fontVariant: 'small-caps'
                }}>{memberName}</Typography>
            </div>
        );
    }

    const classes = chatStyles();
    return (
        <>
            <div className={classes.talkingToContainer} style={{ display: 'flex', alignItems: 'center' }} >
                <img hidden={props.recipient.isRoom} className={classes.expandFastOnHover} src={props.recipient.avatar} style={{ borderRadius: '20%', margin: '15px' }} height="50px" width="50px" />
                <Typography variant="h5" style={{
                    fontWeight: 'bold',
                    fontFamily: "'Syne', sans-serif",
                    letterSpacing: '2px',
                    margin: '15px',
                    marginBottom: '15px'
                }}>
                    {props.recipient.username}
                </Typography>
                {props.recipient.isRoom && <IconButton><ExitToAppIcon onClick={handleLeaveRoomClicked} /></IconButton>}
            </div>

            {props.recipient.isRoom && <div className={classes.onlineRoomMembers} style={{ display: 'flex', maxWidth: '100%' }}>
                <Typography style={{
                    marginLeft: '15px',
                    marginBottom: '10px',
                    letterSpacing: '1px',
                    fontFamily: "'Syne', sans-serif",
                    fontVariant: 'small-caps',
                    color: 'green'
                }}>
                    members:
                </Typography>
                {/* TODO: Make component clickable and show popup if more than 5 members */}
                {props.onlineMembers.get(props.recipient.username).length > 5 ?
                    returnMemberNameComponent(props.onlineMembers.get(props.recipient.username).length) :
                    props.onlineMembers.get(props.recipient.username).map((memberName) => {
                        return (returnMemberNameComponent(memberName));
                    })}
            </div>}
            <Divider light={true} style={{ width: '100%' }} />
            <div className={classes.messagesContainer} style={{ height: '70vh', overflowY: 'auto', overflowX: 'hidden' }}>
                {
                    // TODO: Clean and optimize this block
                    props.msgList.map((message, index) => {
                        if (message.isRoom) {
                            if (props.recipient.username == message.recipientUsername) {
                                if (!processedMsgListForRooms.includes(props.msgList[index].message)) {
                                    var newIndex = index + 1;
                                    var combinedMsgList = [message.message];
                                    while ((newIndex <= props.msgList.length - 1) && (props.msgList[newIndex].senderUsername == message.senderUsername)) {
                                        if (props.recipient.username == props.msgList[newIndex].recipientUsername) {
                                            combinedMsgList.push(props.msgList[newIndex].message);
                                            processedMsgListForRooms.push(props.msgList[newIndex].message);
                                        }
                                        newIndex++;
                                    }
                                    if (props.recipient.username == message.senderUsername || props.recipient.username == message.recipientUsername) {
                                        if (message.systemMsg) {
                                            return (<Announcement msg={message.message} />)
                                        }
                                        return (<MessageBox message={message} combinedMsgList={combinedMsgList} />)
                                    }
                                }
                            }
                        }
                        else {
                            if (!processedMsgListForUsers.includes(index)) {
                                var newIndex = index + 1;
                                var combinedMsgList = [message.message];
                                while ((newIndex <= props.msgList.length - 1) && (props.msgList[newIndex].senderUsername == message.senderUsername)) {
                                    combinedMsgList.push(props.msgList[newIndex].message);
                                    processedMsgListForUsers.push(newIndex);
                                    newIndex++;
                                }
                                if (props.recipient.username == message.senderUsername || props.recipient.username == message.recipientUsername) {
                                    if (message.systemMsg) {
                                        return (<Announcement msg={message.message} />)
                                    }
                                    return (<MessageBox message={message} combinedMsgList={combinedMsgList} />)
                                }
                            }
                        }
                    })
                }
                < div ref={bottomOfChatDiv} />
            </div>
            <div>
                <CreateMessage sendMessage={props.sendMessage} recipient={props.recipient} sender={props.sender} />
            </div>
        </>
    );
}

export default ChatBox;