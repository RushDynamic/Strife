import React from 'react';
import { BiPhone, BiPhoneCall } from 'react-icons/bi';
import { IconButton } from '@material-ui/core';

export default function PhoneBox(props) {
  return (
    <>
      {returnCallButton(
        props.isCallIncoming,
        props.createCall,
        props.acceptCall,
      )}
      <audio id="remote-audio" ref={props.remoteAudioRef} autoPlay controls />
    </>
  );
}

function returnCallButton(isCallIncoming, createCall, acceptCall) {
  return (
    <>
      {isCallIncoming ? (
        <>
          <IconButton onClick={() => acceptCall()}>
            <BiPhoneCall fontSize="small" />
          </IconButton>
        </>
      ) : (
        <>
          <IconButton onClick={() => createCall()}>
            <BiPhone fontSize="medium" />
          </IconButton>
        </>
      )}
    </>
  );
}
