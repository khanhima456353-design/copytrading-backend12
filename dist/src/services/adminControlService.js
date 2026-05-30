"use strict";
const RiskConfiguration = require("../../models/RiskConfiguration");
const TradingPermission = require("../../models/TradingPermission");
const Liquidation = require("../../models/Liquidation");
const MarginPosition = require("../../models/MarginPosition");
const WalletService = require("./walletService");
const RiskEngine = require("./riskEngine");
const createRiskConfig = async (key, value) => {
    const existing = await RiskConfiguration.findOne({ key });
    if (existing) {
        existing.value = value;
        return existing.save();
    }
    return RiskConfiguration.create({ key, value });
};
const updateTradingPermission = async (userId, updates) => {
    const permission = await TradingPermission.findOneAndUpdate({ userId }, updates, { upsert: true, new: true });
    return permission;
};
const forceLiquidate = async ({ adminId, positionId, currentPrice, reason }) => {
    const position = await MarginPosition.findById(positionId);
    if (!position) {
        throw new Error("Position not found for liquidation");
    }
    const existing = await Liquidation.create({
        positionId,
        userId: position.userId,
        pair: position.pair,
        walletType: position.type,
        amount: position.quantity * (currentPrice || position.entryPrice),
        price: currentPrice || position.entryPrice,
        reason,
        status: "pending",
        executedBy: adminId,
        metadata: { forced: true, positionType: position.type }
    });
    return existing;
};
const setGlobalRiskParameter = async (key, value) => {
    return createRiskConfig(key, value);
};
const getRiskParameters = async () => {
    const configs = await RiskConfiguration.find();
    return configs.reduce((acc, item) => {
        acc[item.key] = item.value;
        return acc;
    }, {});
};
const manualWalletAdjustment = async ({ userId, walletType, available, locked, borrowed, adminId, description }) => {
    return WalletService.adjustBalances({ userId, walletType, available, locked, borrowed, adminId, description });
};
const freezeUserWallet = async ({ userId, walletType, freeze }) => {
    const wallet = await WalletService.ensureWallet(userId, walletType);
    wallet.isFrozen = Boolean(freeze);
    return wallet.save();
};
module.exports = {
    createRiskConfig,
    updateTradingPermission,
    forceLiquidate,
    setGlobalRiskParameter,
    getRiskParameters,
    manualWalletAdjustment,
    freezeUserWallet
};
