import React from 'react';
import useStyles from '../../styles/chat-styles';
import { motion } from 'framer-motion';
import { Typography } from '@mui/material';
import ChatMenu from './ChatMenu/ChatMenu.jsx';
import constants from '../../../constants/strife-constants.js';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';

export default function Header(props) {
  const classes = useStyles();

  return (
    <>
      <div className={classes.headerContainer}>
        <motion.h1
          animate={{ fontSize: '50px' }}
          className={classes.nonSelectable}
          style={{
            paddingTop: '20px',
            letterSpacing: '1px',
            fontFamily: "'Syncopate', sans-serif",
            marginBottom: '0px',
          }}
        >
          strife
        </motion.h1>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={props.handleDrawerToggle}
          sx={{ mr: 2, display: { md: 'block', lg: 'none' } }}
        >
          <MenuIcon />
        </IconButton>
        <Typography style={{ fontSize: '0.6rem' }}>
          {constants.APP_VERSION}
        </Typography>
        {/* TODO: Add login/logout/control buttons under the header */}
        {props.loaded && (
          <ChatMenu
            requestFriendsList={props.requestFriendsList}
            manageRooms={props.manageRooms}
          />
        )}
      </div>
    </>
  );
}
