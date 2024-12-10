const Staff = require("../models/Staff");
const Joi = require("joi");
const axios = require("axios");
const bcrypt = require("bcrypt");

const validateStaff = (data) => {
    const schema = Joi.object({
        username: Joi.string().required(),
        email: Joi.string().email().required(),
        phone: Joi.string().pattern(new RegExp("^[0-9]{10}$")).required(),
        cnic: Joi.string().pattern(new RegExp("^[0-9]{13}$")).required(),
        password: Joi.string().min(8).required(),
        role: Joi.string().required(),
    });
    return schema.validate(data);
};

// Create Staff
createStaff = async (req, res) => {
    try {
        const { error } = validateStaff(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });
    
        const { username, email, phone, cnic, password, role } = req.body;

        // Check if the role's limit is reached
        const roleStaffCount = await Staff.countDocuments({ role });
        const roleData = await axios.get(`http://localhost:5000/api/role/${role}`);
        
        if (!roleData.data) {
            return res.status(400).json({ message: "Invalid role ID!" });
        }
        
        if (roleStaffCount >= roleData.data.limit) {
            return res.status(400).json({ message: "Limit Reached!! Can't Add More Staff for this role" });
        }

        // Check if a Staff already exists based on email, phone, or cnic
        const existingStaff = await Staff.findOne({
            $or: [{ email }, { phone }, { cnic }]
        });
    
        if (existingStaff) {
            return res.status(400).json({ message: "Staff already exists!" });
        }
    
        // Create new Staff if no existing Staff matches
        const newStaff = new Staff({ username, email, phone, cnic, password, role });
        await newStaff.save();
    
        res.status(201).json({ message: "Staff created successfully!" });
    } catch (err) {
        console.error("Error in createStaff:", err);
        res.status(500).json({ message: err.message });
    }
};



readallStaff = async (req, res) => {
    try {
        const staffs = await Staff.find();
        res.status(200).json(staffs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

readStaff = async (req, res) => {
    try {
        const staff = await Staff.findById(req.params.id);
        if (!staff) return res.status(404).json({ message: "Staff not found!" });
        res.status(200).json(staff);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

updateStaff = async (req, res) => {
    try {
        // Allowed fields for partial update
        const allowedFields = ["username", "email", "phone", "cnic", "password", "role"];

        // Extract fields from the request body
        const fieldsToUpdate = req.body;

        // Validate if the provided fields are allowed
        const invalidFields = Object.keys(fieldsToUpdate).filter(
            (field) => !allowedFields.includes(field)
        );
        if (invalidFields.length > 0) {
            return res
                .status(400)
                .json({ message: `Invalid fields: ${invalidFields.join(", ")}` });
        }

        // Create a Joi schema for validating only the provided fields
        const schema = Joi.object({
            username: Joi.string(),
            email: Joi.string().email(),
            phone: Joi.string().pattern(new RegExp("^[0-9]{10}$")),
            cnic: Joi.string().pattern(new RegExp("^[0-9]{13}$")),
            password: Joi.string().min(8),
            role: Joi.string(),
        });

        // Validate the fields present in the request body
        const { error } = schema.validate(fieldsToUpdate);
        if (error) return res.status(400).json({ message: error.details[0].message });

        // If password is present, hash it before saving
        if (fieldsToUpdate.password) {
            const salt = await bcrypt.genSalt(10);
            fieldsToUpdate.password = await bcrypt.hash(fieldsToUpdate.password, salt);
        }

        // Perform the partial update
        const updatedStaff = await Staff.findByIdAndUpdate(
            req.params.id,
            { $set: fieldsToUpdate },
            { new: true, runValidators: true } // Ensures Mongoose validations are applied
        );

        if (!updatedStaff) return res.status(404).json({ message: "Staff not found!" });

        res.status(200).json({
            message: "Staff updated successfully!",
            staff: updatedStaff,
        });
    } catch (err) {
        console.error("Error updating Staff:", err);
        res.status(500).json({ message: err.message });
    }
};


deleteStaff = async (req, res) => {
    try {
        const staff = await Staff.findByIdAndDelete(req.params.id);
        if (!staff) return res.status(404).json({ message: "Staff not found!" });
        res.status(200).json({ message: "Staff deleted successfully!" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    createStaff,
    readallStaff,
    readStaff,
    updateStaff,
    deleteStaff
}
