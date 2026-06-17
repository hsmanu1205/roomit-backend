import mongoose from "mongoose";
import Booking from "../models/Booking.js";
import BookingSlot from "../models/BookingSlot.js";
import Waitlist from "../models/Waitlist.js";

export const createBooking = async (data) => {
  const {
    roomId,
    date,
    startTime,
    endTime,
    title,
    bookedBy,
  } = data;

  const slots = [];

  let current = startTime;

  while (current < endTime) {
    slots.push(current);

    const [h, m] = current.split(":").map(Number);

    let nextMinutes = m + 30;
    let nextHours = h;

    if (nextMinutes >= 60) {
      nextHours++;
      nextMinutes = 0;
    }

    current =
      `${nextHours.toString().padStart(2, "0")}:` +
      `${nextMinutes.toString().padStart(2, "0")}`;
  }

  const session = await mongoose.startSession();

  try {
    await session.withTransaction(async () => {
      const booking = await Booking.create(
        [
          {
            roomId,
            date,
            startTime,
            endTime,
            title,
            bookedBy,
            status: "confirmed",
          },
        ],
        { session }
      );

      const bookingId = booking[0]._id;

      const slotDocs = slots.map((slot) => ({
        roomId,
        date,
        slotStart: slot,
        bookingId,
      }));

      await BookingSlot.insertMany(
        slotDocs,
        { session }
      );
    });

    return {
      success: true,
    };
  } catch (error) {
    if (error.code === 11000) {
      throw new Error(
        "Slot already booked"
      );
    }

    throw error;
  } finally {
    await session.endSession();
  }
};

export const getBookingsByEmail = async (
  email
) => {
  return await Booking.find({
    "bookedBy.email": email,
  }).populate("roomId");
};

export const cancelBooking = async (
  bookingId
) => {

  const booking =
    await Booking.findById(
      bookingId
    );

  if (!booking) {
    throw new Error(
      "Booking not found"
    );
  }

  if (
    booking.status !== "confirmed"
  ) {
    throw new Error(
      "Booking already cancelled"
    );
  }

  const bookingStart = new Date(
    `${booking.date}T${booking.startTime}:00`
  );

  const now = new Date();

  const diffHours =
    (bookingStart - now) /
    (1000 * 60 * 60);

  const status =
    diffHours >= 2
      ? "cancelled-refundable"
      : "cancelled-non-refundable";

  const session =
    await mongoose.startSession();

  try {

    await session.withTransaction(
      async () => {

        await Booking.findByIdAndUpdate(
          bookingId,
          { status },
          { session }
        );

        await BookingSlot.deleteMany(
          { bookingId },
          { session }
        );

        const firstWaitlisted =
          await Waitlist.findOne({
            roomId: booking.roomId,
            date: booking.date,
            startTime:
              booking.startTime,
            endTime:
              booking.endTime,
            promoted: false,
          })
            .sort({
              createdAt: 1,
            })
            .session(session);

        if (
          firstWaitlisted
        ) {

          const promotedBooking =
            await Booking.create(
              [
                {
                  roomId:
                    firstWaitlisted.roomId,
                  date:
                    firstWaitlisted.date,
                  startTime:
                    firstWaitlisted.startTime,
                  endTime:
                    firstWaitlisted.endTime,
                  title:
                    "Auto Promoted",
                  bookedBy: {
                    name:
                      firstWaitlisted.name,
                    email:
                      firstWaitlisted.email,
                  },
                  status:
                    "confirmed",
                },
              ],
              { session }
            );

          const promotedBookingId =
            promotedBooking[0]._id;

          const slots = [];

          let current =
            firstWaitlisted.startTime;

          while (
            current <
            firstWaitlisted.endTime
          ) {

            slots.push(current);

            const [h, m] =
              current
                .split(":")
                .map(Number);

            let nextMinutes =
              m + 30;

            let nextHours = h;

            if (
              nextMinutes >= 60
            ) {
              nextHours++;
              nextMinutes = 0;
            }

            current =
              `${nextHours
                .toString()
                .padStart(
                  2,
                  "0"
                )}:` +
              `${nextMinutes
                .toString()
                .padStart(
                  2,
                  "0"
                )}`;
          }

          const slotDocs =
            slots.map(
              (slot) => ({
                roomId:
                  firstWaitlisted.roomId,
                date:
                  firstWaitlisted.date,
                slotStart:
                  slot,
                bookingId:
                  promotedBookingId,
              })
            );

          await BookingSlot.insertMany(
            slotDocs,
            { session }
          );

          await Waitlist.findByIdAndUpdate(
            firstWaitlisted._id,
            {
              promoted: true,
            },
            { session }
          );
        }
      }
    );

  } finally {

    await session.endSession();

  }
};

export const rescheduleBooking = async (
  bookingId,
  data
) => {
  const {
    version,
    date,
    startTime,
    endTime,
  } = data;

  const booking =
    await Booking.findOne({
      _id: bookingId,
      version,
    });

  if (!booking) {
    throw new Error(
      "Booking changed. Please refresh."
    );
  }

  if (
    booking.status !== "confirmed"
  ) {
    throw new Error(
      "Only confirmed bookings can be rescheduled"
    );
  }

  const slots = [];

  let current = startTime;

  while (current < endTime) {
    slots.push(current);

    const [h, m] = current
      .split(":")
      .map(Number);

    let nextMinutes = m + 30;
    let nextHours = h;

    if (nextMinutes >= 60) {
      nextHours++;
      nextMinutes = 0;
    }

    current =
      `${nextHours
        .toString()
        .padStart(2, "0")}:` +
      `${nextMinutes
        .toString()
        .padStart(2, "0")}`;
  }

  const session =
    await mongoose.startSession();

  try {
    await session.withTransaction(
      async () => {

        await BookingSlot.deleteMany(
          {
            bookingId,
          },
          { session }
        );

        const slotDocs = slots.map(
          (slot) => ({
            roomId: booking.roomId,
            date,
            slotStart: slot,
            bookingId,
          })
        );

        await BookingSlot.insertMany(
          slotDocs,
          { session }
        );

        await Booking.findByIdAndUpdate(
          bookingId,
          {
            date,
            startTime,
            endTime,
            version:
              booking.version + 1,
          },
          { session }
        );
      }
    );
  } catch (error) {

    if (error.code === 11000) {
      throw new Error(
        "Target slot already booked"
      );
    }

    throw error;

  } finally {

    await session.endSession();

  }
};