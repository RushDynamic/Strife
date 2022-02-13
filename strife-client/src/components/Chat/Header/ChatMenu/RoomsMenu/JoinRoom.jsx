import React from 'react';
import { TextField, Typography } from '@mui/material';

function JoinRoom(props) {
  return (
    <div hidden={props.value !== props.index}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '2rem',
          height: '100%',
          width: '100%',
        }}
      >
        <Typography variant="h5" paddingTop="1rem">
          Join an existing room
        </Typography>
        <TextField
          id="roomname"
          label="Room name"
          onChange={(event) => props.setRoomname(event.target.value)}
          onKeyDown={props.handleOnKeyDown}
          fullWidth
          autoFocus={true}
          autoComplete="off"
          style={{ marginTop: '8px' }}
        />
      </div>
    </div>
  );
}

export default JoinRoom;
