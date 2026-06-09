const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const User = require("../../models/User");
const Notification = require("../../models/Notification");
const Transaction = require("../../models/Transaction");
const Setting = require("../../models/Setting");

const marketSimulator = require("../services/marketSimulator");
const Order = require("../../models/Order");
const Position = require("../../models/Position");
const Wallet = require("../../models/Wallet");
const walletService = require("../../services/walletService");
const { generateAccessToken, generateRefreshToken } = require("../../utils/auth");
const { sendKycApprovedNotification, sendKycRejectedNotification } = require("../../utils/emailNotifications");

const emitSocket = (event, payload = {}) => {
  if (!global.io) return;

  global.io.emit(event, {
    timestamp: Date.now(),
    ...payload
  });
};

const buildSearchQuery = (search) => {
  if (!search) return {};

  const query = {
    $or: [
      { email: new RegExp(search, "i") },
      { name: new RegExp(search, "i") }
    ]
  };

  if (/^[0-9a-fA-F]{24}$/.test(search)) {
    query.$or.unshift({ _id: search });
  }

  return query;
};

exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);


    // Ensure required legacy `userId` exists before saving refresh token
    if (!user.userId) {
      try {
        user.userId = (user._id || '').toString();
      } catch (e) {
        // fallback: don't block saving — will use save without validation
      }
    }

    user.refreshToken = refreshToken;
    // If userId was still missing for some reason, skip validation to avoid failing login
    if (!user.userId) {
      await user.save({ validateBeforeSave: false });
    } else {
      await user.save();
    }

    res.json({
      success: true,
      message: "Admin login successful",
      token: accessToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const { search, status, page = 1, limit = 50 } = req.query;
    const query = buildSearchQuery(search);

    if (status === "banned") query.isBanned = true;
    if (status === "active") query.isBanned = false;
    if (status === "kyc_verified") query.kycVerified = true;
    if (status === "kyc_pending") query.kycStatus = "pending";
    if (status === "kyc_rejected") query.kycStatus = "rejected";

    const pageNumber = Number(page) || 1;
    const pageSize = Math.min(Number(limit) || 50, 200);

    const [users, total] = await Promise.all([
      User.find(query)
        .select("name email balance role isBanned kycVerified kycStatus createdAt lastLogin")
        .sort({ createdAt: -1 })
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize),
      User.countDocuments(query)
    ]);

    res.json({ users, total, page: pageNumber, limit: pageSize });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getKycSubmissions = async (req, res) => {
  try {
    const submissions = await User.find({ "kycSubmission.submittedAt": { $exists: true } })
      .select("name email role kycVerified kycStatus kycSubmission.submittedAt")
      .sort({ "kycSubmission.submittedAt": -1 })
      .limit(20);

    const formatted = submissions.map((user) => ({
      id: user._id,
      name: user.name || user.email,
      email: user.email,
      role: user.role,
      kycVerified: Boolean(user.kycVerified),
      kycStatus: user.kycStatus || "pending",
      submittedAt: user.kycSubmission?.submittedAt
    }));

    res.json({ submissions: formatted });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    const user = await User.findById(id).select(
      "name email balance frozenBalance role isBanned kycVerified kycStatus createdAt updatedAt lastLogin kycSubmission"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userObj = user.toObject();
    userObj.id = userObj.id || userObj._id;

    res.json({ user: userObj });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    
    // Count pending deposits (transactions of type 'deposit' with status 'pending')
    const pendingDeposits = await Transaction.countDocuments({ 
      type: 'deposit', 
      status: 'pending' 
    });
    
    // Count pending withdrawals (transactions of type 'withdrawal' with status 'pending')
    const pendingWithdrawals = await Transaction.countDocuments({ 
      type: 'withdrawal', 
      status: 'pending' 
    });
    
    // Count pending KYC submissions
    const pendingKycCount = await User.countDocuments({ 
      kycStatus: 'pending' 
    });
    
    // Calculate total platform balance (sum of all user balances)
    const balanceAgg = await User.aggregate([
      { $group: { _id: null, total: { $sum: '$balance' } } }
    ]);
    const totalPlatformBalance = balanceAgg.length > 0 ? balanceAgg[0].total : 0;
    
    res.json({
      success: true,
      totalUsers,
      pendingDeposits,
      pendingWithdrawals,
      pendingKycCount,
      totalPlatformBalance: Number(totalPlatformBalance).toFixed(2)
    });
  } catch (err) {
    console.error('getDashboardStats error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getUserOpenOrders = async (req, res) => {
  try {
    const { id } = req.params;
    const query = { userId: id, status: { $in: ['pending', 'open', 'partially_filled'] } };

    console.log('ADMIN_SIM_USER', id);
    console.log('ADMIN_SIM_QUERY', { collection: 'Order', query });

    const orders = await Order.find(query).sort({ createdAt: -1 });

    console.log('ADMIN_SIM_QUERY_RESULT', orders.map((o) => ({
      _id: o._id,
      pair: o.pair,
      side: o.side,
      status: o.status,
      createdAt: o.createdAt,
      amount: o.amount,
      quantity: o.quantity,
      price: o.price,
      stopPrice: o.stopPrice,
      type: o.type
    })));

    return res.json({ orders });
  } catch (error) {
    console.error('ADMIN_SIM_ORDER_ERROR', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getUserPositions = async (req, res) => {
  try {
    const { id } = req.params;
    const positions = await Position.find({ userId: id }).sort({ createdAt: -1 });
    return res.json({ positions });
  } catch (error) {
    console.error('ADMIN_SIM_POSITION_ERROR', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    const allowedUpdates = ["name", "email", "role", "isBanned", "kycVerified", "kycStatus"];
    const updates = {};

    allowedUpdates.forEach((key) => {
      if (req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    });

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "No valid fields provided for update" });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const previousKycVerified = Boolean(user.kycVerified);
    const previousKycStatus = user.kycStatus;

    Object.assign(user, updates);

    
    // Ensure required legacy `userId` exists before saving
    if (!user.userId) {
      try {
        user.userId = (user._id || '').toString();
      } catch (e) {
        // fallback: don't block update
      }
    }

    // Save with or without validation if userId is still missing
    if (!user.userId) {
      await user.save({ validateBeforeSave: false });
    } else {
      await user.save();
    }

    const nowKycVerified = Boolean(user.kycVerified);
    const nowKycStatus = user.kycStatus;

    const isApproved = nowKycVerified && nowKycStatus === "approved";
    const justApproved = isApproved && (!previousKycVerified || previousKycStatus !== "approved");
    const justRejected = nowKycStatus === "rejected" && previousKycStatus !== "rejected";

    if (justApproved) {
      // Create in-app notification
      await Notification.create({
        userId: user._id,
        title: "✅ KYC Verified – Full Trading Access Unlocked",
        message: "Congratulations! Your identity has been successfully verified. You now have full access to all trading features including unlimited deposits & withdrawals, leveraged products, and SwanCore Services.",
        type: "success",
        priority: "high",
        metadata: {
          kycStatus: user.kycStatus,
          adminId: req.userId
        }
      });

      // Send email and push notifications
      await sendKycApprovedNotification(user.email, user.name);
      
      // Emit socket event for push notification
      if (global.io) {
        global.io.to(`user_${user._id}`).emit("kycApproved", {
          title: "✅ KYC Verified",
          message: "Your account is now fully verified with full trading access!",
          timestamp: Date.now()
        });
      }
    }

    if (justRejected) {
      // Create in-app notification with rejection details
      const rejectionReasons = req.body.rejectionReasons || [
        "Document image was blurry or incomplete",
        "Address proof is older than 3 months"
      ];

      await Notification.create({
        userId: user._id,
        title: "⚠️ KYC Verification Requires Attention",
        message: `We were unable to verify your identity with the documents provided. Please re-submit with corrected documents. You have 7 days to re-submit before your account is restricted.`,
        type: "warning",
        priority: "high",
        metadata: {
          kycStatus: user.kycStatus,
          adminId: req.userId,
          rejectionReasons: rejectionReasons
        }
      });

      // Send email notification
      await sendKycRejectedNotification(user.email, user.name, {
        reasons: rejectionReasons
      });

      // Emit socket event for push notification
      if (global.io) {
        global.io.to(`user_${user._id}`).emit("kycRejected", {
          title: "⚠️ KYC Verification Requires Attention",
          message: "Please re-submit your documents within 7 days.",
          timestamp: Date.now()
        });
      }
    }

    res.json({ message: "User updated", user });
  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
      return res.status(400).json({ message: "Email already in use" });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const createBalanceTransaction = async ({
  userId,
  amount,
  type,
  description,
  adminId,
  balanceBefore,
  balanceAfter,
  lockedBefore,
  lockedAfter
}) => {
  const numericAmount = Number(amount) || 0;
  const user = await User.findById(userId).lean();
  if (!user) throw new Error("Transaction target user not found");

  const currentBalance = user.balance || 0;
  const currentLocked = user.frozenBalance || 0;

  const finalizedBalanceAfter = balanceAfter != null ? Number(balanceAfter) : currentBalance;
  const finalizedLockedAfter = lockedAfter != null ? Number(lockedAfter) : currentLocked;

  const finalizedBalanceBefore = balanceBefore != null
    ? Number(balanceBefore)
    : finalizedBalanceAfter - numericAmount;

  const finalizedLockedBefore = lockedBefore != null
    ? Number(lockedBefore)
    : (type === "freeze" || type === "lock")
      ? finalizedLockedAfter - numericAmount
      : finalizedLockedAfter;

  return Transaction.create({
    userId,
    type,
    amount: numericAmount,
    balanceBefore: finalizedBalanceBefore,
    balanceAfter: finalizedBalanceAfter,
    lockedBefore: finalizedLockedBefore,
    lockedAfter: finalizedLockedAfter,
    description,
    createdBy: adminId || null,
  });
};

const getSettingValue = async (key, defaultValue) => {
  const setting = await Setting.findOne({ key });
  return setting ? setting.value : defaultValue;
};

const upsertSetting = async (key, value) => {
  return Setting.findOneAndUpdate(
    { key },
    { value },
    { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
  );
};

const syncUserWalletBalances = async (userId, availableBalance, lockedBalance) => {
  const wallet = await walletService.ensureWallet(userId);
  wallet.availableBalance = Number(availableBalance) || 0;
  wallet.lockedBalance = Number(lockedBalance) || 0;
  if (wallet.availableBalance < 0 || wallet.lockedBalance < 0) {
    throw new Error("Wallet balances cannot be negative");
  }
  await wallet.save();
  return wallet;
};

// Deposit/audit-related admin endpoints removed because corresponding models were deleted.

exports.getSettings = async (req, res) => {
  try {
    const tradeLossMin = await getSettingValue("tradeLossMinPercent", 10);
    const tradeLossMax = await getSettingValue("tradeLossMaxPercent", 20);
    res.json({ tradeLossMin, tradeLossMax });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.updateTradeSettings = async (req, res) => {
  try {
    const { tradeLossMin, tradeLossMax } = req.body;
    if (tradeLossMin == null || tradeLossMax == null) {
      return res.status(400).json({ message: "tradeLossMin and tradeLossMax are required" });
    }
    if (tradeLossMin < 0 || tradeLossMax < 0 || tradeLossMin > tradeLossMax) {
      return res.status(400).json({ message: "Invalid trade loss settings" });
    }

    await upsertSetting("tradeLossMinPercent", Number(tradeLossMin));
    await upsertSetting("tradeLossMaxPercent", Number(tradeLossMax));

    

    res.json({ message: "Trade settings updated", tradeLossMin, tradeLossMax });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


exports.adminStartDrift = async (req, res) => {
  try {
    const {
      userId,
      pair,
      positionId,
      positionSide,
      entryPrice,
      outcomePercent,
      direction,
      speed = "normal",
      volatility = "low",
      lossPercent = 0.25,
    } = req.body;

    if (!userId || !pair || !positionId || entryPrice == null || outcomePercent == null || !direction) {
      return res.status(400).json({
        message: "userId, pair, positionId, entryPrice, outcomePercent, and direction are required"
      });
    }

    const status = marketSimulator.startDrift({
      userId,
      pair,
      positionId,
      positionSide,
      entryPrice: Number(entryPrice),
      outcomePercent: Number(outcomePercent),
      direction,
      speed,
      volatility,
      lossPercent,
    });

    if (!status) {
      return res.status(400).json({ message: "Unable to start drift for this user/pair" });
    }

    res.json({ success: true, status });
  } catch (error) {
    console.error("adminStartDrift error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.adminStopDrift = async (req, res) => {
  try {
    const { userId, pair, positionId } = req.body;
    if (!userId || !pair || !positionId) {
      return res.status(400).json({ message: "userId, pair, and positionId are required" });
    }

    const status = marketSimulator.stopDrift(userId, pair, positionId);
    if (!status) {
      return res.status(404).json({ message: "No drift state found for this user/pair" });
    }

    res.json({ success: true, status });
  } catch (error) {
    console.error("adminStopDrift error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.adminDriftStatus = async (req, res) => {
  try {
    const { userId, pair, positionId } = req.params;
    if (!userId || !pair || !positionId) {
      return res.status(400).json({ message: "userId, pair, and positionId are required" });
    }

    const status = marketSimulator.getDriftStatus(userId, pair, positionId);
    res.json({ success: true, status });
  } catch (error) {
    console.error("adminDriftStatus error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.addBalance = async (req, res) => {
  try {
    const { userId, amount, description } = req.body;
    const adminId = req.userId;

    if (!userId || !amount || amount <= 0) {
      return res.status(400).json({ message: "userId and positive amount are required" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.balance = (user.balance || 0) + Number(amount);

    if (!user.userId) { try { user.userId = (user._id || '').toString(); } catch (e) {} }
    if (!user.userId) { await user.save({ validateBeforeSave: false }); } else { await user.save(); }

    await syncUserWalletBalances(userId, user.balance, user.frozenBalance || 0);

    const syncedUser = await User.findById(userId).lean();
    emitSocket("balanceUpdate", {
      userId: user._id,
      balance: syncedUser?.balance || user.balance,
      available: syncedUser?.balance || user.balance,
      locked: syncedUser?.frozenBalance || 0
    });

    await createBalanceTransaction({
      userId,
      amount,
      type: "manual_credit",
      description: description || "Admin added balance",
      adminId
    });

    res.json({ message: "Balance added", userBalance: syncedUser?.balance || user.balance });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.removeBalance = async (req, res) => {
  try {
    const { userId, amount, description } = req.body;
    const adminId = req.userId;

    if (!userId || !amount || amount <= 0) {
      return res.status(400).json({ message: "userId and positive amount are required" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if ((user.balance || 0) < amount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    user.balance = (user.balance || 0) - Number(amount);

    if (!user.userId) { try { user.userId = (user._id || '').toString(); } catch (e) {} }
    if (!user.userId) { await user.save({ validateBeforeSave: false }); } else { await user.save(); }

    await syncUserWalletBalances(userId, user.balance, user.frozenBalance || 0);

    const syncedUser = await User.findById(userId).lean();
    emitSocket("balanceUpdate", {
      userId: user._id,
      balance: syncedUser?.balance || user.balance,
      available: syncedUser?.balance || user.balance,
      locked: syncedUser?.frozenBalance || 0
    });

    await createBalanceTransaction({
      userId,
      amount,
      type: "manual_debit",
      description: description || "Admin removed balance",
      adminId
    });

    res.json({ message: "Balance removed", userBalance: syncedUser?.balance || user.balance });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.creditBonus = async (req, res) => {
  try {
    const { userId, amount, description } = req.body;
    const adminId = req.userId;

    if (!userId || !amount || amount <= 0) {
      return res.status(400).json({ message: "userId and positive amount are required" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.balance = (user.balance || 0) + Number(amount);

    if (!user.userId) { try { user.userId = (user._id || '').toString(); } catch (e) {} }
    if (!user.userId) { await user.save({ validateBeforeSave: false }); } else { await user.save(); }

    await syncUserWalletBalances(userId, user.balance, user.frozenBalance || 0);

    const syncedUser = await User.findById(userId).lean();
    emitSocket("balanceUpdate", {
      userId: user._id,
      balance: syncedUser?.balance || user.balance,
      available: syncedUser?.balance || user.balance,
      locked: syncedUser?.frozenBalance || 0
    });

    await createBalanceTransaction({
      userId,
      amount,
      type: "bonus",
      description: description || "Admin credited bonus",
      adminId
    });

    res.json({ message: "Bonus credited", userBalance: syncedUser?.balance || user.balance });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.freezeFunds = async (req, res) => {
  try {
    const { userId, amount, description } = req.body;
    const adminId = req.userId;

    if (!userId || !amount || amount <= 0) {
      return res.status(400).json({ message: "userId and positive amount are required" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if ((user.balance || 0) < amount) {
      return res.status(400).json({ message: "Insufficient balance to freeze" });
    }

    user.balance = (user.balance || 0) - Number(amount);
    user.frozenBalance = (user.frozenBalance || 0) + Number(amount);

    if (!user.userId) { try { user.userId = (user._id || '').toString(); } catch (e) {} }
    if (!user.userId) { await user.save({ validateBeforeSave: false }); } else { await user.save(); }

    await syncUserWalletBalances(userId, user.balance, user.frozenBalance || 0);

    const syncedUser = await User.findById(userId);
    emitSocket("balanceUpdate", {
      userId: user._id,
      balance: syncedUser?.balance || user.balance,
      available: syncedUser?.balance || user.balance,
      locked: syncedUser?.frozenBalance || user.frozenBalance
    });

    await createBalanceTransaction({
      userId,
      amount,
      type: "freeze",
      description: description || "Funds frozen by admin",
      adminId
    });

    res.json({ message: "Funds frozen", userBalance: syncedUser?.balance || user.balance, frozenBalance: syncedUser?.frozenBalance || user.frozenBalance });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getBalanceHistory = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const transactions = await Transaction.find({ userId: id })
      .sort({ createdAt: -1 });

    res.json({ transactions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Deposit and withdrawal admin endpoints removed because corresponding models were deleted.


// ─── Admin Price Override ─────────────────────────────────────────────────────
exports.setPriceOverride = async (req, res) => {
  try {
    const { userId, pair, price } = req.body;

    if (!userId || !pair || price === undefined) {
      return res.status(400).json({
        message: "userId, pair, and price are required"
      });
    }

    if (!Number.isFinite(price) || price <= 0) {
      return res.status(400).json({
        message: "price must be a positive number"
      });
    }

    // Ensure structure exists
    if (!global.adminPriceOverride[userId]) {
      global.adminPriceOverride[userId] = {};
    }

    // Set the override
    global.adminPriceOverride[userId][pair] = {
      active: true,
      price: parseFloat(price)
    };

    // Emit price update to user's socket room with override price
    if (global.io) {
      global.io.to(`user:${userId}`).emit('priceUpdate', {
        pair,
        price: parseFloat(price),
        isOverride: true,
        time: Date.now()
      });
    }

    

    res.json({
      message: "Price override set",
      override: {
        userId,
        pair,
        active: true,
        price: parseFloat(price)
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.removePriceOverride = async (req, res) => {
  try {
    const { userId, pair } = req.body;

    if (!userId || !pair) {
      return res.status(400).json({
        message: "userId and pair are required"
      });
    }

    // Clear the override
    if (global.adminPriceOverride[userId]) {
      global.adminPriceOverride[userId][pair] = {
        active: false,
        price: null
      };
    }

    // Get live Binance price
    const livePrice = global.cachedMarketPrices?.[pair];

    // Emit price update to user's socket room with live Binance price
    if (global.io) {
      global.io.to(`user:${userId}`).emit('priceUpdate', {
        pair,
        price: livePrice || null,
        isOverride: false,
        time: Date.now()
      });
    }

    

    res.json({
      message: "Price override removed",
      override: {
        userId,
        pair,
        active: false,
        price: null,
        livePrice: livePrice || null
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
