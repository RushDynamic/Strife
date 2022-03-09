export interface Message {
  message: string;
  avatar: string;
  systemMsg?: false;
  recipientUsername: string;
  senderUsername: string;
  senderPubKey: string;
  timestamp: string;
  isRoom: boolean;
}
