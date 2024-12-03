const Admin = require("../models/Admin");
const Joi = require("joi");

const validateAdmin = (data) => {
    const schema = Joi.object({
        username: Joi.string().required(),
        email: Joi.string().email().required(),
        phone: Joi.string().pattern(new RegExp("^[0-9]{10}$")).required(),
        password: Joi.string().min(6).required(),
    });
    return schema.validate(data);
};

// Create Admin
createAdmin = async (req, res) => {
    try {
        const { error } = validateAdmin(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });

        const { username, email, phone, password } = req.body;

        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) return res.status(400).json({ message: "Admin already exists!" });

        const admin = new Admin({ username, email, phone, password });
        await admin.save();
        res.status(201).json({ message: "Admin created successfully!" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

readallAdmin = async (req, res) => {
    try {
        const admins = await Admin.find();
        res.status(200).json(admins);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

readAdmin = async (req, res) => {
    try {
        const admin = await Admin.findById(req.params.id);
        if (!admin) return res.status(404).json({ message: "Admin not found!" });
        res.status(200).json(admin);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

updateAdmin = async (req, res) => {
    try {
        const { error } = validateAdmin(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });

        const updatedAdmin = await Admin.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedAdmin) return res.status(404).json({ message: "Admin not found!" });

        res.status(200).json({ message: "Admin updated successfully!" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

deleteAdmin = async (req, res) => {
    try {
        const admin = await Admin.findByIdAndDelete(req.params.id);
        if (!admin) return res.status(404).json({ message: "Admin not found!" });
        res.status(200).json({ message: "Admin deleted successfully!" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    createAdmin,
    readallAdmin,
    readAdmin,
    updateAdmin,
    deleteAdmin,
}
