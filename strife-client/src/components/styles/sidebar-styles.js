import makeStyles from '@mui/styles/makeStyles';

const sidebarStyles = makeStyles({
  cardTitleTextContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  cardTitleText: {
    color: '#1fd1f9',
    fontVariant: 'small-caps',
    fontFamily: "'Syne', sans-serif",
    fontSize: '1.3rem',
    letterSpacing: '3px',
    margin: '1rem 0 0 1rem',
  },

  cardSubTitleText: {
    fontVariant: 'small-caps',
    fontFamily: "'Syncopate', sans-serif",
    margin: '1rem 1rem 0 1rem',
    fontSize: '0.7em',
    color: '#696A6B',
  },

  // friendslist/roomslist
  onlineUsersCard: {
    marginBottom: '10px',
    overflow: 'auto',
  },

  singleRowContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    margin: '1rem',
  },

  avatarNameContainer: {
    display: 'flex',
    alignItems: 'center',
  },

  nameText: {
    fontFamily: "'Rubik', sans-serif",
    margin: '0.2rem 0 0.2rem 0.8rem',
  },

  noFriendsContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },

  noFriendsText: {
    padding: '15px',
    fontFamily: "'Syne', sans-serif",
    fontSize: '0.9rem',
  },
});

export default sidebarStyles;
