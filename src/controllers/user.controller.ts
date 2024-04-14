// controllers/UserController.ts
import { Request, Response } from 'express';
import UserService from '../services/user.service';
import {newResponse} from '../utils/common.util';
import { IUser } from './../types/user.type';

const UserController = {
  async login(req: Request, res: Response) {
    try {
      newResponse<any>(res, 200, "SUCCESS", {})
    } catch (error) {
      res.status(400).json({ error: 'logged in was failed'});
    }
  },

  async createUser(req: Request, res: Response) {
    try {
      const newUser = await UserService.createUser(req.body);
      res.json(newUser);
    } catch (error) {
      res.status(400).json({ error: 'Could not create user' });
    }
  },

  async getAllUsers(req: Request, res: Response) {
    try {
      const users = await UserService.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(400).json({ error: 'Could not fetch users' });
    }
  },

  async getUserById(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const user = await UserService.getUserById(id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      res.status(400).json({ error: 'Could not fetch user' });
    }
  },

  async updateUser(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const updatedUser = await UserService.updateUser(id, req.body);
      res.json(updatedUser);
    } catch (error) {
      res.status(400).json({ error: 'Could not update user' });
    }
  },

  async deleteUser(req: Request, res: Response) {
    const { id } = req.params;
    try {
      await UserService.deleteUser(id);
      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      res.status(400).json({ error: 'Could not delete user' });
    }
  },
};

export default UserController;
