import React from "react";
import {
  Typography,
  Dialog,
  DialogContent,
  DialogTitle,
} from "@material-ui/core";

export default function ChatAlreadyOpen(props) {
  return (
    <Dialog
      open={props.showChatAlreadyOpen}
      style={{
        backdropFilter: "blur(15px)",
        backgroundColor: "rgba(0,0,30,0.4)",
      }}
    >
      <DialogTitle
        style={{
          fontWeight: "bold",
          fontFamily: "'Syne', sans-serif",
          fontVariant: "small-caps",
          letterSpacing: "15px",
        }}
      >
        uh oh
      </DialogTitle>
      <DialogContent>
        <div
          style={{
            margin: "50px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <img
            alt="error_uhoh"
            src={process.env.PUBLIC_URL + "/images/uhoh.svg"}
            height="150"
            width="150"
          />
          <Typography
            variant="h4"
            style={{
              fontWeight: "bold",
              fontFamily: "'Syne', sans-serif",
            }}
          >
            You already have Strife open somewhere
          </Typography>
          <Typography
            style={{
              fontFamily: "'Rubik', sans-serif",
            }}
          >
            You can only run one instance of Strife at a time :c
          </Typography>
        </div>
      </DialogContent>
    </Dialog>
  );
}
