const mongoose = require("mongoose");
const Order = require("../models/Order");

let getPrice = (pair) => null;
let getSimulatedPrice = (userId, pair) => null;
let closeOrder = null;
let onActivate = null;
let onSpotFill = null;

function startMonitor(opts) {
  getPrice = opts.getPrice || getPrice;
  getSimulatedPrice = opts.getSimulatedPrice || getSimulatedPrice;
  closeOrder = opts.closeOrder || closeOrder;
  onActivate = opts.onActivate || onActivate;
  onSpotFill = opts.onSpotFill || onSpotFill;
  setTimeout(() => reconcileOpenPositions(), 1000);
  setInterval(tick, 2000);
}

async function tick() {
  try {
    await checkPendingTriggers();
    await checkSlTpTriggers();
  } catch (err) {
    console.error("[OrderMonitor] tick error:", err.message);
  }
}

async function reconcileOpenPositions() {
  try {
    const openOrders = await Order.find({ status: "open", type: { $in: ["market", "limit"] } });
    const grouped = {};
    for (const o of openOrders) {
      const key = `${o.userId}|${o.pair}`;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(o);
    }
    for (const [key, orders] of Object.entries(grouped)) {
      const [userId, pair] = key.split("|");
      const totalQty = orders.reduce((s, o) => s + o.quantity, 0);
      const totalMargin = orders.reduce((s, o) => s + o.lockedAmount, 0);
      const avgPrice = orders.reduce((s, o) => s + (o.entryPrice * o.quantity), 0) / totalQty;

      const existing = await mongoose.model("Position").findOne({ userId, pair });
      if (existing) {
        // Position exists — merge any unmatched order quantity
        const qtyDiff = Math.abs(existing.size - totalQty);
        if (qtyDiff > 0.0001) {
          console.warn(`[OrderMonitor] Position size mismatch for ${key}: pos=${existing.size}, orders=${totalQty} — reconciling`);
          if (typeof onActivate === "function") {
            const fakeOrder = orders[0];
            fakeOrder.quantity = totalQty;
            fakeOrder.entryPrice = avgPrice;
            fakeOrder.lockedAmount = totalMargin;
            // onActivate will merge into existing position (else branch adds qty)
            await onActivate(fakeOrder, avgPrice);
            console.log(`[OrderMonitor] Reconciled position for ${userId} ${pair}`);
          }
        }
        continue;
      }

      if (typeof onActivate === "function") {
        const fakeOrder = orders[0];
        fakeOrder.quantity = totalQty;
        fakeOrder.entryPrice = avgPrice;
        fakeOrder.lockedAmount = totalMargin;
        await onActivate(fakeOrder, avgPrice);
        console.log(`[OrderMonitor] Reconciled position for ${userId} ${pair} (${orders.length} orders)`);
      }
    }
  } catch (err) {
    console.error("[OrderMonitor] reconcile error:", err.message);
  }
}

async function checkPendingTriggers() {
  const pending = await Order.find({ status: "pending", type: { $in: ["limit", "stop-limit", "oco"] } });
  if (!pending.length) return;

  for (const order of pending) {
    // Use simulated price if user has an active simulation for this pair, else Binance price
    const currentPrice = getSimulatedPrice(order.userId, order.pair) || getPrice(order.pair);
    if (!currentPrice || currentPrice <= 0) continue;

    let triggered = false;

    if (order.type === "limit") {
      triggered =
        (order.side === "buy" && currentPrice <= order.price) ||
        (order.side === "sell" && currentPrice >= order.price);
    } else {
      triggered =
        (order.side === "buy" && currentPrice >= order.stopPrice) ||
        (order.side === "sell" && currentPrice <= order.stopPrice);
    }

    if (!triggered) continue;

    try {
      const fillPrice = order.type === "limit"
        ? (order.side === "buy" ? Math.min(order.price, currentPrice) : Math.max(order.price, currentPrice))
        : currentPrice;

      if (order.category === "spot") {
        order.status = "filled";
        order.filledAt = new Date();
        order.entryPrice = fillPrice;
        await order.save();
        if (typeof onSpotFill === "function") {
          await onSpotFill(order, fillPrice);
        }
      } else {
        order.status = "open";
        order.entryPrice = fillPrice;
        order.openedAt = new Date();
        await order.save();
        if (typeof onActivate === "function") {
          await onActivate(order, fillPrice);
        }
      }
      console.log(`[OrderMonitor] Triggered ${order.type} ${order._id} at ${fillPrice}`);
    } catch (err) {
      console.error(`[OrderMonitor] Failed to activate order ${order._id}:`, err.message);
    }
  }
}

async function checkSlTpTriggers() {
  const openOrders = await Order.find({
    status: "open",
    $or: [
      { stopLoss: { $gt: 0 } },
      { takeProfit: { $gt: 0 } },
    ],
  });
  if (!openOrders.length) return;

  for (const order of openOrders) {
    const currentPrice = getPrice(order.pair);
    if (!currentPrice || currentPrice <= 0) continue;

    let slHit = false;
    if (order.stopLoss > 0) {
      if (order.positionSide === "long" && currentPrice <= order.stopLoss) slHit = true;
      if (order.positionSide === "short" && currentPrice >= order.stopLoss) slHit = true;
    }

    let tpHit = false;
    if (order.takeProfit > 0) {
      if (order.positionSide === "long" && currentPrice >= order.takeProfit) tpHit = true;
      if (order.positionSide === "short" && currentPrice <= order.takeProfit) tpHit = true;
    }

    if (slHit || tpHit) {
      try {
        await closeOrder(order._id, currentPrice);
        console.log(`[OrderMonitor] Closed ${order._id} via ${slHit ? "SL" : "TP"} at ${currentPrice}`);
      } catch (err) {
        console.error(`[OrderMonitor] Failed to close ${order._id}:`, err.message);
      }
    }
  }
}

module.exports = { startMonitor };
