import { Request, Response } from "express";
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

    if (!req.userId) {
      return res.status(401).json({
        message: "Unauthorized"
      });
    }

    await prisma.deposit.create({
      data: {
        userId: req.userId,
        amount
      }
    });

    const updatedUser = await prisma.user.update({
      where: { id: req.userId },
      data: {
        balance: {
          increment: amount
        }
      }
    });

    res.json({
      message: "Deposit successful",
      balance: updatedUser.balance
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error
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
    res.status(500).json({
      message: "Server error",
      error
    });
  }
};