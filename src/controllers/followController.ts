import type { Request, Response } from "express-serve-static-core";
import prisma from "../lib/prisma";

interface AuthRequest extends Request {
  userId?: string;
}

export const followUser = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { userIdToFollow } = req.body;

    if (!req.userId) {
      return res.status(401).json({
        message: "Unauthorized"
      });
    }

    if (req.userId === userIdToFollow) {
      return res.status(400).json({
        message: "You cannot follow yourself"
      });
    }

    await prisma.follow.create({
      data: {
        followerId: req.userId,
        followingId: userIdToFollow
      }
    });

    res.json({
      message: "User followed successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error
    });
  }
};