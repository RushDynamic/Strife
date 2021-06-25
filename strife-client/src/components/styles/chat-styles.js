import { makeStyles } from "@material-ui/core";

const chatStyles = makeStyles({
    headerContainer: {
        textAlign: 'center'
    },

    messageBoxContainer: {
        margin: '5px',
    },

    createMessageContainer: {
        marginTop: '10px',
        display: 'flex'
    },

    chatMenuContainer: {
        height: '8vh',
        display: 'flex',
        flexDirection: 'row'
    },
    chatMenuIcon: {
        margin: '2vh',
    },

    onlineUsersContainer: {
        marginBottom: '10px'
    }
});

export default chatStyles;