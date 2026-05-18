"use strict";
const TradingPermission = require("../../models/TradingPermission");
const RiskConfig = require("../../models/RiskConfiguration");
const MarginPosition = require("../../models/MarginPosition");
const getRiskConfigValue = async (key, defaultValue) => {
    const config = await RiskConfig.findOne({ key });
    return config ? config.value : defaultValue;
};
const calculatePositionPnl = ({ entryPrice, currentPrice, quantity, side }) => {
    const direction = side === "long" ? 1 : -1;
    return (currentPrice - entryPrice) * quantity * direction;
};
const calculateLiquidationPrice = ({ entryPrice, leverage, maintenanceMarginRatio, side }) => {
    if (!entryPrice || !leverage)
        return null;
    const marginImpact = entryPrice / leverage;
    const threshold = entryPrice * maintenanceMarginRatio;
    if (side === "long") {
        return entryPrice - marginImpact - threshold;
    }
    return entryPrice + marginImpact + threshold;
};
const calculateCrossMarginSummary = async ({ wallet, positions = [], currentPrices = {} }) => {
    const unrealizedPnl = positions.reduce((sum, position) => {
        const price = currentPrices[position.pair] || position.entryPrice;
        return sum + calculatePositionPnl({ ...position.toObject(), currentPrice: price });
    }, 0);
    const equity = wallet.availableBalance + unrealizedPnl - wallet.borrowedBalance;
    const maintenanceMargin = equity * wallet.maintenanceMarginRatio;
    const marginRatio = equity > 0 ? maintenanceMargin / equity : 1;
    return {
        unrealizedPnl,
        equity,
        maintenanceMargin,
        marginRatio,
        health: marginRatio < 1 ? "healthy" : "risk"
    };
};
const validateOrderRisk = async ({ wallet, pair, side, type, quantity, price, stopPrice }) => {
    const permission = await TradingPermission.findOne({ userId: wallet.userId });
    if (!permission || !permission.enabled) {
        throw new Error("User trading permissions are disabled");
    }
    if (!permission.allowedPairs.length && !permission.blockedPairs.length) {
        return true;
    }
    if (permission.blockedPairs.includes(pair)) {
        throw new Error("Trading is blocked for this pair");
    }
    if (permission.allowedPairs.length && !permission.allowedPairs.includes(pair)) {
        throw new Error("Trading is not permitted for this pair");
    }
    return true;
};
const isLiquidationRequired = async ({ wallet, positions, currentPrices = {} }) => {
    const summary = await calculateCrossMarginSummary({ wallet, positions, currentPrices });
    return summary.equity <= summary.maintenanceMargin;
};
module.exports = {
    getRiskConfigValue,
    calculatePositionPnl,
    calculateLiquidationPrice,
    calculateCrossMarginSummary,
    validateOrderRisk,
    isLiquidationRequired
};
