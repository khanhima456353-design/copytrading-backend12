"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const tradeController_1 = require("../controllers/tradeController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.post("/place", authMiddleware_1.authMiddleware, tradeController_1.placeTrade);
router.get("/history", authMiddleware_1.authMiddleware, tradeController_1.getTradeHistory);
router.get("/stats", authMiddleware_1.authMiddleware, tradeController_1.getTradeStats);
exports.default = router;
