import React, { useContext, useState } from 'react';
import chatStyles from '../styles/chat-styles.js';
import { Button, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@material-ui/core';
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import Paper from '@material-ui/core/Paper';
import { UserContext } from '../../UserContext.js';
import { addFriend } from '../../services/friend-service.js';

function ChatMenu() {

    const { user } = useContext(UserContext);
    const [openAddFriend, setOpenAddFriend] = useState(false);
    const [friendUsername, setFriendUsername] = useState("");
    const classes = chatStyles();
    return (
        <>
            <Paper>
                <div className={classes.chatMenuContainer}>
                    <IconButton className={classes.chatMenuIcon}>
                        <PersonAddIcon onClick={() => setOpenAddFriend(true)} />
                    </IconButton>
                    <IconButton className={classes.chatMenuIcon}>
                        <GroupAddIcon />
                    </IconButton>
                </div>
            </Paper>
            <Dialog open={openAddFriend} onClose={() => setOpenAddFriend(false)}>
                <DialogTitle>Add new friend</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Enter the exact username of your friend.
                    </DialogContentText>
                    <TextField
                        autofocus
                        id="friendUsername"
                        label="Friend's username"
                        onChange={event => setFriendUsername(event.target.value)}
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenAddFriend(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={() => {
                        addFriend(user.username, friendUsername);
                        setOpenAddFriend(false);
                    }} color="primary">
                        Add
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default ChatMenu;