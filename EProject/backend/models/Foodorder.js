const mongoose = require("mongoose");
const axios = require("axios");
const { required } = require("joi");

const foodorderSchema = new mongoose.Schema({
    foodid: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        validate: {
            validator: async function (value) {
                try {
                    const response = await axios.get("http://localhost:5000/api/food/");
                    const validFoods = response.data.map(food => food._id);
                    return validFoods.includes(value.toString());
                } catch (err) {
                    console.error("Error fetching foods:", err);
                    return false;
                }
            },
            message: (props) => `${props.value} is not a valid Food ID.`,
        },
    },
    quantity: {
        type: Number,
        required: true,
    },
    bill: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ["recieved", "gettingready", "read", "delivered"],
        default: "recieved",
        required: true,
    },
    paymentstatus: {
        type: String,
        enum: ["paid", "unpaid"],
        default: "unpaid",
        required: true,
    },
    type: {
        type: String,
        enum: ["dinein", "takeaway", "roomserve"],
        required: true,
    },
    ordertime: {
        type: Date,
        default: () => new Date(),
        required: true,
    },
    room: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
        validate: {
            validator: async function (value) {
                if (this.type !== 'roomserve') return true; // Skip validation for non-roomserve orders
                try {
                    const response = await axios.get(`http://localhost:5000/api/room/${value}`);
                    return response.data && response.data.available === 'no';
                } catch (error) {
                    return false;
                }
            },
            message: "Invalid Room ID or the Room is Not Booked By Anyone.",
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
                } catch (error) {
                    return false;
                }
            },
            message: "Invalid Guest ID.",
        },
    },
});

// Middleware to handle room logic based on type
foodorderSchema.pre("validate", function (next) {
    if (this.type !== "roomserve") {
        this.room = null; // Set room to null for non-roomserve types
    }
    next();
});

foodorderSchema.pre("save", async function (next) {
    this.ordertime = new Date();

    try {
        const foodResponse = await axios.get(`http://localhost:5000/api/food/${this.foodid}`);
        const food = foodResponse.data;

        if (!food) {
            throw new Error("Invalid Food ID.");
        }

        // Calculate bill
        this.bill = this.quantity * food.price;
    } catch (err) {
        return next(err);
    }

    next();
});

module.exports = mongoose.model("FoodOrder", foodorderSchema);
