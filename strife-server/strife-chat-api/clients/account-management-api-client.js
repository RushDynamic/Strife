require('dotenv').config();
const fetch = require('node-fetch');

module.exports = {
  fetchFriendsList: async function (username) {
    const fetchFriendsListResponse = await fetch(
      `${process.env.AM_API_URL}/friend/fetch`,
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
