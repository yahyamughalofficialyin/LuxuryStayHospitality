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

createBooking = async (req, res) => {
    try {
        const { error } = validateBooking(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });

        const { room, bookfor, bookedby, bookingtime, expectedcheckin, checkin, expectedcheckout, checkout } = req.body;

        // Check if the room is available
        const roomResponse = await axios.get(`http://localhost:5000/api/room/${room}`);
        if (roomResponse.data.available === 'no') {
            return res.status(400).json({ message: "Room is not available." });
        }

        // Ensure bookingtime is set to the current time if the user provides anything
        const currentBookingTime = moment().toDate();
        const bookingTimeParsed = bookingtime ? new Date(bookingtime) : currentBookingTime;

        // Validate expectedcheckin
        const expectedCheckinParsed = new Date(expectedcheckin);
        if (expectedCheckinParsed < bookingTimeParsed) {
            return res.status(400).json({ message: "Expected check-in time cannot be before booking time." });
        }
        const maxCheckinDate = moment(bookingTimeParsed).add(1, 'months').toDate();
        if (expectedCheckinParsed > maxCheckinDate) {
            return res.status(400).json({ message: "Expected check-in time cannot be more than one month after the booking time." });
        }

        // Validate checkin
        const checkinParsed = new Date(checkin);
        if (checkinParsed < expectedCheckinParsed) {
            return res.status(400).json({ message: "Check-in time cannot be before expected check-in time." });
        }

        // Validate expectedcheckout
        const expectedCheckoutParsed = new Date(expectedcheckout);
        if (expectedCheckoutParsed < expectedCheckinParsed) {
            return res.status(400).json({ message: "Expected check-out time must be after expected check-in time." });
        }

        // Validate checkout
        const checkoutParsed = new Date(checkout);
        if (checkoutParsed > expectedCheckoutParsed) {
            return res.status(400).json({ message: "Check-out time cannot be after expected check-out time." });
        }

        // Calculate stay duration
        const duration = moment.duration(moment(checkout).diff(moment(checkin)));
        const stayDuration = `${Math.floor(duration.asDays())} days ${Math.round(duration.asHours() % 24)} hours`;

        // Calculate bill
        const bill = await calculateBill(room, stayDuration);

        // Update room availability and status
        const roomUpdateResponse = await axios.put(`http://localhost:5000/api/room/update/${room}`, {
            available: "no",
            status: "occupied",
        });

        if (roomUpdateResponse.status !== 200) {
            return res.status(400).json({ message: "Failed to update room status." });
        }

        // Create booking
        const newBooking = new Booking({
            room,
            bookfor,
            bookedby,
            bookingtime: currentBookingTime,
            expectedcheckin,
            checkin,
            expectedcheckout,
            checkout,
            staytime: stayDuration,
            bill,
        });

        await newBooking.save();

        res.status(201).json({ message: "Room booked successfully!", booking: newBooking });
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
        // Allowed fields for partial update
        const allowedFields = [
            'room',
            'bookfor',
            'bookedby',
            'bookingtime',
            'expectedcheckin',
            'checkin',
            'expectedcheckout',
            'checkout',
            'staytime',
            'bill',
        ];

        // Extract and validate fields from req.body
        const fieldsToUpdate = req.body;

        // Validate if the fields are allowed
        const invalidFields = Object.keys(fieldsToUpdate).filter(
            field => !allowedFields.includes(field)
        );
        if (invalidFields.length > 0) {
            return res.status(400).json({ message: `Invalid fields: ${invalidFields.join(', ')}` });
        }

        // Perform the partial update
        const updatedBooking = await Booking.findByIdAndUpdate(
            req.params.id,
            { $set: fieldsToUpdate },
            { new: true, runValidators: true } // Ensure validation for fields being updated
        );

        if (!updatedBooking) return res.status(404).json({ message: "Booking not found!" });

        res.status(200).json({ message: "Booking updated successfully!", booking: updatedBooking });
    } catch (err) {
        console.error("Error updating Booking:", err);
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
