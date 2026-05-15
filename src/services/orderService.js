const Order = require("../../models/Order");
const TradeRecord = require("../../models/TradeRecord");
const WalletService = require("./walletService");
const RiskEngine = require("./riskEngine");
const HoldingService = require("./holdingService");
const LedgerService = require("./ledgerService");

const parseAssetFromPair = (pair) => pair.split("/")[0];

const validateOrder = async ({ userId, walletType, pair, side, type, price, quantity, stopPrice, feeRate }) => {
  if (!userId || !pair || !side || !type || !quantity || quantity <= 0) {
    throw new Error("Invalid order payload");
  }

  if (!["spot", "cross", "isolated"].includes(walletType)) {
    throw new Error("Unsupported wallet type");
  }

  if (!["buy", "sell"].includes(side)) {
    throw new Error("Unsupported order side");
  }

  if (!["limit", "market", "stop-loss"].includes(type)) {
    throw new Error("Unsupported order type");
  }

  if (type === "limit" && (!price || price <= 0)) {
    throw new Error("Limit orders require a price");
  }

  if (type === "stop-loss" && (!stopPrice || stopPrice <= 0)) {
    throw new Error("Stop-loss orders require a stop price");
  }

  const wallet = await WalletService.getWallet(userId, walletType === "isolated" ? "cross" : walletType);

  if (wallet.isFrozen) {
    throw new Error("Wallet is frozen");
  }

  const estimatedAmount = Number((price || stopPrice || 0) * quantity);
  const requiredFunds = side === "buy" ? estimatedAmount : 0;

  if (wallet.availableBalance < requiredFunds) {
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

const placeOrder = async ({ userId, walletType, pair, side, type, price, quantity, stopPrice, feeRate = 0 }) => {
  const wallet = await validateOrder({ userId, walletType, pair, side, type, price, quantity, stopPrice, feeRate });
  const total = quantity * (price || stopPrice || 0);
  const order = await Order.create({
    userId,
    walletType,
    pair,
    side,
    type,
    price: price || 0,
    quantity,
    filledQuantity: 0,
    total,
    status: "open",
    stopPrice,
    feeRate
  });

  if (type === "market") {
    await executeMarketOrder(order, wallet);
  } else {
    if (side === "buy") {
      await WalletService.lockFunds({
        userId,
        walletType,
        amount: total,
        reason: "Order placement",
        referenceType: "order",
        referenceId: order._id
      });
    } else {
      const asset = parseAssetFromPair(pair);
      await HoldingService.lockHolding({ userId, asset, quantity });
    }
  }

  return order;
};

const executeMarketOrder = async (order, wallet) => {
  const marketPrice = order.price || order.stopPrice || 1;
  const amount = order.quantity * marketPrice;
  const asset = parseAssetFromPair(order.pair);

  if (order.side === "buy") {
    await WalletService.lockFunds({
      userId: order.userId,
      walletType: order.walletType,
      amount,
      reason: "Market order execution",
      referenceType: "order",
      referenceId: order._id
    });

    wallet.lockedBalance -= amount;
    await wallet.save();

    await HoldingService.addHolding({ userId: order.userId, asset, quantity: order.quantity, price: marketPrice });

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
      metadata: { asset, quantity: order.quantity, price: marketPrice }
    });
  } else {
    await HoldingService.lockHolding({ userId: order.userId, asset, quantity: order.quantity });
    await HoldingService.removeHolding({ userId: order.userId, asset, quantity: order.quantity });

    wallet.availableBalance += amount;
    await wallet.save();

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
      metadata: { asset, quantity: order.quantity, price: marketPrice }
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
    pnl: 0
  });

  order.filledQuantity = order.quantity;
  order.status = "filled";
  await order.save();

  return trade;
};

const cancelOrder = async ({ orderId, userId }) => {
  const order = await Order.findOne({ _id: orderId, userId });
  if (!order) {
    throw new Error("Order not found");
  }

  if (order.status !== "open") {
    throw new Error("Only open orders can be cancelled");
  }

  order.status = "cancelled";
  await order.save();

  if (order.type !== "market") {
    if (order.side === "buy") {
      await WalletService.unlockFunds({
        userId,
        walletType: order.walletType,
        amount: order.total,
        reason: "Order cancelled",
        referenceType: "order",
        referenceId: order._id
      });
    } else {
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
  executeMarketOrder
};
