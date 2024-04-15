import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

// Import the necessary interfaces and models
const prisma = new PrismaClient();

import { JWT_SECRET_KEY } from "../configs/config";
import { IUser } from "./../interfaces/user.interface";
import { ITokenPayload } from "../utils/jwt.util";

class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthError";
  }
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const token = req.headers.authorization?.split(" ")[1] as string;
    if (!token) {
      res.status(401).json({ message: "No token provided" });
    } else {
      const decodedToken = jwt.verify(
        token,
        JWT_SECRET_KEY as string
      ) as ITokenPayload;
      if (new Date().getTime() > decodedToken.exp * 1000) {
        throw new AuthError("Token expired");
      }

      const userID = decodedToken.sub as string;
      if (!userID) {
        throw new AuthError("Invalid Token");
      }
      const user = await prisma.user.findUnique({
        where: {
          id: parseInt(userID),
        },
      });

      if (!user) {
        throw new AuthError("Unauthorized");
      }

      const userInfo: IUser = {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        phone_number: user.phone_number,
        role: user.role,
        created_at: user.created_at,
        updated_at: user.updated_at,
      };
      req.user = userInfo;
      next();
    }
  } catch (error) {
    console.error(error);

    if (error instanceof AuthError) {
      res.status(401).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Internal server error" });
    }
  }
};

export const roleMiddleware = (role: string) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!("user" in req)) {
      throw new Error("Request object without user found unexpectedly");
    }

    const userRole = req.user!.role;

    if (userRole !== role) {
      res
        .status(403)
        .json({ message: `Only ${role}s can access this resource` });
    } else {
      next();
    }
  };
};
