export const PNL_MAX_PERCENT = 2;
export const PNL_MIN_PERCENT = -25;

/** Clamp PnL percentage to +2% / -25%. */
export function clampPnL(pnlPercent: number): number {
  if (!Number.isFinite(pnlPercent)) return 0;
  return Number(Math.min(PNL_MAX_PERCENT, Math.max(PNL_MIN_PERCENT, pnlPercent)).toFixed(4));
}

export const clampPnLPercent = clampPnL;

export interface PositionPnLResult {
  rawPnl: number;
  rawPnlPercent: number;
  clampedPnl: number;
  clampedPnlPercent: number;
}

export function calculatePositionPnL(
  entryPrice: number,
  markPrice: number,
  size: number,
  side: string = "long",
  leverage: number = 1
): PositionPnLResult {
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

export function shouldClampPnL(entity?: { isDemo?: boolean; isGenuine?: boolean } | null): boolean {
  if (!entity) return true;
  if (entity.isDemo === true) return false;
  if (entity.isGenuine === false) return false;
  return true;
}
