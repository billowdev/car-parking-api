// seed.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seedData() {
  try {
    // Seed data for Reserving
    const reservingData = [
      {
        plate_number: "ABC123",
        vehicle_brand: "Toyota",
        price: 50.0,
        reserve_date: new Date(),
        user_id: 1,
        parking_area_id: 1,
      },
      {
        plate_number: "DEF456",
        vehicle_brand: "Honda",
        price: 50.0,
        reserve_date: new Date(),
        user_id: 2,
        parking_area_id: 2,
      },
    ];

    const parkingAreaData = [
      {
        id: 1,
        name: "A",
        is_reserved: false,
      },
      {
        id: 2,
        name: "B",
        is_reserved: true,
      },
      {
        id: 3,
        name: "C",
        is_reserved: false,
      },
      {
        id: 4,
        name: "D",
        is_reserved: false,
      },
      {
        id: 5,
        name: "E",
        is_reserved: false,
      },
      {
        id: 6,
        name: "F",
        is_reserved: false,
      },
    ];
    await prisma.parkingArea.createMany({
      data: parkingAreaData,
    });

    // Insert seed data into the database
    await prisma.reserving.createMany({
      data: reservingData,
    });


    console.log(
      "Seed data for Reserving and ParkingArea inserted successfully"
    );
  } catch (error) {
    console.error("Error seeding data:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Call the seed function
seedData();
