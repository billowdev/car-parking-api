import { Request, Response } from "express";
import { newResponse, parseStringQuery } from "../utils/common.util";
import { generateTokens, decodeToken, verifyToken } from "../utils/jwt.util";
import jwt from "jsonwebtoken";

import {
  IAPIResponse,
  IUser,
  IUserFilter,
  IPaginationOptions,
  IGetAllUserOptions,
  ErrorResponse,
  ErrorArray
} from "../interfaces";

import os from "os";
import { IDateFilterOptions } from "./../interfaces/common.interface";
import UserService from "./../services/user.service";
import { JWT_SECRET_KEY } from "./../configs/config";
import { validationResult } from 'express-validator';

const hostname = os.hostname();

export const UserController = {
  async refresh(req: Request, res: Response) {
    const refreshToken = req.body.refresh_token;

    try {
      // Verify the refresh token
      const verify = verifyToken(refreshToken);
      const decoded = decodeToken(refreshToken);

      // Assuming you extract the necessary user information from the refresh token
      const sub = decoded.sub ?? "";
      const user = await UserService.getUserById(parseInt(sub)); // Fetch user from database based on userId

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Generate new tokens for the user
      const { access_token, refresh_token: newRefreshToken } = generateTokens({
        sub: sub,
        role: user.role,
        name: user.name,
      });

      // Send the new access token and refresh token back to the client
      return res
        .status(200)
        .json({ access_token, refresh_token: newRefreshToken });
    } catch (error) {
      console.error("Error refreshing token:", error);
      return res.status(401).json({ message: "Invalid refresh token" });
    }
  },
  async login(req: Request, res: Response) {
    try {
      const username = req.body.username.toLowerCase();
      const credentials = {
        username: username,
        password: req.body.password,
      };
      const token = await UserService.login(credentials);
      return newResponse<any>(res, 200, "SUCCESS", token);
    } catch (error: unknown) {
      const errMsg = (error as Error)?.message ?? ""; // Type assertion to inform TypeScript that 'error' is of type 'Error'
      console.log("---UserController---");
      console.log(error);
      console.log("-----");
      return newResponse<string>(res, 400, "FAILED", errMsg);
    }
  },
  async register(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const response: ErrorResponse<ErrorArray> = {
          errors: errors.array(),
        };
        return newResponse(res, 400, "FAILED", response);
      }

      const body = req.body;
      if (body.email) {
        body.email = body.email.toLowerCase();
      }
      if (body.username) {
        body.username = body.username.toLowerCase();
      }
      body.role = "user";
      const newUser = await UserService.createUser(body);
      return newResponse<typeof newUser>(res, 200, "SUCCESS", newUser);
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
      const body = req.body;
      if (body.email) {
        body.email = body.email.toLowerCase();
      }
      if (body.username) {
        body.username = body.username.toLowerCase();
      }
      const newUser = await UserService.createUser(body);
      if (body.role && !["admin", "user"].includes(body.role)) {
        throw new Error("Invalid role. Role must be 'admin' or 'user'.");
      }
      return newResponse<typeof newUser>(res, 200, "SUCCESS", newUser);
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
      const email = parseStringQuery(req.query.email)?.toLowerCase() ?? "";
      const username =
        parseStringQuery(req.query.username)?.toLowerCase() ?? "";

      const filters: IUserFilter | IDateFilterOptions = {
        email: email,
        username: username,
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
    try {
      const { id } = req.params;
      const user = await UserService.getUserById(parseInt(id));
      if (!user) {
        return newResponse<{ error: string }>(res, 404, "FAILED", {
          error: "User not found",
        });
      }
      return newResponse<typeof user>(res, 200, "SUCCESS", user);
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
      const body = req.body;
      if (body.email) {
        body.email = body.email.toLowerCase();
      }
      if (body.username) {
        body.username = body.username.toLowerCase();
      }
      const existing = await UserService.getUserById(parseInt(id));
      const updatedUser = await UserService.updateUser(parseInt(id), body);
      if (body.role && !["admin", "user"].includes(body.role)) {
        throw new Error("Invalid role. Role must be 'admin' or 'user'.");
      }
      return newResponse<typeof updatedUser>(res, 200, "SUCCESS", updatedUser);
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
      return newResponse<null>(res, 200, "SUCCESS", null);
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
