const mongoose = require("mongoose");
const axios = require("axios");

const bookingSchema = new mongoose.Schema({
    room: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        validate: {
            validator: async function (value) {
                try {
                    const response = await axios.get("http://localhost:5000/api/room/");
                    const validRooms = response.data.filter(
                        (room) => room.available === "yes"
                    );
                    return validRooms.some((room) => room._id.toString() === value.toString());
                } catch (err) {
                    console.error("Error fetching Room:", err);
                    return false;
                }
            },
            message: "Invalid or unavailable Room ID.",
        },
    },
    bookfor: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        validate: {
            validator: async function (value) {
                try {
                    const response = await axios.get("http://localhost:5000/api/guest/");
                    const validGuests = response.data.map((guest) => guest._id);
                    return validGuests.includes(value.toString());
                } catch (err) {
                    console.error("Error fetching Guest:", err);
                    return false;
                }
            },
            message: "Invalid Guest ID.",
        },
    },
    bookedby: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        validate: {
            validator: async function (value) {
                try {
                    const staffResponse = await axios.get("http://localhost:5000/api/staff/");
                    const staff = staffResponse.data.find((staff) => staff._id.toString() === value.toString());

                    if (!staff) return false;

                    const roleResponse = await axios.get("http://localhost:5000/api/role/");
                    const validRoles = roleResponse.data.filter((role) => role.name === "receptionist");

                    return validRoles.some((role) => role._id.toString() === staff.role.toString());
                } catch (err) {
                    console.error("Error fetching Staff or Role:", err);
                    return false;
                }
            },
            message: "Invalid Staff ID or Staff is not a Receptionist.",
        },
    },
    bookingtime: {
        type: Date,
        default: Date.now,
    },
    expectedcheckin: {
        type: Date,
        required: true,
    },
    checkin: {
        type: Date,
    },
    expectedcheckout: {
        type: Date,
        required: true,
    },
    checkout: {
        type: Date,
    },
    staytime: {
        type: String, // Store as a human-readable duration
    },
    bill: {
        type: Number,
    },
});

module.exports = mongoose.model("Booking", bookingSchema);
