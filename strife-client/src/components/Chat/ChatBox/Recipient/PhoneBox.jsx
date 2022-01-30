import React from 'react';
import { BiPhone, BiPhoneCall } from 'react-icons/bi';
import { IconButton } from '@material-ui/core';

export default function PhoneBox(props) {
  return (
    <>
      {returnCallButton(props.isCallIncoming, props.createCall)}
      <audio id="remote-audio" ref={props.remoteAudioRef} autoPlay controls />
    </>
  );
}

function returnCallButton(isCallIncoming, createCall) {
  return (
    <>
      {isCallIncoming ? (
        <>
          <BiPhoneCall fontSize="small" />
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
