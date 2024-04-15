import { PrismaClient } from "@prisma/client";

import { generatePaginationLinks } from "./../utils/pagination.util";
import { applyFilters, applyDateFilters } from "./../utils/pagination.util";

import {
  IReserving,
  IReservingResponse,
  IReservingFilter,
  IPaginationResponse,
  IPaginationOptions,
  IDateFilterOptions,
} from "../interfaces";

const prisma = new PrismaClient();

const ReservingService = {
  async createReserving(payload: IReserving) {
    // Check for duplicate name
    const parkingAreaReserved = await prisma.reserving.findFirst({
      where: {
        parking_area_id: payload.parking_area_id,
        NOT: {
          user_id: payload.user_id,
        },
      },
    });

    if (parkingAreaReserved) {
      const endTime = parkingAreaReserved.end_time;
      const currentTime = new Date();
      if (!(endTime < currentTime)) {
        throw new Error("Parking area is already on reserved.");
      }
    }

    const alreadyReserved = await prisma.reserving.findFirst({
      where: {
        parking_area_id: payload.parking_area_id,
        user_id: payload.user_id,
        status: "reserved",
      },
    });

    if (alreadyReserved) {
      const endTime = alreadyReserved.end_time;
      const currentTime = new Date();
      if (!(endTime < currentTime)) {
        throw new Error("Parking area is already on reserved.");
      }
    }

    const { plate_number, vehicle_brand, price, start_time, end_time } =
      payload;

    // Validate payload data
    if (!plate_number || !vehicle_brand || !price || !start_time || !end_time) {
      throw new Error("Invalid payload data");
    }

    // Convert start_time and end_time to ISO string format
    const startTime = new Date(start_time);
    const endTime = new Date(end_time);

    // Check if start_time is before end_time
    if (startTime >= endTime) {
      throw new Error("Start time must be before end time");
    }

    const data = {
      plate_number: plate_number,
      vehicle_brand: vehicle_brand,
      price: price,
      start_time: startTime.toISOString(),
      end_time: endTime.toISOString(),
      status: "reserved", // Using uppercase for consistency
      user: {
        connect: { id: payload.user_id },
      },
      parking_area: {
        connect: { id: payload.parking_area_id },
      },
    };
    return prisma.reserving.create({
      select: {
        id: true,
        plate_number: true,
        vehicle_brand: true,
        status: true,
        price: true,
        start_time: true,
        end_time: true,
        parking_area_id: true,
        user_id: true,
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            email: true,
            phone_number: true,
            role: true,
            created_at: true,
            updated_at: true,
          },
        },
        parking_area: {
          select: {
            id: true,
            name: true,
            is_reserved: true,
            created_at: true,
            updated_at: true,
          },
        },
        created_at: true,
        updated_at: true,
      },
      data: data,
    });
  },

  async getAllReserving(
    options: IPaginationOptions,
    filters: IReservingFilter
  ) {
    let page = options.page ?? 1;
    let page_size = options.page_size ?? 10;
    let host = options.host ?? "";

    const skip = (page - 1) * page_size;
    let where: any = {};

    await applyFilters<IReservingFilter>(
      where,
      filters,
      ["plate_number", "vehicle_brand"],
      "contains"
    );

    await applyFilters<IReservingFilter>(
      where,
      filters,
      ["parking_area_id", "user_id"],
      "exact"
    );

    interface IReservingDate {
      start_time?: string;
      end_time?: string;
    }
    const reservingDate: IReservingDate = {
      start_time: filters.start_time,
      end_time: filters.end_time,
    };
    // await applyDateGenericFilters<>(where, reservingDate);
    await applyDateFilters(where, reservingDate);

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

    const result: IReservingResponse[] = await prisma.reserving.findMany({
      select: {
        id: true,
        plate_number: true,
        vehicle_brand: true,
        price: true,
        status: true,
        start_time: true,
        end_time: true,
        parking_area_id: true,
        user_id: true,
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            email: true,
            phone_number: true,
            role: true,
            created_at: true,
            updated_at: true,
          },
        },
        parking_area: {
          select: {
            id: true,
            name: true,
            is_reserved: true,
            created_at: true,
            updated_at: true,
          },
        },
        created_at: true,
        updated_at: true,
      },
      where,
      skip,
      take: page_size,
    });

    const total_count = await prisma.reserving.count({ where });
    const total_pages = Math.ceil(total_count / page_size);

    const paginationResponse: IPaginationResponse<IReservingResponse[]> = {
      links: generatePaginationLinks(host, page, page_size, total_pages),
      total: total_count,
      page,
      page_size,
      total_pages,
      rows: result,
    };
    return paginationResponse;
  },
};

export default ReservingService;
