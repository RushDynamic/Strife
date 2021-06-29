import React from 'react';
import { Typography, Button } from '@material-ui/core';

function NoFriends() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="body1">You don't have any friends</Typography>
            <img src={process.env.PUBLIC_URL + '/images/nofriends.svg'} height="150" width="150" />
            <Button variant="contained" style={{
                paddingRight: '50px',
                paddingLeft: '50px',
                backgroundColor: '#2a2a72',
                backgroundImage: 'linear-gradient(25deg, #2a2a72 0%, #009ffd 74%)',
                color: 'white',
                fontVariant: 'small-caps', letterSpacing: '3px', fontFamily: "'Syne', sans-serif"
            }}>Add friend</Button>
        </div>
    )
}

export default NoFriends;