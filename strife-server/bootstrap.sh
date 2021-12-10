#!/bin/sh
if [ -z $MONGODB_CONNECTION_URI ]
then
    echo "Required environment variables have not been set, server not started"
else
    urxvt -e nodemon strife-chat-api/app &
    urxvt -e nodemon account-management-api/app &
    urxvt -e nodemon user-authorization-api/app &
fi