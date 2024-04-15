import { Request, Response } from "express";
import { newResponse, parseStringQuery } from "../utils/common.util";
import {
  IParkingAreaFilter,
  IDateFilterOptions,
  IErrorResponse,
  IErrorArray,
  IPaginationOptions,
} from "./../interfaces";
import os from "os";
import ParkingAreaService from "./../services/parking-area.service";
import { validationResult } from "express-validator";

const hostname = os.hostname();

export const ParkingAreaController = {
  async createParkingArea(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const response: IErrorResponse<IErrorArray> = {
          errors: errors.array(),
        };
        return newResponse(res, 400, "FAILED", response);
      }
      const body = req.body;
      const resp = await ParkingAreaService.createParkingArea(body);
      return newResponse<typeof resp>(res, 200, "SUCCESS", resp);
    } catch (error) {
      const errMsg = (error as Error)?.message ?? ""; // Type assertion to inform TypeScript that 'error' is of type 'Error'
      console.log("---ParkingAreaController->createParkingArea---");
      console.log(error);
      console.log("-----");
      return newResponse<string>(res, 400, "FAILED", errMsg);
    }
  },

  async getAllParkingArea(req: Request, res: Response) {
    try {
      const host = req.protocol + "://" + req.get("host") + req.originalUrl;
      const filters: IParkingAreaFilter | IDateFilterOptions = {
        id: parseStringQuery(req.query.id),
        name: parseStringQuery(req.query.name),
        is_reserved: parseStringQuery(req.query.is_reserved),

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
      const resp = await ParkingAreaService.getAllParkingArea(params, filters);
      return newResponse<typeof resp>(res, 200, "SUCCESS", resp);
    } catch (error: unknown) {
      const errMsg = (error as Error)?.message ?? ""; // Type assertion to inform TypeScript that 'error' is of type 'Error'
      console.log("---ParkingAreaController->getAllParkingArea---");
      console.log(error);
      console.log("-----");
      return newResponse<string>(res, 400, "FAILED", errMsg);
    }
  },
  async getParkingAreaById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const resp = await ParkingAreaService.getParkingAreaById(parseInt(id));
      if (!resp) {
        return newResponse<{ error: string }>(res, 404, "FAILED", {
          error: "ParkingArea not found",
        });
      }
      return newResponse<typeof resp>(res, 200, "SUCCESS", resp);
    } catch (error: unknown) {
      const errMsg = (error as Error)?.message ?? ""; // Type assertion to inform TypeScript that 'error' is of type 'Error'
      console.log("---ParkingAreaController->getParkingAreaById---");
      console.log(error);
      console.log("-----");
      return newResponse<string>(res, 400, "FAILED", errMsg);
    }
  },
  async updateParkingArea(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const response: IErrorResponse<IErrorArray> = {
          errors: errors.array(),
        };
        return newResponse(res, 400, "FAILED", response);
      }
      const body = req.body;
      const information = await ParkingAreaService.updateParkingArea(
        parseInt(id),
        body
      );
      return newResponse<typeof information>(res, 200, "SUCCESS", information);
    } catch (error) {
      const errMsg = (error as Error)?.message ?? ""; // Type assertion to inform TypeScript that 'error' is of type 'Error'
      console.log("---ParkingAreaController->updateParkingArea---");
      console.log(error);
      console.log("-----");
      return newResponse<string>(res, 400, "FAILED", errMsg);
    }
  },

  async deleteParkingArea(req: Request, res: Response) {
    const { id } = req.params;
    try {
      await ParkingAreaService.deleteParkingArea(parseInt(id));
      return newResponse<null>(res, 200, "SUCCESS", null);
    } catch (error: unknown) {
      //   const errMsg = (error as Error)?.message ?? "";
      const errMsg = (error as Error)?.message ?? "";
      console.log("---ParkingAreaController->deleteParkingArea---");
      console.log(error);
      console.log("-----");
      return newResponse<string>(res, 400, "FAILED", "Something went wrong while delete parking area");
    }
  },
};

export default ParkingAreaController;
