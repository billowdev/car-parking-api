import UserController from "../controllers/user.controller";
import express from "express";
import { ROLE_ENUM } from "../configs/config";
import { authMiddleware, roleMiddleware} from './../middlewares/auth.middleware';

const router = express.Router();

router.post("/login", UserController.login);
router.post("/", UserController.createUser);
router.get(
  "/",
  authMiddleware,
  roleMiddleware(ROLE_ENUM.ADMIN),
  UserController.getAllUsers
);
router.get("/:id", UserController.getUserById);
router.put("/:id", UserController.updateUser);
router.delete("/:id", UserController.deleteUser);

export default router;
