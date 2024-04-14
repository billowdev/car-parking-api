// routes/userRoutes.ts
import express from 'express';
import UserController from '../controllers/user.controller';

const router = express.Router();

router.post('/login', UserController.login);
router.post('/', UserController.createUser);
router.get('/', UserController.getAllUsers);
router.get('/:id', UserController.getUserById);
router.put('/:id', UserController.updateUser);
router.delete('/:id', UserController.deleteUser);

export default router;
