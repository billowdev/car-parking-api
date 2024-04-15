import { IUser } from "./user.interface";

export interface IParkingArea {
  id: number;
  name: string;
  is_reserved: boolean;
}

export interface IParkingAreaFilter {
  id?: string;
  name?: string;
  is_reserved?: string;
}

export interface IParkingAreaResponse {
  id: number;
  name: string;
  is_reserved: string;
  created_at: Datetime;
  updated_at: Datetime;
}
