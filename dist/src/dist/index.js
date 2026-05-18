"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const walletRoutes_1 = __importDefault(require("./routes/walletRoutes"));
const tradeRoutes_1 = __importDefault(require("./routes/tradeRoutes"));
const followRoutes_1 = __importDefault(require("./routes/followRoutes"));
const marketRoutes_1 = __importDefault(require("./routes/marketRoutes"));
const authMiddleware_1 = require("./middleware/authMiddleware");
const marketData_1 = require("./services/marketData");
const User_1 = __importDefault(require("../models/User"));
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
// 🔥 Socket.IO setup
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "*"
    }
});
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Routes
app.use("/api/auth", authRoutes_1.default);
app.use("/api/wallet", walletRoutes_1.default);
app.use("/api/trade", tradeRoutes_1.default);
app.use("/api/follow", followRoutes_1.default);
app.use("/api/market", marketRoutes_1.default);
app.get("/api/coins", (req, res) => {
    res.json({ coins: ["BTC/USDT", "ETH/USDT", "BNB/USDT", "SOL/USDT", "ADA/USDT"] });
});
app.get("/api/ping", (req, res) => {
    res.json({ success: true, source: "ts-local" });
});
// Test routes
app.get("/", (req, res) => {
    res.send("Copy Trading Backend Running");
});
app.get("/api/profile", authMiddleware_1.authMiddleware, async (req, res) => {
    try {
        const user = await User_1.default.findById(req.userId).select("name email balance kycVerified kycStatus");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                balance: user.balance || 0,
                kycVerified: user.kycVerified || false,
                kycStatus: user.kycStatus || "pending"
            }
        });
    }
    catch (error) {
        console.error("Profile fetch error:", error);
        res.status(500).json({ message: "Server error" });
    }
});
// 🔥 Fake BTC price generator + DEBUG LOG
let price = 30000;
setInterval(() => {
    const change = (Math.random() - 0.5) * 100;
    price += change;
    (0, marketData_1.setCurrentPrice)(price);
    const side = Math.random() > 0.5 ? "buy" : "sell";
    const amount = Number((Math.random() * 2 + 0.05).toFixed(4));
    console.log("Sending price:", price); // ✅ DEBUG
    io.emit("priceUpdate", {
        pair: "BTC/USDT",
        price: price.toFixed(2),
    });
    io.emit("trade", {
        pair: "BTC/USDT",
        price: price.toFixed(2),
        amount,
        side,
        time: Math.floor(Date.now() / 1000),
    });
}, 2000);
const PORT = process.env.PORT || 5000;
// Start server
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}).on("error", (err) => {
    if (err?.code === "EADDRINUSE") {
        console.error(`Port ${PORT} is already in use. Stop the existing server or set PORT to a different value.`);
    }
    else {
        console.error("Server error:", err);
    }
});
