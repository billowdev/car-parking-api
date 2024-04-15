import { IUser } from './user.interface';


export interface IReserving {
	id: number;
	plate_number: string;
	vehicle_brand: string;
	price: number;
	reserve_date: Datetime;
	user_id: number;
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
  