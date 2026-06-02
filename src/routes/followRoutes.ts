import express from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { followUser } from "../controllers/followController";

const router = express.Router();

// Follow a user
router.post("/", authMiddleware, followUser);

export default router;
