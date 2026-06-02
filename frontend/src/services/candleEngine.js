/**
 * Shared Candle Engine
 * ────────────────────────────────────────────────────────────────────────────
 * Unified candle management for both live market feed and admin simulation.
 * Uses plain refs (not React state) for shared access across components and engines.
 */

// ─── Shared State Refs ─────────────────────────────────────────────────────

export const candlesRef = { current: [] };
export const candlesInitialized = { current: false };
export const adminSimActive = { current: false };
export const priceAlertsRef = { current: {} }; // Map: price -> callback

// ─── Helper Functions ─────────────────────────────────────────────────────

/**
 * Detect the interval in milliseconds from the last two candles.
 * Binance timestamps are in seconds (unix timestamp).
 * Fallback to 60s if not enough data.
 */
function detectIntervalSec(candles) {
  if (candles.length < 2) return 60;
  const last = candles[candles.length - 1].time;
  const prev = candles[candles.length - 2].time;
  // Candle times are stored in seconds.
  return Math.max(1, last - prev);
}

/**
 * Normalize timestamp to candle bucket based on interval in seconds.
 * Accepts both seconds and milliseconds and returns seconds.
 */
function normalizeToBucket(timestamp, intervalSec) {
  let seconds = timestamp;
  if (seconds > 1e12) {
    seconds = Math.floor(seconds / 1000);
  }
  return Math.floor(seconds / intervalSec) * intervalSec;
}

/**
 * Generate random wick based on volatility level.
 * Volatility scaling: low=0.05%, medium=0.15%, high=0.3%
 */
function calculateWick(basePrice, volatility = 'low') {
  const wickPct = volatility === 'high' ? 0.003 : volatility === 'medium' ? 0.0015 : 0.0005;
  const wickFactor = volatility === 'high' ? 0.85 : volatility === 'medium' ? 0.7 : 0.5;
  return basePrice * wickPct * wickFactor;
}

// ─── Main Candle Update Function ─────────────────────────────────────────────

/**
 * Update the latest candle with new price data.
 * Guards:
 * - Return early if candles not initialized
 * - Return early if lastPrice is invalid (≤ 0)
 * - Return early if no candles exist yet
 *
 * Updates:
 * - Same bucket: Update high/low/close only (preserve open), add wick
 * - New bucket: Initialize all OHLC from previous close (never 0)
 * - Cap at 200 candles max (drop oldest if needed)
 *
 * @param {number} lastPrice - Current market price
 * @param {number} timestamp - Current timestamp in milliseconds
 * @param {string} volatility - 'low', 'medium', or 'high' for wick sizing
 * @returns {Object|null} Updated candle object for rendering, or null if no change
 */
export function updateLatestCandle(lastPrice, timestamp, volatility = 'low') {
  // Guard: candles not initialized
  if (!candlesInitialized.current) return null;

  // Guard: invalid price
  if (!lastPrice || lastPrice <= 0) return null;

  const candles = candlesRef.current;
  // Guard: no candles exist yet
  if (!candles.length) return null;

  const intervalSec = detectIntervalSec(candles);
  const bucketTime = normalizeToBucket(timestamp, intervalSec);
  const latest = candles[candles.length - 1];

  const wick = () => calculateWick(lastPrice, volatility);

  let updated;
  let hasChanged = false;

  if (latest.time === bucketTime) {
    // Same candle bucket: update high/low/close only
    const newHigh = Math.max(latest.high, lastPrice) + wick();
    const newLow = Math.min(latest.low, lastPrice) - wick();
    const newClose = lastPrice;

    // Only trigger update if values actually changed
    hasChanged =
      newClose !== latest.close ||
      newHigh !== latest.high ||
      newLow !== latest.low;

    updated = {
      time: latest.time,
      open: latest.open, // Never touch open
      high: newHigh,
      low: newLow,
      close: newClose,
      volume: latest.volume ?? 0
    };

    if (hasChanged) {
      candlesRef.current = [...candles.slice(0, -1), updated];
    }
  } else {
    // New candle bucket: OHLC from previous close
    const prevClose = latest.close ?? lastPrice;
    const newHigh = Math.max(prevClose, lastPrice) + wick();
    const newLow = Math.min(prevClose, lastPrice) - wick();

    updated = {
      time: bucketTime,
      open: prevClose, // Initialize from previous close
      high: newHigh,
      low: newLow,
      close: lastPrice,
      volume: latest.volume ?? 0
    };

    const next = [...candles, updated];
    // Keep last 200 candles only
    candlesRef.current = next.length > 200 ? next.slice(-200) : next;
    hasChanged = true;
  }

  return hasChanged ? updated : null;
}

/**
 * Initialize candles from historical data (typically from Binance REST API).
 * Validates and filters out any malformed candles.
 * Binance timestamps come in seconds (unix timestamp).
 *
 * @param {Array} candles - Array of candle objects {time, open, high, low, close, volume}
 * @returns {void}
 */
export function initializeCandles(candles) {
  if (!Array.isArray(candles)) {
    console.warn('candleEngine: invalid candles array');
    return;
  }

  // Filter: only valid candles
  const valid = candles.filter(c => {
    if (!c) return false;
    
    // Validate price fields
    if (!Number.isFinite(c.open) || c.open <= 0) return false;
    if (!Number.isFinite(c.close) || c.close <= 0) return false;
    if (!Number.isFinite(c.high) || c.high <= 0) return false;
    if (!Number.isFinite(c.low) || c.low <= 0) return false;
    if (!Number.isFinite(c.volume) || c.volume < 0) return false;

    // Validate timestamp (in seconds, unix format)
    if (!Number.isFinite(c.time) || c.time <= 0) {
      console.warn('[candleEngine] Invalid candle time:', c.time);
      return false;
    }

    // Verify timestamp is valid date
    const dateMs = new Date(c.time * 1000).getTime();
    if (isNaN(dateMs)) {
      console.error('[candleEngine] Invalid candle timestamp:', c);
      return false;
    }

    return true;
  });

  candlesRef.current = valid.slice(-200); // Keep last 200
  candlesInitialized.current = true;
}

/**
 * Reset the engine (e.g., when switching pairs or timeframes).
 */
export function resetCandles() {
  candlesRef.current = [];
  candlesInitialized.current = false;
  adminSimActive.current = false;
  priceAlertsRef.current = {};
}

/**
 * Register a price alert callback.
 * Callback will be invoked when a candle close passes the alert price.
 *
 * @param {number} price - Alert price level
 * @param {Function} callback - Invoked with {price, direction, candleTime}
 */
export function registerPriceAlert(price, callback) {
  if (!price || !callback) return;
  priceAlertsRef.current[price] = callback;
}

/**
 * Unregister a price alert.
 */
export function unregisterPriceAlert(price) {
  delete priceAlertsRef.current[price];
}

/**
 * Check and trigger any price alert callbacks.
 * Called internally after candle updates.
 */
export function checkPriceAlerts(candle) {
  if (!candle) return;

  Object.entries(priceAlertsRef.current).forEach(([priceStr, callback]) => {
    const alertPrice = Number(priceStr);
    if (!Number.isFinite(alertPrice)) return;

    // Trigger on close crossing alert price
    const prevCandle = candlesRef.current[candlesRef.current.length - 2];
    if (prevCandle) {
      const prevClose = prevCandle.close;
      const currClose = candle.close;

      if (
        (prevClose < alertPrice && currClose >= alertPrice) ||
        (prevClose > alertPrice && currClose <= alertPrice)
      ) {
        callback({
          price: alertPrice,
          currentPrice: currClose,
          direction: currClose >= alertPrice ? 'above' : 'below',
          candleTime: candle.time
        });
      }
    }
  });
}

/**
 * Get current candle data snapshot.
 */
export function getCandles() {
  return candlesRef.current;
}

/**
 * Get the latest candle.
 */
export function getLatestCandle() {
  const candles = candlesRef.current;
  return candles.length > 0 ? candles[candles.length - 1] : null;
}

/**
 * Check if candles are ready for use.
 */
export function isInitialized() {
  return candlesInitialized.current;
}

/**
 * Check if admin simulation is active.
 */
export function isAdminSimActive() {
  return adminSimActive.current;
}

export default {
  candlesRef,
  candlesInitialized,
  adminSimActive,
  priceAlertsRef,
  updateLatestCandle,
  initializeCandles,
  resetCandles,
  registerPriceAlert,
  unregisterPriceAlert,
  checkPriceAlerts,
  getCandles,
  getLatestCandle,
  isInitialized,
  isAdminSimActive,
};
