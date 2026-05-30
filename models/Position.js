const mongoose = require('mongoose');

const positionSchema = new mongoose.Schema({
<<<<<<< HEAD
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  pair: { type: String, required: true },
  size: { type: Number, required: true }, // positive for long, negative for short
  entryPrice: { type: Number, required: true },
  margin: { type: Number, default: 0 },
  liqPrice: { type: Number },
  unrealizedPnL: { type: Number, default: 0 },
  roePct: { type: Number, default: 0 },
  updatedAt: { type: Date, default: Date.now }
=======
  userId:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  pair:         { type: String, required: true },
  // FIX #1 & #8: side field added (positive size = long, but explicit side is safer)
  // FIX #8: leverage stored per position for correct PnL
  side:         { type: String, enum: ['long', 'short'], default: 'long' },
  leverage:     { type: Number, default: 1, min: 1 },
  size:         { type: Number, required: true }, // positive = long, negative = short
  entryPrice:   { type: Number, required: true },
  margin:       { type: Number, default: 0 },   // original collateral locked — returned on close
  liqPrice:     { type: Number },
  unrealizedPnL:{ type: Number, default: 0 },
  roePct:       { type: Number, default: 0 },
  updatedAt:    { type: Date, default: Date.now }
>>>>>>> main
});

module.exports = mongoose.model('Position', positionSchema);
