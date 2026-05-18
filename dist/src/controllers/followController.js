"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.followUser = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const followUser = async (req, res) => {
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
        res.status(500).json({
            message: "Server error",
            error
        });
    }
};
exports.followUser = followUser;
