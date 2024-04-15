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
  async createParkingArea(payload: IParkingArea) {
    // Check for duplicate name
    const existingName = await prisma.reserving.findFirst({
      where: { name: payload.name },
    });

    if (existingName) {
      throw new Error("Parking area name is already in use.");
    }

    return prisma.reserving.create({
      select: {
        id: true,
        plate_number: true,
        vehicle_brand: true,
        price: true,
        reserve_date: true,
        created_at: true,
        updated_at: true,
      },
      data: payload,
    });
  },
};
