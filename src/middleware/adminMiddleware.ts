// Re-export adminMiddleware from the CommonJS implementation to satisfy
// TypeScript imports in route files.
const auth = require("./authMiddleware");
export const adminMiddleware = auth.adminMiddleware;
