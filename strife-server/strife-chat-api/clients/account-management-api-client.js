const fetch = require('node-fetch');

module.exports = {
  fetchFriendsList: async function (username) {
    const fetchFriendsListResponse = await fetch(
      'http://localhost:3001/friend/fetch',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
        }),
      },
    );
    return await fetchFriendsListResponse.json();
  },
};
