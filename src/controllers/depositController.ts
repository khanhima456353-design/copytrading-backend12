import type { Request, Response } from "express-serve-static-core";
import prisma from "../lib/prisma";

interface AuthRequest extends Request {
  userId?: string;
}

// User requests a deposit (creates pending deposit request)
export const requestDeposit = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { amount, paymentMethod = "bank_transfer", notes } = req.body;

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

    const deposit = await prisma.deposit.create({
      data: {
        userId: req.userId,
        amount: Number(amount),
        paymentMethod,
        notes: notes || `User deposit request - Please send ${amount} to khanhima456353@gmail.com`,
        status: "pending"
      }
    });

    res.json({
      message: "Deposit request created. Please send the amount to khanhima456353@gmail.com",
      deposit
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error
    });
  }
};

// Get user's deposit history
export const getUserDeposits = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        message: "Unauthorized"
      });
    }

    const deposits = await prisma.deposit.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: "desc" }
    });

    res.json({
      deposits
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error
    });
  }
};

// Admin: Get all pending deposits
export const getPendingDeposits = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    // TODO: Add admin verification middleware
    const deposits = await prisma.deposit.findMany({
      where: { status: "pending" },
      include: { user: { select: { id: true, email: true } } },
      orderBy: { createdAt: "desc" }
    });

    res.json({
      deposits
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error
    });
  }
};

// Admin: Approve deposit and add funds to user account
export const approveDeposit = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { depositId } = req.params;
    const { transactionRef } = req.body;

    if (!req.userId) {
      return res.status(401).json({
        message: "Unauthorized"
      });
    }

    const deposit = await prisma.deposit.findUnique({
      where: { id: depositId },
      include: { user: true }
    });

    if (!deposit) {
      return res.status(404).json({
        message: "Deposit not found"
      });
    }

    if (deposit.status !== "pending") {
      return res.status(400).json({
        message: "Deposit is not pending"
      });
    }

    // Update deposit status
    const updatedDeposit = await prisma.deposit.update({
      where: { id: depositId },
      data: {
        status: "approved",
        approvedBy: req.userId,
        approvedAt: new Date(),
        transactionRef: transactionRef || undefined
      }
    });

    // Add funds to user's balance
    const updatedUser = await prisma.user.update({
      where: { id: deposit.userId },
      data: {
        balance: {
          increment: deposit.amount
        }
      }
    });

    // Create transaction record
    await prisma.transaction.create({
      data: {
        userId: deposit.userId,
        type: "deposit",
        amount: deposit.amount,
        description: `Deposit approved - ${transactionRef || "Manual verification"}`,
        createdBy: req.userId
      }
    });

    res.json({
      message: "Deposit approved and funds added to user account",
      deposit: updatedDeposit,
      userBalance: updatedUser.balance
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error
    });
  }
};

// Admin: Reject deposit
export const rejectDeposit = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { depositId } = req.params;
    const { reason } = req.body;

    if (!req.userId) {
      return res.status(401).json({
        message: "Unauthorized"
      });
    }

    const deposit = await prisma.deposit.findUnique({
      where: { id: depositId }
    });

    if (!deposit) {
      return res.status(404).json({
        message: "Deposit not found"
      });
    }

    const updatedDeposit = await prisma.deposit.update({
      where: { id: depositId },
      data: {
        status: "rejected",
        notes: reason || "Rejected by admin"
      }
    });

    res.json({
      message: "Deposit rejected",
      deposit: updatedDeposit
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error
    });
  }
};
