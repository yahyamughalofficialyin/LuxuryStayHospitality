const mongoose = require("mongoose");
const axios = require("axios");

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
    },
    status: {
        type: String,
        enum: ["recieved","gettingready", "read", "delivered"],
    },
    ordertime: {
        type: Date,
        default: () => new Date(),
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

// Middleware to enforce current ordertime and dynamic bill calculation
foodorderSchema.pre("save", async function (next) {
    this.ordertime = new Date(); // Override with the current time

    try {
        // Fetch the food item details to calculate the bill
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

module.exports = mongoose.model("Foodorder", foodorderSchema);
