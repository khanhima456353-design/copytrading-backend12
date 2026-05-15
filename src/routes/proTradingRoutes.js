const express = require("express");
const {
  authMiddleware,
  adminMiddleware,
  superAdminMiddleware
} = require("../middleware/authMiddleware");
const controller = require("../controllers/proTradingController");

const router = express.Router();

router.use(authMiddleware);

router.get("/wallet/:type", controller.getWalletSummary);
router.post("/order", controller.placeOrder);
router.post("/order/cancel", controller.cancelOrder);
router.get("/orders", controller.listOrders);
router.get("/positions/isolated", controller.getIsolatedPositions);
router.post("/positions/isolated/open", controller.openIsolatedPosition);
router.post("/positions/isolated/close", controller.closeIsolatedPosition);

router.use(adminMiddleware);
router.get("/risk/parameters", controller.getRiskParameters);
router.post("/risk/parameter", controller.updateRiskParameter);
router.post("/permissions/update", controller.updateTradingPermission);
router.post("/wallet/adjust", controller.manualBalanceAdjustment);
router.post("/wallet/freeze", controller.freezeWallet);
router.post("/liquidation/force", controller.forceLiquidation);

module.exports = router;
