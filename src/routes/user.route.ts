import UserController from "../controllers/user.controller";
import express from "express";
import { ROLE_ENUM } from "../configs/config";
import {
  authMiddleware,
  roleMiddleware,
} from "./../middlewares/auth.middleware";
import { body, validationResult } from "express-validator";

const router = express.Router();

router.post("/refresh", UserController.refresh);
router.post("/login", UserController.login);
router.post(
  "/register",
  [
    body("email").notEmpty().isEmail().normalizeEmail(),
    body("username").notEmpty().isString().trim(),
    body("password")
      .notEmpty()
      .isString()
      .trim()
      .matches(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()-_=+{};:,<.>]).{8,}$/
      )
      .withMessage(
        "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character."
      ),
    body("role")
      .notEmpty()
      .isString()
      .trim()
      .isIn(["user", "admin"])
      .withMessage('Role must be either "user" or "admin"'),
  ],
  UserController.register
);
router.post(
  "/",

  [
    body("email").notEmpty().isEmail().normalizeEmail(),
    body("username").notEmpty().isString().trim(),
    body("password")
      .notEmpty()
      .isString()
      .trim()
      .matches(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()-_=+{};:,<.>]).{8,}$/
      )
      .withMessage(
        "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character."
      ),
    body("role")
      .notEmpty()
      .isString()
      .trim()
      .isIn(["user", "admin"])
      .withMessage('Role must be either "user" or "admin"'),
  ],

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
