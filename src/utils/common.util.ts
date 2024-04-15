import { Request, Response } from "express";
import { IAPIResponse } from "../interfaces/common.interface";

export const newResponse = <T>(
  res: Response,
  http_code: number,
  message: string,
  data: T
) => {
  return res.status(http_code).json({
    message: message,
    data: data,
  });
};

export const parseStringQuery = (
  param: any
): string | undefined => {
  if (Array.isArray(param)) {
    return param[0];
  }
  return param;
};
