// seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedData() {
  try {
    // Seed data for Reserving
    const reservingData = [
      {
        plate_number: 'ABC123',
        vehicle_brand: 'Toyota',
        price: 50.00,
        reserve_date: new Date(),
        user_id: 1,
      },
      {
        plate_number: 'DEF456',
        vehicle_brand: 'Honda',
        price: 50.00,
        reserve_date: new Date(),
		user_id: 2,

      },
    ];

    // Seed data for ParkingArea
    const parkingAreaData = [
      {
        name: 'A',
        isReserved: false,
      },
      {
        name: 'B',
        isReserved: true,
      },
	  {
        name: 'C',
        isReserved: false,
      },
	  {
        name: 'D',
        isReserved: false,
      },
	  {
        name: 'E',
        isReserved: false,
      },
	  {
        name: 'F',
        isReserved: false,
      },
    ];

    // Insert seed data into the database
    await prisma.reserving.createMany({
      data: reservingData,
    });

    await prisma.parkingArea.createMany({
      data: parkingAreaData,
    });

    console.log('Seed data for Reserving and ParkingArea inserted successfully');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Call the seed function
seedData();
