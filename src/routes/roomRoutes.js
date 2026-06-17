import express from "express";

import {
  getRooms,
  getAvailability,
} from "../controllers/roomController.js";

const router = express.Router();

router.get("/", getRooms);

router.get(
  "/:id/availability",
  getAvailability
);

export default router;