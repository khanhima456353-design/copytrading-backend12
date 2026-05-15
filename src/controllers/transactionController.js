const User = require("../../models/User");
const Transaction = require("../../models/Transaction");

// Admin: Add profit to user account
const addProfit = async (req, res) => {
  try {
    const { userId, amount, description } = req.body;
    const adminId = req.userId;

    if (!adminId) {
      return res.status(401).json({
        message: "Unauthorized"
      });
    }

    if (!amount || amount <= 0) {
      return res.status(400).json({
        message: "Invalid amount"
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    user.balance = (user.balance || 0) + Number(amount);
    await user.save();

    const transaction = await Transaction.create({
      userId,
      type: "profit",
      amount: Number(amount),
      description: description || "Profit added by admin",
      createdBy: adminId
    });

    res.json({
      message: "Profit added successfully",
      userBalance: user.balance,
      transaction
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

// Admin: Deduct loss from user account
const deductLoss = async (req, res) => {
  try {
    const { userId, amount, description } = req.body;
    const adminId = req.userId;

    if (!adminId) {
      return res.status(401).json({
        message: "Unauthorized"
      });
    }

    if (!amount || amount <= 0) {
      return res.status(400).json({
        message: "Invalid amount"
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    if ((user.balance || 0) < amount) {
      return res.status(400).json({
        message: "Insufficient balance"
      });
    }

    user.balance = (user.balance || 0) - Number(amount);
    await user.save();

    const transaction = await Transaction.create({
      userId,
      type: "loss",
      amount: Number(amount),
      description: description || "Loss deducted by admin",
      createdBy: adminId
    });

    res.json({
      message: "Loss deducted successfully",
      userBalance: user.balance,
      transaction
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

// Get user's transaction history
const getUserTransactions = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized"
      });
    }

    const transactions = await Transaction.find({ userId })
      .sort({ createdAt: -1 });

    res.json({
      transactions
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

// Admin: Get all transactions
const getAllTransactions = async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        message: "Unauthorized"
      });
    }

    const transactions = await Transaction.find()
      .populate("userId", "email")
      .sort({ createdAt: -1 });

    res.json({
      transactions
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

// Admin: Get transactions for a specific user
const getUserTransactionHistory = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!req.userId) {
      return res.status(401).json({
        message: "Unauthorized"
      });
    }

    const transactions = await Transaction.find({ userId })
      .sort({ createdAt: -1 });

    res.json({
      transactions
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
  addProfit,
  deductLoss,
  getUserTransactions,
  getAllTransactions,
  getUserTransactionHistory
};
