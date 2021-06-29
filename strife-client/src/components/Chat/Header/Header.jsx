import React from 'react';
import useStyles from '../../styles/chat-styles';
import { Typography } from '@material-ui/core';
import ChatMenu from './ChatMenu/ChatMenu.jsx';

export default function Header() {
    const classes = useStyles();

    return (
        <>
            <div className={classes.headerContainer}>
                <Typography variant="h2" style={{ fontVariant: 'small-caps', letterSpacing: '5px', fontFamily: "'Syne', sans-serif" }}>Strife</Typography>
                {/* TODO: Add login/logout/control buttons under the header */}
                <ChatMenu />
            </div>
        </>
    );
}