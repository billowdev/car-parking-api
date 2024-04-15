import { IUser } from './user.interface';
import { IDateFilterOptions } from "./common.interface";


export interface IReserving {
	id: number;
	plate_number: string;
	vehicle_brand: string;
	price: number;
	reserve_date: Datetime;
	user_id: number;
}

export interface IReservingFilter extend IDateFilterOptions {
	id?: string;
	plate_number?: string;
	vehicle_brand?: string;
	price?: string;
	reserve_date?: string;
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
	parking_area_id: 
}
  