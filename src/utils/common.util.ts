import { Request, Response } from 'express';
import { IAPIResponse } from './../types/common.type';

export const newResponse = <T>(res: Response, http_code: number, message: string, data: T) => {
	return res.status(http_code).json({
        message: message,
        data: data,
	})
}