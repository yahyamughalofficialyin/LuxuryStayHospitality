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
                    const validRooms = response.data.filter(room => room.available === "yes").map(room => room._id);
                    return validRooms.includes(value.toString());
                } catch (err) {
                    console.error("Error fetching Room:", err);
                    return false;
                }
            },
            message: "Invalid Room ID or Room is not available.",
        },
    },
    bookfor: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        validate: {
            validator: async function (value) {
                try {
                    const response = await axios.get("http://localhost:5000/api/guest/");
                    const validGuests = response.data.map(guest => guest._id);
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
                    const roleResponse = await axios.get("http://localhost:5000/api/role/");
                    const receptionistRole = roleResponse.data.find(role => role.name === "receptionist" && role.status === "active")._id;

                    const validStaff = staffResponse.data.filter(staff => staff.role === receptionistRole).map(staff => staff._id);
                    return validStaff.includes(value.toString());
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
        required: true,
        default: Date.now,
    },
    expectedcheckin: {
        type: Date,
        required: true,
    },
    checkin: {
        type: Date,
        required: true,
    },
    expectedcheckout: {
        type: Date,
        required: true,
    },
    checkout: {
        type: Date,
        required: true,
    },
    staytime: {
        type: String, // "2 days 5 hours"
        required: true,
    },
    bill: {
        type: Number,
        required: true,
    },
});

module.exports = mongoose.model("Booking", bookingSchema);
