"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminMiddleware = void 0;
// Re-export adminMiddleware from the CommonJS implementation to satisfy
// TypeScript imports in route files.
const auth = require("./authMiddleware");
exports.adminMiddleware = auth.adminMiddleware;
