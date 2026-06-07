import type { NextFunction, Request, Response } from "express-serve-static-core";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

interface AuthRequest extends Request {
  userId?: string;
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: "No token provided"
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId?: string;
      id?: string;
    };

    req.userId = decoded.userId || decoded.id;

    // Verify the user still exists in the database
    const User = mongoose.model("User");
    const user = await User.findById(req.userId).select("_id");
    if (!user) {
      return res.status(401).json({
        message: "User not found - account may have been deleted"
      });
    }

    next();

  } catch (error) {
    return res.status(401).json({
      message: "Invalid token"
    });
  }
};