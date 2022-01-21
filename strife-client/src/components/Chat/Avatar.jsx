import React from 'react';

function Avatar(props) {
  return (
    <>
      {props.online ? (
        <img
          alt="avatar_online"
          src={props.avatarUrl}
          style={{ borderRadius: '50%', border: '2px solid green' }}
          height="25px"
          width="25px"
        />
      ) : (
        <img
          alt="avatar_offline"
          src={props.avatarUrl}
          style={{ borderRadius: '50%' }}
          height="25px"
          width="25px"
        />
      )}
    </>
  );
}

export default Avatar;
