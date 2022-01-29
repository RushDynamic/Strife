import React from 'react';
import { BiPhone, BiPhoneCall } from 'react-icons/bi';
import { IconButton } from '@material-ui/core';

export default function PhoneBox(props) {
  return <>{returnCallButton(false, props.createCall)}</>;
}

function returnCallButton(calling, createCall) {
  return (
    <>
      {calling ? (
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
