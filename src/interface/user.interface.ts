
export interface IUser {
	id: number; 
	name: string; 
	username: string; 
	password: string; 
	email: string; 
	phone_number: string; 
	role: "USER" | "ADMIN";
	created_at: Date;
	updated_at: Date;
}
