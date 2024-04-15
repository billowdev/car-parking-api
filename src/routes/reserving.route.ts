import { ROLE_ENUM } from "../configs/config";
import express from "express";
import { body } from "express-validator";
import { ReservingController } from "./../controllers/reserving.controller";
import {
  authMiddleware,
  roleMiddleware,
} from "./../middlewares/auth.middleware";

const router = express.Router();

router.post(
  "/",
  body("plate_number").notEmpty().isString().trim(),
  body("price").notEmpty().isNumeric(),
  body("parking_area_id").notEmpty().isInt(),
  body("start_time").notEmpty().isString().trim().isISO8601(),
  body("end_time").notEmpty().isString().trim().isISO8601(),
  authMiddleware,
  ReservingController.createReserving
);

router.put(
  "/:id",
  body("plate_number").notEmpty().isString().trim(),
  body("price").notEmpty().isNumeric(),
  body("parking_area_id").notEmpty().isInt(),
  body("start_time").notEmpty().isString().trim().isISO8601(),
  body("end_time").notEmpty().isString().trim().isISO8601(),
  authMiddleware,
  ReservingController.updateReserving
);
router.get("/:id", authMiddleware, ReservingController.getReservingById);


router.get("", authMiddleware, ReservingController.getAllReserving);

router.delete(
  "/:id",
  authMiddleware,
  ReservingController.deleteReserving
);

export default router;
