import React from 'react';

function Avatar(props) {
  const onlineStyle = { borderRadius: '50%', border: '2px solid green' };
  const offlineStyle = { borderRadius: '50%' };
  return (
    <>
      <img
        alt="avatar_online"
        src={`https://strife-playground.s3.ap-south-1.amazonaws.com/${props.avatarUrl}`}
        style={props.online ? onlineStyle : offlineStyle}
        height="25px"
        width="25px"
        // TODO: replace URL string with constant
        onError={({ target }) => {
          target.onerror = null;
          target.src = `https://strife-playground.s3.ap-south-1.amazonaws.com/avatars/default/default1.png`;
        }}
      />
    </>
  );
}

export default Avatar;
