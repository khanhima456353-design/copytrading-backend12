import express from "express";
import {
  depositFunds,
  getBalance
} from "../controllers/walletController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/deposit", authMiddleware, depositFunds);
router.get("/balance", authMiddleware, getBalance);

export default router;