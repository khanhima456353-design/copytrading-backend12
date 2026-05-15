import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import {
  requestDeposit,
  getUserDeposits,
  getPendingDeposits,
  approveDeposit,
  rejectDeposit
} from "../controllers/depositController";

const router = Router();

// User routes
router.post("/request", authMiddleware, requestDeposit);
router.get("/my-deposits", authMiddleware, getUserDeposits);

// Admin routes
router.get("/pending", authMiddleware, getPendingDeposits);
router.post("/:depositId/approve", authMiddleware, approveDeposit);
router.post("/:depositId/reject", authMiddleware, rejectDeposit);

export default router;
