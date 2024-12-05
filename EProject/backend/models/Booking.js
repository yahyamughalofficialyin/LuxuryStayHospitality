const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  room: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    validate: {
      validator: async function (value) {
        // Room validation code remains unchanged
      },
      message: "Invalid or unavailable Room ID."
    }
  },
  bookfor: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    validate: {
      validator: async function (value) {
        // Guest validation code remains unchanged
      },
      message: "Invalid Guest ID."
    }
  },
  bookedby: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    validate: {
      validator: async function (value) {
        // Staff validation code remains unchanged
      },
      message: "Invalid Staff ID or Staff is not a Receptionist."
    }
  },
  bookingtime: {
    type: Date,
    default: () => new Date(), // Current time as default
  },
  expectedcheckin: {
    type: Date,
    required: true
  },
  checkin: {
    type: Date
  },
  expectedcheckout: {
    type: Date,
    required: true
  },
  checkout: {
    type: Date
  },
  staytime: {
    type: String // Store as a human-readable duration (e.g., "00 days 00 hrs")
  },
  bill: {
    type: Number
  }
});

module.exports = mongoose.model("Booking", bookingSchema);
