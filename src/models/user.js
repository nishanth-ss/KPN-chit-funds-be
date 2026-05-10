const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    phoneNo: {
        type: Number,
        required: true,
        unique: true,
        trim: true
    },
    chitNo: {
        type: Number,
        required: true
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
    roles: {
        type: String,
        enum: ["admin", "user"],
        default: "user"
    },
    activeCycleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ChitCycle'
    },
    // Track amount update history
    amountHistory: [{
        amount: {
            type: Number,
            required: true
        },
        updatedAt: {
            type: Date,
            default: Date.now
        },
        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    }],
    // Track selection history
    selectionHistory: [{
        selectedAt: {
            type: Date,
            default: Date.now
        },
        selectedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        selectionRound: {
            type: Number,
            required: true
        }
    }],
    // Track last amount update
    lastAmountUpdate: {
        type: Date
    },
    // Track last selection
    lastSelectionDate: {
        type: Date
    },
    // Track total times selected
    totalSelections: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);