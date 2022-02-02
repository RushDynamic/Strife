import React from 'react';
import { Typography } from '@mui/material';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

export default function MemberName(props) {
  return (
    <div
      key={props.memberName}
      style={{
        display: 'flex',
        alignItems: 'center',
        marginLeft: '10px',
        marginBottom: '10px',
        boxSizing: 'border-box',
      }}
    >
      <FiberManualRecordIcon
        style={{ fontSize: '15px', color: '#80FF00', paddingRight: '5px' }}
      />
      <Typography
        style={{
          paddingRight: '10px',
          letterSpacing: '1px',
          fontFamily: "'Syne', sans-serif",
          fontVariant: 'small-caps',
          cursor: 'pointer',
        }}
        onClick={() => {
          props.setShowDetailedMembers(true);
        }}
      >
        {props.memberName}
      </Typography>
    </div>
  );
}
