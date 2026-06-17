import express from "express";

import {
  createBookingController,
  getBookingsController,
  cancelBookingController,
  rescheduleBookingController,
} from "../controllers/bookingController.js";

const router = express.Router();

router.post(
  "/",
  createBookingController
);

router.get(
  "/",
  getBookingsController
);

router.patch(
  "/:id/cancel",
  cancelBookingController
);

router.patch(
  "/:id/reschedule",
  rescheduleBookingController
);

export default router;