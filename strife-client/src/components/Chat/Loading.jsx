import React from 'react';

function Loading() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '78vh' }}>
            <img alt="loading_pacman" src={process.env.PUBLIC_URL + '/images/loading.svg'} />
        </div>
    )
}

export default Loading;