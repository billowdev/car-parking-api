// services/UserService.ts
import { PrismaClient } from '@prisma/client';
import { IUser } from './../types/user.type';

const prisma = new PrismaClient();

const UserService = {

  // async generateToken()

  async createUser(userData: IUser) {
    return prisma.user.create({
      data: userData,
    });
  },

  async getAllUsers() {
    return prisma.user.findMany();
  },

  async getUserById(id: string) {
    return prisma.user.findUnique({
      where: { id },
    });
  },

  async updateUser(id: string, userData: any) {
    return prisma.user.update({
      where: { id },
      data: userData,
    });
  },

  async deleteUser(id: string) {
    return prisma.user.delete({
      where: { id },
    });
  },
};

export default UserService;
