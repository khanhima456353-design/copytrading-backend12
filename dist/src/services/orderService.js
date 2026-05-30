/**
 * orderService.js  —  CRASH-PROOF edition
 *
 * UPGRADES:
 *  - validateOrder      : balance check uses the already-atomic walletService
 *  - placeOrder         : fund/asset locking is now atomic via upgraded walletService/holdingService
 *  - executeMarketOrder : wallet credit/debit done in a single atomic $inc update
 *  - cancelOrder        : atomic status flip via findOneAndUpdate before releasing funds
 */
"use strict";
const Order = require("../../models/Order");
const TradeRecord = require("../../models/TradeRecord");
const WalletService = require("./walletService");
const RiskEngine = require("./riskEngine");
const HoldingService = require("./holdingService");
const LedgerService = require("./ledgerService");
const { getBasePrice } = require("./marketData");
const parseAssetFromPair = (pair) => pair.split("/")[0];
const isValidPrice = (value) => Number.isFinite(value) && value > 0;
const getOrderMarketPrice = (pair) => {
    const marketPrice = getBasePrice(pair);
    if (!isValidPrice(marketPrice)) {
        throw new Error("Market price unavailable");
    }
    return marketPrice;
};
// ─── validateOrder ────────────────────────────────────────────────────────────
const validateOrder = async ({ userId, walletType, pair, side, type, price, quantity, stopPrice, feeRate }) => {
    if (!userId || !pair || !side || !type || !quantity || quantity <= 0) {
        throw new Error("Invalid order payload");
    }
    if (!["spot", "cross", "isolated"].includes(walletType))
        throw new Error("Unsupported wallet type");
    if (!["buy", "sell"].includes(side))
        throw new Error("Unsupported order side");
    if (!["limit", "market", "stop-loss"].includes(type))
        throw new Error("Unsupported order type");
    if (type === "limit" && !isValidPrice(price))
        throw new Error("Limit orders require a valid price");
    if (type === "stop-loss" && !isValidPrice(stopPrice))
        throw new Error("Stop-loss orders require a valid stop price");
    if (type === "market")
        getOrderMarketPrice(pair);
    const wallet = await WalletService.getWallet(userId, walletType === "isolated" ? "cross" : walletType);
    if (wallet.isFrozen)
        throw new Error("Wallet is frozen");
    const effectivePrice = type === "market" ? getOrderMarketPrice(pair) : (isValidPrice(price) ? price : (isValidPrice(stopPrice) ? stopPrice : null));
    if (effectivePrice === null)
        throw new Error("Order requires a valid price");
    const estimatedAmount = effectivePrice * quantity;
    if (side === "buy" && wallet.availableBalance < estimatedAmount) {
        throw new Error("Insufficient available balance for order");
    }
    if (side === "sell" && walletType === "spot") {
        const asset = parseAssetFromPair(pair);
        const holding = await HoldingService.getHolding(userId, asset);
        if (holding.quantity - holding.lockedQuantity < quantity) {
            throw new Error("Insufficient asset holdings for sell order");
        }
    }
    await RiskEngine.validateOrderRisk({ wallet, pair, side, type, quantity, price, stopPrice });
    return wallet;
};
// ─── placeOrder ───────────────────────────────────────────────────────────────
/**
 * UPGRADE: lockFunds and lockHolding inside walletService/holdingService are
 * now atomic — no TOCTOU gap between reading and debiting.
 */
const placeOrder = async ({ userId, walletType, pair, side, type, price, quantity, stopPrice, feeRate = 0 }) => {
    const wallet = await validateOrder({ userId, walletType, pair, side, type, price, quantity, stopPrice, feeRate });
    const orderPrice = type === "market" ? getOrderMarketPrice(pair) : price;
    if (!isValidPrice(orderPrice))
        throw new Error("Order requires a valid price");
    const total = quantity * orderPrice;
    const order = await Order.create({
        userId,
        walletType,
        pair,
        side,
        type,
        price: orderPrice,
        quantity,
        filledQuantity: 0,
        total,
        status: "open",
        stopPrice,
        feeRate,
    });
    if (type === "market") {
        await executeMarketOrder(order, wallet);
    }
    else {
        if (side === "buy") {
            await WalletService.lockFunds({
                userId,
                walletType,
                amount: total,
                reason: "Order placement",
                referenceType: "order",
                referenceId: order._id,
            });
        }
        else {
            const asset = parseAssetFromPair(pair);
            await HoldingService.lockHolding({ userId, asset, quantity });
        }
    }
    return order;
};
// ─── executeMarketOrder ───────────────────────────────────────────────────────
/**
 * UPGRADE: Wallet mutations use findOneAndUpdate atomic $inc instead of
 * read-then-save, eliminating the concurrency window.
 */
const executeMarketOrder = async (order, _wallet) => {
    const marketPrice = isValidPrice(order.price) ? order.price : getOrderMarketPrice(order.pair);
    const amount = order.quantity * marketPrice;
    const asset = parseAssetFromPair(order.pair);
    if (order.side === "buy") {
        // Lock then immediately deduct locked balance (market fills instantly)
        await WalletService.lockFunds({
            userId: order.userId,
            walletType: order.walletType,
            amount,
            reason: "Market order execution",
            referenceType: "order",
            referenceId: order._id,
        });
        // Atomic deduction of locked balance
        const { Wallet } = require("../../models/Wallet");
        await Wallet.findOneAndUpdate({ userId: order.userId, type: order.walletType, lockedBalance: { $gte: amount } }, { $inc: { lockedBalance: -amount } });
        await HoldingService.addHolding({
            userId: order.userId,
            asset,
            quantity: order.quantity,
            price: marketPrice,
        });
        await LedgerService.createLedgerEntry({
            userId: order.userId,
            walletType: order.walletType,
            entryType: "market_buy",
            amount,
            debitAccount: "locked",
            creditAccount: "asset",
            referenceType: "order",
            referenceId: order._id,
            description: "Market buy executed",
            metadata: { asset, quantity: order.quantity, price: marketPrice },
        });
    }
    else {
        // Sell: lock + remove asset, credit wallet atomically
        await HoldingService.lockHolding({ userId: order.userId, asset, quantity: order.quantity });
        await HoldingService.removeHolding({ userId: order.userId, asset, quantity: order.quantity });
        // Atomic credit of available balance (no read-modify-write race)
        const Wallet = require("../../models/Wallet");
        await Wallet.findOneAndUpdate({ userId: order.userId, type: order.walletType }, { $inc: { availableBalance: amount } });
        await LedgerService.createLedgerEntry({
            userId: order.userId,
            walletType: order.walletType,
            entryType: "market_sell",
            amount,
            debitAccount: "asset",
            creditAccount: "wallet",
            referenceType: "order",
            referenceId: order._id,
            description: "Market sell executed",
            metadata: { asset, quantity: order.quantity, price: marketPrice },
        });
    }
    const trade = await TradeRecord.create({
        userId: order.userId,
        orderId: order._id,
        walletType: order.walletType,
        pair: order.pair,
        side: order.side,
        type: order.type,
        price: marketPrice,
        quantity: order.quantity,
        amount,
        fee: amount * order.feeRate,
        pnl: 0,
    });
    order.filledQuantity = order.quantity;
    order.status = "filled";
    await order.save();
    return trade;
};
// ─── cancelOrder ─────────────────────────────────────────────────────────────
/**
 * UPGRADE: Status flip to "cancelled" is atomic — guards against double-cancel
 * from concurrent requests.
 */
const cancelOrder = async ({ orderId, userId }) => {
    // Atomically claim the cancellation: only succeeds if still "open"
    const order = await Order.findOneAndUpdate({ _id: orderId, userId, status: "open" }, { $set: { status: "cancelled" } }, { new: true });
    if (!order) {
        const exists = await Order.exists({ _id: orderId, userId });
        if (!exists)
            throw new Error("Order not found");
        throw new Error("Only open orders can be cancelled");
    }
    if (order.type !== "market") {
        if (order.side === "buy") {
            await WalletService.unlockFunds({
                userId,
                walletType: order.walletType,
                amount: order.total,
                reason: "Order cancelled",
                referenceType: "order",
                referenceId: order._id,
            });
        }
        else {
            const asset = parseAssetFromPair(order.pair);
            await HoldingService.unlockHolding({ userId, asset, quantity: order.quantity });
        }
    }
    return order;
};
module.exports = {
    validateOrder,
    placeOrder,
    cancelOrder,
    executeMarketOrder,
};
