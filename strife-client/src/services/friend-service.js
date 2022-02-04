export async function addFriend(username, friendUsername, setAddFriendStatus) {
  console.log(username, friendUsername);
  const addFriendResponse = await fetch('http://am-api:3001/friend/add', {
    method: 'POST',
    body: JSON.stringify({
      username: username,
      friendUsername: friendUsername,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });
  const addFriendResult = await addFriendResponse.json();
  console.log(addFriendResult);
  if (addFriendResult.success === true) {
    setAddFriendStatus({
      failure: false,
      success: true,
      msg: `Successfully added ${friendUsername} as a friend!`,
    });
  } else if (
    addFriendResult.success === false &&
    addFriendResult.alreadyFriends === true
  ) {
    setAddFriendStatus({
      failure: true,
      success: false,
      msg: `You're already friends with ${friendUsername}!`,
    });
  } else {
    setAddFriendStatus({
      failure: true,
      success: false,
      msg: `Could not add ${friendUsername} as a friend, please try again later!`,
    });
  }
}
