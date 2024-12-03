const Food = require("../models/Food");
const Joi = require("joi");

const validateFood = (data) => {
    const schema = Joi.object({
        name: Joi.string().min(3).required(),
        type: Joi.string().valid("breakfast", "starter", "main", "deserts", "beverages").required(),
        price: Joi.number().required(),
    });
    return schema.validate(data);
};

// Create Food
createFood = async (req, res) => {
    try {
        const { error } = validateFood(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });
    
        const { name, type, price } = req.body;
    
        // Check if a Food already exists based on name, phone, or cnic
        const existingFood = await Food.findOne({
            $or: [{ name }]
        });
    
        if (existingFood) {
            return res.status(400).json({ message: "Food already exists!" });
        }
    
        // Create new Food if no existing Food matches
        const newFood = new Food({ name, type, price });
        await newFood.save();
    
        res.status(201).json({ message: "Food created successfully!" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


readallFood = async (req, res) => {
    try {
        const foods = await Food.find();
        res.status(200).json(foods);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

readFood = async (req, res) => {
    try {
        const food = await Food.findById(req.params.id);
        if (!food) return res.status(404).json({ message: "Food not found!" });
        res.status(200).json(food);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

updateFood = async (req, res) => {
    try {
        const { error } = validateFood(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });

        const updatedFood = await Food.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedFood) return res.status(404).json({ message: "Food not found!" });

        res.status(200).json({ message: "Food updated successfully!" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

deleteFood = async (req, res) => {
    try {
        const food = await Food.findByIdAndDelete(req.params.id);
        if (!food) return res.status(404).json({ message: "Food not found!" });
        res.status(200).json({ message: "Food deleted successfully!" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    createFood,
    readallFood,
    readFood,
    updateFood,
    deleteFood
}
