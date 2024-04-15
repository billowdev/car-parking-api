import { PrismaClient } from "@prisma/client";
import { generatePaginationLinks } from "./../utils/pagination.util";
import { applyFilters, applyDateFilters } from "./../utils/pagination.util";

import {
  IParkingArea,
  IParkingAreaResponse,
  IParkingAreaFilter,
  IPaginationResponse,
  IPaginationOptions,
  IDateFilterOptions
} from "../interfaces";

const prisma = new PrismaClient();

const ParkingAreaService = {
  async createParkingArea(payload: IParkingArea) {
    // Check for duplicate name
    const existingName = await prisma.parkingArea.findFirst({
      where: { name: payload.name },
    });

    if (existingName) {
      throw new Error("Parking area name is already in use.");
    }

    // Create the parking area
    return prisma.parkingArea.create({
      select: {
        id: true,
        name: true,
        is_reserved: true,
        created_at: true,
        updated_at: true,
      },
      data: payload,
    });
  },

  async getAllParkingArea(
    options: IPaginationOptions,
    filters: IParkingAreaFilter | IDateFilterOptions
  ) {
    let page = options.page ?? 1;
    let page_size = options.page_size ?? 10;
    let host = options.host ?? "";

    const skip = (page - 1) * page_size;
    let where: any = {};

    await applyFilters<IParkingAreaFilter>(
      where,
      filters,
      ["id", "name"],
      "contains"
    );

    await applyFilters<IParkingAreaFilter>(
      where,
      filters,
      ["is_reserved"],
      "exact"
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

    const result: IParkingAreaResponse[] = await prisma.parkingArea.findMany({
      select: {
        id: true,
        name: true,
        is_reserved: true,
        created_at: true,
        updated_at: true,
      },
      where,
      skip,
      take: page_size,
    });

    const total_count = await prisma.user.count({ where });
    const total_pages = Math.ceil(total_count / page_size);

    const paginationResponse: IPaginationResponse<IParkingAreaResponse[]> = {
      links: generatePaginationLinks(host, page, page_size, total_pages),
      total: total_count,
      page,
      page_size,
      total_pages,
      rows: result,
    };
    return paginationResponse;
  },

  async getParkingAreaById(id: number) {
    return prisma.parkingArea.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        is_reserved: true,
        created_at: true,
        updated_at: true,
      },
    });
  },

  async updateParkingArea(id: number, payload: IParkingArea) {
    // Check for duplicate name
    const existingName = await prisma.parkingArea.findFirst({
      where: {
        name: payload.name.toLowerCase(),
        NOT: {
          id: id,
        },
      },
    });

    if (existingName) {
      throw new Error("Parking area name is already in use.");
    }

    // Update the parking area
    return prisma.parkingArea.update({
      where: { id },
      select: {
        id: true,
        name: true,
        is_reserved: true,
        created_at: true,
        updated_at: true,
      },
      data: payload
    });
  },

  async deleteParkingArea(id: number) {
    return prisma.parkingArea.delete({
      where: { id },
    });
  },
};

export default ParkingAreaService;
