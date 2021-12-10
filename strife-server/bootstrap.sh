#!/bin/sh

# cd required for recognizing .env file
cd strife-chat-api && urxvt -e nodemon app &
cd account-management-api && urxvt -e nodemon app &
cd user-authorization-api && urxvt -e nodemon app &