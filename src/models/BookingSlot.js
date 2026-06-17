import mongoose from "mongoose";

const bookingSlotSchema = new mongoose.Schema({
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Room"
  },

  date: String,

  slotStart: String,

  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Booking"
  }
});

// Unique Index
bookingSlotSchema.index(
    {
        roomId: 1,
        date: 1,
        slotStart: 1
    },
    {
        unique:true
    }
);

export default mongoose.model(
    "BookingSlot",
    bookingSlotSchema
);