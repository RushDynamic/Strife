import React, { useState } from 'react';
import chatStyles from '../../../../styles/chat-styles.js';
import {
  Typography,
  Dialog,
  DialogContent,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import MemberName from './MemberName.jsx';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

export default function OnlineRoomMembers(props) {
  const classes = chatStyles();
  const [showDetailedMembers, setShowDetailedMembers] = useState(false);

  return (
    <div
      className={classes.onlineRoomMembers}
      style={{ display: 'flex', maxWidth: '100%' }}
    >
      <Typography
        style={{
          marginLeft: '15px',
          marginBottom: '10px',
          letterSpacing: '1px',
          fontFamily: "'Syne', sans-serif",
          fontVariant: 'small-caps',
          color: '#80FF00',
        }}
      >
        members:
      </Typography>
      {props.onlineMembers.length > 5 ? (
        <MemberName
          memberName={props.onlineMembers.length}
          setShowDetailedMembers={setShowDetailedMembers}
        />
      ) : (
        props.onlineMembers.map((memberName) => {
          return (
            <MemberName
              memberName={memberName}
              setShowDetailedMembers={setShowDetailedMembers}
            />
          );
        })
      )}

      {/* For showing detailed members list */}
      <Dialog
        open={showDetailedMembers}
        onClose={() => setShowDetailedMembers(false)}
        autoFocus={false}
      >
        <DialogContent>
          {props.onlineMembers.map((memberName) => {
            return (
              <List key={memberName}>
                <ListItem>
                  <FiberManualRecordIcon
                    style={{
                      fontSize: '15px',
                      color: '#80FF00',
                      paddingRight: '5px',
                    }}
                  />
                  <ListItemText
                    primary={
                      <Typography style={{ fontFamily: "'Rubik', sans-serif" }}>
                        {memberName}
                      </Typography>
                    }
                  />
                </ListItem>
              </List>
            );
          })}
        </DialogContent>
      </Dialog>
    </div>
  );
}
