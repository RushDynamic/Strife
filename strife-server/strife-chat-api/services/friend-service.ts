import * as accountMgmtApiClient from '../clients/account-management-api-client';
import {
  FetchFriendsList,
  Friend,
  FriendWithStatus,
  GetOnlineFriendUsernames,
  PrepareFriendsList,
} from '../types/friend-types';

const fetchFriendsList: FetchFriendsList = async (username) => {
  let friendsList = await accountMgmtApiClient.fetchFriendsList(username);
  return friendsList;
};

const getOnlineFriendUsernames: GetOnlineFriendUsernames = (
  friendsList,
  onlineUsersMap,
) => {
  return friendsList
    .filter((value: Friend) =>
      Array.from(onlineUsersMap.keys()).includes(value.username),
    )
    .map((result: any) => result.username);
};

export const prepareFriendsList: PrepareFriendsList = async (
  username,
  onlineUsersMap,
) => {
  let friendsList = await fetchFriendsList(username);
  const onlineFriends = getOnlineFriendUsernames(friendsList, onlineUsersMap);
  const friendsListWithStatus: Array<FriendWithStatus> = [];
  friendsList.map((friend) => {
    const friendStatus = {
      ...friend,
      status: onlineFriends.includes(friend.username)
        ? 'online'
        : ('offline' as FriendWithStatus['status']),
    };
    friendsListWithStatus.push(friendStatus);
  });
  friendsListWithStatus.sort((a) => {
    if (a.status == 'offline') return 1;
    else return -1;
  });
  return friendsListWithStatus;
};
