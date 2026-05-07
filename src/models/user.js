const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phoneNo: {
        type: Number,
        required: true,
        unique: true
    },
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ["Pending", "Selected", "Rejected"],
        default: "Pending"
    },
    roles:{
        type: String,
        enum: ["admin","user"],
        required: true
    }

}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);