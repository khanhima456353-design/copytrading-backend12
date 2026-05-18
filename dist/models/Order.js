"use strict";
const mongoose = require('mongoose');
const orderSchema = new mongoose.Schema({
    orderId: { type: String, required: false, unique: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    walletType: { type: String, enum: ['spot', 'cross', 'isolated'] },
    pair: { type: String, required: true },
    side: { type: String, enum: ['buy', 'sell'], required: true },
    type: { type: String, enum: ['limit', 'market', 'stop-loss'], default: 'limit' },
    price: { type: Number },
    amount: { type: Number },
    quantity: { type: Number },
    filled: { type: Number, default: 0 },
    filledQuantity: { type: Number, default: 0 },
    stopPrice: { type: Number },
    total: { type: Number },
    feeRate: { type: Number, default: 0 },
    riskParameters: { type: mongoose.Schema.Types.Mixed },
    status: {
        type: String,
        enum: ['open', 'filled', 'cancelled', 'partially_filled', 'rejected'],
        default: 'open'
    }
}, { timestamps: true });
module.exports = mongoose.model('Order', orderSchema);
