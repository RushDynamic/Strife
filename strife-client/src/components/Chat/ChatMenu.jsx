import React, { useContext, useState } from 'react';
import chatStyles from '../styles/chat-styles.js';
import { Button, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Snackbar } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import Paper from '@material-ui/core/Paper';
import { UserContext } from '../../UserContext.js';
import { addFriend } from '../../services/friend-service.js';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function ChatMenu() {
    const { user } = useContext(UserContext);
    const [openAddFriend, setOpenAddFriend] = useState(false);
    const [friendUsername, setFriendUsername] = useState("");
    const [addFriendStatus, setAddFriendStatus] = useState({ failure: false, success: false, msg: "An error occurred while adding friend" });
    const classes = chatStyles();

    async function handleAddFriendClick() {
        // TODO: Accept Enter key as input
        // TODO: Add input validation for username
        if (friendUsername == null || friendUsername.trim().length == 0) {
            setAddFriendStatus({ failure: true, msg: "Please enter a valid username!" })
        }
        else {
            setOpenAddFriend(false);
            await addFriend(user.username, friendUsername, setAddFriendStatus);
        }
    }

    function handleAddFriendOnKeyDown(e) {
        if (e.keyCode == 13) {
            handleAddFriendClick();
        }
    }
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
            <Dialog open={openAddFriend} onClose={() => setOpenAddFriend(false)} autoFocus={false}>
                <DialogTitle>Add new friend</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Enter the exact username of your friend.
                    </DialogContentText>
                    <TextField
                        id="friendUsername"
                        label="Friend's username"
                        onChange={event => setFriendUsername(event.target.value)}
                        onKeyDown={handleAddFriendOnKeyDown}
                        fullWidth
                        autoFocus={true}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenAddFriend(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={() => handleAddFriendClick()} color="primary">
                        Add
                    </Button>
                </DialogActions>
            </Dialog>
            <Snackbar open={addFriendStatus.failure} autoHideDuration={3000} onClose={() => setAddFriendStatus({ failure: false, msg: addFriendStatus.msg })}>
                <Alert severity="error">
                    {addFriendStatus.msg}
                </Alert>
            </Snackbar>
            <Snackbar open={addFriendStatus.success} autoHideDuration={3000} onClose={() => setAddFriendStatus({ success: false, msg: addFriendStatus.msg })}>
                <Alert severity="success">
                    {addFriendStatus.msg}
                </Alert>
            </Snackbar>
        </>
    )
}

export default ChatMenu;