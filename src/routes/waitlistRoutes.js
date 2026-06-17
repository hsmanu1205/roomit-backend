import express from "express";

import {
  joinWaitlistController,
  getWaitlistController,
} from "../controllers/waitlistController.js";

const router = express.Router();

router.post(
  "/",
  joinWaitlistController
);

router.get(
  "/:roomId",
  getWaitlistController
);

export default router;