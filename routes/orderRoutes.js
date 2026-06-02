const express = require("express");
const authenticateUser = require("../middleware/authenticateUser");
const orderService = require("../services/orderService");

const router = express.Router();

async function findOrderForUser(userId, orderId) {
  const openOrders = await orderService.getUserOpenOrders(userId);
  const openMatch = openOrders.find((o) => String(o._id) === String(orderId));
  if (openMatch) return openMatch;

  const closedOrders = await orderService.getUserClosedOrders(userId);
  return closedOrders.find((o) => String(o._id) === String(orderId)) || null;
}

router.post("/open", authenticateUser, async (req, res) => {
  try {
    const { pair, side, type, entryPrice, quantity, lockedAmount } = req.body;
    if (!pair || !side || !type || entryPrice == null || quantity == null || lockedAmount == null) {
      return res.status(400).json({
        success: false,
        message: "pair, side, type, entryPrice, quantity, and lockedAmount are required",
      });
    }

    const order = await orderService.openOrder(
      req.user._id,
      pair,
      side,
      type,
      Number(entryPrice),
      Number(quantity),
      Number(lockedAmount)
    );

    return res.status(201).json({ success: true, data: { order } });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
});

router.post("/close", authenticateUser, async (req, res) => {
  try {
    const { orderId, closePrice } = req.body;
    if (!orderId || closePrice == null) {
      return res.status(400).json({
        success: false,
        message: "orderId and closePrice are required",
      });
    }

    const existing = await findOrderForUser(req.user._id, orderId);
    if (!existing) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }
    if (String(existing.userId) !== String(req.user._id)) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }
    if (existing.status !== "open") {
      return res.status(400).json({ success: false, message: "Order is not open" });
    }

    const order = await orderService.closeOrder(orderId, Number(closePrice));
    return res.json({ success: true, data: { order } });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
});

router.get("/open", authenticateUser, async (req, res) => {
  try {
    const orders = await orderService.getUserOpenOrders(req.user._id);
    return res.json({ success: true, data: { orders } });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
});

router.get("/closed", authenticateUser, async (req, res) => {
  try {
    const orders = await orderService.getUserClosedOrders(req.user._id);
    return res.json({ success: true, data: { orders } });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
});

router.get("/:orderId", authenticateUser, async (req, res) => {
  try {
    const order = await findOrderForUser(req.user._id, req.params.orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }
    return res.json({ success: true, data: { order } });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
});

module.exports = router;
