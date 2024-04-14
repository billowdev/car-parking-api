export interface IAPIResponse<T> {
	code: string;
	message: string;
	data: T | unknown;
  }