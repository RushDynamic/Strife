import React, { useState } from 'react';
import { Typography, IconButton } from '@mui/material';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import FaceIcon from '@mui/icons-material/Face';
import chatStyles from '../../../../styles/chat-styles';

function EditAvatar(props) {
  const classes = chatStyles();
  const [imagePath, setImagePath] = useState(props.currentAvatar);
  const [showAvatarError, setShowAvatarError] = useState({
    show: false,
    msg: 'An error occurred while uploading your avatar.',
  });

  const handleAvatarFileChanged = async (e) => {
    if (e.target.files[0] != null) {
      var fileSize = (e.target.files[0].size / 1024 / 1024).toFixed(4);
      console.log('Avatar file size:', fileSize);
      if (fileSize > 0.2) {
        setShowAvatarError({
          show: true,
          msg: "Please select a file that's smaller than 200KB :c",
        });
      } else {
        setShowAvatarError({ show: false });
        props.setAvatarFile(e.target.files[0]);
        setImagePath(URL.createObjectURL(e.target.files[0]));
      }
    }
  };

  return (
    <>
      <div hidden={props.value !== props.index}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '50px',
          }}
        >
          {imagePath === '' ? (
            <FaceIcon style={{ fontSize: 150 }} />
          ) : (
            <img
              alt="avatar_preview"
              className={classes.expandFastOnHover}
              src={
                imagePath.includes('blob')
                  ? imagePath
                  : `https://strife-playground.s3.ap-south-1.amazonaws.com/${imagePath}`
              }
              height="100px"
              width="100px"
              onError={({ target }) => {
                target.onerror = null;
                target.src = 'http://localhost:3001/images/default_avatar.jpg';
              }}
              style={{ borderRadius: '50%' }}
            />
          )}
          <input
            accept="image/*"
            id="avatarFileInput"
            type="file"
            style={{ display: 'none' }}
            onChange={handleAvatarFileChanged}
          />
          <label htmlFor="avatarFileInput">
            <IconButton color="primary" component="span" size="large">
              <AddAPhotoIcon />
            </IconButton>
          </label>
          <Typography variant="h4">Upload an avatar</Typography>
          <Typography
            variant="body1"
            style={{ color: 'red' }}
            hidden={!showAvatarError.show}
          >
            {showAvatarError.msg}
          </Typography>
        </div>
      </div>
    </>
  );
}

export default EditAvatar;
