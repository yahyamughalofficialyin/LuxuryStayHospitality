const Room = require("../models/Room");
const axios = require("axios");
const Joi = require("joi");

const validateRoom = (data) => {
    const schema = Joi.object({
        type: Joi.string().required(),
        available: Joi.string().valid("yes", "no").required(),
        status: Joi.string().valid("occupied", "cleaning", "available").required(),
        floor: Joi.string().required(),
        roomno: Joi.number().required(),
    });
    return schema.validate(data);
};

createRoom = async (req, res) => {
    try {
        const { error } = validateRoom(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });

        const { type, available, status, floor } = req.body;

        // Check if RoomType exists
        const typeData = await axios.get(`http://localhost:5000/api/roomtype/${type}`);
        if (!typeData.data) {
            return res.status(400).json({ message: "Invalid Room Type ID!" });
        }

        // Check if Floor exists
        const floorData = await axios.get(`http://localhost:5000/api/floor/${floor}`);
        if (!floorData.data) {
            return res.status(400).json({ message: "Invalid Floor ID!" });
        }

        const floorNumber = floorData.data.number; // Extract floor number
        const floorLimit = floorData.data.limit;

        // Enforce room addition sequence
        const roomsOnFloor = await Room.find({ floor }).sort({ roomno: 1 });
        const lastRoomNo = roomsOnFloor.length > 0 ? roomsOnFloor[roomsOnFloor.length - 1].roomno : null;

        let newRoomNo;
        if (!lastRoomNo) {
            // First room on the floor
            newRoomNo = parseInt(`${floorNumber}01`);
        } else {
            const expectedRoomNo = parseInt(lastRoomNo) + 1;
            newRoomNo = expectedRoomNo;

            // Prevent skipping sequence
            if (req.body.roomno && req.body.roomno !== expectedRoomNo) {
                return res.status(400).json({
                    message: `Invalid Room Number! The next room number should be ${expectedRoomNo}.`,
                });
            }
        }

        // Enforce floor limit
        if (roomsOnFloor.length >= floorLimit) {
            return res.status(400).json({
                message: "Floor room limit reached. Cannot add more rooms.",
            });
        }

        // Validate available and status combination
        if (available === "yes" && (status === "occupied" || status === "cleaning")) {
            return res.status(400).json({
                message: "Room cannot be 'occupied' or 'cleaning' if it is 'available'.",
            });
        }

        // Create the new room
        const newRoom = new Room({
            type,
            available,
            status,
            floor,
            roomno: newRoomNo,
        });
        await newRoom.save();

        res.status(201).json({ message: "Room created successfully!", room: newRoom });
    } catch (err) {
        console.error("Error in createRoom:", err);
        res.status(500).json({ message: err.message });
    }
};

// Other CRUD functions remain the same (readallRoom, readRoom, updateRoom, deleteRoom)
readallRoom = async (req, res) => {
    try {
        const rooms = await Room.find();
        res.status(200).json(rooms);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

readRoom = async (req, res) => {
    try {
        const room = await Room.findById(req.params.id);
        if (!room) return res.status(404).json({ message: "Room not found!" });
        res.status(200).json(room);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

updateRoom = async (req, res) => {
    try {
        const { error } = validateRoom(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });

        const updatedRoom = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedRoom) return res.status(404).json({ message: "Room not found!" });

        res.status(200).json({ message: "Room updated successfully!", room: updatedRoom });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

deleteRoom = async (req, res) => {
    try {
        const room = await Room.findByIdAndDelete(req.params.id);
        if (!room) return res.status(404).json({ message: "Room not found!" });
        res.status(200).json({ message: "Room deleted successfully!" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    createRoom,
    readallRoom,
    readRoom,
    updateRoom,
    deleteRoom,
};
