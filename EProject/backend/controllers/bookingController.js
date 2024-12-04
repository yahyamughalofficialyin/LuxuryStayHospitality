const Booking = require("../models/Booking");
const axios = require("axios");
const Joi = require("joi");
const moment = require("moment");

const validateBooking = (data) => {
    const schema = Joi.object({
        room: Joi.string().required(),
        bookfor: Joi.string().required(),
        bookedby: Joi.string().required(),
        bookingtime: Joi.date().required(),
        expectedcheckin: Joi.date().required(),
        checkin: Joi.date().required(),
        expectedcheckout: Joi.date().required(),
        checkout: Joi.date().required(),
        staytime: Joi.string().required(),
        bill: Joi.number().required(),
    });
    return schema.validate(data);
};

const calculateBill = async (roomId, stayDuration) => {
    try {
        const roomResponse = await axios.get(`http://localhost:5000/api/room/${roomId}`);
        const roomTypeId = roomResponse.data.type;

        const roomTypeResponse = await axios.get(`http://localhost:5000/api/roomtype/${roomTypeId}`);
        const { halfdayprice, fulldayprice } = roomTypeResponse.data;

        const [days, hours] = stayDuration.split(" days ").map(value => parseInt(value.replace(" hours", ""), 10));
        const fullDays = days;
        const halfDays = hours > 6 ? 1 : 0;

        return fullDays * fulldayprice + halfDays * halfdayprice;
    } catch (err) {
        console.error("Error calculating bill:", err);
        return 0; // Default in case of error
    }
};

const createBooking = async (req, res) => {
    try {
        const { error } = validateBooking(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });

        const { room, bookfor, bookedby, expectedcheckin, checkin, expectedcheckout, checkout } = req.body;

        // Validate Room
        const roomData = await axios.get(`http://localhost:5000/api/room/${room}`);
        if (!roomData.data || roomData.data.available !== "yes") {
            return res.status(400).json({ message: "Room is unavailable or invalid!" });
        }

        // Update Room Status
        await axios.patch(`http://localhost:5000/api/room/${room}`, {
            status: "occupied",
            available: "no",
        });

        // Calculate Stay Time
        const stayDuration = checkin && checkout ? new Date(checkout) - new Date(checkin) : null;

        // Fetch Room Type and Calculate Bill
        const roomTypeResponse = await axios.get(`http://localhost:5000/api/roomtype/${roomData.data.type}`);
        const roomType = roomTypeResponse.data;

        const stayDays = Math.floor(stayDuration / (1000 * 60 * 60 * 24)); // Days
        const stayHours = Math.floor((stayDuration % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)); // Hours

        let bill = stayDays * roomType.fulldayprice;
        if (stayHours > 0 && stayHours <= 6) bill += roomType.halfdayprice;
        else if (stayHours > 6) bill += roomType.fulldayprice;

        // Create the Booking
        const newBooking = new Booking({
            room,
            bookfor,
            bookedby,
            bookingtime: new Date(),
            expectedcheckin,
            checkin,
            expectedcheckout,
            checkout,
            staytime: `${stayDays} days, ${stayHours} hours`,
            bill,
        });

        await newBooking.save();

        res.status(201).json({ message: "Room booked successfully!", Booking: newBooking });
    } catch (err) {
        console.error("Error in Booking:", err);
        res.status(500).json({ message: err.message });
    }
};



// Other CRUD functions remain the same (readallBooking, readBooking, updateBooking, deleteBooking)
readallBooking = async (req, res) => {
    try {
        const bookings = await Booking.find();
        res.status(200).json(bookings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

readBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) return res.status(404).json({ message: "Booking not found!" });
        res.status(200).json(booking);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

updateBooking = async (req, res) => {
    try {
        const { error } = validateBooking(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });

        const updatedBooking = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedBooking) return res.status(404).json({ message: "Booking not found!" });

        res.status(200).json({ message: "Booking updated successfully!", booking: updatedBooking });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

deleteBooking = async (req, res) => {
    try {
        const booking = await Booking.findByIdAndDelete(req.params.id);
        if (!booking) return res.status(404).json({ message: "Booking not found!" });
        res.status(200).json({ message: "Booking deleted successfully!" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    createBooking,
    readallBooking,
    readBooking,
    updateBooking,
    deleteBooking,
};
