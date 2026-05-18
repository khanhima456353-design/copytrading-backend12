import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

import authRoutes    from "./routes/authRoutes";
import walletRoutes  from "./routes/walletRoutes";
import tradeRoutes   from "./routes/tradeRoutes";
import followRoutes  from "./routes/followRoutes";
import marketRoutes  from "./routes/marketRoutes";
import accountRoutes from "./routes/accountRoutes";   // ← added
import { authMiddleware } from "./middleware/authMiddleware";
import { setCurrentPrice } from "./services/marketData";
const User = require("../models/User");

const app    = express();
const server = http.createServer(app);

// Socket.IO setup
const io = new Server(server, {
  cors: { origin: "*" }
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth",    authRoutes);
app.use("/api/wallet",  walletRoutes);
app.use("/api/trade",   tradeRoutes);
app.use("/api/follow",  followRoutes);
app.use("/api/market",  marketRoutes);
app.use("/api/account", accountRoutes);   // ← added

app.get("/api/coins", (_req: any, res: any) => {
  res.json({ coins: ["BTC/USDT", "ETH/USDT", "BNB/USDT", "SOL/USDT", "ADA/USDT"] });
});

app.get("/api/ping", (_req: any, res: any) => {
  res.json({ success: true, source: "ts-local" });
});

app.get("/", (_req: any, res: any) => {
  res.send("Copy Trading Backend Running");
});

app.get("/api/profile", authMiddleware, async (req: any, res: any) => {
  try {
    const user = await User.findById(req.userId).select("name email balance kycVerified kycStatus");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({
      success: true,
      user: {
        id:          user._id,
        name:        user.name,
        email:       user.email,
        balance:     user.balance     || 0,
        kycVerified: user.kycVerified || false,
        kycStatus:   user.kycStatus   || "pending",
      },
    });
  } catch (error) {
    console.error("Profile fetch error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Price broadcaster
let price = 30000;
setInterval(() => {
  const change = (Math.random() - 0.5) * 100;
  price += change;
  setCurrentPrice(price);

  const side   = Math.random() > 0.5 ? "buy" : "sell";
  const amount = Number((Math.random() * 2 + 0.05).toFixed(4));

  io.emit("priceUpdate", { pair: "BTC/USDT", price: price.toFixed(2) });
  io.emit("trade",       { pair: "BTC/USDT", price: price.toFixed(2), amount, side, time: Math.floor(Date.now() / 1000) });
}, 2000);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}).on("error", (err: NodeJS.ErrnoException) => {
  if (err?.code === "EADDRINUSE") {
    console.error(`Port ${PORT} is already in use.`);
  } else {
    console.error("Server error:", err);
  }
});
