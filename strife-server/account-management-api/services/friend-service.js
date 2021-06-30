import Friend from '../models/friend-model.js';
import Account from '../models/account-model.js';

export async function addFriend(username, friendUsername) {
    try {
        if (username == null || username.length == 0 || friendUsername == null || friendUsername.length == 0) {
            return ({ success: false, alreadyFriends: false });
        }
        var friend = await Friend.findOne({
            username: username
        });

        // For new users with 0 friends
        if (friend == null) {
            friend = new Friend({
                username: username,
                friends: []
            });
        }
        if (!friend.friends.includes(friendUsername)) {
            friend.friends.push(friendUsername);
            const newFriendsList = await friend.save();
            console.log(newFriendsList.friends);
            console.log("Successfully added friend for user", username);
            return ({ success: true });
        }
        else {
            console.log("Already friends with that user!");
            return ({ success: false, alreadyFriends: true });
        }
    }
    catch (ex) {
        console.log("An error occurred while adding friend:", ex.toString());
        return ({ success: false, alreadyFriends: false });
    }
}

export async function fetchFriends(username) {
    try {
        if (username == null || username.trim().length == 0) {
            return ({ success: false, friendsList: [] });
        }
        const friend = await Friend.findOne({
            username: username
        });

        // TODO: Find better way to fetch avatar URLs
        const friendDetails = await Account.find().where('username').in(friend.friends).exec();
        const avatarUrls = new Map();
        friendDetails.map((friend) => {
            avatarUrls.set(friend.username, friend.avatar);
        });
        const friendsList = [];
        friend.friends.map((friendUsername) => {
            if (avatarUrls.has(friendUsername)) {
                friendsList.push({ username: friendUsername, avatar: avatarUrls.get(friendUsername) });
            }
            else {
                // Push default avatar URL
                friendsList.push({ username: friendUsername, avatar: "https://cdn0.iconfinder.com/data/icons/user-pictures/100/male-128.png" })
            }
        })
        return ({ success: true, friendsList: friendsList });
    }
    catch (ex) {
        console.log("An error occurred while fetching friends:", ex.toString());
        return ({ success: false, friendsList: [] });
    }
}