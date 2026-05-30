"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const walletController_1 = require("../controllers/walletController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.post("/deposit", authMiddleware_1.authMiddleware, walletController_1.depositFunds);
router.get("/balance", authMiddleware_1.authMiddleware, walletController_1.getBalance);
exports.default = router;
