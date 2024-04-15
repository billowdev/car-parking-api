import { Request, Response } from "express";
import { newResponse, parseStringQuery } from "../utils/common.util";
import { IDateFilterOptions } from "./../interfaces/common.interface";
import os from "os";
import ParkingAreaService from "./../services/parking-area.service";
const hostname = os.hostname();

export const ParkingAreaController = {
  async createParkingArea(req: Request, res: Response) {
	try {
		const body = req.body;	

	} catch (error) {
		
	}
  },
};
