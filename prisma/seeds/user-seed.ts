// user-seed.ts
import { PrismaClient } from '@prisma/client';
import { hashPassword } from "../../src/utils/password.util"
import { ROLE_ENUM } from '../../src/configs/config';
const prisma = new PrismaClient();

async function seedUsers() {
	const hashing: string = await hashPassword("1234")
  try {
    // Seed data for users
    const users = [
      {
        id: 1,
        name: 'John Doe',
        username: 'johndoe',
        password: hashing,
        email: 'john@example.com',
        phone_number: '+1234567890',
        role: ROLE_ENUM.USER,
      },
      {
        id: 2,
        name: 'Jane Smith',
        username: 'janesmith',
        password: hashing,
        email: 'jane@example.com',
        phone_number: '+0987654321',
        role: ROLE_ENUM.ADMIN,
      },
      {
        id: 3,
        name: 'admin Smith',
        username: 'admin',
        password: hashing,
        email: 'admin@gmail.com',
        phone_number: '+0987654322',
        role: ROLE_ENUM.ADMIN,
      },
    ];

    // Insert seed data into the database
    for (const user of users) {
      for (const user of users) {
        try {
          await prisma.user.create({
            data: user,
          });
        } catch (error) {
          // Handle the error gracefully, or simply ignore it if you don't need to take any action
          console.error("Error creating user:", error);
        }
      }
      
    }

    console.log('Seed data for users inserted successfully');
  } catch (error) {
    console.error('Error seeding users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Call the seed function
seedUsers();
