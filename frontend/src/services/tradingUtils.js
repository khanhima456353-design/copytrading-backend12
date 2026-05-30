/**
 * Trading Utilities and Calculations
 * ────────────────────────────────────────────────────────────────────────────
 * Common utilities for trading operations, PnL calculations, and order handling.
 */

/**
 * Calculate unrealized PnL for an open position.
 *
 * @param {Object} position - Trade position object
 * @param {number} position.entryPrice - Entry price
 * @param {number} position.quantity - Position quantity
 * @param {number} position.side - 'buy' or 'sell'
 * @param {number} currentPrice - Current market price
 * @returns {Object} { pnl, pnlPercent, isProfit }
 */
export function calculateUnrealizedPnL(position, currentPrice) {
  if (!position || !Number.isFinite(currentPrice) || currentPrice <= 0) {
    return { pnl: 0, pnlPercent: 0, isProfit: null };
  }

  const { entryPrice, quantity, side } = position;
  if (!Number.isFinite(entryPrice) || !Number.isFinite(quantity) || quantity === 0) {
    return { pnl: 0, pnlPercent: 0, isProfit: null };
  }

  let pnl;
  if (side === 'buy' || side === 'long') {
    pnl = (currentPrice - entryPrice) * quantity;
  } else if (side === 'sell' || side === 'short') {
    pnl = (entryPrice - currentPrice) * quantity;
  } else {
    return { pnl: 0, pnlPercent: 0, isProfit: null };
  }

  const pnlPercent = ((pnl / (entryPrice * quantity)) * 100);
  const isProfit = pnl >= 0;

  return {
    pnl: Number(pnl.toFixed(2)),
    pnlPercent: Number(pnlPercent.toFixed(2)),
    isProfit
  };
}

/**
 * Format PnL value with color indicator.
 *
 * @param {number} pnl - PnL value
 * @param {boolean} isProfit - Is profitable
 * @returns {Object} { formatted, color }
 */
export function formatPnL(pnl, isProfit) {
  const sign = isProfit ? '+' : '';
  const formatted = `${sign}${pnl.toFixed(2)} USDT`;
  const color = isProfit ? '#10B981' : '#EF4444';
  return { formatted, color };
}

/**
 * Calculate order total with fees and slippage.
 *
 * @param {Object} order - Order configuration
 * @param {number} order.quantity - Order quantity
 * @param {number} order.price - Order price
 * @param {number} order.makerFee - Maker fee %
 * @param {number} order.takerFee - Taker fee %
 * @param {boolean} order.isMarket - Is market order
 * @returns {Object} { subtotal, fees, total, slippage }
 */
export function calculateOrderTotal(order) {
  const {
    quantity,
    price,
    makerFee = 0.001,
    takerFee = 0.002,
    isMarket = false
  } = order;

  if (!quantity || !price) return { subtotal: 0, fees: 0, total: 0, slippage: 0 };

  const subtotal = quantity * price;
  const feeRate = isMarket ? takerFee : makerFee;
  const fees = subtotal * feeRate;
  const total = subtotal + fees;

  // Estimate slippage for market orders (typically 0.05-0.15%)
  const slippage = isMarket ? subtotal * 0.001 : 0;

  return {
    subtotal: Number(subtotal.toFixed(2)),
    fees: Number(fees.toFixed(2)),
    total: Number((total + slippage).toFixed(2)),
    slippage: Number(slippage.toFixed(2))
  };
}

/**
 * Validate an order before submission.
 *
 * @param {Object} order - Order to validate
 * @returns {Object} { isValid, errors }
 */
export function validateOrder(order) {
  const errors = [];

  if (!order.pair) errors.push('Pair is required');
  if (!order.side || !['buy', 'sell', 'long', 'short'].includes(order.side)) {
    errors.push('Invalid side');
  }
  if (!Number.isFinite(order.quantity) || order.quantity <= 0) {
    errors.push('Quantity must be positive');
  }
  if (order.type === 'limit' && (!Number.isFinite(order.price) || order.price <= 0)) {
    errors.push('Price must be positive for limit orders');
  }
  if (order.stopLoss && (!Number.isFinite(order.stopLoss) || order.stopLoss <= 0)) {
    errors.push('Stop loss must be positive');
  }
  if (order.takeProfit && (!Number.isFinite(order.takeProfit) || order.takeProfit <= 0)) {
    errors.push('Take profit must be positive');
  }

  // Check for conflicting stop orders
  if (
    order.side === 'buy' &&
    order.stopLoss &&
    order.stopLoss >= (order.price || order.currentPrice)
  ) {
    errors.push('Stop loss cannot be above entry price for long orders');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Calculate margin and leverage metrics.
 *
 * @param {Object} params
 * @param {number} params.positionSize - Total position size in USDT
 * @param {number} params.leverage - Leverage multiplier
 * @param {number} params.collateral - Available collateral
 * @returns {Object} { requiredMargin, availableMargin, marginRatio, canOpen }
 */
export function calculateMarginMetrics(params) {
  const { positionSize, leverage = 1, collateral = 0 } = params;

  const requiredMargin = positionSize / leverage;
  const availableMargin = collateral - requiredMargin;
  const marginRatio = (requiredMargin / collateral) * 100;

  return {
    requiredMargin: Number(requiredMargin.toFixed(2)),
    availableMargin: Number(availableMargin.toFixed(2)),
    marginRatio: Number(marginRatio.toFixed(2)),
    canOpen: availableMargin >= 0
  };
}

/**
 * Calculate liquidation price.
 *
 * @param {Object} position
 * @param {number} position.entryPrice - Entry price
 * @param {number} position.leverage - Leverage (default 1)
 * @param {number} position.side - 'buy' or 'sell'
 * @param {number} maintenanceMargin - Maintenance margin % (default 5%)
 * @returns {number} Liquidation price
 */
export function calculateLiquidationPrice(position, maintenanceMargin = 0.05) {
  const { entryPrice, leverage = 1, side } = position;

  if (!Number.isFinite(entryPrice) || leverage <= 0) return null;

  const marginPercent = 1 / leverage;
  const maxLoss = marginPercent - maintenanceMargin;

  if (side === 'buy' || side === 'long') {
    return Number((entryPrice * (1 - maxLoss)).toFixed(2));
  } else {
    return Number((entryPrice * (1 + maxLoss)).toFixed(2));
  }
}

/**
 * Estimate price impact for large orders.
 *
 * @param {number} orderSize - Order size in base currency
 * @param {number} bidAskSpread - Current spread in %
 * @param {number} liquidityRatio - Liquidity ratio (default 1.0)
 * @returns {number} Estimated price impact in %
 */
export function estimatePriceImpact(orderSize, bidAskSpread = 0.05, liquidityRatio = 1.0) {
  if (!Number.isFinite(orderSize) || orderSize <= 0) return 0;

  // Simple model: impact = spread + (order_size / liquidity) * factor
  const impactFromSpread = bidAskSpread / 2; // Half spread
  const impactFromSize = (orderSize / (1000 * liquidityRatio)) * 0.01; // ~0.01% per 1000 units

  return Number((impactFromSpread + impactFromSize).toFixed(4));
}

/**
 * Format price for display with appropriate decimals.
 *
 * @param {number} price - Price value
 * @param {string} pair - Trading pair (optional, for context)
 * @returns {string} Formatted price
 */
export function formatPrice(price, pair = '') {
  if (!price || isNaN(price)) return '—';
  const p = Math.abs(price);
  if (p >= 10000) return price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  if (p >= 100) return price.toFixed(2);
  if (p >= 1) return price.toFixed(4);
  return price.toFixed(6);
}

/**
 * Format volume/size value.
 *
 * @param {number} volume - Volume value
 * @returns {string} Formatted volume
 */
export function formatVolume(volume) {
  if (volume >= 1e9) return (volume / 1e9).toFixed(2) + 'B';
  if (volume >= 1e6) return (volume / 1e6).toFixed(2) + 'M';
  if (volume >= 1e3) return (volume / 1e3).toFixed(2) + 'K';
  return volume.toFixed(2);
}

/**
 * Calculate time remaining for a time-based order.
 *
 * @param {number} startTime - Start timestamp (ms)
 * @param {number} duration - Duration in milliseconds
 * @returns {string} Formatted time remaining (e.g., "5d 3h 20m")
 */
export function formatTimeRemaining(startTime, duration) {
  if (!startTime || !duration) return '—';

  const now = Date.now();
  const elapsed = now - startTime;
  const remaining = Math.max(0, duration - elapsed);

  if (remaining === 0) return 'Expired';

  const seconds = Math.floor((remaining / 1000) % 60);
  const minutes = Math.floor((remaining / 1000 / 60) % 60);
  const hours = Math.floor((remaining / 1000 / 3600) % 24);
  const days = Math.floor(remaining / 1000 / 3600 / 24);

  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (seconds > 0 && parts.length < 2) parts.push(`${seconds}s`);

  return parts.join(' ');
}

/**
 * Sort orderbook by price (bids descending, asks ascending).
 *
 * @param {Object} book - Orderbook { bids, asks }
 * @returns {Object} Sorted orderbook
 */
export function sortOrderBook(book) {
  return {
    bids: (book.bids || []).sort((a, b) => b.price - a.price),
    asks: (book.asks || []).sort((a, b) => a.price - b.price)
  };
}

/**
 * Calculate spread between best bid and ask.
 *
 * @param {number} bestBid - Best bid price
 * @param {number} bestAsk - Best ask price
 * @returns {Object} { spread, spreadPercent, midPrice }
 */
export function calculateSpread(bestBid, bestAsk) {
  if (!Number.isFinite(bestBid) || !Number.isFinite(bestAsk) || bestBid <= 0 || bestAsk <= 0) {
    return { spread: 0, spreadPercent: 0, midPrice: 0 };
  }

  const midPrice = (bestBid + bestAsk) / 2;
  const spread = bestAsk - bestBid;
  const spreadPercent = (spread / midPrice) * 100;

  return {
    spread: Number(spread.toFixed(8)),
    spreadPercent: Number(spreadPercent.toFixed(4)),
    midPrice: Number(midPrice.toFixed(8))
  };
}

export default {
  calculateUnrealizedPnL,
  formatPnL,
  calculateOrderTotal,
  validateOrder,
  calculateMarginMetrics,
  calculateLiquidationPrice,
  estimatePriceImpact,
  formatPrice,
  formatVolume,
  formatTimeRemaining,
  sortOrderBook,
  calculateSpread
};
