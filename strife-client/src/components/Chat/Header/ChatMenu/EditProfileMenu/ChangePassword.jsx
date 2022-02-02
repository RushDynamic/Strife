import React from 'react';
import { Typography } from '@mui/material';

function ChangePassword(props) {
  return (
    <div hidden={props.value !== props.index}>
      <Typography style={{ padding: '15px' }}>Under construction</Typography>
    </div>
  );
}

export default ChangePassword;
