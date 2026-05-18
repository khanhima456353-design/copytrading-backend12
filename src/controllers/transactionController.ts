import type { Request, Response } from "express-serve-static-core";
import prisma from "../lib/prisma";

interface AuthRequest extends Request {
  userId?: string;
}

// Admin: Add profit to user account
export const addProfit = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { userId, amount, description } = req.body;

    if (!req.userId) {
      return res.status(401).json({
        message: "Unauthorized"
      });
    }

    if (!amount || amount <= 0) {
      return res.status(400).json({
        message: "Invalid amount"
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    // Update user balance
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        balance: {
          increment: amount
        }
      }
    });

    // Create transaction record
    const transaction = await prisma.transaction.create({
      data: {
        userId,
        type: "profit",
        amount: Number(amount),
        description: description || "Profit added by admin",
        createdBy: req.userId
      }
    });

    res.json({
      message: "Profit added successfully",
      userBalance: updatedUser.balance,
      transaction
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error
    });
  }
};

// Admin: Deduct loss from user account
export const deductLoss = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { userId, amount, description } = req.body;

    if (!req.userId) {
      return res.status(401).json({
        message: "Unauthorized"
      });
    }

    if (!amount || amount <= 0) {
      return res.status(400).json({
        message: "Invalid amount"
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    if (user.balance < amount) {
      return res.status(400).json({
        message: "Insufficient balance"
      });
    }

    // Update user balance
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        balance: {
          decrement: amount
        }
      }
    });

    // Create transaction record
    const transaction = await prisma.transaction.create({
      data: {
        userId,
        type: "loss",
        amount: Number(amount),
        description: description || "Loss deducted by admin",
        createdBy: req.userId
      }
    });

    res.json({
      message: "Loss deducted successfully",
      userBalance: updatedUser.balance,
      transaction
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error
    });
  }
};

// Get user's transaction history
export const getUserTransactions = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        message: "Unauthorized"
      });
    }

    const transactions = await prisma.transaction.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: "desc" }
    });

    res.json({
      transactions
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error
    });
  }
};

// Admin: Get all transactions
export const getAllTransactions = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        message: "Unauthorized"
      });
    }

    const transactions = await prisma.transaction.findMany({
      include: { user: { select: { id: true, email: true } } },
      orderBy: { createdAt: "desc" }
    });

    res.json({
      transactions
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error
    });
  }
};

// Admin: Get transactions for a specific user
export const getUserTransactionHistory = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { userId } = req.params;

    if (!req.userId) {
      return res.status(401).json({
        message: "Unauthorized"
      });
    }

    const transactions = await prisma.transaction.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" }
    });

    res.json({
      transactions
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error
    });
  }
};
