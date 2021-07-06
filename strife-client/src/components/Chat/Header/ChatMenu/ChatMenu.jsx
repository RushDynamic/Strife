import React, { useContext, useState } from 'react';
import chatStyles from '../../../styles/chat-styles.js';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Snackbar, AppBar, Tabs, Tab } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import FaceIcon from '@material-ui/icons/Face';
import Paper from '@material-ui/core/Paper';
import EditAvatar from './EditProfile/EditAvatar.jsx';
import ChangePassword from './EditProfile/ChangePassword.jsx';
import { UserContext } from '../../../../UserContext.js';
import { addFriend } from '../../../../services/friend-service.js';
import { editAvatar } from '../../../../services/profile-service.js'

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function ChatMenu(props) {
    const { user, setUser } = useContext(UserContext);
    const [openEditProfile, setOpenEditProfile] = useState(false);
    const [tabValue, setTabValue] = useState(0);
    const [avatarFile, setAvatarFile] = useState(null);
    const [friendUsername, setFriendUsername] = useState("");
    const [openAddFriend, setOpenAddFriend] = useState(false);
    const [addFriendStatus, setAddFriendStatus] = useState({ failure: false, success: false, msg: "An error occurred while adding friend" });
    const [openCreateRoom, setOpenCreateRoom] = useState(false);
    const [roomname, setRoomname] = useState("");
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
            props.requestFriendsList([user.username, friendUsername]);
        }
    }

    function handleAddFriendOnKeyDown(e) {
        if (e.keyCode == 13) {
            handleAddFriendClick();
        }
    }

    async function handleCreateRoomClick() {
        if (roomname == null || roomname.trim().length == 0) {
            // throw error msg
        }
        else {
            setOpenCreateRoom(false);
            props.manageRooms("create", roomname);
            props.manageRooms("join", roomname);
            props.setRecipient({ username: roomname, isRoom: true });
        }
    }

    function handleCreateRoomOnKeyDown(e) {
        if (e.keyCode == 13) {
            handleCreateRoomClick();
        }
    }

    async function handleSaveButtonClicked() {
        if (avatarFile != null) {
            console.log("Changing avatar");
            const result = await editAvatar(avatarFile, user.username);
            console.log("Result:", result);
            setUser({ ...user, avatar: result.filePath });
        }
        setOpenEditProfile(false)
    }

    return (
        <>
            <Paper>
                <div className={classes.chatMenuContainer}>
                    <PersonAddIcon onClick={() => setOpenAddFriend(true)} className={classes.chatMenuIcon} />
                    <GroupAddIcon onClick={() => setOpenCreateRoom(true)} className={classes.chatMenuIcon} />
                    <FaceIcon onClick={() => setOpenEditProfile(true)} className={classes.chatMenuIcon} />
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

            {/* For create room */}
            <Dialog open={openCreateRoom} onClose={() => setOpenCreateRoom(false)} autoFocus={false}>
                <DialogTitle>Create a new room</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Enter a cool name for the room.
                    </DialogContentText>
                    <TextField
                        id="roomname"
                        label="Room name"
                        onChange={event => setRoomname(event.target.value)}
                        onKeyDown={handleCreateRoomOnKeyDown}
                        fullWidth
                        autoFocus={true}
                        autoComplete="off"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenCreateRoom(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={() => handleCreateRoomClick()} color="primary">
                        Create
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
                        </Tabs>
                        <EditAvatar value={tabValue} index={0} avatarFile={avatarFile} setAvatarFile={setAvatarFile} currentAvatar={user.avatar} />
                        <ChangePassword value={tabValue} index={1} />
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenEditProfile(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleSaveButtonClicked} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default ChatMenu;