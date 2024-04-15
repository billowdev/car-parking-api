import { IUser } from "./user.interface";
import { IDateFilterOptions } from "./common.interface";
export interface IParkingArea {
  id: number;
  name: string;
  is_reserved: boolean;
}

export interface IParkingAreaFilter extends IDateFilterOptions {
  id?: string;
  name?: string;
  is_reserved?: string;
}

export interface IParkingAreaResponse {
  id: number;
  name: string;
  is_reserved: boolean;
  created_at: Datetime;
  updated_at: Datetime;
}
