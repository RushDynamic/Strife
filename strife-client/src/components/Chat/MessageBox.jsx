import React from 'react';
import Avatar from './Avatar.jsx';
import chatStyles from '../styles/chat-styles.js';
import moment from 'moment';

export default function MessageBox(props) {
    const colors = ['#6ee429', '#4ab2a7', '#2366cb', '#3abefb', '#6efccf', '#b12da4', '#d7db05', '#f97a12', '#a186e1', '#d11265'];
    const classes = chatStyles();

    function returnMsgTextContainer(msg) {
        return (<div className={classes.messageTextContainer} style={{
            fontFamily: "'Rubik', sans-serif",
            fontSize: '1rem',
            margin: '2.5px'
        }}>{msg}</div>)
    }

    return (
        <>
            <div className={classes.messageBoxContainer}>
                <div className={classes.outerMessageBoxContainer} style={{ display: 'flex', alignItems: 'center' }}>
                    <div className={classes.avatarMessageBoxContainer} style={{ padding: '10px' }}>
                        <Avatar avatarUrl={props.message.avatar} />
                    </div>
                    <div className={classes.innerMessageBoxContainer} style={{ padding: '10px' }}>
                        <div className={classes.usernameTimeBox} style={{ display: 'flex', alignItems: 'center' }}>
                            <div style={{
                                fontWeight: 'bold',
                                fontVariant: 'small-caps',
                                fontFamily: "'Syne', sans-serif",
                                fontSize: '1rem',
                                color: colors[(props.message.senderUsername.length + props.message.senderUsername.charCodeAt(0) + new Date().getDate()) % 10]
                            }}>
                                {props.message.senderUsername}
                            </div>
                            <div style={{
                                fontWeight: 'bold',
                                paddingLeft: '8px',
                                fontFamily: "'Rubik', sans-serif",
                                fontSize: '0.6rem',
                                color: '#7d7d7d'
                            }}>{moment(props.message.timestamp).format('h:mm a')}</div>
                        </div>
                        {
                            props.combinedMsgList.length > 0 ?
                                props.combinedMsgList.map((message) => returnMsgTextContainer(message)) :
                                returnMsgTextContainer(props.message.message)
                        }
                    </div>
                </div>
            </div>
        </>
    );
}