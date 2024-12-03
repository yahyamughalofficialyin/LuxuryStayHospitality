const Room = require("../models/Room");
const Joi = require("joi");

const validateRoom = (data) => {
    const schema = Joi.object({
        type: Joi.string().valid("standard", "deluxe", "suite").required(),
        available: Joi.string().valid("yes", "no").required(),
        status: Joi.string().valid("occupied", "cleaning", "available").required(),
        roomno: Joi.string().required(),
        halfdayprice: Joi.number().required(),
        fulldayprice: Joi.number().required(),
    });
    return schema.validate(data);
};

// Create Room
createRoom = async (req, res) => {
    try {
        const { error } = validateRoom(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });
    
        const { type, available, status, roomno, halfdayprice, fulldayprice } = req.body;
    
        // Check if a Room already exists based on object
        const existingRoom = await Room.findOne({
            $or: [{ roomno }]
        });
    
        if (existingRoom) {
            return res.status(400).json({ message: "Room already exists!" });
        }
    
        // Create new Room if no existing Room matches
        const newRoom = new Room({ type, available, status, roomno, halfdayprice, fulldayprice });
        await newRoom.save();
    
        res.status(201).json({ message: "Room created successfully!" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


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

        const updatedRoom = await Room.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedRoom) return res.status(404).json({ message: "Room not found!" });

        res.status(200).json({ message: "Room updated successfully!" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

deleteRoom = async (req, res) => {
    try {
        const room = await Room.findByIdAndDelete(req.params.id);
        if (!room) return res.status(404).json({ message: "Room Item not found!" });
        res.status(200).json({ message: "Room Item deleted successfully!" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    createRoom,
    readallRoom,
    readRoom,
    updateRoom,
    deleteRoom
}
