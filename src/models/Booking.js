import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
    },

    date: String,

    startTime: String,

    endTime: String,

    title: String,

    bookedBy: {
      name: String,
      email: String,
    },

    status: {
      type: String,
      default: "confirmed",
    },

    version: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "Booking",
  bookingSchema
);