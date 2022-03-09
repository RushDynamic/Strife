import { Callback } from './common-types';

export type Manage = (
  action: string,
  roomname: string,
  socket: any,
  callback?: Callback,
) => void;

export type Leave = (roomname: string, socket: any) => void;
export type LeaveAll = (socket: any) => void;
export type GenericAction = (
  roomname: string,
  socket: any,
  callback?: Callback,
) => void;
export type GetUserRooms = (username: string) => void;
