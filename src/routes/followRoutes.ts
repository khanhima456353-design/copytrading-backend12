import express from "express";
import { followUser } from "../controllers/followController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/follow", authMiddleware, followUser);

export default router;