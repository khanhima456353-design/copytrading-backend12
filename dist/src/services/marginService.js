"use strict";
const MarginPosition = require("../../models/MarginPosition");
const WalletService = require("./walletService");
const LedgerService = require("./ledgerService");
const RiskEngine = require("./riskEngine");
const createIsolatedPosition = async ({ userId, pair, side, quantity, entryPrice, margin, leverage, liquidationPrice }) => {
    const wallet = await WalletService.getWallet(userId, "cross");
    if (!wallet.isMarginEnabled) {
        throw new Error("Margin trading is not enabled for this user");
    }
    if (wallet.availableBalance < margin) {
        throw new Error("Insufficient margin collateral");
    }
    wallet.availableBalance -= margin;
    wallet.lockedBalance += margin;
    await wallet.save();
    const position = await MarginPosition.create({
        userId,
        pair,
        side,
        type: "isolated",
        quantity,
        entryPrice,
        isolatedMargin: margin,
        borrowedAmount: (quantity * entryPrice) / leverage - margin,
        leverage,
        maintenanceMargin: margin * 0.25,
        liquidationPrice: liquidationPrice || RiskEngine.calculateLiquidationPrice({ entryPrice, leverage, maintenanceMarginRatio: wallet.maintenanceMarginRatio, side })
    });
    await LedgerService.createLedgerEntry({
        userId,
        walletType: "isolated",
        entryType: "isolated_position_open",
        amount: margin,
        debitAccount: "available",
        creditAccount: "isolated_margin",
        referenceType: "margin_position",
        referenceId: position._id,
        description: "Opened isolated margin position",
        metadata: { pair, side, quantity, leverage }
    });
    return position;
};
const closeIsolatedPosition = async ({ positionId, currentPrice, closedByAdmin = false }) => {
    const position = await MarginPosition.findById(positionId);
    if (!position || position.status !== "open") {
        throw new Error("Position not available for close");
    }
    const pnl = RiskEngine.calculatePositionPnl({
        entryPrice: position.entryPrice,
        currentPrice,
        quantity: position.quantity,
        side: position.side
    });
    position.status = closedByAdmin ? "closed" : "closed";
    position.unrealizedPnl = pnl;
    await position.save();
    const wallet = await WalletService.getWallet(position.userId, "cross");
    wallet.lockedBalance -= position.isolatedMargin;
    wallet.availableBalance += position.isolatedMargin + pnl;
    await wallet.save();
    await LedgerService.createLedgerEntry({
        userId: position.userId,
        walletType: "isolated",
        entryType: "isolated_position_close",
        amount: position.isolatedMargin + pnl,
        debitAccount: "isolated_margin",
        creditAccount: "available",
        referenceType: "margin_position",
        referenceId: position._id,
        description: "Closed isolated margin position",
        metadata: { pnl, currentPrice, closedByAdmin }
    });
    return position;
};
const getOpenIsolatedPositions = async (userId) => {
    return MarginPosition.find({ userId, type: "isolated", status: "open" });
};
module.exports = {
    createIsolatedPosition,
    closeIsolatedPosition,
    getOpenIsolatedPositions
};
