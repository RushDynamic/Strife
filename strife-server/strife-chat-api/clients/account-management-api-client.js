import dotenv from 'dotenv';
dotenv.config();
import fetch from 'node-fetch';

export const fetchFriendsList = async (username) => {
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
};
