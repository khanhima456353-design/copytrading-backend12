const express = require("express");
const { authMiddleware, adminMiddleware } = require("../middleware/authMiddleware");
const {
  requestDeposit,
  getUserDeposits,
  getPendingDeposits,
  approveDeposit,
  rejectDeposit
} = require("../controllers/depositController");

const router = express.Router();

// User routes
router.post("/request", authMiddleware, requestDeposit);
router.get("/my-deposits", authMiddleware, getUserDeposits);

// Admin routes
router.get("/pending", authMiddleware, adminMiddleware, getPendingDeposits);
router.post("/:depositId/approve", authMiddleware, adminMiddleware, approveDeposit);
router.post("/:depositId/reject", authMiddleware, adminMiddleware, rejectDeposit);

module.exports = router;
