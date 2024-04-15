import { IUser } from "./user.interface";
import { IDateFilterOptions } from "./common.interface";
import { IParkingAreaResponse } from "./parking-area.interface";

export interface IReserving {
  id: number;
  plate_number: string;
  vehicle_brand?: string;
  price: number;
  start_time: Datetime;
  end_time: Datetime;
  status?: string
  parking_area_id: number;
  user_id: number;
}

export interface IReservingFilter extends IDateFilterOptions {
  id?: string;
  plate_number?: string;
  vehicle_brand?: string;
  price?: string;
  start_time?: string;
  end_time?: string;
  user_id?: string;
  status?: string;
  parking_area_id?: string;
}

export interface IReservingResponse {
  id: number;
  plate_number: string;
  vehicle_brand: string;
  price: number;
  user_id: number;
  status: string;
  user: IUser;
  start_time: Datetime;
  end_time: Datetime;
  parking_area_id: number;
  parking_area: IParkingAreaResponse;
  created_at: Datetime;
  updated_at: Datetime;
}
