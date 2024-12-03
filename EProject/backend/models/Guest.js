const mongoose = require("mongoose");

const guestSchema = new mongoose.Schema({
    name: {
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
    documenttype: {
        type: String,
        required: true,
        enum: ["passport", "cnic"],
    },
    documentno: {
        type: String,
        required: true,
        validate: {
            validator: function (value) {
                if (this.documenttype === "passport") {
                    return value.length >= 6 && value.length <= 10;
                } else if (this.documenttype === "cnic") {
                    return value.length === 13;
                }
                return false;
            },
            message: (props) =>
                `${props.value} is not valid for the selected document type!`,
        },
    },
});

module.exports = mongoose.model("Guest", guestSchema);
