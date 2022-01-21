import React from 'react';
import { Typography } from '@material-ui/core';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';

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
          console.log('SHOWING DETAILED MEMBERS');
        }}
      >
        {props.memberName}
      </Typography>
    </div>
  );
}
