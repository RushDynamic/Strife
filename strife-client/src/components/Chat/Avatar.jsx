import React from 'react';

function Avatar(props) {
  const onlineStyle = { borderRadius: '50%', border: '2px solid green' };
  const offlineStyle = { borderRadius: '50%' };
  return (
    <>
      <img
        alt="avatar_online"
        src={props.avatarUrl}
        style={props.online ? onlineStyle : offlineStyle}
        height="25px"
        width="25px"
        // TODO: replace URL string with constant
        onError={({ target }) => {
          target.onerror = null;
          target.src = 'http://localhost:3001/images/default_avatar.jpg';
        }}
      />
    </>
  );
}

export default Avatar;
