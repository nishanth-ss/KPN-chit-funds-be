const mongoose = require("mongoose");

const chitCycleSchema = new mongoose.Schema({
    cycleID: {
        type: String,
        required: true,
        unique: true
    },
    chitNumber: {
        type: Number,
        required: true
    },
    startDate: {
        type: Date,
        default: Date.now
    },
    endDate: {
        type: Date
    },
    status: {
        type: String,
        enum: ["ongoing", "completed"],
        default: "ongoing"
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    currentBalance: {
        type: Number
    }
}, { timestamps: true });

module.exports = mongoose.model("ChitCycle", chitCycleSchema);
