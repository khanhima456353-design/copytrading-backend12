"use strict";
const Order = require("../../models/Order");
const AdminControlService = require("../services/adminControlService");
const getWalletSummary = async (req, res) => {
    try {
        const walletType = req.params.type || "spot";
        const wallet = await WalletService.getWallet(req.userId, walletType);
        return res.json({ wallet });
    }
    catch (error) {
        console.error(error);
        return res.status(400).json({ message: error.message });
    }
};
const placeOrder = async (req, res) => {
    try {
        const { walletType, pair, side, type, price, quantity, stopPrice, feeRate } = req.body;
        const order = await OrderService.placeOrder({
            userId: req.userId,
            walletType,
            pair,
            side,
            type,
            price,
            quantity,
            stopPrice,
            feeRate
        });
        return res.json({ order });
    }
    catch (error) {
        console.error(error);
        return res.status(400).json({ message: error.message });
    }
};
const cancelOrder = async (req, res) => {
    try {
        const { orderId } = req.body;
        const order = await OrderService.cancelOrder({ orderId, userId: req.userId });
        return res.json({ order });
    }
    catch (error) {
        console.error(error);
        return res.status(400).json({ message: error.message });
    }
};
const listOrders = async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.userId }).sort({ createdAt: -1 });
        return res.json({ orders });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
};
const getIsolatedPositions = async (req, res) => {
    try {
        const positions = await MarginService.getOpenIsolatedPositions(req.userId);
        return res.json({ positions });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
};
const openIsolatedPosition = async (req, res) => {
    try {
        const { pair, side, quantity, entryPrice, margin, leverage } = req.body;
        const position = await MarginService.createIsolatedPosition({
            userId: req.userId,
            pair,
            side,
            quantity,
            entryPrice,
            margin,
            leverage
        });
        return res.json({ position });
    }
    catch (error) {
        console.error(error);
        return res.status(400).json({ message: error.message });
    }
};
const closeIsolatedPosition = async (req, res) => {
    try {
        const { positionId, currentPrice } = req.body;
        const position = await MarginService.closeIsolatedPosition({ positionId, currentPrice });
        return res.json({ position });
    }
    catch (error) {
        console.error(error);
        return res.status(400).json({ message: error.message });
    }
};
const getRiskParameters = async (req, res) => {
    try {
        const configurations = await AdminControlService.getRiskParameters();
        return res.json({ configurations });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
};
const updateRiskParameter = async (req, res) => {
    try {
        const { key, value } = req.body;
        const config = await AdminControlService.setGlobalRiskParameter(key, value);
        return res.json({ config });
    }
    catch (error) {
        console.error(error);
        return res.status(400).json({ message: error.message });
    }
};
const updateTradingPermission = async (req, res) => {
    try {
        const permission = await AdminControlService.updateTradingPermission(req.body.userId, req.body);
        return res.json({ permission });
    }
    catch (error) {
        console.error(error);
        return res.status(400).json({ message: error.message });
    }
};
const manualBalanceAdjustment = async (req, res) => {
    try {
        const adjustment = await AdminControlService.manualWalletAdjustment({
            userId: req.body.userId,
            walletType: req.body.walletType,
            available: Number(req.body.available || 0),
            locked: Number(req.body.locked || 0),
            borrowed: Number(req.body.borrowed || 0),
            adminId: req.userId,
            description: req.body.description
        });
        return res.json({ adjustment });
    }
    catch (error) {
        console.error(error);
        return res.status(400).json({ message: error.message });
    }
};
const freezeWallet = async (req, res) => {
    try {
        const { userId, walletType, freeze } = req.body;
        const wallet = await AdminControlService.freezeUserWallet({ userId, walletType, freeze });
        return res.json({ wallet });
    }
    catch (error) {
        console.error(error);
        return res.status(400).json({ message: error.message });
    }
};
const forceLiquidation = async (req, res) => {
    try {
        const { positionId, currentPrice, reason } = req.body;
        const liquidation = await AdminControlService.forceLiquidate({
            adminId: req.userId,
            positionId,
            currentPrice,
            reason
        });
        return res.json({ liquidation });
    }
    catch (error) {
        console.error(error);
        return res.status(400).json({ message: error.message });
    }
};
module.exports = {
    getWalletSummary,
    placeOrder,
    cancelOrder,
    listOrders,
    getIsolatedPositions,
    openIsolatedPosition,
    closeIsolatedPosition,
    getRiskParameters,
    updateRiskParameter,
    updateTradingPermission,
    manualBalanceAdjustment,
    freezeWallet,
    forceLiquidation
};
