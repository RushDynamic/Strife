import { Callback } from './common-types';

export type Manage = (
  action: string,
  socket: any,
  roomname?: string,
  callback?: Callback,
) => void;

export type Leave = (socket: any, roomname?: string) => void;
export type LeaveAll = (socket: any) => void;
export type GenericAction = (
  socket: any,
  roomname?: string,
  callback?: Callback,
) => void;
export type GetUserRooms = (username: string) => void;
