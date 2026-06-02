const SPEED_MAP = {
  slow: 5 * 60 * 1000,
  normal: 3 * 60 * 1000,
  fast: 3000,
  instant: 500,
};

const VOLATILITY_MAP = {
  low: 0.0005,
  medium: 0.002,
  high: 0.008,
};

const TIMEFRAME_INTERVALS = {
  '1s': 1,
  '1m': 60,
  '5m': 300,
  '15m': 900,
  '1h': 3600,
  '4h': 14400,
  '1d': 86400,
  '1w': 604800,
  '1M': 2592000,
};

const DEFAULT_INTERVAL_SEC = 60;
const MAX_HISTORY_CANDLES = 200;
const LIQUIDATION_LOSS_RATIO = 0.8;
const MIN_PNL_PERCENT = -25;
const MAX_PNL_PERCENT = 2;

function clampPnlPercent(percent) {
  if (!Number.isFinite(percent)) return 0;
  return Number(Math.min(Math.max(percent, MIN_PNL_PERCENT), MAX_PNL_PERCENT).toFixed(4));
}

function normalizeToBucket(timestampSec, intervalSec) {
  return Math.floor(timestampSec / intervalSec) * intervalSec;
}

function randomVolumeTick(volatility = 'low') {
  const base = volatility === 'high' ? 4.5 : volatility === 'medium' ? 2.2 : 0.8;
  return Number((Math.random() * base + 0.25).toFixed(4));
}

function buildOrderBook(price, skew = 0) {
  const levels = 10;
  const spread = 0.02;
  const bids = Array.from({ length: levels }, (_, i) => ({
    price: Number((price - spread - i * 0.1 + skew * 0.01).toFixed(2)),
    amount: Number((Math.random() * 3 + 0.001).toFixed(5)),
  }));
  const asks = Array.from({ length: levels }, (_, i) => ({
    price: Number((price + spread + i * 0.1 + skew * 0.01).toFixed(2)),
    amount: Number((Math.random() * 3 + 0.001).toFixed(5)),
  }));
  return { bids, asks };
}

function calculatePositionPnl(position, price) {
  const leverage = Number(position.leverage || 1) || 1;
  const quantity = Number(position.quantity || 0);
  const side = String(position.side || 'long').toLowerCase();
  const direction = side === 'short' ? -1 : 1;

  const raw = direction * (price - position.entryPrice) * quantity * leverage;
  const rawPercent = position.entryPrice > 0
    ? (((price - position.entryPrice) / position.entryPrice) * 100) * direction
    : 0;
  const clampedPercent = clampPnlPercent(rawPercent);
  const clamped = Number((position.entryPrice * quantity * leverage * (clampedPercent / 100)).toFixed(4));

  return {
    ...position,
    currentPrice: price,
    currentPnL: clamped,
    currentPnLPercent: Number(clampedPercent.toFixed(4)),
    rawPnL: Number(raw.toFixed(4)),
    rawPnLPercent: Number(rawPercent.toFixed(4)),
  };
}

class SimulationEngine {
  constructor() {
    this.state = {
      currentPrice: 0,
      currentPair: null,
      driftActive: false,
      driftTarget: 0,
      driftSpeed: 'normal',
      driftVolatility: 'low',
      outcome: 'profit',
      driftProgress: 0,
      driftDirection: 'profit',
      openPositions: [],
      candleHistory: [],
      portfolio: {
        totalEquity: 10000,
        availableUSDT: 10000,
        lockedUSDT: 0,
      },
      pnl: 0,
      pnlPercent: 0,
      orderBook: { bids: [], asks: [] },
      tradeHistory: [],
      takeProfit: null,
      stopLoss: null,
      liquidationNotice: null,
      bidAskSkew: 0,
      candleIntervalSec: TIMEFRAME_INTERVALS['4h'],
    };

    this.listeners = [];
    this.priceListeners = [];
    this.driftTimer = null;
  }

  getState() {
    return { ...this.state };
  }

  getCurrentCandle() {
    const history = this.state.candleHistory;
    return history.length > 0 ? history[history.length - 1] : null;
  }

  subscribe(listener) {
    if (typeof listener !== 'function') return () => {};
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(fn => fn !== listener);
    };
  }

  subscribePriceUpdate(listener) {
    if (typeof listener !== 'function') return () => {};
    this.priceListeners.push(listener);
    return () => {
      this.priceListeners = this.priceListeners.filter(fn => fn !== listener);
    };
  }

  emit() {
    const snapshot = this.getState();
    this.listeners.forEach(fn => {
      try {
        fn(snapshot);
      } catch (err) {
        console.error('[SimulationEngine] listener error:', err);
      }
    });
  }

  emitPriceUpdate(update) {
    this.priceListeners.forEach(fn => {
      try {
        fn(update);
      } catch (err) {
        console.error('[SimulationEngine] price listener error:', err);
      }
    });
  }

  setOpenPositions(positions = []) {
    this.state.openPositions = positions.map((position) => ({
      ...position,
      currentPrice: position.entryPrice,
      currentPnL: 0,
      currentPnLPercent: 0,
      quantity: Number(position.quantity.toFixed ? position.quantity.toFixed(8) : Number(position.quantity).toFixed(8)),
      lockedMargin: Number(position.lockedMargin ?? 0),
      takeProfit: position.takeProfit ?? null,
      stopLoss: position.stopLoss ?? null,
      liquidationPrice: position.liquidationPrice ?? this.calculateDefaultLiquidationPrice(position),
    }));

    const totalLocked = this.state.openPositions.reduce((sum, pos) => sum + Number(pos.lockedMargin || 0), 0);
    this.state.portfolio.lockedUSDT = Number(totalLocked.toFixed(4));
    this.state.portfolio.totalEquity = Number((this.state.portfolio.availableUSDT + this.state.portfolio.lockedUSDT).toFixed(4));
    this.emit();
  }

  setPortfolio({ availableUSDT = 0, lockedUSDT = 0, totalEquity } = {}) {
    this.state.portfolio.availableUSDT = Number(availableUSDT.toFixed ? availableUSDT.toFixed(4) : Number(availableUSDT).toFixed(4));
    this.state.portfolio.lockedUSDT = Number(lockedUSDT.toFixed ? lockedUSDT.toFixed(4) : Number(lockedUSDT).toFixed(4));
    this.state.portfolio.totalEquity = totalEquity != null
      ? Number(totalEquity.toFixed ? totalEquity.toFixed(4) : Number(totalEquity).toFixed(4))
      : Number((this.state.portfolio.availableUSDT + this.state.portfolio.lockedUSDT).toFixed(4));
    this.emit();
  }

  setBidAskSkew(skew) {
    this.state.bidAskSkew = Number(skew);
    if (this.state.currentPrice > 0) {
      this.state.orderBook = buildOrderBook(this.state.currentPrice, this.state.bidAskSkew);
    }
    this.emit();
  }

  setDriftTarget(target) {
    this.state.driftTarget = Number(target);
    this.emit();
  }

  setDriftSpeed(speed) {
    if (!Object.prototype.hasOwnProperty.call(SPEED_MAP, speed)) return;
    this.state.driftSpeed = speed;
    this.emit();
  }

  setDriftVolatility(volatility) {
    if (!Object.prototype.hasOwnProperty.call(VOLATILITY_MAP, volatility)) return;
    this.state.driftVolatility = volatility;
    this.emit();
  }

  setOutcome(outcome) {
    this.state.outcome = outcome === 'loss' ? 'loss' : 'profit';
    this.emit();
  }

  setPair(pair) {
    if (typeof pair !== 'string' || !pair.trim()) return;
    this.state.currentPair = pair.replace('/', '').toUpperCase();
    this.emit();
  }

  setCandleInterval(intervalSec) {
    const interval = Number(intervalSec);
    if (!Number.isFinite(interval) || interval <= 0) return;
    this.state.candleIntervalSec = Math.max(1, Math.floor(interval));
    this.emit();
  }

  setTimeframe(timeframe) {
    if (typeof timeframe !== 'string') return;
    const interval = TIMEFRAME_INTERVALS[timeframe];
    if (interval) {
      this.state.candleIntervalSec = interval;
      this.emit();
    }
  }

  calculateDefaultLiquidationPrice(position) {
    if (position.side === 'short') {
      return Number((position.entryPrice * 1.15).toFixed(2));
    }
    return Number((position.entryPrice * 0.85).toFixed(2));
  }

  resetCandleHistory(initialCandles = []) {
    this.state.candleHistory = Array.isArray(initialCandles)
      ? initialCandles.slice(-MAX_HISTORY_CANDLES)
      : [];

    if (this.state.candleHistory.length > 0) {
      this.state.currentPrice = this.state.candleHistory[this.state.candleHistory.length - 1].close;
      this.state.orderBook = buildOrderBook(this.state.currentPrice, this.state.bidAskSkew);
    }

    this.emit();
  }

  updateOpenPositions(price) {
    const updated = this.state.openPositions.map((position) => calculatePositionPnl(position, price));
    this.state.openPositions = updated;

    const totalPnL = updated.reduce((sum, position) => sum + Number(position.currentPnL || 0), 0);
    const equityBase = this.state.portfolio.availableUSDT + this.state.portfolio.lockedUSDT || 1;

    this.state.pnl = Number(totalPnL.toFixed(4));
    this.state.pnlPercent = Number(((totalPnL / equityBase) * 100).toFixed(2));
    this.state.portfolio.totalEquity = Number((this.state.portfolio.availableUSDT + this.state.portfolio.lockedUSDT + totalPnL).toFixed(4));
  }

  updateOrderBook(price) {
    this.state.orderBook = buildOrderBook(price, this.state.bidAskSkew);
  }

  maybeTriggerStops(price) {
    if (!this.state.openPositions.length) return;

    this.state.openPositions.forEach((position) => {
      if (position.takeProfit != null) {
        if ((position.side === 'long' && price >= position.takeProfit)
          || (position.side === 'short' && price <= position.takeProfit)) {
          this.closePosition(position.id, price, 'take-profit');
        }
      }

      if (position.stopLoss != null) {
        if ((position.side === 'long' && price <= position.stopLoss)
          || (position.side === 'short' && price >= position.stopLoss)) {
          this.closePosition(position.id, price, 'stop-loss');
        }
      }

      if (position.liquidationPrice != null) {
        if ((position.side === 'long' && price <= position.liquidationPrice)
          || (position.side === 'short' && price >= position.liquidationPrice)) {
          this.closePosition(position.id, price, 'liquidation');
          this.state.liquidationNotice = `Position ${position.id} liquidated at ${price.toFixed(2)}`;
        }
      }
    });
  }

  updatePrice(newPrice, timestamp = Date.now()) {
    const price = Number(newPrice);
    if (!Number.isFinite(price) || price <= 0) return;

    const timeSec = Math.floor(timestamp / 1000);
    const intervalSec = Number(this.state.candleIntervalSec) || DEFAULT_INTERVAL_SEC;
    const bucketTime = normalizeToBucket(timeSec, intervalSec);
    const previous = this.getCurrentCandle();
    const volumeTick = randomVolumeTick(this.state.driftVolatility);

    let updatedCandle;
    if (!previous) {
      updatedCandle = {
        time: bucketTime,
        open: price,
        high: price,
        low: price,
        close: price,
        volume: volumeTick,
      };
      this.state.candleHistory = [updatedCandle];
    } else if (previous.time === bucketTime) {
      updatedCandle = {
        ...previous,
        high: Number(Math.max(previous.high, price).toFixed(8)),
        low: Number(Math.min(previous.low, price).toFixed(8)),
        close: Number(price.toFixed(8)),
        volume: Number((previous.volume + volumeTick).toFixed(4)),
      };
      this.state.candleHistory = [
        ...this.state.candleHistory.slice(0, -1),
        updatedCandle,
      ];
    } else {
      const prevClose = previous.close;
      updatedCandle = {
        time: bucketTime,
        open: prevClose,
        high: Number(Math.max(prevClose, price).toFixed(8)),
        low: Number(Math.min(prevClose, price).toFixed(8)),
        close: Number(price.toFixed(8)),
        volume: volumeTick,
      };
      this.state.candleHistory = [
        ...this.state.candleHistory,
        updatedCandle,
      ].slice(-MAX_HISTORY_CANDLES);
    }

    this.state.currentPrice = price;
    this.updateOpenPositions(price);
    this.updateOrderBook(price);
    this.maybeTriggerStops(price);

    this.emitPriceUpdate({
      pair: this.state.currentPair,
      price,
      candle: updatedCandle,
      driftActive: this.state.driftActive,
      driftProgress: this.state.driftProgress,
      openPositions: this.state.openPositions,
      portfolio: this.state.portfolio,
      orderBook: this.state.orderBook,
    });
    this.emit();
  }

  startDrift({
    driftTarget,
    driftSpeed = 'normal',
    driftVolatility = 'low',
    outcome = 'profit',
    onComplete = () => {},
    takeProfit = null,
    stopLoss = null,
  }) {
    this.stopDrift();

    if (!Number.isFinite(driftTarget) || driftTarget <= 0) {
      throw new Error('Invalid drift target price');
    }

    const duration = SPEED_MAP[driftSpeed] ?? SPEED_MAP.normal;
    const noise = VOLATILITY_MAP[driftVolatility] ?? VOLATILITY_MAP.low;
    const steps = 60;
    const stepInterval = duration / steps;
    const startPrice = this.state.currentPrice > 0
      ? this.state.currentPrice
      : (this.getCurrentCandle()?.close ?? driftTarget);

    this.state.driftActive = true;
    this.state.driftTarget = Number(driftTarget);
    this.state.driftSpeed = driftSpeed;
    this.state.driftVolatility = driftVolatility;
    this.state.outcome = outcome === 'loss' ? 'loss' : 'profit';
    this.state.driftDirection = outcome === 'loss' ? 'loss' : 'profit';
    this.state.takeProfit = Number.isFinite(takeProfit) ? takeProfit : null;
    this.state.stopLoss = Number.isFinite(stopLoss) ? stopLoss : null;
    this.state.driftProgress = 0;
    this.state.liquidationNotice = null;
    this.state.currentPrice = Number(startPrice.toFixed(8));
    this.emit();

    let step = 0;
    let lastPrice = startPrice;

    this.driftTimer = setInterval(() => {
      step += 1;
      const progress = step / steps;
      // Realistic random walk toward target
      const remaining = steps - step;
      const distToTarget = this.state.driftTarget - lastPrice;
      const trendBias = remaining > 0 ? distToTarget / remaining * (0.15 + progress * 0.5) : distToTarget;
      const noiseAmp = lastPrice * noise * (1 + Math.random());
      const randomStep = noiseAmp * (Math.random() * 2 - 1);
      const spike = Math.random() < 0.15 ? -trendBias * (Math.random() * 0.5) : 0;
      const raw = lastPrice + trendBias + randomStep + spike;
      const clampDir = this.state.driftTarget > startPrice ? 1 : -1;
      const nextPrice = Number((clampDir > 0 ? Math.min(raw, this.state.driftTarget * 1.002) : Math.max(raw, this.state.driftTarget * 0.998)).toFixed(8));

      this.state.driftProgress = Number(progress.toFixed(4));
      lastPrice = nextPrice;
      this.updatePrice(nextPrice);

      if (step >= steps) {
        this.updatePrice(this.state.driftTarget);
        this.stopDrift();
        onComplete({
          finalPrice: this.state.driftTarget,
          outcomePercent: Math.abs(((this.state.driftTarget - startPrice) / startPrice) * 100).toFixed(2),
          direction: this.state.outcome,
          success: true,
        });
      }
    }, stepInterval);
  }

  stopDrift() {
    if (this.driftTimer) {
      clearInterval(this.driftTimer);
      this.driftTimer = null;
    }

    this.state.driftActive = false;
    this.state.driftProgress = 0;
    this.emit();
  }

  closePosition(positionId, exitPrice, reason = 'closed') {
    const position = this.state.openPositions.find((pos) => pos.id === positionId);
    if (!position) return null;

    const leverage = Number(position.leverage || 1) || 1;
    const quantity = Number(position.quantity || 0);
    const side = String(position.side || 'long').toLowerCase();
    const direction = side === 'short' ? -1 : 1;

    const raw = direction * (exitPrice - position.entryPrice) * quantity * leverage;
    const rawPercent = position.entryPrice > 0
      ? (((exitPrice - position.entryPrice) / position.entryPrice) * 100) * direction
      : 0;
    const clampedPercent = clampPnlPercent(rawPercent);
    const settledPnl = Number((position.entryPrice * quantity * leverage * (clampedPercent / 100)).toFixed(4));
    const lockedMargin = Number(position.lockedMargin || 0);

    this.state.portfolio.availableUSDT = Number((this.state.portfolio.availableUSDT + lockedMargin + settledPnl).toFixed(4));
    this.state.portfolio.lockedUSDT = Number(Math.max(0, this.state.portfolio.lockedUSDT - lockedMargin).toFixed(4));
    this.state.portfolio.totalEquity = Number((this.state.portfolio.availableUSDT + this.state.portfolio.lockedUSDT).toFixed(4));

    const closed = {
      ...position,
      exitPrice: Number(exitPrice.toFixed(8)),
      rawPnL: Number(raw.toFixed(4)),
      rawPnLPercent: Number(rawPercent.toFixed(4)),
      realizedPnL: settledPnl,
      realizedPnLPercent: Number(clampedPercent.toFixed(4)),
      closedAt: new Date().toISOString(),
      closeReason: reason,
    };

    this.state.tradeHistory.push(closed);
    this.state.openPositions = this.state.openPositions.filter((pos) => pos.id !== positionId);
    this.updateOpenPositions(this.state.currentPrice);
    this.emit();
    return closed;
  }

  overrideBalance(amount) {
    this.state.portfolio.availableUSDT = Number(amount.toFixed ? amount.toFixed(4) : Number(amount).toFixed(4));
    this.state.portfolio.totalEquity = Number((this.state.portfolio.availableUSDT + this.state.portfolio.lockedUSDT).toFixed(4));
    this.emit();
  }
}

export const simulationEngine = new SimulationEngine();
export default simulationEngine;
