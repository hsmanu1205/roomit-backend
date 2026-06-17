import Room from "../models/Room.js";
import BookingSlot from "../models/BookingSlot.js";

export const getRooms = async (req, res) => {
  try {
    const rooms = await Room.find();

    res.status(200).json({
      success: true,
      count: rooms.length,
      rooms,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const { date } = req.query;

    const bookedSlots = await BookingSlot.find({
      roomId: id,
      date,
    });

    const allSlots = [];

    for (let hour = 8; hour < 18; hour++) {
      allSlots.push(`${hour.toString().padStart(2, "0")}:00`);
      allSlots.push(`${hour.toString().padStart(2, "0")}:30`);
    }

    const availability = allSlots.map((slot) => ({
      slot,
      available: !bookedSlots.some(
        (b) => b.slotStart === slot
      ),
    }));

    res.status(200).json({
      success: true,
      date,
      availability,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};