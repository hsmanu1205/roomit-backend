import Waitlist from "../models/Waitlist.js";

export const joinWaitlistController =
  async (req, res) => {
    try {

      const waitlist =
        await Waitlist.create(
          req.body
        );

      res.status(201).json({
        success: true,
        waitlist,
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message: error.message,
      });

    }
  };

export const getWaitlistController =
  async (req, res) => {
    try {

      const entries =
        await Waitlist.find({
          roomId: req.params.roomId,
        });

      res.status(200).json({
        success: true,
        entries,
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message: error.message,
      });

    }
  };