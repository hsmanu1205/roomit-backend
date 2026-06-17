import {
  createBooking,
  getBookingsByEmail,
  cancelBooking,
  rescheduleBooking,
} from "../services/bookingService.js";

export const createBookingController =
  async (req, res) => {
    try {
      await createBooking(req.body);

      res.status(201).json({
        success: true,
        message: "Booking Created",
      });
    } catch (error) {
      if (
        error.message ===
        "Slot already booked"
      ) {
        return res.status(409).json({
          success: false,
          message: error.message,
        });
      }

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

export const getBookingsController =
  async (req, res) => {
    try {
      const bookings =
        await getBookingsByEmail(
          req.query.email
        );

      res.status(200).json({
        success: true,
        bookings,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

export const cancelBookingController =
  async (req, res) => {
    try {
      await cancelBooking(
        req.params.id
      );

      res.status(200).json({
        success: true,
        message:
          "Booking Cancelled",
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };

  export const rescheduleBookingController =
  async (req, res) => {
    try {

      await rescheduleBooking(
        req.params.id,
        req.body
      );

      res.status(200).json({
        success: true,
        message:
          "Booking Rescheduled",
      });

    } catch (error) {

      if (
        error.message ===
        "Target slot already booked"
      ) {
        return res.status(409).json({
          success: false,
          message: error.message,
        });
      }

      if (
        error.message ===
        "Booking changed. Please refresh."
      ) {
        return res.status(409).json({
          success: false,
          message: error.message,
        });
      }

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };