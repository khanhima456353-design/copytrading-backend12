import type { Request, Response } from "express-serve-static-core";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma";
import { generateUniqueUserId } from "../../utils/userIdGenerator";

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = await generateUniqueUserId(prisma);

    const user = await prisma.user.create({
      data: {
        userId,
        email,
        password: hashedPassword
      }
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user.id,
        userId: user.userId,
        email: user.email,
        createdAt: user.createdAt
      }
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const body = req.body as any;
    const { password } = body;
    const rawIdentifier = String(body.identifier || body.email || "").trim();

    if (!rawIdentifier || !password) {
      return res.status(400).json({
        message: "Email and password required"
      });
    }

    // Check if identifier is email or userId
    const isEmail = rawIdentifier.includes('@');
    const identifier = isEmail ? rawIdentifier.toLowerCase() : rawIdentifier.toUpperCase();
    const whereClause: any = isEmail
      ? { email: identifier }
      : { userId: identifier };

    const user = await prisma.user.findUnique({
      where: whereClause
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    if (!user.password) {
      return res.status(400).json({
        message: "Please complete registration before logging in."
      });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(400).json({
        message: "Invalid password"
      });
    }

    const token = jwt.sign(
      { userId: user.id },
      "SECRET_KEY",
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        userId: user.userId,
        email: user.email
      }
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error
    });
  }
};
