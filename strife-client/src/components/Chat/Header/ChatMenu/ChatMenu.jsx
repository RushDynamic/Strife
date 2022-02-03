import React, { useContext, useState } from 'react';
import { useDispatch } from 'react-redux';
import changeRecipient from '../../../../actions/recipient-actions.js';
import chatStyles from '../../../styles/chat-styles.js';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Snackbar,
  Tabs,
  Tab,
  Tooltip,
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import FaceIcon from '@mui/icons-material/Face';
import Paper from '@mui/material/Paper';
import JoinRoom from './RoomsMenu/JoinRoom.jsx';
import CreateRoom from './RoomsMenu/CreateRoom.jsx';
import EditAvatar from './EditProfileMenu/EditAvatar.jsx';
import ChangePassword from './EditProfileMenu/ChangePassword.jsx';
import { UserContext } from '../../../../UserContext.js';
import { addFriend } from '../../../../services/friend-service.js';
import { editAvatar } from '../../../../services/profile-service.js';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function ChatMenu(props) {
  const { user, setUser } = useContext(UserContext);
  const dispatch = useDispatch();
  const [openEditProfile, setOpenEditProfile] = useState(false);
  const [profileTabValue, setProfileTabValue] = useState(0);
  const [roomsTabValue, setRoomsTabValue] = useState(0);
  const [avatarFile, setAvatarFile] = useState(null);
  const [friendUsername, setFriendUsername] = useState('');
  const [openAddFriend, setOpenAddFriend] = useState(false);
  const [addFriendStatus, setAddFriendStatus] = useState({
    failure: false,
    success: false,
    msg: 'An error occurred while adding friend',
  });
  const [openRoomsMenu, setOpenRoomsMenu] = useState(false);
  const [roomActionStatus, setRoomActionStatus] = useState({
    failure: false,
    success: false,
    msg: "That room doesn't exist",
  });
  const [roomname, setRoomname] = useState('');
  const classes = chatStyles();

  function handleProfileTabChange(event, value) {
    setProfileTabValue(value);
  }

  function handleRoomsTabChange(event, value) {
    setRoomsTabValue(value);
  }

  async function handleAddFriendClick() {
    if (friendUsername === null || friendUsername.trim().length === 0) {
      setAddFriendStatus({
        failure: true,
        msg: 'Please enter a valid username!',
      });
    } else {
      setOpenAddFriend(false);
      await addFriend(user.username, friendUsername, setAddFriendStatus);
      props.requestFriendsList([user.username, friendUsername]);
    }
  }

  function handleAddFriendOnKeyDown(e) {
    if (e.keyCode === 13) {
      handleAddFriendClick();
    }
  }

  function handleCreateRoomClick() {
    if (roomname === null || roomname.trim().length === 0) {
      setRoomActionStatus({
        failure: true,
        msg: 'Please enter a valid roomname',
      });
    } else {
      setOpenRoomsMenu(false);
      props.manageRooms('create', roomname, isRoomCreated);
    }
  }

  function handleCreateRoomOnKeyDown(e) {
    if (e.keyCode === 13) {
      handleCreateRoomClick();
    }
  }

  function isRoomCreated(status) {
    if (status) {
      props.manageRooms('join', roomname, isUserInRoom);
    } else {
      setRoomActionStatus({
        failure: true,
        msg: 'Could not create room with that name',
      });
    }
  }

  function isUserInRoom(status, roomname) {
    if (status) {
      dispatch(changeRecipient({ username: roomname, isRoom: true }));
    } else {
      setRoomActionStatus({ failure: true, msg: "That room doesn't exist" });
    }
  }

  function handleJoinRoomClick() {
    if (roomname === null || roomname.trim().length === 0) {
      setRoomActionStatus({
        failure: true,
        msg: 'Please enter a valid roomname',
      });
    } else {
      setOpenRoomsMenu(false);
      props.manageRooms('join', roomname, isUserInRoom);
    }
  }

  function handleJoinRoomOnKeyDown(e) {
    if (e.keyCode === 13) {
      handleJoinRoomClick();
    }
  }

  async function handleProfileSaveButtonClicked() {
    if (avatarFile != null) {
      console.log('Changing avatar');
      const result = await editAvatar(avatarFile, user.username);
      console.log('Result:', result);
      setUser({ ...user, avatar: result.filePath });
    }
    setOpenEditProfile(false);
  }

  return (
    <>
      <Paper>
        <div className={classes.chatMenuContainer}>
          <Tooltip title="Add Friend" arrow>
            <PersonAddIcon
              onClick={() => setOpenAddFriend(true)}
              className={classes.chatMenuIcon}
            />
          </Tooltip>
          <Tooltip title="Rooms" arrow>
            <PeopleAltIcon
              onClick={() => setOpenRoomsMenu(true)}
              className={classes.chatMenuIcon}
            />
          </Tooltip>
          <Tooltip title="Edit Profile" arrow>
            <FaceIcon
              onClick={() => setOpenEditProfile(true)}
              className={classes.chatMenuIcon}
            />
          </Tooltip>
        </div>
      </Paper>

      {/* For add friend */}
      <Dialog
        open={openAddFriend}
        onClose={() => setOpenAddFriend(false)}
        autoFocus={false}
      >
        <DialogTitle>Add new friend</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter the exact username of your friend.
          </DialogContentText>
          <TextField
            id="friendUsername"
            label="Friend's username"
            onChange={(event) => setFriendUsername(event.target.value)}
            onKeyDown={handleAddFriendOnKeyDown}
            fullWidth
            variant="standard"
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
      <Snackbar
        open={addFriendStatus.failure}
        autoHideDuration={3000}
        onClose={() =>
          setAddFriendStatus({ failure: false, msg: addFriendStatus.msg })
        }
      >
        <Alert severity="error">{addFriendStatus.msg}</Alert>
      </Snackbar>
      <Snackbar
        open={addFriendStatus.success}
        autoHideDuration={3000}
        onClose={() =>
          setAddFriendStatus({ success: false, msg: addFriendStatus.msg })
        }
      >
        <Alert severity="success">{addFriendStatus.msg}</Alert>
      </Snackbar>

      {/* For rooms */}
      <Dialog
        open={openRoomsMenu}
        onClose={() => setOpenRoomsMenu(false)}
        autoFocus={false}
      >
        <DialogTitle>Rooms</DialogTitle>
        <DialogContent>
          <div
            className={classes.roomsMenuContainer}
            style={{ display: 'flex' }}
          >
            <Tabs
              value={roomsTabValue}
              onChange={handleRoomsTabChange}
              orientation="vertical"
              variant="scrollable"
              style={{ borderRight: `1px solid #cfcfcf` }}
            >
              <Tab label="Join" />
              <Tab label="Create" />
            </Tabs>
            <JoinRoom
              value={roomsTabValue}
              handleOnKeyDown={handleJoinRoomOnKeyDown}
              setRoomname={setRoomname}
              index={0}
            />
            <CreateRoom
              value={roomsTabValue}
              index={1}
              handleOnKeyDown={handleCreateRoomOnKeyDown}
              setRoomname={setRoomname}
            />
          </div>
        </DialogContent>
      </Dialog>
      <Snackbar
        open={roomActionStatus.failure}
        autoHideDuration={3000}
        onClose={() =>
          setRoomActionStatus({ failure: false, msg: roomActionStatus.msg })
        }
      >
        <Alert severity="error">{roomActionStatus.msg}</Alert>
      </Snackbar>

      {/* For edit profile */}
      <Dialog
        open={openEditProfile}
        onClose={() => setOpenEditProfile(false)}
        autoFocus={false}
      >
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <div
            className={classes.editProfileContainer}
            style={{ display: 'flex' }}
          >
            <Tabs
              value={profileTabValue}
              onChange={handleProfileTabChange}
              orientation="vertical"
              variant="scrollable"
              style={{ borderRight: `1px solid #cfcfcf` }}
            >
              <Tab label="Edit Avatar" />
              <Tab label="Change Password" />
            </Tabs>
            <EditAvatar
              value={profileTabValue}
              index={0}
              avatarFile={avatarFile}
              setAvatarFile={setAvatarFile}
              currentAvatar={user.avatar}
            />
            <ChangePassword value={profileTabValue} index={1} />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditProfile(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleProfileSaveButtonClicked} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default ChatMenu;
