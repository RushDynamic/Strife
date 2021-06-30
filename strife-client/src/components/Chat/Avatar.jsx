import React from 'react';

function Avatar(props) {
    return (
        <>
            {
                props.online ?
                    <img src={props.avatarUrl} style={{ borderRadius: '50%', border: '2px solid green' }} height="25px" width="25px" /> :
                    <img src={props.avatarUrl} style={{ borderRadius: '50%' }} height="25px" width="25px" />
            }
        </>
    )
}

export default Avatar;