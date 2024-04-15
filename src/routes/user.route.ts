import UserController from "../controllers/user.controller";
import express from "express";
import { ROLE_ENUM } from "../configs/config";
import {
  authMiddleware,
  roleMiddleware,
} from "./../middlewares/auth.middleware";

const router = express.Router();

router.post("/refresh", UserController.refresh);
router.post("/login", UserController.login);
router.post(
  "/register",
  UserController.register
);
router.post(
  "/",
  authMiddleware,
  roleMiddleware(ROLE_ENUM.ADMIN),
  UserController.createUser
);
router.get(
  "/",
  authMiddleware,
  roleMiddleware(ROLE_ENUM.ADMIN),
  UserController.getAllUsers
);
router.get(
  "/:id",
  authMiddleware,
  roleMiddleware(ROLE_ENUM.ADMIN),
  UserController.getUserById
);
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(ROLE_ENUM.ADMIN),
  UserController.updateUser
);
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(ROLE_ENUM.ADMIN),
  UserController.deleteUser
);

export default router;
