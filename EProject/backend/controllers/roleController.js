const Role = require("../models/Role");
const Joi = require("joi");

const validateRole = (data) => {
    const schema = Joi.object({
        name: Joi.string().min(3).required(),
        status: Joi.string().valid("active", "inactive").required(),
    });
    return schema.validate(data);
};

// Create Role
createRole = async (req, res) => {
    try {
        const { error } = validateRole(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });
    
        const { name, status } = req.body;
    
        // Check if a Role already exists based on name, phone, or cnic
        const existingRole = await Role.findOne({
            $or: [{ name }]
        });
    
        if (existingRole) {
            return res.status(400).json({ message: "Role already exists!" });
        }
    
        // Create new Role if no existing Role matches
        const newRole = new Role({ name, status });
        await newRole.save();
    
        res.status(201).json({ message: "Role created successfully!" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


readallRole = async (req, res) => {
    try {
        const roles = await Role.find();
        res.status(200).json(roles);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

readRole = async (req, res) => {
    try {
        const role = await Role.findById(req.params.id);
        if (!role) return res.status(404).json({ message: "Role not found!" });
        res.status(200).json(role);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

updateRole = async (req, res) => {
    try {
        const { error } = validateRole(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });

        const updatedRole = await Role.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedRole) return res.status(404).json({ message: "Role not found!" });

        res.status(200).json({ message: "Role updated successfully!" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

deleteRole = async (req, res) => {
    try {
        const role = await Role.findByIdAndDelete(req.params.id);
        if (!role) return res.status(404).json({ message: "Role not found!" });
        res.status(200).json({ message: "Role deleted successfully!" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    createRole,
    readallRole,
    readRole,
    updateRole,
    deleteRole
}
