const Laundryorder = require("../models/Laundryorder");
const Joi = require("joi");
const axios = require("axios")

const validateLaundryorder = (data) => {
    const schema = Joi.object({
        laundryid: Joi.string().required(),
        quantity: Joi.number().required(),
        bill: Joi.number().required(),
        status: Joi.string().valid("pending","gettingwashed", "drying", "ready").required(),
        paymentstatus: Joi.string().valid("paid", "unpaid").required(),
        room: Joi.string().required(),
        ordertime: Joi.date().required(),
        orderby: Joi.string().required(),
    });
    return schema.validate(data);
};

const createLaundryorder = async (req, res) => {
    try {
        const { error } = validateLaundryorder(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });

        const { laundryid, quantity, status, paymentstatus, room, orderby } = req.body;

        // Check if the laundry item exists
        const laundryResponse = await axios.get(`http://localhost:5000/api/laundry/${laundryid}`);
        const laundry = laundryResponse.data;
        if (!laundry) return res.status(404).json({ message: "Laundry item not found!" });

        // Create the order
        const newLaundryorder = new Laundryorder({ laundryid, quantity, status, paymentstatus, room, orderby });
        await newLaundryorder.save();

        res.status(201).json({ message: "Order placed successfully!" });
    } catch (err) {
        if (err.response) {
            return res.status(err.response.status).json({ message: err.response.data.message });
        }
        res.status(500).json({ message: err.message });
    }
};



readallLaundryorder = async (req, res) => {
    try {
        const laundryorders = await Laundryorder.find();
        res.status(200).json(laundryorders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

readLaundryorder = async (req, res) => {
    try {
        const laundryorder = await Laundryorder.findById(req.params.id);
        if (!laundryorder) return res.status(404).json({ message: "Order not found!" });
        res.status(200).json(laundryorder);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

updateLaundryorder = async (req, res) => {
    try {
        const { error } = validateLaundryorder(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });

        const updatedLaundryorder = await Laundryorder.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedLaundryorder) return res.status(404).json({ message: "Order not found!" });

        res.status(200).json({ message: "Order updated successfully!" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

deleteLaundryorder = async (req, res) => {
    try {
        const laundryorder = await Laundryorder.findByIdAndDelete(req.params.id);
        if (!laundryorder) return res.status(404).json({ message: "Order not found!" });
        res.status(200).json({ message: "Order deleted successfully!" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    createLaundryorder,
    readallLaundryorder,
    readLaundryorder,
    updateLaundryorder,
    deleteLaundryorder
}
