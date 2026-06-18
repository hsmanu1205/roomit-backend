import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import morgan from "morgan";
import roomRoutes from "./routes/roomRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import waitlistRoutes from "./routes/waitlistRoutes.js";


dotenv.config();

const app = express();

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://roomit-frontend-alpha.vercel.app/",
    ],
    credentials: true,
  })
);
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/rooms", roomRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/waitlist",waitlistRoutes);

// Test Route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "RoomIt API Running",
  });
});

// MongoDB Connection


mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`🚀 Server Running on Port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ MongoDB Connection Failed");
    console.error(error.message);
  });