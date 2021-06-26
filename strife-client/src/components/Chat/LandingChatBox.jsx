import React, { useContext } from 'react';
import { Typography } from '@material-ui/core';
import { UserContext } from '../../UserContext';

function LandingChatBox() {
    const { user } = useContext(UserContext);
    return (
        <>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '70vh', justifyContent: 'center' }}>
                <Typography variant="h2">
                    Hey {user.username},
                </Typography>
                <Typography variant="h4" style={{ fontFamily: "'Rubik', sans-serif" }}>
                    why don't you talk to someone about it?
                </Typography>
            </div>
        </>
    )
}

export default LandingChatBox;