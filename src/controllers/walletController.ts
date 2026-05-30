import type { Request, Response } from "express-serve-static-core";
import prisma from "../lib/prisma";

interface AuthRequest extends Request {
  userId?: string;
}

export const depositFunds = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { amount } = req.body;
    const depositAmount = Number(amount);

    if (!req.userId) {
      return res.status(401).json({
        message: "Unauthorized"
      });
    }

    if (!Number.isFinite(depositAmount) || depositAmount <= 0) {
      return res.status(400).json({
        message: "Invalid deposit amount"
      });
    }

    const [, updatedUser] = await prisma.$transaction([
      prisma.deposit.create({
        data: {
          userId: req.userId,
          amount: depositAmount
        }
      }),
      prisma.user.update({
        where: { id: req.userId },
        data: {
          balance: {
            increment: depositAmount
          }
        }
      })
    ]);

    res.json({
      message: "Deposit successful",
      balance: updatedUser.balance
    });

  } catch (error: any) {
    console.error(error);
    if (error?.code === "P2025") {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(500).json({
      message: "Server error"
    });
  }
};

export const getBalance = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        message: "Unauthorized"
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.userId }
    });

    res.json({
      balance: user?.balance || 0
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error"
    });
  }
};