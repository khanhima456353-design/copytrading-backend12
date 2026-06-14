// Per-asset maintenance margin requirements (as fraction of notional)
// Used to compute liquidation price for each position
const MAINTENANCE_MARGIN = {
  BTC: 0.005,   // 0.5%
  ETH: 0.01,    // 1.0%
  SOL: 0.015,   // 1.5%
  ADA: 0.02,    // 2.0%
  DOT: 0.02,    // 2.0%
  LINK: 0.02,   // 2.0%
  AVAX: 0.015,  // 1.5%
  MATIC: 0.025, // 2.5%
  DOGE: 0.025,  // 2.5%
  UNI: 0.02,    // 2.0%
  ATOM: 0.02,   // 2.0%
  XRP: 0.015,   // 1.5%
  BNB: 0.01,    // 1.0%
};

const DEFAULT_MAINTENANCE_MARGIN = 0.02; // 2% fallback

function getMaintenanceMargin(pair) {
  const base = pair.replace(/\/USDT$|USDT$/, "");
  return MAINTENANCE_MARGIN[base] ?? DEFAULT_MAINTENANCE_MARGIN;
}

function computeLiquidationPrice(entryPrice, side, leverage, maintMargin) {
  if (!entryPrice || !leverage || leverage <= 0) return 0;
  const mm = maintMargin ?? DEFAULT_MAINTENANCE_MARGIN;
  const marginPercent = 1 / leverage;
  const maxLossFrac = marginPercent - mm;
  if (maxLossFrac <= 0) return side === "long" ? 0 : Infinity;
  if (side === "long") {
    return Number((entryPrice * (1 - maxLossFrac)).toFixed(2));
  } else {
    return Number((entryPrice * (1 + maxLossFrac)).toFixed(2));
  }
}

module.exports = { getMaintenanceMargin, computeLiquidationPrice, MAINTENANCE_MARGIN, DEFAULT_MAINTENANCE_MARGIN };
