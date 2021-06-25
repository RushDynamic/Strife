import Friend from '../models/friend-model.js';

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
            console.log("You're already friends with that user!");
            return ({ success: false, alreadyFriends: true });
        }
    }
    catch (ex) {
        console.log("An error occurred while adding friend:", ex.toString());
        return ({ success: false, alreadyFriends: false });
    }
}