const mongoose = require('mongoose');

// This collection stores a snapshot of each completed chit cycle.
// Each entry contains the chit number, the time it was completed, and
// the state of every user at the moment the cycle ended.
const chitCycleHistorySchema = new mongoose.Schema({
  chitNumber: {
    type: Number,
    required: true,
  },
  completedAt: {
    type: Date,
    default: Date.now,
  },
  // Array of user snapshots for this cycle
  users: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      amount: { type: Number, required: true },
      status: { type: String, enum: ['Pending', 'Selected', 'Rejected'], required: true },
    },
  ],
}, { timestamps: true });

module.exports = mongoose.model('ChitCycleHistory', chitCycleHistorySchema);
