import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { adminMiddleware } from "../middleware/adminMiddleware";
import { requestDeposit, getUserDeposits, getPendingDeposits, approveDeposit, rejectDeposit } from "../controllers/depositController";

const router = Router();

// User routes
router.post("/request", authMiddleware, requestDeposit);
router.get("/my-deposits", authMiddleware, getUserDeposits);

// Admin routes
router.get("/pending", authMiddleware, adminMiddleware, getPendingDeposits);
router.post("/:depositId/approve", authMiddleware, adminMiddleware, approveDeposit);
router.post("/:depositId/reject", authMiddleware, adminMiddleware, rejectDeposit);

export default router;
