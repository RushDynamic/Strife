import React from 'react';
import { Typography } from '@material-ui/core';
import PublishIcon from '@material-ui/icons/Publish';

function EditAvatar(props) {

    return (
        <div hidden={props.value !== props.index} >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '50px' }}>
                <Typography variant="h4">
                    Upload an avatar
                </Typography>
                <PublishIcon style={{ fontSize: 150 }} />
            </div>
        </div>
    );
}

export default EditAvatar;