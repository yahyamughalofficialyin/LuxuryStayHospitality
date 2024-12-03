const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ["standard", "deluxe", "suite"],
        required: true,
    },
    available: {
        type: String,
        enum: ["yes", "no"],
        required: true,
    },
    status: {
        type: String,
        enum: ["occupied", "cleaning", "available"],
        required: true,
    },
    roomno: {
        type: String,
        required: true,
    },
    halfdayprice: {
        type: Number,
        required: true,
    },
    fulldayprice: {
        type: Number,
        required: true,
    },
});

module.exports = mongoose.model("Room", roomSchema);
