import { Request, Response } from "express";
import prisma from "../lib/prisma";

interface AuthRequest extends Request {
  userId?: string;
}

export const placeTrade = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { pair, amount } = req.body;

    if (!req.userId) {
      return res.status(401).json({
        message: "Unauthorized"
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.userId }
    });

    if (!user || user.balance < amount) {
      return res.status(400).json({
        message: "Insufficient balance"
      });
    }

    const profit = Math.random() * 20 - 10;

    // Main user trade
    const trade = await prisma.trade.create({
      data: {
        userId: req.userId,
        pair: String(pair),
        amount: Number(amount),
        profit: Number(profit),
        status: "closed"
      }
    });

    // Update main user balance
    await prisma.user.update({
      where: { id: req.userId },
      data: {
        balance: user.balance - amount + profit
      }
    });

    // 🔥 COPY TRADING LOGIC
    const followers = await prisma.follow.findMany({
      where: {
        followingId: req.userId
      }
    });

    for (const f of followers) {
      const followerUser = await prisma.user.findUnique({
        where: { id: f.followerId }
      });

      if (!followerUser || followerUser.balance < amount) continue;

      const followerProfit = Math.random() * 20 - 10;

      await prisma.trade.create({
        data: {
          userId: f.followerId,
          pair: String(pair),
          amount: Number(amount),
          profit: Number(followerProfit),
          status: "closed"
        }
      });

      await prisma.user.update({
        where: { id: f.followerId },
        data: {
          balance: followerUser.balance - amount + followerProfit
        }
      });
    }

    res.json({
      message: "Trade placed",
      trade
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server error",
      error
    });
  }
};

export const getTradeHistory = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        message: "Unauthorized"
      });
    }

    const trades = await prisma.trade.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: "desc" }
    });

    res.json({
      trades
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error
    });
  }
};

export const getTradeStats = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        message: "Unauthorized"
      });
    }

    const trades = await prisma.trade.findMany({
      where: { userId: req.userId }
    });

    const totalTrades = trades.length;

    const totalProfit = trades.reduce(
      (sum, t) => sum + t.profit,
      0
    );

    const wins = trades.filter(t => t.profit > 0).length;

    const winRate =
      totalTrades > 0 ? (wins / totalTrades) * 100 : 0;

    res.json({
      totalTrades,
      totalProfit,
      winRate: winRate.toFixed(2) + "%"
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error
    });
  }
};