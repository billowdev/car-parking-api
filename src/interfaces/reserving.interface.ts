import { IUser } from './user.interface';
import { IDateFilterOptions } from "./common.interface";


export interface IReserving {
	id: number;
	plate_number: string;
	vehicle_brand: string;
	price: number;
	start_time: Datetime;
	end_time: Datetime;
	user_id: number;
}

export interface IReservingFilter extend IDateFilterOptions {
	id?: string;
	plate_number?: string;
	vehicle_brand?: string;
	price?: string;
	reserve_date?: string;
	start_time: string;
	end_time: string;
	user_id?: number;
}


export interface IReservingResponse {
	id: number;
	plate_number: string;
	vehicle_brand: string;
	price: number;
	reserve_date: Datetime;
	user_id: number;
	user: IUser;
	start_time: Datetime;
	end_time: Datetime;
	parking_area_id: 
}
  