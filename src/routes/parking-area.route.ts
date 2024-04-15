import { ROLE_ENUM } from "../configs/config";
import express from "express";
import { body } from "express-validator";
import ParkingAreaController from "../controllers/parking-area.controller";
import {
  authMiddleware,
  roleMiddleware,
} from "./../middlewares/auth.middleware";

const router = express.Router();
router.post(
  "/",
  [body("name").notEmpty().isString().trim()],
  authMiddleware,
  roleMiddleware(ROLE_ENUM.ADMIN),
  ParkingAreaController.createParkingArea
);

router.get("/", authMiddleware, ParkingAreaController.getAllParkingArea);

router.get("/:id", authMiddleware, ParkingAreaController.getParkingAreaById);

router.put(
  "/:id",
  [body("name").notEmpty().isString().trim()],
  authMiddleware,
  ParkingAreaController.updateParkingArea
);

router.delete(
  "/:id",
  authMiddleware,
  ParkingAreaController.deleteParkingArea
);

export default router;
