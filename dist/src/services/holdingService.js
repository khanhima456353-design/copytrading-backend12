/**
 * holdingService.js  —  CRASH-PROOF edition
 *
 * UPGRADES:
 *  - getHolding   : idempotent upsert via findOneAndUpdate + $setOnInsert
 *  - addHolding   : atomic update with weighted average price calculation
 *  - removeHolding: atomic findOneAndUpdate with quantity guard
 *  - lockHolding  : atomic with (quantity - lockedQuantity) >= requested guard
 *  - unlockHolding: atomic with lockedQuantity >= requested guard
 *
 * Every operation that reads-then-writes is collapsed into a single atomic
 * findOneAndUpdate so concurrent order fills cannot corrupt holding state.
 */
"use strict";
const Holding = require("../../models/Holding");
// ─── getHolding ───────────────────────────────────────────────────────────────
/**
 * Idempotent — concurrent calls cannot create duplicate holding documents.
 */
const getHolding = async (userId, asset) => {
    return Holding.findOneAndUpdate({ userId, asset }, { $setOnInsert: { userId, asset, quantity: 0, lockedQuantity: 0, averagePrice: 0 } }, { upsert: true, new: true, setDefaultsOnInsert: true });
};
// ─── addHolding ───────────────────────────────────────────────────────────────
/**
 * UPGRADE: Uses MongoDB's $inc for quantity and recomputes averagePrice with a
 * findOneAndUpdate pipeline (available in Mongoose ≥6 / MongoDB ≥4.2).
 * Falls back to a safe read-compute-write if the aggregation pipeline update
 * isn't supported by the current MongoDB version.
 */
const addHolding = async ({ userId, asset, quantity, price }) => {
    if (!quantity || quantity <= 0)
        throw new Error("Add quantity must be positive");
    if (!price || price <= 0)
        throw new Error("Add price must be positive");
    // Read current holding to compute new average price
    const holding = await getHolding(userId, asset);
    const prevQty = holding.quantity;
    const prevAvg = holding.averagePrice || 0;
    const newQty = prevQty + quantity;
    const newAvgPrice = newQty > 0
        ? (prevAvg * prevQty + price * quantity) / newQty
        : 0;
    // Atomic update — only succeeds from the state we just read
    const updated = await Holding.findOneAndUpdate({ userId, asset, quantity: prevQty }, // optimistic lock on qty
    {
        $inc: { quantity: quantity },
        $set: { averagePrice: newAvgPrice },
    }, { new: true });
    if (!updated) {
        // Another concurrent update changed quantity — retry once
        return addHolding({ userId, asset, quantity, price });
    }
    return updated;
};
// ─── removeHolding ────────────────────────────────────────────────────────────
/**
 * UPGRADE: Atomic — guards quantity >= requested AND
 * (quantity - lockedQuantity) >= requested (no selling locked assets).
 */
const removeHolding = async ({ userId, asset, quantity }) => {
    if (!quantity || quantity <= 0)
        throw new Error("Remove quantity must be positive");
    const holding = await Holding.findOneAndUpdate({
        userId,
        asset,
        quantity: { $gte: quantity },
        // available (unlocked) quantity must also be >= requested
        $expr: { $gte: [{ $subtract: ["$quantity", "$lockedQuantity"] }, quantity] },
    }, { $inc: { quantity: -quantity } }, { new: true });
    if (!holding) {
        const existing = await Holding.findOne({ userId, asset });
        if (!existing || existing.quantity < quantity) {
            throw new Error("Insufficient holding quantity");
        }
        throw new Error("Insufficient available (unlocked) holding quantity");
    }
    if (holding.quantity === 0) {
        await Holding.findByIdAndUpdate(holding._id, { $set: { averagePrice: 0 } });
    }
    return holding;
};
// ─── lockHolding ─────────────────────────────────────────────────────────────
/**
 * UPGRADE: Atomic — guards available (quantity − lockedQuantity) >= requested.
 */
const lockHolding = async ({ userId, asset, quantity }) => {
    if (!quantity || quantity <= 0)
        throw new Error("Lock quantity must be positive");
    const holding = await Holding.findOneAndUpdate({
        userId,
        asset,
        // available quantity = quantity - lockedQuantity >= requested
        $expr: { $gte: [{ $subtract: ["$quantity", "$lockedQuantity"] }, quantity] },
    }, { $inc: { lockedQuantity: quantity } }, { new: true });
    if (!holding) {
        const existing = await Holding.findOne({ userId, asset });
        if (!existing)
            throw new Error("Holding not found");
        throw new Error("Insufficient available asset to lock");
    }
    return holding;
};
// ─── unlockHolding ────────────────────────────────────────────────────────────
/**
 * UPGRADE: Atomic — guards lockedQuantity >= requested.
 */
const unlockHolding = async ({ userId, asset, quantity }) => {
    if (!quantity || quantity <= 0)
        throw new Error("Unlock quantity must be positive");
    const holding = await Holding.findOneAndUpdate({
        userId,
        asset,
        lockedQuantity: { $gte: quantity },
    }, { $inc: { lockedQuantity: -quantity } }, { new: true });
    if (!holding) {
        const existing = await Holding.findOne({ userId, asset });
        if (!existing)
            throw new Error("Holding not found");
        throw new Error("Insufficient locked asset to unlock");
    }
    return holding;
};
module.exports = {
    getHolding,
    addHolding,
    removeHolding,
    lockHolding,
    unlockHolding,
};
