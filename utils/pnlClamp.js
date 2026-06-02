"use strict";

const PNL_MAX_PERCENT = 2;
const PNL_MIN_PERCENT = -25;

/**
 * Clamp PnL percentage to the platform range (+2% / -25%).
 * @param {number} pnlPercent
 * @returns {number}
 */
function clampPnL(pnlPercent) {
  if (!Number.isFinite(pnlPercent)) return 0;
  return Number(Math.min(PNL_MAX_PERCENT, Math.max(PNL_MIN_PERCENT, pnlPercent)).toFixed(4));
}

/**
 * @param {number} entryPrice
 * @param {number} markPrice
 * @param {number} size - signed or absolute quantity
 * @param {'long'|'short'|string} [side='long']
 * @param {number} [leverage=1]
 * @returns {{ rawPnl: number, rawPnlPercent: number, clampedPnl: number, clampedPnlPercent: number }}
 */
function calculatePositionPnL(entryPrice, markPrice, size, side = "long", leverage = 1) {
  const qty = Math.abs(Number(size) || 0);
  const entry = Number(entryPrice);
  const mark = Number(markPrice);
  const lev = Number(leverage) || 1;
  const direction = String(side).toLowerCase() === "short" ? -1 : 1;

  if (!Number.isFinite(entry) || entry <= 0 || !Number.isFinite(mark) || mark <= 0 || qty <= 0) {
    return { rawPnl: 0, rawPnlPercent: 0, clampedPnl: 0, clampedPnlPercent: 0 };
  }

  const rawPnlPercent = (((mark - entry) / entry) * 100) * direction;
  const clampedPnlPercent = clampPnL(rawPnlPercent);
  const rawPnl = (mark - entry) * qty * lev * direction;
  const clampedPnl = Number((entry * qty * lev * (clampedPnlPercent / 100)).toFixed(4));

  return {
    rawPnl: Number(rawPnl.toFixed(4)),
    rawPnlPercent: Number(rawPnlPercent.toFixed(4)),
    clampedPnl,
    clampedPnlPercent: Number(clampedPnlPercent.toFixed(4)),
  };
}

/**
 * Genuine user trades get clamped PnL; demo/paper trades do not.
 * @param {{ isDemo?: boolean, isGenuine?: boolean }} entity
 * @returns {boolean}
 */
function shouldClampPnL(entity) {
  if (!entity) return true;
  if (entity.isDemo === true) return false;
  if (entity.isGenuine === false) return false;
  return true;
}

module.exports = {
  PNL_MAX_PERCENT,
  PNL_MIN_PERCENT,
  clampPnL,
  clampPnLPercent: clampPnL,
  calculatePositionPnL,
  shouldClampPnL,
};
