const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

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
        enum: ["manager", "receptionist", "housekeeping"],
        required: true,
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
