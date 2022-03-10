export interface Friend {
  username: string;
  avatar: string;
  publicKey: string;
}

export type FetchFriendsList = (username: string) => Promise<Array<Friend>>;

export type GetOnlineFriendUsernames = (
  friendsList: Array<Friend>,
  onlineUsersMap: Map<string, string>,
) => Array<string>;

export interface FriendWithStatus extends Friend {
  status: 'online' | 'offline';
}

export type PrepareFriendsList = (
  username: string,
  onlineUsersMap: Map<string, string>,
) => Promise<Array<FriendWithStatus>>;
