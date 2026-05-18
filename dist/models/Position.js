"use strict";
const mongoose = require('mongoose');
const positionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    pair: { type: String, required: true },
    size: { type: Number, required: true }, // positive for long, negative for short
    entryPrice: { type: Number, required: true },
    margin: { type: Number, default: 0 },
    liqPrice: { type: Number },
    unrealizedPnL: { type: Number, default: 0 },
    roePct: { type: Number, default: 0 },
    updatedAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Position', positionSchema);
