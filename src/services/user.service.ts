// services/UserService.ts
import { PrismaClient } from "@prisma/client";
import { hashPassword, verifyPassword } from "../utils/password.util";
import {
  IUser,
  IUserFilter,
  IPaginationResponse,
  IGetAllUserOptions,
  IGetAllUserResponse,
  IPaginationOptions,
} from "./../interfaces";
import { generatePaginationLinks } from "./../utils/pagination.util";
import { applyFilters, applyDateFilters } from "./../utils/pagination.util";
import { IDateFilterOptions } from "./../interfaces/common.interface";
import { generateToken, generateTokens, ITokenResponse } from "./../utils/jwt.util";
import { ITokenClaims } from "./../utils/jwt.util";
import { relativeTimeRounding } from "./../../node_modules/moment/moment.d";

const prisma = new PrismaClient();

const UserService = {
  async login(c: { username: string; password: string }) {
    const username = c.username;
    const user = await prisma.user.findFirst({
      where: { username },
    })

    const hashedPassword = user?.password ?? "";
    const validatePassword = await verifyPassword(hashedPassword, c.password);
    if (validatePassword && user && user.id) {
      const subject = user?.id?.toString();
      const name = user?.name;
      const role = user?.role;
      const userClaims = {
        sub: subject,
        name: name,
        role: role,
      };
      const token: ITokenResponse = generateTokens(userClaims)
      // const token = generateToken(userClaims);
      return token
    } else {
      throw new Error("Error verifying password");
    }
  },

  async createUser(userData: IUser) {
    const pwd = userData?.password as string
    const hasing: string = await hashPassword(pwd);
    return prisma.user.create({
      data: {
        ...userData,
        password: hasing,
      },
    });
  },

  async getAllUsers(
    options: IPaginationOptions,
    filters: IUserFilter | IDateFilterOptions
  ): Promise<any> {
    let page = options.page ?? 1;
    let page_size = options.page_size ?? 10;
    let host = options.host ?? "";

    const skip = (page - 1) * page_size;
    let where: any = {};

    await applyFilters<IUserFilter>(
      where,
      filters,
      ["username", "email", "phone_number", "id"],
      "contains"
    );

    const dateFilters: IDateFilterOptions = {
      created_at: filters.created_at,
      updated_at: filters.updated_at,
      range_filter_field: filters.range_filter_field,
      created_after: filters.created_after,
      updated_after: filters.updated_after,
      created_before: filters.created_before,
      updated_before: filters.updated_before,
      start: filters.start,
      end: filters.end,
    };

    await applyDateFilters(where, dateFilters);

    const total_count = await prisma.user.count({ where });
    const total_pages = Math.ceil(total_count / page_size);

    const users: IGetAllUserResponse[] = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        phone_number: true,
        role: true,
        created_at: true,
        updated_at: true,
      },
      where,
      skip,
      take: page_size,
    });

    const paginationResponse: IPaginationResponse<IGetAllUserResponse[]> = {
      links: generatePaginationLinks(host, page, page_size, total_pages),
      total: total_count,
      page,
      page_size,
      total_pages,
      rows: users,
    };
    return paginationResponse;
  },

  async getUserById(id: number) {
    return prisma.user.findUnique({
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
        phone_number: true,
        role: true,
        created_at: true,
        updated_at: true,
      },
      where: { id },
    });
  },

  async updateUser(id: number, userData: any) {
    return prisma.user.update({
      where: { id },
      data: userData,
    });
  },

  async deleteUser(id: number) {
    return prisma.user.delete({
      where: { id },
    });
  },
};

export default UserService;
