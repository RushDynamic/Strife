import React, { useContext, useEffect, useRef } from 'react';
import { Typography } from '@material-ui/core';
import { UserContext } from '../../UserContext';
import chatStyles from '../styles/chat-styles';

function LandingChatBox() {
    const { user } = useContext(UserContext);
    const classes = chatStyles();
    return (
        <>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '70vh' }}>
                <img className={classes.nonSelectable} src={process.env.PUBLIC_URL + '/images/chatbot.svg'} height="600" width="600" />
                <Typography variant="h2" className={classes.nonSelectable}>
                    Hey {user.username},
                </Typography>
                <Typography variant="h4" style={{ fontFamily: "'Rubik', sans-serif" }} className={classes.nonSelectable}>
                    why don't you talk to someone about it?
                </Typography>
            </div>
        </>
    )
}

export default LandingChatBox;