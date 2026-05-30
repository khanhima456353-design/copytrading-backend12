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
    const userIdToFollow = String(req.body.userIdToFollow || "").trim();

    if (!req.userId) {
      return res.status(401).json({
        message: "Unauthorized"
      });
    }

    if (!userIdToFollow) {
      return res.status(400).json({
        message: "Target user ID is required"
      });
    }

    if (req.userId === userIdToFollow) {
      return res.status(400).json({
        message: "You cannot follow yourself"
      });
    }

    const targetUser = await prisma.user.findUnique({
      where: { id: userIdToFollow }
    });

    if (!targetUser) {
      return res.status(404).json({
        message: "User to follow not found"
      });
    }

    const existingFollow = await prisma.follow.findFirst({
      where: {
        followerId: req.userId,
        followingId: userIdToFollow
      }
    });

    if (existingFollow) {
      return res.status(409).json({
        message: "Already following this user"
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
    console.error(error);
    res.status(500).json({
      message: "Server error"
    });
  }
};