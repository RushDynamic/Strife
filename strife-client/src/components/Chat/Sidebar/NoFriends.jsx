import React from 'react';
import { Typography } from '@material-ui/core';

function NoFriends() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <img alt="error_nofriends" src={process.env.PUBLIC_URL + '/images/uhoh.svg'} height="150" width="150" />
            <Typography style={{
                padding: '15px',
                color: "#1fd1f9",
                fontFamily: "'Syne', sans-serif",
                fontSize: '0.9rem',
            }} >You don't have any friends</Typography>
        </div>
    )
}

export default NoFriends;