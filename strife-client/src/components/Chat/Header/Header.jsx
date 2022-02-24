import React from 'react';
import { useSelector } from 'react-redux';
import useStyles from '../../styles/chat-styles';
import { motion } from 'framer-motion';
import { Typography, Badge } from '@mui/material';
import ChatMenu from './ChatMenu/ChatMenu.jsx';
import * as CONSTANTS from '../../../constants/strife-constants.js';
import MenuIcon from '@mui/icons-material/Menu';

export default function Header(props) {
  const classes = useStyles();
  const unseenMsgUserList = useSelector(
    (state) => state.notifications.unseenMsgUserList,
  );

  const menuIconProps = {
    color: 'inherit',
    'aria-label': 'open drawer',
    edge: 'start',
    onClick: props.handleDrawerToggle,
    className: classes.menuIcon,
    sx: { mr: 2, display: { md: 'block', lg: 'none' } },
  };

  return (
    <>
      {props.loaded &&
        (unseenMsgUserList.length > 0 ? (
          <div {...menuIconProps}>
            <Badge
              badgeContent={unseenMsgUserList.length}
              color="secondary"
              max={999}
              overlap="circular"
            >
              <MenuIcon />
            </Badge>
          </div>
        ) : (
          <MenuIcon {...menuIconProps} />
        ))}
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
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
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
