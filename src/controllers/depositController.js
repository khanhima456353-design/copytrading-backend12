const User = require("../../models/User");
const Deposit = require("../../models/Deposit");
const Transaction = require("../../models/Transaction");
const {
  sendDepositNotification,
  sendDepositApprovedNotification,
  sendDepositRejectedNotification
} = require("../../utils/emailNotifications");
const balanceService = require("../services/balanceService");

// User requests a deposit (creates pending deposit request)
const requestDeposit = async (req, res) => {
  try {
    const { amount, paymentMethod = "bank_transfer", notes } = req.body;
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    const deposit = await Deposit.create({
      userId,
      amount: Number(amount),
      paymentMethod,
      notes:
        notes ||
        `User deposit request - Please send ${amount} to khanhima456353@gmail.com`,
      status: "pending"
    });

    await sendDepositNotification(
      user.email,
      amount,
      deposit._id.toString()
    );

    res.json({
      message:
        "Deposit request created. Please send the amount to khanhima456353@gmail.com",
      deposit
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

// Get user's deposit history
const getUserDeposits = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const deposits = await Deposit.find({ userId }).sort({
      createdAt: -1
    });

    res.json({ deposits });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

// Admin: Get all pending deposits
const getPendingDeposits = async (req, res) => {
  try {
    const deposits = await Deposit.find({ status: "pending" })
      .populate("userId", "email")
      .sort({ createdAt: -1 });

    res.json({ deposits });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

// Admin: Approve deposit and add funds to user account
const approveDeposit = async (req, res) => {
  try {
    const { depositId } = req.params;
    const { transactionRef } = req.body;
    const adminId = req.userId;

    if (!adminId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const deposit = await Deposit.findById(depositId).populate(
      "userId",
      "email"
    );

    if (!deposit) {
      return res.status(404).json({ message: "Deposit not found" });
    }

    if (deposit.status !== "pending") {
      return res.status(400).json({
        message: "Deposit is not pending"
      });
    }

    deposit.status = "approved";
    deposit.approvedBy = adminId;
    deposit.approvedAt = new Date();
    deposit.transactionRef =
      transactionRef || deposit.transactionRef;

    await deposit.save();

    // ✅ BALANCE UPDATE
    const updatedUser = await User.findByIdAndUpdate(
      deposit.userId,
      { $inc: { balance: deposit.amount } },
      { new: true }
    );
    await balanceService.creditBalance(deposit.userId, "USDT", deposit.amount);

    await Transaction.create({
      userId: deposit.userId,
      type: "deposit",
      amount: deposit.amount,
      description: `Deposit approved - ${
        transactionRef || "Manual verification"
      }`,
      createdBy: adminId
    });

    await sendDepositApprovedNotification(
      deposit.userId.email || "",
      deposit.amount
    );

    // 🔥 FIX: REAL-TIME SOCKET UPDATE
    if (global.io) {
      global.io.emit("balanceUpdated", {
        userId: deposit.userId.toString(),
        balance: updatedUser?.balance
      });
    }

    res.json({
      message: "Deposit approved and funds added to user account",
      deposit,
      userBalance: updatedUser?.balance
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

// Admin: Reject deposit
const rejectDeposit = async (req, res) => {
  try {
    const { depositId } = req.params;
    const { reason } = req.body;

    if (!req.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const deposit = await Deposit.findById(depositId).populate(
      "userId",
      "email"
    );

    if (!deposit) {
      return res.status(404).json({ message: "Deposit not found" });
    }

    deposit.status = "rejected";
    deposit.notes = reason || "Rejected by admin";
    await deposit.save();

    if (deposit.userId?.email) {
      await sendDepositRejectedNotification(
        deposit.userId.email,
        deposit.amount,
        reason
      );
    }

    res.json({
      message: "Deposit rejected",
      deposit
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

module.exports = {
  requestDeposit,
  getUserDeposits,
  getPendingDeposits,
  approveDeposit,
  rejectDeposit
};
