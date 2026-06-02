"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = __importDefault(require("../lib/prisma"));
const userIdGenerator_1 = require("../../utils/userIdGenerator");
const register = async (req, res) => {
    try {
        const { email, password } = req.body;
        const rawEmail = typeof email === "string" ? email.trim() : "";
        const rawPassword = typeof password === "string" ? password : "";
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!rawEmail || !rawPassword) {
            return res.status(400).json({ message: "Email and password are required" });
        }
        if (!emailPattern.test(rawEmail)) {
            return res.status(400).json({ message: "Invalid email format" });
        }
        const existingUser = await prisma_1.default.user.findUnique({
            where: { email: rawEmail }
        });
        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const userId = await (0, userIdGenerator_1.generateUniqueUserId)(prisma_1.default);
        const user = await prisma_1.default.user.create({
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server error"
        });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const body = req.body;
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
        const whereClause = isEmail
            ? { email: identifier }
            : { userId: identifier };
        const user = await prisma_1.default.user.findUnique({
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
        const validPassword = await bcrypt_1.default.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({
                message: "Invalid password"
            });
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, "SECRET_KEY", { expiresIn: "7d" });
        res.json({
            message: "Login successful",
            token,
            user: {
                id: user.id,
                userId: user.userId,
                email: user.email
            }
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server error"
        });
    }
};
exports.login = login;
