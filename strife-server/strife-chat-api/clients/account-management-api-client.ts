import dotenv from 'dotenv';
dotenv.config();
import fetch from 'node-fetch';
import { Friend } from '../types/friend-types';

type FetchFriendsList = (username: string) => Promise<Array<Friend>>;
export const fetchFriendsList: FetchFriendsList = async (username) => {
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
