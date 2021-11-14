import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { Typography } from '@material-ui/core';
import { UserContext } from '../../UserContext';
import chatStyles from '../styles/chat-styles';

function LandingChatBox() {
    const { user } = useContext(UserContext);
    const classes = chatStyles();

    return (
        <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '70vh' }}>
                <img alt="friendly_robot" className={`${classes.nonSelectable} ${classes.expandOnHover}`} src={process.env.PUBLIC_URL + '/images/chatbot.svg'} height="600" width="600" />
                <Typography variant="h2" className={classes.nonSelectable}>
                    Hey {user.username},
                </Typography>
                <Typography variant="h4" style={{ fontFamily: "'Rubik', sans-serif" }} className={classes.nonSelectable}>
                    why don't you talk to someone about it?
                </Typography>
            </motion.div>
        </>
    )
}

export default LandingChatBox;