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
    }
});

export default chatStyles;