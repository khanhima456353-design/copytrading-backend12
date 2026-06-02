"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middleware/authMiddleware");
const adminMiddleware_1 = require("../middleware/adminMiddleware");
const depositController_1 = require("../controllers/depositController");
const router = (0, express_1.Router)();
// User routes
router.post("/request", authMiddleware_1.authMiddleware, depositController_1.requestDeposit);
router.get("/my-deposits", authMiddleware_1.authMiddleware, depositController_1.getUserDeposits);
// Admin routes
router.get("/pending", authMiddleware_1.authMiddleware, adminMiddleware_1.adminMiddleware, depositController_1.getPendingDeposits);
router.post("/:depositId/approve", authMiddleware_1.authMiddleware, adminMiddleware_1.adminMiddleware, depositController_1.approveDeposit);
router.post("/:depositId/reject", authMiddleware_1.authMiddleware, adminMiddleware_1.adminMiddleware, depositController_1.rejectDeposit);
exports.default = router;
