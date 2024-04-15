import { Request, Response } from "express";
import { newResponse, parseStringQuery } from "../utils/common.util";
import {
  IAPIResponse,
  IUser,
  IUserFilter,
  IPaginationOptions,
  IGetAllUserOptions,
} from "../interfaces";

import os from "os";
import { IDateFilterOptions } from "./../interfaces/common.interface";
import UserService from './../services/user.service';
const hostname = os.hostname();

export const UserController = {
  async login(req: Request, res: Response) {
    try {
      const credentials = {
        username: req.body.username,
        password: req.body.password,
      }
      const token = await UserService.login(credentials)
      return newResponse<any>(res, 200, "SUCCESS", token);
    } catch (error: unknown) {
      const errMsg = (error as Error)?.message ?? ""; // Type assertion to inform TypeScript that 'error' is of type 'Error'
      console.log("---UserController---");
      console.log(error);
      console.log("-----");
      return newResponse<string>(res, 400, "FAILED", errMsg);
    }
  },

  async createUser(req: Request, res: Response) {
    try {
      const newUser = await UserService.createUser(req.body);
      res.json(newUser);
    } catch (error: unknown) {
      const errMsg = (error as Error)?.message ?? ""; // Type assertion to inform TypeScript that 'error' is of type 'Error'
      console.log("---UserController---");
      console.log(error);
      console.log("-----");
      return newResponse<string>(res, 400, "FAILED", errMsg);
    }
  },

  async getAllUsers(req: Request, res: Response) {
    try {
      const host = req.protocol + "://" + req.get("host") + req.originalUrl;
      const filters: IUserFilter | IDateFilterOptions = {
        email: parseStringQuery(req.query.email),
        username: parseStringQuery(req.query.username),
        phone_number: parseStringQuery(req.query.phone_number),
        id: parseStringQuery(req.query.id),
        name: parseStringQuery(req.query.name),
        role: parseStringQuery(req.query.role),

        created_at: parseStringQuery(req.query.created_at),
        updated_at: parseStringQuery(req.query.updated_at),

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

      const users = await UserService.getAllUsers(params, filters);
      // res.json(users);
      return newResponse<typeof users>(res, 200, "SUCCESS", users);
    } catch (error: unknown) {
      const errMsg = (error as Error)?.message ?? ""; // Type assertion to inform TypeScript that 'error' is of type 'Error'
      console.log("---UserController---");
      console.log(error);
      console.log("-----");
      return newResponse<string>(res, 400, "FAILED", errMsg);
    }
  },

  async getUserById(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const user = await UserService.getUserById(parseInt(id));
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error: unknown) {
      const errMsg = (error as Error)?.message ?? ""; // Type assertion to inform TypeScript that 'error' is of type 'Error'
      console.log("---UserController---");
      console.log(error);
      console.log("-----");
      return newResponse<string>(res, 400, "FAILED", errMsg);
    }
  },

  async updateUser(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const updatedUser = await UserService.updateUser(parseInt(id), req.body);
      res.json(updatedUser);
    } catch (error: unknown) {
      const errMsg = (error as Error)?.message ?? ""; // Type assertion to inform TypeScript that 'error' is of type 'Error'
      console.log("---UserController---");
      console.log(error);
      console.log("-----");
      return newResponse<string>(res, 400, "FAILED", errMsg);
    }
  },

  async deleteUser(req: Request, res: Response) {
    const { id } = req.params;
    try {
      await UserService.deleteUser(parseInt(id));
      res.json({ message: "User deleted successfully" });
    } catch (error: unknown) {
      const errMsg = (error as Error)?.message ?? ""; // Type assertion to inform TypeScript that 'error' is of type 'Error'
      console.log("---UserController---");
      console.log(error);
      console.log("-----");
      return newResponse<string>(res, 400, "FAILED", errMsg);
    }
  },
};

export default UserController;
