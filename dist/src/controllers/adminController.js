"use strict";
const bcrypt = require("bcrypt");
const User = require("../../models/User");
const Notification = require("../../models/Notification");
const Deposit = require("../../models/Deposit");
const Transaction = require("../../models/Transaction");
const Withdrawal = require("../../models/Withdrawal");
const AuditLog = require("../../models/AuditLog");
const Setting = require("../../models/Setting");
const { generateAccessToken, generateRefreshToken } = require("../../utils/auth");
const emitSocket = (event, payload = {}) => {
    if (!global.io)
        return;
    global.io.emit(event, {
        timestamp: Date.now(),
        ...payload
    });
};
const buildSearchQuery = (search) => {
    if (!search)
        return {};
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
        user.refreshToken = refreshToken;
        await user.save();
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
exports.getUsers = async (req, res) => {
    try {
        const { search, status, page = 1, limit = 50 } = req.query;
        const query = buildSearchQuery(search);
        if (status === "banned")
            query.isBanned = true;
        if (status === "active")
            query.isBanned = false;
        if (status === "kyc_verified")
            query.kycVerified = true;
        if (status === "kyc_pending")
            query.kycStatus = "pending";
        if (status === "kyc_rejected")
            query.kycStatus = "rejected";
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
    }
    catch (error) {
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
exports.getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id).select("name email balance frozenBalance role isBanned kycVerified kycStatus createdAt updatedAt lastLogin kycSubmission");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ user });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
exports.getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const pendingDeposits = await Deposit.countDocuments({ status: "pending" });
        const pendingWithdrawals = await Withdrawal.countDocuments({ status: "pending" });
        const activeTraders = await Transaction.distinct("userId").then((ids) => ids.length);
        const totals = await User.aggregate([
            {
                $group: {
                    _id: null,
                    balance: { $sum: "$balance" },
                    frozenBalance: { $sum: "$frozenBalance" }
                }
            }
        ]);
        const recentTransactions = await Transaction.find()
            .sort({ createdAt: -1 })
            .limit(10)
            .populate("userId", "email name");
        const pendingKycCount = await User.countDocuments({
            "kycSubmission.submittedAt": { $exists: true },
            kycStatus: "pending"
        });
        res.json({
            totalUsers,
            pendingDeposits,
            pendingWithdrawals,
            activeTraders,
            totalPlatformBalance: totals?.[0]?.balance + totals?.[0]?.frozenBalance || 0,
            pendingKycCount,
            recentTransactions
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
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
        await user.save();
        const nowKycVerified = Boolean(user.kycVerified);
        const nowKycStatus = user.kycStatus;
        const isApproved = nowKycVerified && nowKycStatus === "approved";
        const justApproved = isApproved && (!previousKycVerified || previousKycStatus !== "approved");
        const justRejected = nowKycStatus === "rejected" && previousKycStatus !== "rejected";
        if (justApproved) {
            await Notification.create({
                userId: user._id,
                title: "KYC Verification Approved",
                message: "Your identity verification has been approved. Your account is now fully verified and trading is unlocked.",
                type: "success",
                priority: "high",
                metadata: {
                    kycStatus: user.kycStatus,
                    adminId: req.userId
                }
            });
        }
        if (justRejected) {
            await Notification.create({
                userId: user._id,
                title: "KYC Verification Rejected",
                message: "Your KYC submission was not approved. Please review your documents and submit again.",
                type: "warning",
                priority: "high",
                metadata: {
                    kycStatus: user.kycStatus,
                    adminId: req.userId
                }
            });
        }
        res.json({ message: "User updated", user });
    }
    catch (error) {
        console.error(error);
        if (error.code === 11000) {
            return res.status(400).json({ message: "Email already in use" });
        }
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        await Promise.all([
            Deposit.deleteMany({ userId: id }),
            Transaction.deleteMany({ userId: id }),
            Withdrawal.deleteMany({ userId: id })
        ]);
        res.json({ message: "User deleted" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
const createBalanceTransaction = async ({ userId, amount, type, description, adminId }) => {
    return Transaction.create({
        userId,
        type,
        amount: Number(amount),
        description,
        createdBy: adminId
    });
};
const createAdminAuditLog = async ({ adminId, action, targetType, targetId, details, metadata }) => {
    return AuditLog.create({
        adminId,
        action,
        targetType,
        targetId,
        details,
        metadata
    });
};
const getSettingValue = async (key, defaultValue) => {
    const setting = await Setting.findOne({ key });
    return setting ? setting.value : defaultValue;
};
const upsertSetting = async (key, value) => {
    return Setting.findOneAndUpdate({ key }, { value }, { upsert: true, new: true, setDefaultsOnInsert: true });
};
exports.addDeposit = async (req, res) => {
    try {
        const { userId, amount, transactionRef, notes } = req.body;
        const adminId = req.userId;
        if (!userId || !amount || amount <= 0) {
            return res.status(400).json({ message: "userId and positive amount are required" });
        }
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const deposit = await Deposit.create({
            userId,
            amount: Number(amount),
            status: "approved",
            paymentMethod: "admin_credit",
            transactionRef: transactionRef || `admin-${Date.now()}`,
            notes: notes || "Admin deposit created",
            approvedBy: adminId,
            approvedAt: new Date()
        });
        user.balance = (user.balance || 0) + Number(amount);
        await user.save();
        emitSocket("balanceUpdate", {
            userId: user._id,
            balance: user.balance
        });
        await createBalanceTransaction({
            userId,
            amount,
            type: "deposit",
            description: `Admin deposit approved (${deposit.transactionRef})`,
            adminId
        });
        await createAdminAuditLog({
            adminId,
            action: "admin_add_deposit",
            targetType: "deposit",
            targetId: deposit._id,
            details: `Admin credited ${amount} to user ${user.email}`,
            metadata: { transactionRef: deposit.transactionRef }
        });
        res.json({ message: "Deposit created and balance updated", deposit, userBalance: user.balance });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
exports.getAuditLogs = async (req, res) => {
    try {
        const logs = await AuditLog.find()
            .populate("adminId", "email name role")
            .sort({ createdAt: -1 })
            .limit(200);
        res.json({ logs });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
exports.getSettings = async (req, res) => {
    try {
        const tradeLossMin = await getSettingValue("tradeLossMinPercent", 10);
        const tradeLossMax = await getSettingValue("tradeLossMaxPercent", 20);
        res.json({ tradeLossMin, tradeLossMax });
    }
    catch (error) {
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
        await createAdminAuditLog({
            adminId: req.userId,
            action: "update_trade_settings",
            targetType: "setting",
            details: `Updated trade loss range to ${tradeLossMin}-${tradeLossMax}`,
            metadata: { tradeLossMin, tradeLossMax }
        });
        res.json({ message: "Trade settings updated", tradeLossMin, tradeLossMax });
    }
    catch (error) {
        console.error(error);
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
        if (!user)
            return res.status(404).json({ message: "User not found" });
        user.balance = (user.balance || 0) + Number(amount);
        await user.save();
        emitSocket("balanceUpdate", { userId: user._id, balance: user.balance });
        await createBalanceTransaction({
            userId,
            amount,
            type: "manual_credit",
            description: description || "Admin added balance",
            adminId
        });
        await createAdminAuditLog({
            adminId,
            action: "add_balance",
            targetType: "user",
            targetId: user._id,
            details: `Added ${amount} to user ${user.email}`,
            metadata: { amount, description }
        });
        res.json({ message: "Balance added", userBalance: user.balance });
    }
    catch (error) {
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
        if (!user)
            return res.status(404).json({ message: "User not found" });
        if ((user.balance || 0) < amount) {
            return res.status(400).json({ message: "Insufficient balance" });
        }
        user.balance = (user.balance || 0) - Number(amount);
        await user.save();
        emitSocket("balanceUpdate", { userId: user._id, balance: user.balance });
        await createBalanceTransaction({
            userId,
            amount,
            type: "manual_debit",
            description: description || "Admin removed balance",
            adminId
        });
        await createAdminAuditLog({
            adminId,
            action: "remove_balance",
            targetType: "user",
            targetId: user._id,
            details: `Removed ${amount} from user ${user.email}`,
            metadata: { amount, description }
        });
        res.json({ message: "Balance removed", userBalance: user.balance });
    }
    catch (error) {
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
        if (!user)
            return res.status(404).json({ message: "User not found" });
        user.balance = (user.balance || 0) + Number(amount);
        await user.save();
        emitSocket("balanceUpdate", { userId: user._id, balance: user.balance });
        await createBalanceTransaction({
            userId,
            amount,
            type: "bonus",
            description: description || "Admin credited bonus",
            adminId
        });
        await createAdminAuditLog({
            adminId,
            action: "credit_bonus",
            targetType: "user",
            targetId: user._id,
            details: `Credited bonus ${amount} to user ${user.email}`,
            metadata: { amount, description }
        });
        res.json({ message: "Bonus credited", userBalance: user.balance });
    }
    catch (error) {
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
        if (!user)
            return res.status(404).json({ message: "User not found" });
        if ((user.balance || 0) < amount) {
            return res.status(400).json({ message: "Insufficient balance to freeze" });
        }
        user.balance = (user.balance || 0) - Number(amount);
        user.frozenBalance = (user.frozenBalance || 0) + Number(amount);
        await user.save();
        emitSocket("balanceUpdate", { userId: user._id, balance: user.balance, frozenBalance: user.frozenBalance });
        await createBalanceTransaction({
            userId,
            amount,
            type: "freeze",
            description: description || "Funds frozen by admin",
            adminId
        });
        await createAdminAuditLog({
            adminId,
            action: "freeze_funds",
            targetType: "user",
            targetId: user._id,
            details: `Frozen ${amount} for user ${user.email}`,
            metadata: { amount, description }
        });
        res.json({ message: "Funds frozen", userBalance: user.balance, frozenBalance: user.frozenBalance });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
exports.getBalanceHistory = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        if (!user)
            return res.status(404).json({ message: "User not found" });
        const transactions = await Transaction.find({ userId: id })
            .sort({ createdAt: -1 });
        res.json({ transactions });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
exports.getDeposits = async (req, res) => {
    try {
        const { status, userId } = req.query;
        const query = {};
        if (status) {
            query.status = status;
        }
        if (userId) {
            query.userId = userId;
        }
        const deposits = await Deposit.find(query)
            .populate("userId", "email name")
            .sort({ createdAt: -1 });
        res.json({ deposits });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
exports.approveDeposit = async (req, res) => {
    try {
        const { depositId, transactionRef } = req.body;
        const adminId = req.userId;
        if (!depositId) {
            return res.status(400).json({ message: "depositId is required" });
        }
        const deposit = await Deposit.findById(depositId);
        if (!deposit)
            return res.status(404).json({ message: "Deposit not found" });
        if (deposit.status !== "pending") {
            return res.status(400).json({ message: "Deposit is not pending" });
        }
        deposit.status = "approved";
        deposit.approvedBy = adminId;
        deposit.approvedAt = new Date();
        deposit.transactionRef = transactionRef || deposit.transactionRef;
        await deposit.save();
        const user = await User.findById(deposit.userId);
        if (user) {
            user.balance = (user.balance || 0) + deposit.amount;
            await user.save();
            emitSocket("balanceUpdate", { userId: user._id, balance: user.balance });
            await createBalanceTransaction({
                userId: deposit.userId,
                amount: deposit.amount,
                type: "deposit",
                description: transactionRef ? `Deposit approved (${transactionRef})` : "Deposit approved by admin",
                adminId
            });
            await createAdminAuditLog({
                adminId,
                action: "approve_deposit",
                targetType: "deposit",
                targetId: deposit._id,
                details: `Approved deposit ${deposit._id} for user ${user.email}`,
                metadata: { transactionRef }
            });
        }
        res.json({ message: "Deposit approved", deposit });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
exports.rejectDeposit = async (req, res) => {
    try {
        const { depositId, reason } = req.body;
        if (!depositId) {
            return res.status(400).json({ message: "depositId is required" });
        }
        const deposit = await Deposit.findById(depositId);
        if (!deposit)
            return res.status(404).json({ message: "Deposit not found" });
        deposit.status = "rejected";
        deposit.notes = reason || "Rejected by admin";
        await deposit.save();
        await createAdminAuditLog({
            adminId: req.userId,
            action: "reject_deposit",
            targetType: "deposit",
            targetId: deposit._id,
            details: `Rejected deposit ${deposit._id}`,
            metadata: { reason }
        });
        res.json({ message: "Deposit rejected", deposit });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
exports.getWithdrawals = async (req, res) => {
    try {
        const { status, userId } = req.query;
        const query = {};
        if (status)
            query.status = status;
        if (userId)
            query.userId = userId;
        const withdrawals = await Withdrawal.find(query)
            .populate("userId", "email name")
            .sort({ createdAt: -1 });
        res.json({ withdrawals });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
exports.approveWithdrawal = async (req, res) => {
    try {
        const { withdrawalId, notes } = req.body;
        const adminId = req.userId;
        if (!withdrawalId) {
            return res.status(400).json({ message: "withdrawalId is required" });
        }
        const withdrawal = await Withdrawal.findById(withdrawalId);
        if (!withdrawal)
            return res.status(404).json({ message: "Withdrawal not found" });
        if (withdrawal.status !== "pending") {
            return res.status(400).json({ message: "Withdrawal is not pending" });
        }
        const user = await User.findById(withdrawal.userId);
        if (!user)
            return res.status(404).json({ message: "User not found" });
        if ((user.balance || 0) < withdrawal.amount) {
            return res.status(400).json({ message: "Insufficient user balance" });
        }
        user.balance = (user.balance || 0) - withdrawal.amount;
        await user.save();
        emitSocket("balanceUpdate", { userId: user._id, balance: user.balance });
        withdrawal.status = "approved";
        withdrawal.approvedBy = adminId;
        withdrawal.approvedAt = new Date();
        withdrawal.notes = notes || withdrawal.notes;
        await withdrawal.save();
        await createBalanceTransaction({
            userId: withdrawal.userId,
            amount: withdrawal.amount,
            type: "withdrawal",
            description: notes || "Withdrawal approved by admin",
            adminId
        });
        await createAdminAuditLog({
            adminId,
            action: "approve_withdrawal",
            targetType: "withdrawal",
            targetId: withdrawal._id,
            details: `Approved withdrawal ${withdrawal._id} for user ${user.email}`,
            metadata: { notes }
        });
        res.json({ message: "Withdrawal approved", withdrawal, userBalance: user.balance });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
exports.rejectWithdrawal = async (req, res) => {
    try {
        const { withdrawalId, reason } = req.body;
        if (!withdrawalId) {
            return res.status(400).json({ message: "withdrawalId is required" });
        }
        const withdrawal = await Withdrawal.findById(withdrawalId);
        if (!withdrawal)
            return res.status(404).json({ message: "Withdrawal not found" });
        withdrawal.status = "rejected";
        withdrawal.notes = reason || "Rejected by admin";
        await withdrawal.save();
        await createAdminAuditLog({
            adminId: req.userId,
            action: "reject_withdrawal",
            targetType: "withdrawal",
            targetId: withdrawal._id,
            details: `Rejected withdrawal ${withdrawal._id}`,
            metadata: { reason }
        });
        res.json({ message: "Withdrawal rejected", withdrawal });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
