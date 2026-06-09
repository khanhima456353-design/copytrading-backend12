const express = require("express");
const { authMiddleware, adminMiddleware, superAdminMiddleware } = require("../middleware/authMiddleware");
const {
  adminLogin,
  getDashboardStats,
  getKycSubmissions,
  getUsers,
  getUserById,
  getUserOpenOrders,
  getUserPositions,
  updateUser,
  addBalance,
  removeBalance,
  creditBonus,
  freezeFunds,
  getBalanceHistory,
  getSettings,

  updateTradeSettings,
  adminStartDrift,
  adminStopDrift,
  adminDriftStatus,
  setPriceOverride,
  removePriceOverride
} = require("../controllers/adminController");

const router = express.Router();

router.post("/login", adminLogin);
router.get("/stats", authMiddleware, adminMiddleware, getDashboardStats);
router.use(authMiddleware, adminMiddleware);

// stats route removed (controller export missing)
router.get("/kyc-submissions", getKycSubmissions);
router.get("/users", getUsers);
router.get("/user/:id", getUserById);

router.get("/user/:id/positions", getUserPositions);
router.get("/user/:id/open-orders", getUserOpenOrders);
router.get("/users/:id/open-orders", getUserOpenOrders);
router.get("/user/:id/open-order", getUserOpenOrders);
router.get("/users/:id/open-order", getUserOpenOrders);
router.patch("/user/:id", updateUser);
// user delete route removed (controller export missing)


router.post("/add-balance", addBalance);
router.post("/remove-balance", removeBalance);
router.post("/credit-bonus", creditBonus);
router.post("/freeze-funds", freezeFunds);
router.get("/balance-history/:id", getBalanceHistory);
// Deposit, withdrawal, trade, audit, and other removed routes.


router.post("/sim/drift/start", adminStartDrift);
router.post("/sim/drift/stop", adminStopDrift);
router.get("/sim/drift/:userId/:pair/:positionId", adminDriftStatus);

// legacy aliases for backward compatibility
router.post("/drift/start", adminStartDrift);
router.post("/drift/stop", adminStopDrift);
router.get("/drift/status/:userId/:pair/:positionId", adminDriftStatus);

// audit-logs route removed.
router.get("/settings", getSettings);
router.post("/settings/trade-loss", updateTradeSettings);


// Price override routes
router.post("/price-override", setPriceOverride);
router.delete("/price-override", removePriceOverride);

module.exports = router;
