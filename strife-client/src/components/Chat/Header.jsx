import React from 'react';
import useStyles from '../styles/chat-styles';
import { Typography } from '@material-ui/core';

export default function Header() {
    const classes = useStyles();

    return (
        <>
            <div className={classes.headerContainer}>
                <Typography variant="h2" style={{ paddingTop: '2vh' }}>Strife</Typography>
                {/* TODO: Add login/logout/control buttons under the header */}
            </div>
        </>
    );
}