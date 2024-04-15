import { Request, Response } from "express";
import UserService from "../services/user.service";
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
const hostname = os.hostname();

export const UserController = {
  async login(req: Request, res: Response) {
    try {
      newResponse<any>(res, 200, "SUCCESS", {});
    } catch (error) {
      res.status(400).json({ error: "logged in was failed" });
    }
  },

  async createUser(req: Request, res: Response) {
    try {
      const newUser = await UserService.createUser(req.body);
      res.json(newUser);
    } catch (error) {
      res.status(400).json({ error: "Could not create user" });
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
      res.json(users);
    } catch (error) {
      console.log("--------------------------------")
      console.log(error)
      console.log("--------------------------------")
      res.status(400).json({ error: "Could not fetch users" });
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
    } catch (error) {
      res.status(400).json({ error: "Could not fetch user" });
    }
  },

  async updateUser(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const updatedUser = await UserService.updateUser(parseInt(id), req.body);
      res.json(updatedUser);
    } catch (error) {
      res.status(400).json({ error: "Could not update user" });
    }
  },

  async deleteUser(req: Request, res: Response) {
    const { id } = req.params;
    try {
      await UserService.deleteUser(parseInt(id));
      res.json({ message: "User deleted successfully" });
    } catch (error) {
      res.status(400).json({ error: "Could not delete user" });
    }
  },
};

export default UserController;
