export async function addFriend(username, friendUsername) {
    console.log(username, friendUsername);
    const addFriendResponse = await fetch("http://localhost:3001/user/add_friend", {
        method: 'POST',
        body: JSON.stringify({
            username: username,
            friendUsername: friendUsername
        }),
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    });
    const addFriendResult = await addFriendResponse.json();
    console.log(addFriendResult);
}