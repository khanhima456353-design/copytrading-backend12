const mongoose = require("mongoose");
const Order = require("../models/Order");
const walletService = require("./walletService");
const { clampPnL, calculatePositionPnL } = require("../utils/pnlClamp");

function clampPnlPercent(rawPnlPercent) {
  return clampPnL(rawPnlPercent);
}

function calculatePnl(entryPrice, currentPrice, lockedAmount) {
  const pnl = calculatePositionPnL(entryPrice, currentPrice, lockedAmount, "long", 1);
  return {
    rawPnlPercent: pnl.rawPnlPercent,
    rawPnl: pnl.rawPnl,
    clampedPnlPercent: pnl.clampedPnlPercent,
    clampedPnl: pnl.clampedPnl,
  };
}

async function openOrder(userId, pair, side, type, entryPrice, quantity, lockedAmount) {
  const session = await mongoose.startSession();
  let order;

  try {
    await session.withTransaction(async () => {
      const created = await Order.create(
        [
          {
            userId,
            pair,
            side,
            type,
            entryPrice,
            quantity,
            lockedAmount,
            status: "open",
            openedAt: new Date(),
          },
        ],
        { session }
      );
      order = created[0];
    });
  } finally {
    await session.endSession();
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

  const pnl = calculatePnl(order.entryPrice, currentPrice, order.lockedAmount);
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

  const pnl = calculatePnl(order.entryPrice, closePrice, order.lockedAmount);
  order.rawPnlPercent = pnl.rawPnlPercent;
  order.rawPnl = pnl.rawPnl;
  order.clampedPnlPercent = pnl.clampedPnlPercent;
  order.clampedPnl = pnl.clampedPnl;
  order.closePrice = closePrice;
  order.status = "closed";
  order.closedAt = new Date();

  await walletService.unlockBalance(order.userId, order.lockedAmount, order.clampedPnl, order._id);
  await order.save();
  return order;
}

async function getUserOpenOrders(userId) {
  return Order.find({ userId, status: "open" }).sort({ openedAt: -1 });
}

async function getUserClosedOrders(userId) {
  return Order.find({ userId, status: "closed" }).sort({ closedAt: -1 });
}

module.exports = {
  openOrder,
  updateOrderPnl,
  closeOrder,
  getUserOpenOrders,
  getUserClosedOrders,
};
