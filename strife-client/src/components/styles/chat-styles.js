import { makeStyles } from "@material-ui/core";

const chatStyles = makeStyles({
    headerContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: 'center',
        height: '20vh',
        backgroundColor: '#2a2a72', backgroundImage: 'linear-gradient(115deg, #2a2a72 0%, #009ffd 74%)'
    },

    messageBoxContainer: {
        margin: '5px',
    },

    announcementMsg: {
        margin: '15px',
    },

    createMessageContainer: {
        marginTop: '10px',
        display: 'flex'
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
    },

    onlineUsersContainer: {
        marginBottom: '10px'
    }
});

export default chatStyles;