const Laundry = require("../models/Laundry");
const Joi = require("joi");

const validateLaundry = (data) => {
    const schema = Joi.object({
        object: Joi.string().min(3).required(),
        category: Joi.string().valid("Clothing Items", "Bed & Bath Linen","Special Items", "Additional Services").required(),
        pricing: Joi.number().required(),
    });
    return schema.validate(data);
};

// Create Laundry
createLaundry = async (req, res) => {
    try {
        const { error } = validateLaundry(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });
    
        const { object, category, pricing } = req.body;
    
        // Check if a Laundry already exists based on object
        const existingLaundry = await Laundry.findOne({
            $or: [{ object }]
        });
    
        if (existingLaundry) {
            return res.status(400).json({ message: "Laundry Item already exists!" });
        }
    
        // Create new Laundry if no existing Laundry matches
        const newLaundry = new Laundry({ object, category, pricing });
        await newLaundry.save();
    
        res.status(201).json({ message: "Laundry Item created successfully!" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


readallLaundry = async (req, res) => {
    try {
        const laundrys = await Laundry.find();
        res.status(200).json(laundrys);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

readLaundry = async (req, res) => {
    try {
        const laundry = await Laundry.findById(req.params.id);
        if (!laundry) return res.status(404).json({ message: "Laundry Item not found!" });
        res.status(200).json(laundry);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

updateLaundry = async (req, res) => {
    try {
        const { error } = validateLaundry(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });

        const updatedLaundry = await Laundry.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedLaundry) return res.status(404).json({ message: "Laundry not found!" });

        res.status(200).json({ message: "Laundry updated successfully!" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

deleteLaundry = async (req, res) => {
    try {
        const laundry = await Laundry.findByIdAndDelete(req.params.id);
        if (!laundry) return res.status(404).json({ message: "Laundry Item not found!" });
        res.status(200).json({ message: "Laundry Item deleted successfully!" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    createLaundry,
    readallLaundry,
    readLaundry,
    updateLaundry,
    deleteLaundry
}
