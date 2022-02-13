import React, { useContext, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Typography } from '@mui/material';
import { UserContext } from '../../../UserContext';
import * as CONSTANTS from '../../../constants/strife-constants.js';
import {
  pickRandomElement,
  pickRandomBetweenRange,
} from '../../../utils/utils';
import chatStyles from '../../styles/chat-styles';

function LandingChatBox() {
  const { user } = useContext(UserContext);
  const memoizedIndex = useMemo(() => pickRandomBetweenRange(1, 20), []);
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
          justifyContent: 'space-around',
          height: '70vh',
        }}
      >
        <img
          alt="friendly_robot"
          className={`${classes.nonSelectable} ${classes.expandOnHover}`}
          src={
            process.env.PUBLIC_URL + `/images/welcome/illu${memoizedIndex}.svg`
          }
          height="60%"
          width="60%"
          style={{ margin: '1rem' }}
        />
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
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
        </div>
      </motion.div>
    </>
  );
}

export default LandingChatBox;
