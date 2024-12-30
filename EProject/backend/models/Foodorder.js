const mongoose = require("mongoose");
const axios = require("axios");

const foodorderSchema = new mongoose.Schema({
    foodid: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        validate: {
            validator: async function (value) {
                try {
                    const response = await axios.get(`http://localhost:5000/api/food/${value}`);
                    return !!response.data;
                } catch {
                    return false;
                }
            },
            message: "Invalid Food ID.",
        },
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
    },
    bill: {
        type: Number,
    },
    status: {
        type: String,
        enum: ["recieved", "gettingready", "read", "delivered"],
        default: "recieved",
    },
    paymentstatus: {
        type: String,
        enum: ["paid", "unpaid"],
        default: "unpaid",
    },
    type: {
        type: String,
        enum: ["dinein", "takeaway", "roomserve"],
        required: true,
    },
    ordertime: {
        type: Date,
        default: () => new Date(),
    },
    room: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
        validate: {
            validator: function (value) {
                // If the type is "roomserve", room ID must be provided
                if (this.type === "roomserve" && !value) {
                    return false;
                }
                // If the type is "dinein" or "takeaway", room ID should not be provided
                if ((this.type === "dinein" || this.type === "takeaway") && value) {
                    return false;
                }
                return true;
            },
            message: "Room ID is required for room service orders and must not be provided for dine-in or takeaway.",
        },
    },
    orderby: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        validate: {
            validator: async function (value) {
                try {
                    const response = await axios.get(`http://localhost:5000/api/guest/${value}`);
                    return !!response.data;
                } catch {
                    return false;
                }
            },
            message: "Invalid Guest ID.",
        },
    },
});

// Pre-save middleware for calculating the bill
foodorderSchema.pre("save", async function (next) {
    try {
        const foodResponse = await axios.get(`http://localhost:5000/api/food/${this.foodid}`);
        const food = foodResponse.data;

        if (!food) throw new Error("Invalid Food ID.");
        this.bill = this.quantity * food.price;
    } catch (err) {
        return next(err);
    }
    next();
});

module.exports = mongoose.model("FoodOrder", foodorderSchema);
