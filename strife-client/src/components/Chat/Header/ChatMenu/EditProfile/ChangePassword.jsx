import React from 'react';
import { Typography, TextField } from '@material-ui/core';

function ChangePassword(props) {

    return (
        <div hidden={props.value !== props.index}>
            <Typography>
                Change your password:
            </Typography>
            <TextField />
        </div>
    );
}

export default ChangePassword;