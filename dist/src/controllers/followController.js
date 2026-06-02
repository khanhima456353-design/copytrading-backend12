"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.followUser = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const followUser = async (req, res) => {
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
        const targetUser = await prisma_1.default.user.findUnique({
            where: { id: userIdToFollow }
        });
        if (!targetUser) {
            return res.status(404).json({
                message: "User to follow not found"
            });
        }
        const existingFollow = await prisma_1.default.follow.findFirst({
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
        await prisma_1.default.follow.create({
            data: {
                followerId: req.userId,
                followingId: userIdToFollow
            }
        });
        res.json({
            message: "User followed successfully"
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server error"
        });
    }
};
exports.followUser = followUser;
