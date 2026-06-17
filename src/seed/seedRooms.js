import dotenv from "dotenv";
import mongoose from "mongoose";
import Room from "../models/Room.js";

dotenv.config();

const rooms = [
    {
        name: "Conference Room A",
        location: "FLoor 1",
        capacity: 10,
    },
    {
        name: "Conference Room B",
        location: "FLoor 2",
        capacity: 8,
    },
    {
        name: "Board Room",
        location: "FLoor 3",
        capacity: 20,
    },
    {
        name: "Training Room ",
        location: "FLoor 4",
        capacity: 30,
    },
];

mongoose
    .connect(process.env.MONGO_URI)
    .then(async ( )=> {
        await Room.deleteMany();

        await Room.insertMany(rooms);

        console.log("Rooms Seeded Successfully");

        process.exit();
    })
    .catch(console.error);