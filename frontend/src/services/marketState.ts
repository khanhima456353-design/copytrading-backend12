import { getSocket, getAxios } from "../api";


// ─── Types ────────────────────────────────────────────────────────────────

export type Order            = { price: number; amount: number; total?: number };
export type Trade            = { time: number; price: number; amount: number; side: "buy" | "sell"; pair?: string };
export type MarketOrderBook  = { bids: Order[]; asks: Order[] };

export type MarketState = {
  pair:            string;
  lastPrice:       number;
  markPrice:       number;
  bestBid:         number;
  bestAsk:         number;
  spread:          number;
  volume24h:       number;
  high24h:         number;
  low24h:          number;
  change24h:       number;
  changePct:       number;
  lastPriceUpdate: number;
  trades:          Trade[];
  orderbook:       MarketOrderBook;
  updatedAt:       number;
};

type MarketStateSubscriber      = (state: MarketState) => void;
type ConnectionSubscriber       = (status: "live" | "offline") => void;
type ServerMarketUpdate         = {
  userId?: string; pair?: string; positionId?: string;
  currentPrice?: number; balance?: number; unrealizedPnl?: number;
  equity?: number; openTrades?: any[]; orderBook?: MarketOrderBook;
  ticker?: {
    lastPrice?: number; high24h?: number; low24h?: number;
    volume24h?: number; change24h?: number; changePct?: number;
  };
  pnl?: number; holdings?: { asset: string; amount: number; value: number }[];
  timestamp?: number; [key: string]: any;
};
type ServerMarketUpdateSubscriber = (update: ServerMarketUpdate) => void;

// ─── All-tickers types ─────────────────────────────────────────────────────

export type AllTickerData = {
  symbol:    string;
  price:     number;
  high24h:   number;
  low24h:    number;
  volume24h: number;
  quoteVol:  number;
  change24h: number;
  changePct: number;
  timestamp: number;
};

type AllTickersSubscriber = (tickers: AllTickerData[]) => void;

// ─── Constants ────────────────────────────────────────────────────────────

const QUOTE_ASSETS = ["USDT", "USD", "BTC", "ETH", "BNB"];
const MAX_TRADES   = 100;
const DEBOUNCE_MS  = 100;

function binanceSymbolToPair(symbol: string): string | null {
  for (const q of QUOTE_ASSETS) {
    if (symbol.endsWith(q)) return `${symbol.slice(0, -q.length)}/${q}`;
  }
  return null;
}

// ─── Module-level state ───────────────────────────────────────────────────

const marketStateByPair:          Record<string, MarketState>                   = {};
const subscribers:                Record<string, Set<MarketStateSubscriber>>    = {};
const connectionSubscribers       = new Set<ConnectionSubscriber>();
const serverMarketUpdateSubscribers = new Set<ServerMarketUpdateSubscriber>();

// All-tickers state (24hr mini ticker for ALL symbols)
let allTickersData: AllTickerData[] = [];
const allTickersSubscribers = new Set<AllTickersSubscriber>();

// FIX #4 — store timer IDs so we can reset (not skip) on rapid updates
const flushTimers: Record<string, ReturnType<typeof setTimeout>> = {};

// FIX #1/#2 — store a fingerprint of the last-published state per pair
// so we can skip a publish when nothing meaningful changed
const lastPublishedFingerprint: Record<string, string> = {};

// Simulation lock — when a user has an active simulation (drift or snap-back),
// real Binance priceUpdate and trade events are blocked for that pair.
// This prevents wild chart spikes when both sources try to update simultaneously.
const simulationLockByPair: Record<string, boolean> = {};
const simulationLockTimers: Record<string, ReturnType<typeof setTimeout>> = {};

function setSimulationLock(pair: string, locked: boolean): void {
  simulationLockByPair[pair] = locked;
  if (!locked) {
    // Clear any pending lock timer
    if (simulationLockTimers[pair]) {
      clearTimeout(simulationLockTimers[pair]);
      delete simulationLockTimers[pair];
    }
  }
}

function isSimulationLocked(pair: string): boolean {
  return simulationLockByPair[pair] === true;
}

let socketInitialized = false;
let socketConnected   = false;

// ─── Helpers ──────────────────────────────────────────────────────────────

function createEmptyState(pair: string): MarketState {
  return {
    pair,

    lastPrice: NaN, markPrice: NaN, bestBid: NaN, bestAsk: NaN,
    spread: NaN, volume24h: NaN, high24h: NaN, low24h: NaN,
    change24h: NaN, changePct: NaN, lastPriceUpdate: Date.now(),
    trades: [], orderbook: { bids: [], asks: [] }, updatedAt: 0,
  };
}

function safeNumber(v: unknown): number | undefined {
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}
function safePrice(v: unknown): number | undefined {
  const n = safeNumber(v);
  return n !== undefined && n > 0 ? n : undefined;
}
function safeNonNegative(v: unknown): number | undefined {
  const n = safeNumber(v);
  return n !== undefined && n >= 0 ? n : undefined;
}
function safeTimestamp(v: unknown): number | undefined {
  const n = Number(v);
  if (!Number.isFinite(n) || n <= 0) return undefined;
  const t = Math.floor(n);
  return t < 1e12 ? t * 1000 : t;
}

function normalizeOrders(raw: any[], ascending = false): Order[] {
  if (!Array.isArray(raw)) return [];

  return raw
    .map((item) => {
      const price  = safePrice(item.price  ?? item[0]);
      const amount = safeNonNegative(item.amount ?? item[1]);
      return price !== undefined && amount !== undefined ? { price, amount } : undefined;
    })
    .filter((o): o is Order => o !== undefined && o.price > 0 && o.amount > 0)
    .sort((a, b) => ascending ? a.price - b.price : b.price - a.price);
}

function ensureState(pair: string): MarketState {
  if (!marketStateByPair[pair]) marketStateByPair[pair] = createEmptyState(pair);
  return marketStateByPair[pair];
}

function computeDerived(state: MarketState): void {
  const { bids, asks } = state.orderbook;
  state.bestBid  = safePrice(bids[0]?.price) ?? NaN;
  state.bestAsk  = safePrice(asks[0]?.price) ?? NaN;
  state.spread   = (Number.isFinite(state.bestBid) && Number.isFinite(state.bestAsk))
    ? Math.max(0, state.bestAsk - state.bestBid) : NaN;
  state.markPrice = safePrice(state.markPrice) ?? safePrice(state.lastPrice) ?? NaN;
  state.updatedAt = Date.now();
}

/**
 * FIX #1 — Build a cheap string fingerprint of the fields subscribers care about.
 * publish() compares this against the last-published fingerprint and bails out
 * if nothing meaningful changed — no more redundant re-renders.
 */
function fingerprint(state: MarketState): string {
  return [
    state.lastPrice,
    state.markPrice,
    state.volume24h,
    state.high24h,
    state.low24h,
    state.change24h,
    state.changePct,
    state.bestBid,
    state.bestAsk,
    state.orderbook.bids.length,
    state.orderbook.asks.length,
    state.orderbook.bids[0]?.price,
    state.orderbook.asks[0]?.price,
    state.trades[0]?.time,
  ].join('|');
}

// ─── Publish ──────────────────────────────────────────────────────────────

function publish(pair: string): void {
  const state = marketStateByPair[pair];
  if (!state) return;

  // FIX #1 — skip publish if nothing meaningful changed
  const fp = fingerprint(state);
  if (lastPublishedFingerprint[pair] === fp) return;
  lastPublishedFingerprint[pair] = fp;

  const set = subscribers[pair];
  if (!set?.size) return;
  set.forEach((cb) => {
    try { cb(state); } catch (e) {
      console.error('[marketState] subscriber error:', e);
    }
  });
}

/**
 * FIX #4 — Reset the timer on every call (trailing debounce).
 * Previous code used `if (timer) return` which dropped all updates
 * within the window except the first. Now we always clear + restart
 * so the latest state is what gets published after the quiet period.
 */
function schedulePublish(pair: string): void {
  if (flushTimers[pair]) clearTimeout(flushTimers[pair]);
  flushTimers[pair] = setTimeout(() => {
    delete flushTimers[pair];
    publish(pair);
  }, DEBOUNCE_MS);
}

// ─── State update ─────────────────────────────────────────────────────────

type MarketStateUpdate = Partial<Omit<MarketState, "pair" | "updatedAt" | "trades" | "orderbook">> & {
  trades?:    Trade | Trade[];
  orderbook?: MarketOrderBook;
};

function updateMarketState(pair: string, update: MarketStateUpdate): void {
  const current = ensureState(pair);

  // FIX #2 — only create new object when we actually have changes to apply.
  // Reuse existing references for orderbook/trades when untouched so that
  // React reference-equality checks (===) can short-circuit correctly.
  let orderbookChanged = false;
  let tradesChanged    = false;

  let nextOrderbook = current.orderbook;
  if (update.orderbook) {
    const bids = normalizeOrders(update.orderbook.bids || [], false);
    const asks = normalizeOrders(update.orderbook.asks || [], true);
    // Only replace reference if content actually differs
    if (
      bids.length !== current.orderbook.bids.length ||
      asks.length !== current.orderbook.asks.length ||
      bids[0]?.price !== current.orderbook.bids[0]?.price ||
      asks[0]?.price !== current.orderbook.asks[0]?.price
    ) {
      nextOrderbook   = { bids, asks };
      orderbookChanged = true;
    }
  }

  let nextTrades = current.trades;
  if (Array.isArray(update.trades)) {
    const filtered = (update.trades as Trade[])
      .map((t) => {
        const price  = safePrice(t.price);
        const amount = safeNonNegative(t.amount);
        const time   = safeTimestamp(t.time);
        if (price === undefined || amount === undefined || time === undefined) {
          console.warn(`[marketState] rejected invalid trade for ${pair}:`, t);
          return undefined;
        }
        return { ...t, price, amount, time };
      })
      .filter((t): t is Trade => t !== undefined);
    nextTrades    = [...filtered, ...current.trades].slice(0, MAX_TRADES);
    tradesChanged  = true;
  } else if (update.trades) {
    const t      = update.trades as Trade;
    const price  = safePrice(t.price);
    const amount = safeNonNegative(t.amount);
    const time   = safeTimestamp(t.time);
    if (price !== undefined && amount !== undefined && time !== undefined) {
      nextTrades    = [{ ...t, price, amount, time }, ...current.trades].slice(0, MAX_TRADES);
      tradesChanged  = true;
    } else {
      console.warn(`[marketState] rejected invalid trade for ${pair}:`, t);
    }
  }

  // Build next scalar fields, only overwriting defined+valid values
  const next: MarketState = {
    ...current,
    orderbook: nextOrderbook,
    trades:    nextTrades,
  };

  if (update.lastPrice !== undefined) {
    const v = safePrice(update.lastPrice);
    if (v !== undefined) next.lastPrice = v;
    else console.warn(`[marketState] rejected invalid lastPrice for ${pair}:`, update.lastPrice);
  }
  if (update.markPrice !== undefined) {
    const v = safePrice(update.markPrice);
    if (v !== undefined) next.markPrice = v;
    else console.warn(`[marketState] rejected invalid markPrice for ${pair}:`, update.markPrice);
  }
  if (update.volume24h       !== undefined) { const v = safeNonNegative(update.volume24h);  if (v !== undefined) next.volume24h  = v; }
  if (update.high24h         !== undefined) { const v = safeNonNegative(update.high24h);    if (v !== undefined) next.high24h    = v; }
  if (update.low24h          !== undefined) { const v = safeNonNegative(update.low24h);     if (v !== undefined) next.low24h     = v; }
  if (update.change24h       !== undefined) { const v = safeNumber(update.change24h);       if (v !== undefined) next.change24h  = v; }
  if (update.changePct       !== undefined) { const v = safeNumber(update.changePct);       if (v !== undefined) next.changePct  = v; }
  if (update.lastPriceUpdate !== undefined) { const v = safeTimestamp(update.lastPriceUpdate); if (v !== undefined) next.lastPriceUpdate = v; }

  computeDerived(next);
  marketStateByPair[pair] = next;
  schedulePublish(pair);
}

// ─── Connection ───────────────────────────────────────────────────────────

export function isValidPrice(v: unknown): boolean {
  const n = Number(v);
  return Number.isFinite(n) && n > 0;
}


function setConnectionStatus(status: "live" | "offline"): void {
  if ((status === "live") === socketConnected) return;
  socketConnected = status === "live";
  connectionSubscribers.forEach((cb) => cb(status));
}

// ─── REST fetches ─────────────────────────────────────────────────────────

async function fetchOrderBook(pair: string): Promise<void> {
  try {
    const api = await getAxios();
    const res = await api.get(`/api/market/orderbook/${encodeURIComponent(pair)}`);
    const bids = normalizeOrders(res.data?.buy  || [], false);
    const asks = normalizeOrders(res.data?.sell || [], true);
    updateMarketState(pair, { orderbook: { bids, asks } });
  } catch { /* keep existing state */ }
}

async function fetchTickerSummary(pair: string): Promise<void> {
  try {
    const api = await getAxios();
    const res = await api.get(`/api/market/ticker/${encodeURIComponent(pair)}`);
    const t   = res.data;
    if (!t?.lastPrice) return;

    const update: MarketStateUpdate = {
      lastPrice:       safePrice(t.lastPrice),
      markPrice:       safePrice(t.lastPrice),
      high24h:         safeNonNegative(t.high24h) ?? undefined,
      low24h:          safeNonNegative(t.low24h) ?? undefined,
      volume24h:       safeNonNegative(t.volume24h) ?? undefined,
      change24h:       safeNumber(t.change24h) ?? undefined,
      changePct:       safeNumber(t.changePct) ?? undefined,
      lastPriceUpdate: Date.now(),
    };
    updateMarketState(pair, update);
  } catch { /* no-op */ }
}

async function fetchRecentTrades(pair: string): Promise<void> {
  try {
    const api = await getAxios();
    const res = await api.get(`/api/market/trades/${encodeURIComponent(pair)}`);
    const raw = res.data;
    if (!Array.isArray(raw) || raw.length === 0) return;
    updateMarketState(pair, { trades: raw as Trade[] });
  } catch { /* no-op */ }
}

async function requestMarketSnapshot(pair: string): Promise<void> {
  await Promise.all([fetchOrderBook(pair), fetchTickerSummary(pair), fetchRecentTrades(pair)]);
}

// ─── Socket init ──────────────────────────────────────────────────────────

async function initMarketState(): Promise<void> {
  if (socketInitialized) return;
  socketInitialized = true;

  const socket = await getSocket();


  socket.on("connect",    () => setConnectionStatus("live"));
  socket.on("disconnect", () => setConnectionStatus("offline"));

  socket.on("trade", (trade: any) => {
    if (!trade?.pair) return;

    // Block real trade price updates when simulation is active
    if (isSimulationLocked(trade.pair)) return;
    const price  = safePrice(trade.price);
    const amount = safeNonNegative(trade.amount);
    const time   = safeTimestamp(trade.time) ?? safeTimestamp(Date.now());
    if (price === undefined || amount === undefined || time === undefined) {
      console.warn(`[marketState][trade] rejected invalid trade for ${trade.pair}:`, trade);
      return;
    }
    updateMarketState(trade.pair, {
      lastPrice: price, markPrice: price, lastPriceUpdate: time,
      trades: { pair: trade.pair, time, price, amount, side: trade.side === "sell" ? "sell" : "buy" },
    });
  });

  socket.on("priceUpdate", (update: any) => {
    if (!update?.pair) return;

    // Block real Binance price when simulation is active for this pair
    if (isSimulationLocked(update.pair)) return;
    const price     = safePrice(update.price);
    const timestamp = safeTimestamp(update.time) ?? safeTimestamp(Date.now());
    if (price === undefined || timestamp === undefined) {
      console.warn(`[marketState][priceUpdate] rejected for ${update.pair}:`, update);
      return;
    }
    const cur = marketStateByPair[update.pair]; const newHigh = (cur && price > cur.high24h) ? price : undefined; updateMarketState(update.pair, { lastPrice: price, markPrice: price, lastPriceUpdate: timestamp, ...(newHigh ? { high24h: newHigh } : {}) });
  });

  socket.on("orderbook", (data: any) => {
    if (!data?.pair) return;

    updateMarketState(data.pair, {
      orderbook: {
        bids: normalizeOrders(data.buy  || [], false),
        asks: normalizeOrders(data.sell || [], true),
      },
    });
  });

  function activateSimulationLock(pair: string): void {
    setSimulationLock(pair, true);
    if (simulationLockTimers[pair]) clearTimeout(simulationLockTimers[pair]);
    simulationLockTimers[pair] = setTimeout(() => {
      setSimulationLock(pair, false);
      delete simulationLockTimers[pair];
    }, 150000); // 2 min 30 sec
  }

  socket.on("simulatedPriceUpdate", (update: any) => {
    if (!update?.pair) return;
    const price     = safePrice(update.price);
    const timestamp = safeTimestamp(update.time) ?? safeTimestamp(Date.now());
    if (price === undefined || timestamp === undefined) {
      console.warn(`[marketState][simulatedPriceUpdate] rejected for ${update.pair}:`, update);
      return;
    }

    activateSimulationLock(update.pair);
    updateMarketState(update.pair, { lastPrice: price, markPrice: price, lastPriceUpdate: timestamp });
  });

  socket.on("simulationStateSync", (payload: any) => {
    if (!payload || !Array.isArray(payload.states)) return;
    for (const state of payload.states) {
      if (!state?.pair) continue;
      const price     = safePrice(state.price);
      const timestamp = safeTimestamp(state.time) ?? safeTimestamp(Date.now());
      if (price === undefined || timestamp === undefined) continue;

      activateSimulationLock(state.pair);
      updateMarketState(state.pair, { lastPrice: price, markPrice: price, lastPriceUpdate: timestamp });
    }
  });

  socket.on("market_update", (update: any) => {
    if (!update || typeof update !== "object") return;
    const pair      = typeof update.pair === "string" ? update.pair : undefined;
    const price     = safePrice(update.currentPrice);
    const timestamp = safeTimestamp(update.timestamp) ?? safeTimestamp(Date.now());

    if (pair && price !== undefined && timestamp !== undefined) {
      const marketUpdate: MarketStateUpdate = {
        lastPrice: price, markPrice: price, lastPriceUpdate: timestamp,
      };
      if (update.orderBook?.bids && update.orderBook?.asks) {
        marketUpdate.orderbook = { bids: update.orderBook.bids, asks: update.orderBook.asks };
      }
      if (update.ticker && typeof update.ticker === "object") {
        const t = update.ticker;
        if (t.high24h   !== undefined) marketUpdate.high24h   = safeNonNegative(t.high24h)   ?? undefined;
        if (t.low24h    !== undefined) marketUpdate.low24h    = safeNonNegative(t.low24h)    ?? undefined;
        if (t.volume24h !== undefined) marketUpdate.volume24h = safeNonNegative(t.volume24h) ?? undefined;
        if (t.change24h !== undefined) marketUpdate.change24h = safeNumber(t.change24h)      ?? undefined;
        if (t.changePct !== undefined) marketUpdate.changePct = safeNumber(t.changePct)      ?? undefined;
      }
      updateMarketState(pair, marketUpdate);
    }

    serverMarketUpdateSubscribers.forEach((cb) => {
      try { cb(update as ServerMarketUpdate); } catch (e) {
        console.error("[marketState] serverMarketUpdate subscriber error:", e);
      }
    });
  });

  socket.on("positionClosed", (update: any) => {
    if (!update || typeof update !== "object") return;
    serverMarketUpdateSubscribers.forEach((cb) => {
      try { cb({ ...update, event: 'positionClosed' } as ServerMarketUpdate); } catch (e) {
        console.error("[marketState] positionClosed subscriber error:", e);
      }
    });
  });

  socket.on("simulationEnded", (update: any) => {
    if (!update?.pair) return;
    setSimulationLock(update.pair, false);
    if (simulationLockTimers[update.pair]) {
      clearTimeout(simulationLockTimers[update.pair]);
      delete simulationLockTimers[update.pair];
    }
    serverMarketUpdateSubscribers.forEach((cb) => {
      try { cb({ event: 'simulationEnded', ...update } as ServerMarketUpdate); } catch (e) {
        console.error("[marketState] simulationEnded subscriber error:", e);
      }
    });
  });

  // When drift stops, keep lock active during snap-back then release on simulationEnded
  socket.on("driftStopped", (update: any) => {
    serverMarketUpdateSubscribers.forEach((cb) => {
      try { cb({ event: 'driftStopped', ...update } as ServerMarketUpdate); } catch (e) {
        console.error("[marketState] driftStopped subscriber error:", e);
      }
    });
  });

  socket.on("tradeUpdate", (trade: any) => {
    if (!trade || typeof trade !== "object") return;
    serverMarketUpdateSubscribers.forEach((cb) => {
      try { cb({ event: 'tradeUpdate', ...trade } as ServerMarketUpdate); } catch (e) {
        console.error("[marketState] tradeUpdate subscriber error:", e);
      }
    });
  });

  socket.on("balanceUpdate", (update: any) => {
    if (!update || typeof update !== "object") return;
    serverMarketUpdateSubscribers.forEach((cb) => {
      try { cb({ event: 'balanceUpdate', ...update } as ServerMarketUpdate); } catch (e) {
        console.error("[marketState] balanceUpdate subscriber error:", e);
      }
    });
  });

  // All-tickers: 24hr mini ticker for ALL symbols
  socket.on("allTickers", (tickers: any[]) => {
    if (!Array.isArray(tickers) || !tickers.length) return;
    allTickersData = tickers
      .map(t => ({
        symbol:    t.symbol || '',
        price:     Number(t.price) || 0,
        high24h:   Number(t.high24h) || 0,
        low24h:    Number(t.low24h) || 0,
        volume24h: Number(t.volume24h) || 0,
        quoteVol:  Number(t.quoteVol) || 0,
        change24h: Number(t.change24h) || 0,
        changePct: Number(t.changePct) || 0,
        timestamp: Number(t.timestamp) || Date.now(),
      }))
      .filter(t => t.symbol && t.price > 0);
    // Propagate to individual pair market states so switching pairs is instant
    for (const t of allTickersData) {
      const pair = binanceSymbolToPair(t.symbol);
      if (!pair) continue;
      if (isSimulationLocked(pair)) {
        // Keep simulated price — only update 24h stats
        updateMarketState(pair, {
          high24h:   t.high24h,
          low24h:    t.low24h,
          volume24h: t.volume24h,
          change24h: t.change24h,
          changePct: t.changePct,
        });
      } else {
        updateMarketState(pair, {
          lastPrice:       t.price,
          markPrice:       t.price,
          high24h:         t.high24h,
          low24h:          t.low24h,
          volume24h:       t.volume24h,
          change24h:       t.change24h,
          changePct:       t.changePct,
          lastPriceUpdate: t.timestamp,
        });
      }
    }
    allTickersSubscribers.forEach(cb => {
      try { cb(allTickersData); } catch (e) {
        console.error("[marketState] allTickers subscriber error:", e);
      }
    });
  });
}

// ─── Public API ───────────────────────────────────────────────────────────

export function getMarketStateSnapshot(pair: string): MarketState {
  return ensureState(pair);
}


export function updateMarketPrice(pair: string, price: number, time?: number): void {
  if (!pair || !Number.isFinite(price) || price <= 0) return;
  updateMarketState(pair, {
    lastPrice:       price,
    markPrice:       price,
    lastPriceUpdate: typeof time === "number" && Number.isFinite(time) && time > 0 ? time : Date.now(),
  });
}

/**
 * FIX #3 — Separated the initial snapshot call so it no longer causes a
 * double-fire on mount. The subscriber gets the current (possibly empty)
 * state immediately, then ONE debounced publish after the snapshot lands.
 * Previously: subscriber(state) → snapshot → schedulePublish → subscriber(state) again
 * Now:        subscriber(state) → snapshot updates internal state → debounce → ONE publish
 */
export function subscribeMarketState(pair: string, subscriber: MarketStateSubscriber): () => void {
  if (!subscribers[pair]) subscribers[pair] = new Set();
  subscribers[pair].add(subscriber);

  // Deliver current snapshot synchronously so UI has something to show immediately
  subscriber(ensureState(pair));

  // Kick off background refresh — will publish via debounce when it lands,
  // but only if the fingerprint actually changed (FIX #1)
  requestMarketSnapshot(pair).catch(() => { /* ignore */ });
  initMarketState().catch(() => { /* ignore */ });

  return () => {
    subscribers[pair]?.delete(subscriber);
  };
}


export function subscribeConnectionStatus(subscriber: ConnectionSubscriber): () => void {
  connectionSubscribers.add(subscriber);
  subscriber(socketConnected ? "live" : "offline");
  initMarketState().catch(() => { /* ignore */ });
  return () => { connectionSubscribers.delete(subscriber); };
}

export function subscribeServerMarketUpdate(subscriber: ServerMarketUpdateSubscriber): () => void {
  serverMarketUpdateSubscribers.add(subscriber);
  initMarketState().catch(() => { /* ignore */ });
  return () => { serverMarketUpdateSubscribers.delete(subscriber); };
}

// ─── All-tickers subscription ─────────────────────────────────────────────

export function subscribeAllTickers(subscriber: AllTickersSubscriber): () => void {
  allTickersSubscribers.add(subscriber);
  // Deliver current snapshot synchronously
  subscriber(allTickersData);
  initMarketState().catch(() => { /* ignore */ });
  return () => { allTickersSubscribers.delete(subscriber); };
}

export function getAllTickers(): AllTickerData[] {
  return allTickersData;
}
