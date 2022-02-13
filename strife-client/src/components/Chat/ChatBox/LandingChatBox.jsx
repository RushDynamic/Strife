import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { Typography } from '@mui/material';
import { UserContext } from '../../../UserContext';
import * as CONSTANTS from '../../../constants/strife-constants.js';
import { pickRandomElement } from '../../../utils/utils';
import chatStyles from '../../styles/chat-styles';

function LandingChatBox() {
  const { user } = useContext(UserContext);
  const classes = chatStyles();

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          height: '70vh',
        }}
      >
        <img
          alt="friendly_robot"
          className={`${classes.nonSelectable} ${classes.expandOnHover}`}
          src={process.env.PUBLIC_URL + '/images/chatbot.svg'}
          height="80%"
          width="80%"
        />
        <Typography
          variant="h4"
          style={{ padding: '0 0.5rem 0 0.5rem' }}
          className={classes.nonSelectable}
        >
          Hey {user.username},
        </Typography>
        <Typography
          style={{ fontFamily: "'Rubik', sans-serif", padding: '1rem' }}
          className={classes.nonSelectable}
        >
          {pickRandomElement(CONSTANTS.welcomeMessages)}
        </Typography>
      </motion.div>
    </>
  );
}

export default LandingChatBox;
