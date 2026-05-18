import { getSocket, getAxios } from "../api";
import axios from "axios";

export type Order = { price: number; amount: number; total?: number };
export type Trade = { time: number; price: number; amount: number; side: "buy" | "sell"; pair?: string };
export type MarketOrderBook = { bids: Order[]; asks: Order[] };

export type MarketState = {
  pair: string;
  lastPrice: number;
  markPrice: number;
  bestBid: number;
  bestAsk: number;
  spread: number;
  volume24h: number;
  high24h: number;
  low24h: number;
  change24h: number;
  changePct: number;
  lastPriceUpdate: number;
  trades: Trade[];
  orderbook: MarketOrderBook;
  updatedAt: number;
};

type MarketStateSubscriber = (state: MarketState) => void;
type ConnectionSubscriber = (status: "live" | "offline") => void;

const MAX_TRADES = 100;
const DEFAULT_DEBOUNCE_MS = 100;

const marketStateByPair: Record<string, MarketState> = {};
const subscribers: Record<string, Set<MarketStateSubscriber>> = {};
const connectionSubscribers = new Set<ConnectionSubscriber>();
const flushTimers: Record<string, number> = {};
let socketInitialized = false;
let socketConnected = false;

function createEmptyState(pair: string): MarketState {
  return {
    pair,
    lastPrice: NaN,
    markPrice: NaN,
    bestBid: NaN,
    bestAsk: NaN,
    spread: NaN,
    volume24h: NaN,
    high24h: NaN,
    low24h: NaN,
    change24h: NaN,
    changePct: NaN,
    lastPriceUpdate: Date.now(),
    trades: [],
    orderbook: { bids: [], asks: [] },
    updatedAt: 0,
  };
}

function safeNumber(value: unknown): number | undefined {
  const num = Number(value);
  return Number.isFinite(num) ? num : undefined;
}

function safePrice(value: unknown): number | undefined {
  const num = safeNumber(value);
  return num !== undefined && Number.isFinite(num) && num > 0 ? num : undefined;
}

function safeNonNegative(value: unknown): number | undefined {
  const num = safeNumber(value);
  return num !== undefined && num >= 0 ? num : undefined;
}

function safeTimestamp(value: unknown): number | undefined {
  const num = Number(value);
  const timestamp = Math.floor(num);
  return Number.isFinite(timestamp) && timestamp > 0 ? timestamp : undefined;
}

function normalizeOrders(raw: any[], ascending = false): Order[] {
  if (!Array.isArray(raw)) return [];
  const orders = raw
    .map((item) => {
      const price = safePrice(item.price ?? item[0]);
      const amount = safeNonNegative(item.amount ?? item[1]);
      return price !== undefined && amount !== undefined ? { price, amount } : undefined;
    })
    .filter((order): order is Order => order !== undefined && order.price > 0 && order.amount > 0);
  return orders.sort((a, b) => (ascending ? a.price - b.price : b.price - a.price));
}

function ensureState(pair: string): MarketState {
  if (!marketStateByPair[pair]) {
    marketStateByPair[pair] = createEmptyState(pair);
  }
  return marketStateByPair[pair];
}

function computeDerived(state: MarketState) {
  const bids = state.orderbook.bids || [];
  const asks = state.orderbook.asks || [];
  const bestBid = bids.length ? bids[0].price : NaN;
  const bestAsk = asks.length ? asks[0].price : NaN;
  state.bestBid = safePrice(bestBid) ?? NaN;
  state.bestAsk = safePrice(bestAsk) ?? NaN;
  state.spread = (Number.isFinite(state.bestBid) && Number.isFinite(state.bestAsk)) ? Math.max(0, state.bestAsk - state.bestBid) : NaN;
  const validLastPrice = safePrice(state.lastPrice);
  state.markPrice = safePrice(state.markPrice) ?? validLastPrice ?? NaN;
  state.updatedAt = Date.now();
}

function publish(pair: string) {
  const state = marketStateByPair[pair];
  if (!state) return;
  const set = subscribers[pair];
  if (!set || !set.size) return;
  set.forEach((subscriber) => subscriber(state));
}

function schedulePublish(pair: string) {
  if (flushTimers[pair]) return;
  flushTimers[pair] = window.setTimeout(() => {
    delete flushTimers[pair];
    publish(pair);
  }, DEFAULT_DEBOUNCE_MS);
}

type MarketStateUpdate = Partial<Omit<MarketState, "pair" | "updatedAt" | "trades" | "orderbook">> & {
  trades?: Trade | Trade[];
  orderbook?: MarketOrderBook;
};

function updateMarketState(pair: string, update: MarketStateUpdate) {
  const current = ensureState(pair);
  const nextState: MarketState = {
    ...current,
    orderbook: current.orderbook,
    trades: current.trades,
  };

  if (update.orderbook) {
    nextState.orderbook = {
      bids: normalizeOrders(update.orderbook.bids || [], false),
      asks: normalizeOrders(update.orderbook.asks || [], true),
    };
  }

  if (update.lastPrice !== undefined) {
    const safeLastPrice = safePrice(update.lastPrice);
    if (safeLastPrice !== undefined) nextState.lastPrice = safeLastPrice;
    else {
      console.warn(`[marketState] rejected invalid lastPrice for ${pair}:`, update.lastPrice, update);
    }
  }

  if (update.markPrice !== undefined) {
    const safeMarkPrice = safePrice(update.markPrice);
    if (safeMarkPrice !== undefined) nextState.markPrice = safeMarkPrice;
    else {
      console.warn(`[marketState] rejected invalid markPrice for ${pair}:`, update.markPrice, update);
    }
  }

  if (update.volume24h !== undefined) {
    const safeVolume = safeNonNegative(update.volume24h);
    if (safeVolume !== undefined) nextState.volume24h = safeVolume;
  }
  if (update.high24h !== undefined) {
    const safeHigh = safeNonNegative(update.high24h);
    if (safeHigh !== undefined) nextState.high24h = safeHigh;
  }
  if (update.low24h !== undefined) {
    const safeLow = safeNonNegative(update.low24h);
    if (safeLow !== undefined) nextState.low24h = safeLow;
  }
  if (update.change24h !== undefined) {
    const safeChange = safeNumber(update.change24h);
    if (safeChange !== undefined) nextState.change24h = safeChange;
  }
  if (update.changePct !== undefined) {
    const safeChangePct = safeNumber(update.changePct);
    if (safeChangePct !== undefined) nextState.changePct = safeChangePct;
  }
  if (update.lastPriceUpdate !== undefined) {
    const safeUpdate = safeTimestamp(update.lastPriceUpdate);
    if (safeUpdate !== undefined) nextState.lastPriceUpdate = safeUpdate;
  }

  if (Array.isArray(update.trades)) {
    const filteredTrades = update.trades
      .map((trade) => {
        const price = safePrice(trade.price);
        const amount = safeNonNegative(trade.amount);
        const time = safeTimestamp(trade.time);
        if (price === undefined || amount === undefined || time === undefined) {
          console.warn(`[marketState] rejected invalid trade for ${pair}:`, trade);
          return undefined;
        }
        return { ...trade, price, amount, time };
      })
      .filter((trade): trade is Trade => Boolean(trade));
    nextState.trades = [...filteredTrades, ...current.trades].slice(0, MAX_TRADES);
  } else if (update.trades) {
    const trade = update.trades;
    const price = safePrice(trade.price);
    const amount = safeNonNegative(trade.amount);
    const time = safeTimestamp(trade.time);
    if (price !== undefined && amount !== undefined && time !== undefined) {
      nextState.trades = [{ ...trade, price, amount, time }, ...current.trades].slice(0, MAX_TRADES);
    } else {
      console.warn(`[marketState] rejected invalid trade for ${pair}:`, trade);
    }
  }

  computeDerived(nextState);
  marketStateByPair[pair] = nextState;
  schedulePublish(pair);
}

export function isValidPrice(v: unknown) {
  const n = Number(v);
  return Number.isFinite(n) && n > 0;
}

function setConnectionStatus(status: "live" | "offline") {
  if ((status === "live") === socketConnected) return;
  socketConnected = status === "live";
  connectionSubscribers.forEach((subscriber) => subscriber(status));
}

async function fetchOrderBook(pair: string) {
  try {
    const api = await getAxios();
    const res = await api.get(`/api/market/orderbook/${encodeURIComponent(pair)}`);
    const buy = normalizeOrders(res.data?.buy || [], false);
    const sell = normalizeOrders(res.data?.sell || [], true);
    updateMarketState(pair, { orderbook: { bids: buy, asks: sell } });
  } catch (error) {
    // keep existing state if fetching fails
  }
}

async function fetchTickerSummary(pair: string) {
  try {
    const krakenPair = pair.replace("/", "").replace(/USDT$/, "USD");
    const res = await axios.get(`https://api.kraken.com/0/public/Ticker?pair=${krakenPair}`);
    const result = res.data?.result || {};
    const tickerKey = Object.keys(result)[0];
    const ticker = result[tickerKey] || {};
    const last = safePrice(ticker.c?.[0] ?? ticker.a?.[0]);
    const high = safeNonNegative(ticker.h?.[1] ?? ticker.h?.[0]);
    const low = safeNonNegative(ticker.l?.[1] ?? ticker.l?.[0]);
    const volume = safeNonNegative(ticker.v?.[1] ?? ticker.v?.[0]);
    const open = safeNonNegative(ticker.o);
    const change = last !== undefined && open !== undefined ? last - open : undefined;
    const changePct = open ? (change ?? 0) / open * 100 : undefined;
    const lastPriceUpdate = safeTimestamp(Date.now());

    const summaryUpdate: MarketStateUpdate = {};
    if (last !== undefined) {
      summaryUpdate.lastPrice = last;
      summaryUpdate.markPrice = last;
    } else {
      console.warn(`[marketState][ticker] no valid last price from external ticker for ${pair}`, ticker);
    }
    if (high !== undefined) summaryUpdate.high24h = high;
    if (low !== undefined) summaryUpdate.low24h = low;
    if (volume !== undefined) summaryUpdate.volume24h = volume;
    if (change !== undefined) summaryUpdate.change24h = change;
    if (changePct !== undefined) summaryUpdate.changePct = changePct;
    if (lastPriceUpdate !== undefined) summaryUpdate.lastPriceUpdate = lastPriceUpdate;

    updateMarketState(pair, summaryUpdate);
  } catch (error) {
    // no-op
  }
}

async function requestMarketSnapshot(pair: string) {
  await Promise.all([fetchOrderBook(pair), fetchTickerSummary(pair)]);
}

async function initMarketState() {
  if (socketInitialized) return;
  socketInitialized = true;

  const socket = await getSocket();

  socket.on("connect", () => setConnectionStatus("live"));
  socket.on("disconnect", () => setConnectionStatus("offline"));

  socket.on("trade", (trade: any) => {
    if (!trade?.pair) return;
    const price = safePrice(trade.price);
    const amount = safeNonNegative(trade.amount);
    const time = safeTimestamp(trade.time) ?? safeTimestamp(Date.now());
    if (price === undefined || amount === undefined || time === undefined) {
      console.warn(`[marketState][socket trade] rejected invalid trade data for ${trade.pair}:`, trade);
      return;
    }

    updateMarketState(trade.pair, {
      lastPrice: price,
      markPrice: price,
      trades: {
        pair: trade.pair,
        time,
        price,
        amount,
        side: trade.side === "sell" ? "sell" : "buy",
      },
      lastPriceUpdate: time,
    });
  });

  socket.on("priceUpdate", (update: any) => {
    if (!update?.pair) return;
    const price = safePrice(update.price);
    const timestamp = safeTimestamp(update.time) ?? safeTimestamp(Date.now());
    if (price === undefined || timestamp === undefined) {
      console.warn(`[marketState][socket priceUpdate] rejected invalid price update for ${update.pair}:`, update);
      return;
    }

    updateMarketState(update.pair, {
      lastPrice: price,
      markPrice: price,
      lastPriceUpdate: timestamp,
    });
  });

  socket.on("orderbook", (data: any) => {
    if (!data?.pair) return;
    const bids = normalizeOrders(data.buy || [], false);
    const asks = normalizeOrders(data.sell || [], true);
    updateMarketState(data.pair, { orderbook: { bids, asks } });
  });
}

export function getMarketStateSnapshot(pair: string): MarketState {
  return ensureState(pair);
}

export function subscribeMarketState(pair: string, subscriber: MarketStateSubscriber) {
  const state = ensureState(pair);
  if (!subscribers[pair]) subscribers[pair] = new Set();
  subscribers[pair].add(subscriber);
  subscriber(state);
  requestMarketSnapshot(pair).catch(() => {
    /* ignore fetch errors */
  });
  initMarketState().catch(() => {
    /* ignore socket init errors */
  });
  return () => {
    subscribers[pair]?.delete(subscriber);
  };
}

export function subscribeConnectionStatus(subscriber: ConnectionSubscriber) {
  connectionSubscribers.add(subscriber);
  subscriber(socketConnected ? "live" : "offline");
  initMarketState().catch(() => {
    /* ignore */
  });
  return () => {
    connectionSubscribers.delete(subscriber);
  };
}
