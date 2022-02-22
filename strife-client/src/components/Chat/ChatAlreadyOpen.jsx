import React from 'react';
import { Typography, Dialog, DialogContent, DialogTitle } from '@mui/material';

export default function ChatAlreadyOpen(props) {
  return (
    <Dialog
      open={props.showChatAlreadyOpen}
      style={{
        backdropFilter: 'blur(15px)',
      }}
      PaperProps={{
        style: {
          background: '#181818',
          boxShadow: 'none',
        },
      }}
    >
      <DialogTitle
        style={{
          fontWeight: 'bold',
          fontFamily: "'Syne', sans-serif",
          fontVariant: 'small-caps',
          letterSpacing: '5px',
        }}
      >
        uh oh
      </DialogTitle>
      <DialogContent>
        <div
          style={{
            margin: '50px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <img
            alt="error_uhoh"
            src={process.env.PUBLIC_URL + '/images/uhoh.svg'}
            height="150"
            width="150"
          />
          <Typography
            variant="h5"
            style={{
              fontWeight: 'bold',
              fontFamily: "'Syne', sans-serif",
              padding: '0 0 1rem 0',
            }}
          >
            Strife is already open
          </Typography>
          <Typography
            style={{
              fontFamily: "'Inter', sans-serif",
            }}
          >
            You can only run one instance of Strife at a time :c
          </Typography>
        </div>
      </DialogContent>
    </Dialog>
  );
}
