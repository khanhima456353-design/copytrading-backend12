// Thin TypeScript wrapper that delegates to the existing CommonJS router
// located at project root `routes/walletRoutes.js` so the TypeScript build
// can import a module from `src/routes`.
const walletRoutes = require("../../routes/walletRoutes");
export default walletRoutes;
