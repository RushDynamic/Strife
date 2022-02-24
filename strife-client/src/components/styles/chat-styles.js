import makeStyles from '@mui/styles/makeStyles';

const chatStyles = makeStyles({
  headerContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: '20vh',
    background: '#181818',
    // backgroundColor: '#2a2a72', backgroundImage: 'linear-gradient(115deg, #2a2a72 0%, #009ffd 74%)'
  },

  menuIcon: {
    position: 'fixed',
    margin: '1rem',
    cursor: 'pointer',
    color: '#1fd1f9',
  },

  messageBoxContainer: {
    margin: '5px',
  },

  announcementMsg: {
    margin: '15px',
  },

  createMessageContainer: {
    margin: '0.2em',
    display: 'flex',
  },

  chatMenuContainer: {
    height: '5vh',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  chatMenuIcon: {
    margin: '2vh',
    cursor: 'pointer',
    transition: '0.5s',
    '&:hover': {
      transform: 'scale(1.1) translateY(-2.5px)',
    },
  },

  callContainer: {
    margin: '0.5rem',
  },

  callInfoContainer: {
    display: 'flex',
    justifyContent: 'center',
    padding: '0.2rem',
  },

  callButtonsContainer: {
    display: 'flex',
    justifyContent: 'center',
  },

  shakeCallBtn: {
    animation: `$shake 1s`,
    animationIterationCount: 'infinite',
  },

  '@keyframes shake': {
    '0%': { transform: 'translate(1px, 1px) rotate(0deg)' },
    '10%': { transform: 'translate(-1px, -2px) rotate(-1deg)' },
    '20%': { transform: 'translate(-3px, 0px) rotate(1deg)' },
    '30%': { transform: 'translate(3px, 2px) rotate(0deg)' },
    '40%': { transform: 'translate(1px, -1px) rotate(1deg)' },
    '50%': { transform: 'translate(-1px, 2px) rotate(-1deg)' },
    '60%': { transform: 'translate(-3px, 1px) rotate(1deg)' },
    '100%': { transform: 'translate(0px, 0px) rotate(0deg)' },
  },

  nonSelectable: {
    '-webkit-user-select': 'none',
    '-khtml-user-select': 'none',
    '-moz-user-select': 'none',
    '-o-user-select': 'none',
    'user-select': 'none',
  },

  expandOnHover: {
    transitionDelay: '2s',
    transition: '1.5s',
    '&:hover': {
      transform: 'scale(1.1) translateY(-5px)',
    },
  },

  expandFastOnHover: {
    transitionDelay: '1s, 5ms',
    transition: '0.5s',
    '&:hover': {
      transform: 'scale(2)',
    },
  },
});

export default chatStyles;
