import React from 'react';
import useStyles from '../../styles/chat-styles';
import { motion } from 'framer-motion';
import { Typography } from '@mui/material';
import ChatMenu from './ChatMenu/ChatMenu.jsx';
import * as CONSTANTS from '../../../constants/strife-constants.js';
import MenuIcon from '@mui/icons-material/Menu';

export default function Header(props) {
  const classes = useStyles();

  return (
    <>
      <MenuIcon
        color="inherit"
        aria-label="open drawer"
        edge="start"
        onClick={props.handleDrawerToggle}
        style={{
          position: 'fixed',
          margin: '1rem',
          cursor: 'pointer',
          color: '#1fd1f9',
        }}
        sx={{ mr: 2, display: { md: 'block', lg: 'none' } }}
      />
      <div className={classes.headerContainer}>
        <motion.h1
          animate={{
            fontSize: '50px',
          }}
          className={classes.nonSelectable}
          style={{
            paddingTop: '20px',
            letterSpacing: '1px',
            fontFamily: "'Syncopate', sans-serif",
            marginBottom: '0px',
            background:
              '-webkit-linear-gradient(155deg, #7f5a83 0%, #1fd1f9 100%)',
            '-webkit-background-clip': 'text',
            '-webkit-text-fill-color': 'transparent',
          }}
        >
          strife
        </motion.h1>

        <Typography style={{ fontSize: '0.6rem' }}>
          {CONSTANTS.meta.appVersion}
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
