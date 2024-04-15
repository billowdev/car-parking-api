import { Request, Response } from "express";
import { newResponse, parseStringQuery } from "../utils/common.util";
import {
  IReservingFilter,
  IDateFilterOptions,
  ErrorResponse,
  ErrorArray,
  IPaginationOptions,
} from "./../interfaces";
import ReservingService from "./../services/reserving.service";

import os from "os";
import { validationResult } from "express-validator";

const hostname = os.hostname();

export const ReservingController = {
  async createReserving(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const response: ErrorResponse<ErrorArray> = {
          errors: errors.array(),
        };
        return newResponse(res, 400, "FAILED", response);
      }
      const body = req.body;
      const resp = await ReservingService.createReserving(body);
      return newResponse<typeof resp>(res, 200, "SUCCESS", resp);
    } catch (error) {
      const errMsg = (error as Error)?.message ?? ""; // Type assertion to inform TypeScript that 'error' is of type 'Error'
      console.log("---ParkingAreaController->createReserving---");
      console.log(error);
      console.log("-----");
      return newResponse<string>(res, 400, "FAILED", errMsg);
    }
  },

  async getAllReserving(req: Request, res: Response) {
    try {
      const host = req.protocol + "://" + req.get("host") + req.originalUrl;
      const filters: IReservingFilter | IDateFilterOptions = {
        id: parseStringQuery(req.query.id),
        plate_number: parseStringQuery(req.query.plate_number),
        vehicle_brand: parseStringQuery(req.query.vehicle_brand),
        price: parseStringQuery(req.query.price),
        start_time: parseStringQuery(req.query.start_time),
        end_time: parseStringQuery(req.query.end_time),
        user_id: parseStringQuery(req.query.user_id),
        parking_area_id: parseStringQuery(req.query.parking_area_id),
        
        user_name: parseStringQuery(req.query.user_name),
        user_email: parseStringQuery(req.query.user_email),
        user_username: parseStringQuery(req.query.user_username),

        range_filter_field: parseStringQuery(req.query.range_filter_field),
        created_after: parseStringQuery(req.query.created_after),
        updated_after: parseStringQuery(req.query.updated_after),
        created_before: parseStringQuery(req.query.created_before),
        updated_before: parseStringQuery(req.query.updated_before),
        start: parseStringQuery(req.query.start),
        end: parseStringQuery(req.query.end),
      };
      const page = parseInt((req.query.page as string) ?? "1");

      const page_size = parseInt((req.query.page_size as string) ?? "10");
      const params: IPaginationOptions = {
        page,
        page_size,
        host,
      };
      const resp = await ReservingService.getAllReserving(params, filters);
      return newResponse<typeof resp>(res, 200, "SUCCESS", resp);
    } catch (error) {
      const errMsg = (error as Error)?.message ?? ""; // Type assertion to inform TypeScript that 'error' is of type 'Error'
      console.log("---ReservingController->getAllReserving---");
      console.log(error);
      console.log("-----");
      return newResponse<string>(res, 400, "FAILED", errMsg);
    }
  },
};
