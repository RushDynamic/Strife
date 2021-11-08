import Friend from '../models/friend-model.js';
import Account from '../models/account-model.js';

export async function addFriend(username, friendUsername) {
    try {
        if (username == null || username.length == 0 || friendUsername == null || friendUsername.length == 0) {
            return ({ success: false, alreadyFriends: false });
        }
        const accountObjList = await Account.find().or([{ username: friendUsername }, { username: username }]);
        const friendObjList = await Friend.find().or([{ username: friendUsername }, { username: username }]);

        const targetUserAccount = accountObjList.filter(account => account.username === friendUsername)[0];
        if (targetUserAccount === null || targetUserAccount === undefined) {
            return ({ success: false, alreadyFriends: false });
        }
        var currentUserFriend = friendObjList.filter(account => account.username === username)[0];
        // For new users with 0 friends
        if (currentUserFriend == null) {
            currentUserFriend = new Friend({
                username: username,
                friends: []
            });
        }
        if (!currentUserFriend.friends.some(friend => friend.username === friendUsername)) {
            const newFriend = {
                username: targetUserAccount.username,
                avatar: targetUserAccount.avatar,
                publicKey: JSON.parse(targetUserAccount.encodedKeyPair).publicKey
            }
            currentUserFriend.friends.push(newFriend);
            await currentUserFriend.save();
            console.log("Successfully added friend for user:", username);

            // Add current user to friend's friends list
            const currentUserAccount = accountObjList.filter(account => account.username === username)[0];
            newFriend.username = currentUserAccount.username;
            newFriend.avatar = currentUserAccount.avatar;
            newFriend.publicKey = JSON.parse(currentUserAccount.encodedKeyPair).publicKey
            var targetUserFriend = friendObjList.filter(account => account.username === friendUsername)[0];
            if (targetUserFriend == null) {
                targetUserFriend = new Friend({
                    username: friendUsername,
                    friends: []
                });
            }
            targetUserFriend.friends.push(newFriend);
            await targetUserFriend.save();
            console.log("Successfully added friend for user:", friendUsername);
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
        const currentAcc = await Friend.findOne({
            username: username
        });
        return ({ success: true, friendsList: currentAcc.friends });
    }
    catch (ex) {
        console.log("An error occurred while fetching friends:", ex.toString());
        return ({ success: false, friendsList: [] });
    }
}