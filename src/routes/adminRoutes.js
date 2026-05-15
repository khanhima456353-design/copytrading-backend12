const express = require("express");
const { authMiddleware, adminMiddleware, superAdminMiddleware } = require("../middleware/authMiddleware");
const {
  adminLogin,
  getDashboardStats,
  getKycSubmissions,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  addBalance,
  removeBalance,
  creditBonus,
  freezeFunds,
  getBalanceHistory,
  getDeposits,
  approveDeposit,
  rejectDeposit,
  getWithdrawals,
  approveWithdrawal,
  rejectWithdrawal,
  addDeposit,
  getAuditLogs,
  getSettings,
  updateTradeSettings
} = require("../controllers/adminController");
const {
  getAllTrades,
  getActiveTrades,
  updateTradeResult
} = require("../controllers/tradeController");

const router = express.Router();

router.post("/login", adminLogin);
router.use(authMiddleware, adminMiddleware);

router.get("/stats", getDashboardStats);
router.get("/kyc-submissions", getKycSubmissions);
router.get("/users", getUsers);
router.get("/user/:id", getUserById);
router.patch("/user/:id", updateUser);
router.delete("/user/:id", deleteUser);

router.post("/add-balance", addBalance);
router.post("/remove-balance", removeBalance);
router.post("/credit-bonus", creditBonus);
router.post("/freeze-funds", freezeFunds);
router.get("/balance-history/:id", getBalanceHistory);

router.post("/deposit/create", superAdminMiddleware, addDeposit);
router.get("/deposits", getDeposits);
router.post("/deposit/approve", superAdminMiddleware, approveDeposit);
router.post("/deposit/reject", superAdminMiddleware, rejectDeposit);

router.get("/withdrawals", getWithdrawals);
router.post("/withdrawal/approve", approveWithdrawal);
router.post("/withdrawal/reject", rejectWithdrawal);

router.get("/trades", getAllTrades);
router.get("/trades/active", getActiveTrades);
router.post("/trade/update", superAdminMiddleware, updateTradeResult);

router.get("/audit-logs", getAuditLogs);
router.get("/settings", getSettings);
router.post("/settings/trade-loss", updateTradeSettings);

module.exports = router;
