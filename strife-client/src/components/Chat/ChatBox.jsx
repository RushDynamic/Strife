import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Typography, Divider, IconButton, Dialog, DialogContent, List, ListItem, ListItemText } from '@material-ui/core';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import chatStyles from '../styles/chat-styles.js';
import CreateMessage from './CreateMessage.jsx';
import MessageBox from './MessageBox.jsx';
import Announcement from './Announcement.jsx';
import changeRecipient from '../../actions/recipient-actions.js';

function ChatBox(props) {

    // For automatically scrolling to the bottom of the chat
    const bottomOfChatDiv = useRef(null);

    const recipient = useSelector(state => state.recipient);
    const messages = useSelector(state => state.messages);
    const dispatch = useDispatch();
    const [showDetailedMembers, setShowDetailedMembers] = useState(false);
    const processedMsgListForUsers = useRef([]);
    const processedMsgListForRooms = useRef([]);

    useEffect(() => {
        bottomOfChatDiv.current.scrollIntoView({ behavior: 'smooth' });
    });

    function handleLeaveRoomClicked() {
        props.manageRooms("leave", recipient.username);
        dispatch(changeRecipient({ username: "", avatar: "", isRoom: false }));
    }

    function returnMemberNameComponent(memberName, showDetailed) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', marginLeft: '10px', marginBottom: '10px', boxSizing: 'border-box' }}>
                <FiberManualRecordIcon style={{ fontSize: '15px', color: '#80FF00', paddingRight: '5px' }} />
                <Typography style={{
                    paddingRight: '10px',
                    letterSpacing: '1px',
                    fontFamily: "'Syne', sans-serif",
                    fontVariant: 'small-caps',
                    cursor: 'pointer'
                }}
                    onClick={showDetailed ? () => { setShowDetailedMembers(true) } : () => { }}
                >{memberName}</Typography>
            </div>
        );
    }

    const classes = chatStyles();
    return (
        <>
            <div className={classes.talkingToContainer} style={{ display: 'flex', alignItems: 'center' }} >
                <img hidden={recipient.isRoom} className={classes.expandFastOnHover} src={recipient.avatar} style={{ borderRadius: '20%', margin: '15px' }} height="50px" width="50px" />
                <Typography variant="h5" style={{
                    fontWeight: 'bold',
                    fontFamily: "'Syne', sans-serif",
                    letterSpacing: '2px',
                    margin: '15px',
                    marginBottom: '15px'
                }}>
                    {recipient.username}
                </Typography>
                {recipient.isRoom && <IconButton><ExitToAppIcon onClick={handleLeaveRoomClicked} /></IconButton>}
            </div>

            {recipient.isRoom && <div className={classes.onlineRoomMembers} style={{ display: 'flex', maxWidth: '100%' }}>
                <Typography style={{
                    marginLeft: '15px',
                    marginBottom: '10px',
                    letterSpacing: '1px',
                    fontFamily: "'Syne', sans-serif",
                    fontVariant: 'small-caps',
                    color: '#80FF00'
                }}>
                    members:
                </Typography>
                {/* TODO: Make component clickable and show popup if more than 5 members */}
                {props.onlineMembers.get(recipient.username).length > 5 ?
                    returnMemberNameComponent(props.onlineMembers.get(recipient.username).length, true) :
                    props.onlineMembers.get(recipient.username).map((memberName) => {
                        return (returnMemberNameComponent(memberName, false));
                    })}
            </div>}
            <Divider light={true} style={{ width: '100%' }} />
            <div className={classes.messagesContainer} style={{ height: '70vh', overflowY: 'auto', overflowX: 'hidden' }}>
                {
                    // TODO: Clean and optimize this block
                    messages.msgList.map((message, index) => {
                        if (message.isRoom) {
                            if (recipient.username == message.recipientUsername) {
                                if (!processedMsgListForRooms.current.includes(messages.msgList[index].message)) {
                                    var newIndex = index + 1;
                                    var combinedMsgList = [message.message];
                                    while ((newIndex <= messages.msgList.length - 1) && (messages.msgList[newIndex].senderUsername == message.senderUsername)) {
                                        if (recipient.username == messages.msgList[newIndex].recipientUsername) {
                                            combinedMsgList.push(messages.msgList[newIndex].message);
                                            processedMsgListForRooms.current.push(messages.msgList[newIndex].message);
                                        }
                                        newIndex++;
                                    }
                                    if (recipient.username == message.senderUsername || recipient.username == message.recipientUsername) {
                                        if (message.systemMsg) {
                                            return (<Announcement msg={message.message} />)
                                        }
                                        return (<MessageBox message={message} combinedMsgList={combinedMsgList} />)
                                    }
                                }
                            }
                        }
                        else {
                            if (!processedMsgListForUsers.current.includes(index)) {
                                var newIndex = index + 1;
                                var combinedMsgList = [message.message];
                                while ((newIndex <= messages.msgList.length - 1) && (messages.msgList[newIndex].senderUsername == message.senderUsername)) {
                                    combinedMsgList.push(messages.msgList[newIndex].message);
                                    processedMsgListForUsers.current.push(newIndex);
                                    newIndex++;
                                }
                                if (recipient.username == message.senderUsername || recipient.username == message.recipientUsername) {
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
                <CreateMessage sendMessage={props.sendMessage} sender={props.sender} />
            </div>

            {/* For showing detailed members list */}
            <Dialog open={showDetailedMembers} onClose={() => setShowDetailedMembers(false)} autoFocus={false}>
                <DialogContent>
                    {props.onlineMembers.has(recipient.username) &&
                        props.onlineMembers.get(recipient.username).map((memberName) => {
                            return (<List>
                                <ListItem>
                                    <FiberManualRecordIcon style={{ fontSize: '15px', color: '#80FF00', paddingRight: '5px' }} />
                                    <ListItemText
                                        primary={<Typography style={{ fontFamily: "'Rubik', sans-serif" }}>{memberName}</Typography>}
                                    />
                                </ListItem>
                            </List>);
                        })}
                </DialogContent>
            </Dialog>
        </>
    );
}

export default ChatBox;