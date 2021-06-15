import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    //  ---- Login Begin ----
    loginContainer: {
        backgroundImage: 'url(https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1950&q=80)',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',

        minHeight: '100vh',
        marginTop: '0',
        paddingTop: '0',
        display: 'flex',
        flexFlow: 'row',
        justifyContent: 'space-around',
    },
    loginPanelLeft: {
        display: 'flex',
        flexFlow: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        background: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(5px)',
    },

    mainText: {
        paddingLeft: '5vh',
        paddingRight: '5vh'
    },

    loginPanelRight: {
        display: 'flex',
        flexFlow: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minWidth: '40vh'
    },

    loginCard: {
        boxShadow: '3px 3px 25px 15px #F01891',
        width: '100%',
        borderRadius: '15px'
    },

    //  ---- Login End ----
});

export default useStyles;