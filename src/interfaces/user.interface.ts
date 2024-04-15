import { PaginationOptions, IDateFilterOptions } from "./common.interface";

export interface IGetAllUserOptions extends IPaginationOptions, IUserFilter {}

export interface IGetAllUserResponse {
  id: number;
  username: string;
  email: string;
  phone_number: string;
  role: string;
  created_at: Date;
  updated_at: Date;
}

export interface IUser {
  id: number;
  name: string;
  username: string;
  password?: string;
  email: string;
  phone_number: string;
  role: string;
  created_at: Date;
  updated_at: Date;
}

export interface IUserFilter extends IDateFilterOptions {
  id?: string;
  name?: string;
  username?: string;
  email?: string;
  phone_number?: string;
  role?: string;
}
