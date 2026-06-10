const Order = require("../models/Order");
const walletService = require("./walletService");
const { clampPnL, calculatePositionPnL } = require("../utils/pnlClamp");

function clampPnlPercent(rawPnlPercent) {
  return clampPnL(rawPnlPercent);
}

function calculatePnl(entryPrice, currentPrice, quantity, positionSide, leverage) {
  const pnl = calculatePositionPnL(entryPrice, currentPrice, quantity, positionSide || "long", leverage || 1);
  return {
    rawPnlPercent: pnl.rawPnlPercent,
    rawPnl: pnl.rawPnl,
    clampedPnlPercent: pnl.clampedPnlPercent,
    clampedPnl: pnl.clampedPnl,
  };
}

async function openOrder(userId, pair, side, type, entryPrice, quantity, lockedAmount, stopPrice, stopLoss, takeProfit) {
  const positionSide = side === "sell" ? "short" : "long";
  const isPending = ["stop-limit", "oco"].includes(type);
  const order = await Order.create({
    userId,
    pair,
    side,
    type,
    positionSide,
    price: entryPrice,
    amount: quantity,
    entryPrice,
    quantity,
    lockedAmount,
    stopPrice: stopPrice || entryPrice,
    stopLoss: stopLoss != null ? Number(stopLoss) : undefined,
    takeProfit: takeProfit != null ? Number(takeProfit) : undefined,
    status: isPending ? "pending" : "open",
    openedAt: new Date(),
  });

  if (!order.orderId) {
    order.orderId = order._id.toString();
    await order.save();
  }

  try {
    await walletService.lockBalance(userId, lockedAmount, order._id);
  } catch (err) {
    await Order.findByIdAndDelete(order._id);
    throw err;
  }

  return order;
}

async function updateOrderPnl(orderId, currentPrice) {
  const order = await Order.findById(orderId);
  if (!order) {
    throw new Error("Order not found");
  }
  if (order.status !== "open") {
    throw new Error("Order is not open");
  }

  const pnl = calculatePnl(order.entryPrice, currentPrice, order.quantity, order.positionSide, order.leverage);
  order.rawPnlPercent = pnl.rawPnlPercent;
  order.rawPnl = pnl.rawPnl;
  order.clampedPnlPercent = pnl.clampedPnlPercent;
  order.clampedPnl = pnl.clampedPnl;

  await order.save();
  return order;
}

async function closeOrder(orderId, closePrice) {
  const order = await Order.findById(orderId);
  if (!order) {
    throw new Error("Order not found");
  }
  if (order.status !== "open") {
    throw new Error("Order is not open");
  }

  const pnl = calculatePnl(order.entryPrice, closePrice, order.quantity, order.positionSide, order.leverage);
  order.rawPnlPercent = pnl.rawPnlPercent;
  order.rawPnl = pnl.rawPnl;
  order.clampedPnlPercent = pnl.clampedPnlPercent;
  order.clampedPnl = pnl.clampedPnl;
  order.realizedPnl = pnl.clampedPnl ?? pnl.rawPnl ?? 0;
  order.closePrice = closePrice;
  order.status = "closed";
  order.closedAt = new Date();

  await walletService.unlockBalance(order.userId, order.lockedAmount, order.clampedPnl, order._id);
  await order.save();
  return order;
}

async function cancelOrder(orderId) {
  const order = await Order.findById(orderId) || await Order.findOne({ orderId });
  if (!order) throw new Error("Order not found");
  if (order.status !== "open" && order.status !== "pending") throw new Error("Order is not open or pending");

  await walletService.unlockBalance(order.userId, order.lockedAmount, 0, order._id);
  order.status = "cancelled";
  order.closedAt = new Date();
  await order.save();
  return order;
}

async function fillPendingOrder(orderId, currentPrice) {
  const order = await Order.findById(orderId);
  if (!order) throw new Error("Order not found");
  if (order.status !== "pending") throw new Error("Order is not pending");

  const fillPrice = order.side === "buy"
    ? Math.min(order.price, currentPrice)
    : Math.max(order.price, currentPrice);

  order.entryPrice = fillPrice;
  order.status = "open";
  order.openedAt = new Date();
  await order.save();

  return order;
}

async function getUserOpenOrders(userId) {
  return Order.find({ userId, status: { $in: ["open", "pending"] } }).sort({ openedAt: -1 });
}

async function getUserClosedOrders(userId) {
  return Order.find({ userId, status: "closed" }).sort({ closedAt: -1 });
}

module.exports = {
  openOrder,
  updateOrderPnl,
  closeOrder,
  cancelOrder,
  fillPendingOrder,
  getUserOpenOrders,
  getUserClosedOrders,
  calculatePnl,
};
