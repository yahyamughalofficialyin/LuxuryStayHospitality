const axios = require("axios");
const mongoose = require("mongoose");

const staffSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^\S+@\S+\.\S+$/,
    },
    phone: {
        type: String,
        required: true,
        match: /^[0-9]{10}$/,
    },
    cnic: {
        type: String,
        required: true,
        match: /^[0-9]{13}$/,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
        validate: {
            validator: async function (value) {
                try {
                    // Fetch the list of valid roles from the API
                    const response = await axios.get("http://localhost:5000/api/role/");
                    const validRoles = response.data; // Assume the API returns an array of roles
                    return validRoles.includes(value);
                } catch (err) {
                    console.error("Error fetching roles:", err);
                    return false; // If the API fails, validation should fail
                }
            },
            message: (props) => `${props.value} is not a valid role.`,
        },
    },
});

// Pre-save hook to hash password
staffSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

module.exports = mongoose.model("Staff", staffSchema);
