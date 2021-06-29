import React, { useContext, useState } from 'react';
import chatStyles from '../../../styles/chat-styles.js';
import { Button, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Snackbar, AppBar, Tabs, Tab } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import FaceIcon from '@material-ui/icons/Face';
import Paper from '@material-ui/core/Paper';
import EditAvatar from './EditProfile/EditAvatar.jsx';
import ChangePassword from './EditProfile/ChangePassword.jsx';
import { UserContext } from '../../../../UserContext.js';
import { addFriend } from '../../../../services/friend-service.js';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function ChatMenu(props) {
    const { user } = useContext(UserContext);
    const [openAddFriend, setOpenAddFriend] = useState(false);
    const [openEditProfile, setOpenEditProfile] = useState(false);
    const [tabValue, setTabValue] = useState(0);
    const [friendUsername, setFriendUsername] = useState("");
    const [addFriendStatus, setAddFriendStatus] = useState({ failure: false, success: false, msg: "An error occurred while adding friend" });
    const classes = chatStyles();

    function handleTabChange(event, value) {
        setTabValue(value);
    }

    async function handleAddFriendClick() {
        if (friendUsername == null || friendUsername.trim().length == 0) {
            setAddFriendStatus({ failure: true, msg: "Please enter a valid username!" })
        }
        else {
            setOpenAddFriend(false);
            await addFriend(user.username, friendUsername, setAddFriendStatus);
            props.requestFriendsList(user.username);
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
                    <IconButton className={classes.chatMenuIcon}>
                        <FaceIcon onClick={() => setOpenEditProfile(true)} />
                    </IconButton>
                </div>
            </Paper>

            {/* For add friend */}
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

            {/* For edit profile */}
            <Dialog open={openEditProfile} onClose={() => setOpenEditProfile(false)} autoFocus={false}>
                <DialogTitle>Edit Profile</DialogTitle>
                <DialogContent>
                    <div className={classes.editProfileContainer} style={{ display: 'flex' }}>
                        <Tabs value={tabValue} onChange={handleTabChange} orientation="vertical" variant="scrollable" style={{ borderRight: `1px solid #cfcfcf` }}>
                            <Tab label="Edit Avatar" />
                            <Tab label="Change Password" />
                            <Tab label="Change Theme" />
                        </Tabs>
                        <EditAvatar value={tabValue} index={0} />
                        <ChangePassword value={tabValue} index={1} />
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenEditProfile(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={() => { }} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default ChatMenu;