import React from 'react';
import { List, ListItem, ListItemText, ListItemIcon, ListItemAvatar, Paper } from '@material-ui/core';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import ChatBubbleIcon from '@material-ui/icons/ChatBubble';
import useStyles from '../styles/chat-styles.js';

function OnlineUsers() {
    const classes = useStyles();

    function createData(name, calories, fat, carbs, protein) {
        return { name, calories, fat, carbs, protein };
    }

    const rows = [
        createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
        createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
        createData('Eclair', 262, 16.0, 24, 6.0),
        createData('Cupcake', 305, 3.7, 67, 4.3),
        createData('Gingerbread', 356, 16.0, 49, 3.9),
        createData('Eclair', 262, 16.0, 24, 6.0),
        createData('Cupcake', 305, 3.7, 67, 4.3),
        createData('Gingerbread', 356, 16.0, 49, 3.9),
        createData('Eclair', 262, 16.0, 24, 6.0),
        createData('Cupcake', 305, 3.7, 67, 4.3),
        createData('Eclair', 262, 16.0, 24, 6.0),
        createData('Cupcake', 305, 3.7, 67, 4.3),
        createData('Gingerbread', 356, 16.0, 49, 3.9),
        createData('Eclair', 262, 16.0, 24, 6.0),
        createData('Cupcake', 305, 3.7, 67, 4.3),
        createData('Eclair', 262, 16.0, 24, 6.0),
        createData('Cupcake', 305, 3.7, 67, 4.3),
        createData('Eclair', 262, 16.0, 24, 6.0),
        createData('Cupcake', 305, 3.7, 67, 4.3),
        createData('Gingerbread', 356, 16.0, 49, 3.9),
        createData('Eclair', 262, 16.0, 24, 6.0),
        createData('Cupcake', 305, 3.7, 67, 4.3),

    ];


    return (
        <>
            <div className={classes.onlineUsersContainer} style={{ height: '78vh', overflow: 'auto' }}>
                <Paper>
                    <List>
                        <ListItem>
                            <ListItemText primary="Online Users" />
                        </ListItem>
                        {
                            rows.map(row => (
                                <ListItem>
                                    <ListItemAvatar><AccountCircleIcon /></ListItemAvatar>
                                    <ListItemText primary={row.name} />
                                    <ListItemIcon><ChatBubbleIcon /></ListItemIcon>
                                </ListItem>
                            ))
                        }

                    </List>
                </Paper>
            </div>
        </>
    )
}

export default OnlineUsers;