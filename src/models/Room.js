import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
    name: String,

    location: String,

    capacity: Number,

    bufferMinutes: {
        type: Number,
        default: 0,
    }

});

export default mongoose.model("Room", roomSchema);