import makeStyles from '@mui/styles/makeStyles';

const loginStyles = makeStyles({
  //  ---- Login Begin ----
  loginContainer: {
    // backgroundImage: 'url(https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1950&q=80)',
    minHeight: '100vh',
    marginTop: '0',
    paddingTop: '0',
    height: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    '@media screen and (max-width: 768px)': {
      flexDirection: 'column',
      justifyContent: 'center',
    },
  },
  loginPanelLeft: {
    display: 'flex',
    flexFlow: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    background: 'rgba(0, 0, 0, 0.5)',
    backdropFilter: 'blur(5px)',
    '@media screen and (max-width: 768px)': {
      display: 'block',
      padding: '1rem',
      marginBottom: '2rem',
    },
  },

  mainText: {
    paddingLeft: '5vh',
    paddingRight: '5vh',
    fontSize: '5em',
    '@media screen and (max-width: 768px)': {
      fontSize: '2em',
      textAlign: 'center',
    },
  },

  subText: {
    paddingLeft: '5vh',
    paddingRight: '5vh',
    textAlign: 'right',
    fontSize: '1.5em',
    '@media screen and (max-width: 768px)': {
      fontSize: '0.8em',
      textAlign: 'center',
    },
  },

  loginPanelRight: {
    display: 'flex',
    flexFlow: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: '40vh',
    margin: '1rem',
  },

  loginCard: {
    boxShadow: '3px 3px 20px 10px #1b1d1e',
    width: '100%',
    borderRadius: '15px',
  },

  //  ---- Login End ----
});

export default loginStyles;
