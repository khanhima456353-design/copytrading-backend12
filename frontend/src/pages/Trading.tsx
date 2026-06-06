import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.jpg";
import "./Trading.css";
import { getAxios } from "../api";
import authService from "../services/authService";
import { MarketState, subscribeConnectionStatus, subscribeMarketState, isValidPrice } from "../services/marketState";

import { initializeCandles, resetCandles, updateLatestCandle, getCandles } from "../services/candleEngine";
import PositionsPanel from "../components/PositionsPanel";
import { calculateUnrealizedPnL } from "../services/tradingUtils";
import { TradingBalanceCard } from "../components/TradingBalanceCard";
import { Wallet, Trash, Magnet, PaintbrushVertical, RulerDimensionLine, Eraser, ChartCandlestick, ChartLine, BarChart3, ChartArea, ChevronLeft, ChevronRight } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Trade = { time: number; price: number; amount: number; side: "buy" | "sell"; pair?: string };
type Candle = { time: number; open: number; high: number; close: number; low: number; volume: number };
type Order = { price: number; amount: number; total?: number };
type AssetHolding = { asset: string; amount: number; value: number };

type AccountSummary = {
  available: number;
  locked: number;
  unrealizedPnl?: number;
  equity?: number;
  totalEquity?: number;
  usedMargin?: number;
  totalPortfolio?: number;
  holdings: AssetHolding[];
};
type UserOrder = {
  id: string; pair: string; type: "market" | "limit" | "stop-loss" | "take-profit" | "oco";
  side: "buy" | "sell"; price: number; amount: number; status: "open" | "filled" | "cancelled";
  stopLoss?: number; takeProfit?: number; createdAt: number;
};

type TradeHistoryItem = { time: number; price: number; quantity: number; side: "buy" | "sell"; pair: string; type: "market" | "limit"; profit?: number; entryPrice?: number; pnl?: number; leverage?: number; };
type DrawingTool = "cursor" | "crosshair" | "trendline" | "hline" | "vline" | "rect" | "fib" | "text" | "brush" | "eraser" | "measure" | "pitchfork" | "magnet";
type DrawingObject = {
  id: string; tool: DrawingTool; points: { x: number; y: number; price?: number; time?: number }[];
  color: string; lineWidth: number; text?: string; complete: boolean;
};

// ─── Constants ────────────────────────────────────────────────────────────────


const timeframeOptions = ["1s", "1m", "3m", "5m", "15m", "30m", "1h", "2h", "4h", "6h", "8h", "12h", "1d", "1w"];
const TF_SECONDS: Record<string, number> = {
  "1s": 1,
  "1m": 60,
  "3m": 180,
  "5m": 300,
  "15m": 900,
  "30m": 1800,
  "1h": 3600,
  "2h": 7200,
  "4h": 14400,
  "6h": 21600,
  "8h": 28800,
  "12h": 43200,
  "1d": 86400,
  "1w": 604800,
};

function normalizeTimeframe(value: string | undefined) {
  if (!value || typeof value !== "string") return "1d";
  return value.toLowerCase().trim();
}

// ─── Trading Constants ────────────────────────────────────────────────────────

const FEE_RATE = 0.001; // 0.1% trading fee
const MIN_ORDER_TOTAL = 5; // Minimum order total in USDT

const COLORS = {
  bg: "#0b0e11", bgPanel: "#161a1e", bgAlt: "#1a1e24", bgHover: "#1f2530",
  border: "#2a2e35", borderLight: "#222730",
  text: "#848e9c", textBright: "#eaecef", textMuted: "#474d57",
  green: "#0ecb81", greenDim: "rgba(14,203,129,0.12)",
  red: "#f6465d", redDim: "rgba(246,70,93,0.12)",
  blue: "#f0b90b", blueDim: "rgba(240,185,11,0.12)",
  amber: "#f0b90b", cyan: "#3bc8e8",
  sma: "#f0b90b", ema: "#0ecb81",
  bbUpper: "#3b82f6", bbMid: "#8b5cf6", bbLow: "#06b6d4",
  vwap: "#ec4899",
  grid: "rgba(42,46,53,0.6)", crosshair: "rgba(132,142,156,0.5)",
};

const DRAWING_TOOLS: { id: DrawingTool; icon: React.ReactNode; label: string; group: string }[] = [
  { id: "cursor",    icon: "⊹",  label: "Cursor",      group: "select" },
  { id: "crosshair", icon: "⊕",  label: "Crosshair",   group: "select" },
  { id: "trendline", icon: "╱",  label: "Trend Line",  group: "lines" },
  { id: "hline",     icon: "─",  label: "Horiz Line",  group: "lines" },
  { id: "vline",     icon: "│",  label: "Vert Line",   group: "lines" },
  { id: "rect",      icon: "▭",  label: "Rectangle",   group: "shapes" },
  { id: "fib",       icon: "∿",  label: "Fibonacci",   group: "shapes" },
  { id: "pitchfork", icon: "⑂",  label: "Pitchfork",   group: "shapes" },
  { id: "text",      icon: "T",  label: "Text",        group: "annotate" },
  { id: "brush",     icon: <PaintbrushVertical size={16} />,  label: "Brush",       group: "annotate" },
  { id: "eraser",    icon: <Eraser size={16} />,  label: "Eraser",      group: "annotate" },
  { id: "measure",   icon: <RulerDimensionLine size={16} />,  label: "Measure",     group: "measure" },
  { id: "magnet",    icon: <Magnet size={16} />,  label: "Magnet",      group: "measure" },
];

// ─── Utilities ────────────────────────────────────────────────────────────────

const DEFAULT_COIN_IMAGES: Record<string, string> = {
  BTC: "https://assets.coingecko.com/coins/images/1/small/bitcoin.png",
  ETH: "https://assets.coingecko.com/coins/images/279/small/ethereum.png",
  BNB: "https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png",
  SOL: "https://assets.coingecko.com/coins/images/4128/small/solana.png",
  XRP: "https://assets.coingecko.com/coins/images/44/small/xrp-symbol-white-128.png",
  ADA: "https://assets.coingecko.com/coins/images/975/small/cardano.png",
  DOGE: "https://assets.coingecko.com/coins/images/5/small/dogecoin.png",
  DOT: "https://assets.coingecko.com/coins/images/12171/small/polkadot.png",
  AVAX: "https://assets.coingecko.com/coins/images/12559/small/Avalanche_Circle_RedWhite_Trans.png",
  LINK: "https://assets.coingecko.com/coins/images/877/small/chainlink-new-logo.png",
  TRX: "https://assets.coingecko.com/coins/images/1094/small/tron-logo.png",
  SHIB: "https://assets.coingecko.com/coins/images/11939/small/shiba.png",
  LTC: "https://assets.coingecko.com/coins/images/2/small/litecoin.png",
  MATIC: "https://assets.coingecko.com/coins/images/4713/small/polygon.png",
  UNI: "https://assets.coingecko.com/coins/images/12504/small/uniswap-logo.png",
  ATOM: "https://assets.coingecko.com/coins/images/1481/small/cosmos_hub.png",
  FIL: "https://assets.coingecko.com/coins/images/12817/small/filecoin.png",
  APT: "https://assets.coingecko.com/coins/images/26455/small/aptos_round.png",
  ARB: "https://assets.coingecko.com/coins/images/16547/small/photo_2023-03-29_21.47.00.jpeg",
  OP: "https://assets.coingecko.com/coins/images/25244/small/Optimism.png",
  NEAR: "https://assets.coingecko.com/coins/images/10365/small/near.jpg",
  AAVE: "https://assets.coingecko.com/coins/images/12645/small/AAVE.png",
  ALGO: "https://assets.coingecko.com/coins/images/7598/small/algorand.png",
  APE: "https://assets.coingecko.com/coins/images/24383/small/apecoin.jpg",
  AXS: "https://assets.coingecko.com/coins/images/25952/small/photo_2023-09-14_22.28.39.jpeg",
  BUSD: "https://assets.coingecko.com/coins/images/9576/small/BUSD.png",
  CRV: "https://assets.coingecko.com/coins/images/12124/small/Curve.png",
  ENJ: "https://assets.coingecko.com/coins/images/1102/small/enjin-coin-logo.png",
  ETC: "https://assets.coingecko.com/coins/images/79/small/ethereum-classic-logo.png",
  FTM: "https://assets.coingecko.com/coins/images/10090/small/Opera_Symbol_Circle_Black_Transparent.png",
  GRT: "https://assets.coingecko.com/coins/images/13269/small/graph-token.png",
  HBAR: "https://assets.coingecko.com/coins/5/360px-Hedera_Hashgraph_logo.png",
  ICP: "https://assets.coingecko.com/coins/images/14490/small/Internet_Computer_logo.png",
  KCS: "https://assets.coingecko.com/coins/images/9545/small/thumbnail-97.png",
  KLAY: "https://assets.coingecko.com/coins/images/9672/small/klaytn_logo_1.png",
  MANA: "https://assets.coingecko.com/coins/images/12813/small/manana_round.png",
  SAND: "https://assets.coingecko.com/coins/images/12141/small/sandbox_logo.jpg",
  THETA: "https://assets.coingecko.com/coins/images/25783/small/theta-token-logo.png",
  TUSD: "https://assets.coingecko.com/coins/images/3011/small/tusd.png",
  USDC: "https://assets.coingecko.com/coins/images/6319/small/usdc.png",
  USDT: "https://assets.coingecko.com/coins/images/325/small/Tether.png",
  VET: "https://assets.coingecko.com/coins/images/1167/small/VeChain-Logo-768x768.png",
  WAVES: "https://assets.coingecko.com/coins/images/12504/small/waves.png",
  XLM: "https://assets.coingecko.com/coins/images/100/small/Stellar_symbol_black_RGB.png",
  XMR: "https://assets.coingecko.com/coins/images/69/small/monero_logo.png",
  XTZ: "https://assets.coingecko.com/coins/images/976/small/tezos-logo.png",
  ZEC: "https://assets.coingecko.com/coins/images/434/small/zcash.png",
  ZIL: "https://assets.coingecko.com/coins/images/2687/small/Zilliqa-logo.png",
  "1INCH": "https://assets.coingecko.com/coins/images/13469/small/1inch-logo.png",
  COMP: "https://assets.coingecko.com/coins/images/10775/small/COMP.png",
  MKR: "https://assets.coingecko.com/coins/images/1364/small/Maker_logo.png",
  SUSHI: "https://assets.coingecko.com/coins/images/12271/small/swap_token.jpg",
  YFI: "https://assets.coingecko.com/coins/images/11849/small/yfi-192x192.png",
  BAL: "https://assets.coingecko.com/coins/images/12951/small/balancer.png",
  SNX: "https://assets.coingecko.com/coins/images/2589/small/SNX.png",
  CHZ: "https://assets.coingecko.com/coins/images/11784/small/chz.png",
  ANKR: "https://assets.coingecko.com/coins/images/10717/small/ANKR.png",
  RUNE: "https://assets.coingecko.com/coins/images/6741/small/rune.png",
  FLOW: "https://assets.coingecko.com/coins/images/13439/small/flow-fav-icon_512x512.png",
  IOTA: "https://assets.coingecko.com/coins/images/692/small/IOTA_White_logo.png",
  EOS: "https://assets.coingecko.com/coins/images/738/small/eos-logo.png",
  NEO: "https://assets.coingecko.com/coins/images/480/small/NEO_512_512.png",
  EGLD: "https://assets.coingecko.com/coins/images/12133/small/elrond.png",
  KAVA: "https://assets.coingecko.com/coins/images/9719/small/kava.png",
  MINA: "https://assets.coingecko.com/coins/images/15628/small/Mina_Logotype_PNG_Transparent.png",
  TFUEL: "https://assets.coingecko.com/coins/images/8003/small/theta_fuel.png",
  OCEAN: "https://assets.coingecko.com/coins/images/5321/small/ocean-protocol-logo.jpg",
  FET: "https://assets.coingecko.com/coins/images/5681/small/Fetch.jpg",
  RSR: "https://assets.coingecko.com/coins/images/5011/small/rsr.png",
  CKB: "https://assets.coingecko.com/coins/images/9546/small/nervos.png",
  IMX: "https://assets.coingecko.com/coins/images/17233/small/ImmutableX_round_2.png",
  BLUR: "https://assets.coingecko.com/coins/images/28454/small/BLUR-Token.png",
  LDO: "https://assets.coingecko.com/coins/images/13573/small/Lido_DAO_logo.png",
  SSV: "https://assets.coingecko.com/coins/images/24053/small/ssv3.jpg",
  MANTA: "https://assets.coingecko.com/coins/images/34402/small/manta.jpg",
  WLD: "https://assets.coingecko.com/coins/images/31370/small/worldcoin-icon_001_i7XJL1Aq_1722325632283.png",
  JUP: "https://assets.coingecko.com/coins/images/34433/small/jup.png",
  TIA: "https://assets.coingecko.com/coins/images/26718/small/ce2018fc35b18dc603752826f446378c.jpg",
  SEI: "https://assets.coingecko.com/coins/images/28205/small/Sei_Logo_200x200.png",
  PEPE: "https://assets.coingecko.com/coins/images/29850/small/pepe-token.jpg",
  WIF: "https://assets.coingecko.com/coins/images/37734/small/wif.png",
  BONK: "https://assets.coingecko.com/coins/images/28830/small/bonk.jpg",
  RENDER: "https://assets.coingecko.com/coins/images/11636/small/rndr.png",
  STX: "https://assets.coingecko.com/coins/images/2062/small/Stacks_Logo_png.png",
  INJ: "https://assets.coingecko.com/coins/images/12882/small/INJ_round.png",
  ONDO: "https://assets.coingecko.com/coins/images/31099/small/Ondo.svg",
  AR: "https://assets.coingecko.com/coins/images/28284/small/arround.png",
};

function CoinIcon({ symbol, size, images }: { symbol: string; size?: number; images?: Record<string, string> }) {
  const s = size || 20;
  const url = images?.[symbol] || DEFAULT_COIN_IMAGES[symbol];
  if (url) {
    return (
      <img
        src={url}
        alt={symbol}
        style={{ width: s, height: s, objectFit: "contain", borderRadius: "50%" }}
        onError={(e) => {
          const el = e.target as HTMLImageElement;
          if (!el.dataset.retried) {
            el.dataset.retried = "1";
            el.src = `/api/coin-icon/${symbol}`;
          } else {
            el.style.display = "none";
            const span = document.createElement("span");
            span.style.cssText = `font-size:${s * 0.55}px;font-weight:700;color:${COLORS.amber}`;
            span.textContent = symbol.slice(0, 3);
            el.parentElement?.appendChild(span);
          }
        }}
      />
    );
  }
  return (
    <img
      src={`/api/coin-icon/${symbol}`}
      alt={symbol}
      style={{ width: s, height: s, objectFit: "contain", borderRadius: "50%" }}
      onError={(e) => {
        (e.target as HTMLImageElement).style.display = "none";
        const span = document.createElement("span");
        span.style.cssText = `font-size:${s * 0.55}px;font-weight:700;color:${COLORS.amber}`;
        span.textContent = symbol.slice(0, 3);
        e.currentTarget.parentElement?.appendChild(span);
      }}
    />
  );
}

function orderBookIcon(mode: 'bid' | 'ask' | 'both') {
  const top = mode === 'bid' ? '#22c55e' : '#ef4444';
  const topFd = mode === 'bid' ? '#22c55e66' : '#ef444466';
  const bot = mode === 'ask' ? '#ef4444' : '#22c55e';
  const botFd = mode === 'ask' ? '#ef444466' : '#22c55e66';

  return (
    <svg viewBox="0 0 24 20" width="20" height="20" style={{ verticalAlign: 'middle' }}>
      <rect x="0" y="0" width="5" height="3" rx="0.5" fill={top} />
      <rect x="7" y="1" width="10" height="1.5" rx="0.5" fill={topFd} />
      <rect x="0" y="5" width="5" height="3" rx="0.5" fill={top} />
      <rect x="7" y="6" width="8" height="1.5" rx="0.5" fill={topFd} />
      <rect x="0" y="11" width="5" height="3" rx="0.5" fill={bot} />
      <rect x="7" y="12" width="10" height="1.5" rx="0.5" fill={botFd} />
      <rect x="0" y="16" width="5" height="3" rx="0.5" fill={bot} />
      <rect x="7" y="17" width="8" height="1.5" rx="0.5" fill={botFd} />
    </svg>
  );
}

const formatTime = (t: number) =>
  new Date(t * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });

function formatPrice(p: number) {
  if (!p || isNaN(p)) return "—";
  const a = Math.abs(p);
  if (a >= 10000) return p.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  if (a >= 100) return p.toFixed(2);
  if (a >= 1) return p.toFixed(4);
  return p.toFixed(6);
}
function formatVol(v: number) {
  if (v >= 1e9) return (v / 1e9).toFixed(2) + "B";
  if (v >= 1e6) return (v / 1e6).toFixed(2) + "M";
  if (v >= 1e3) return (v / 1e3).toFixed(2) + "K";
  return v.toFixed(2);
}
function formatFullAmount(v: number) {
  return v.toFixed(2);
}
function formatChartTime(ts: number, tf: string) {
  const d = new Date(ts * 1000);
  if (tf === "1d" || tf === "1w") return d.toLocaleDateString([], { month: "short", day: "numeric" });

  if (["1h", "2h", "4h", "6h", "8h", "12h"].includes(tf)) {
    return d.toLocaleDateString([], { month: "short", day: "numeric" }) + " " + d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function formatMsTime(ts: number) {
  const d = new Date(ts);
  const ms = d.getMilliseconds().toString().padStart(3, "0");
  return `${d.toLocaleTimeString([], { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" })}.${ms}`;
}

const generateSyntheticPairs = (available: string[]) => {
  if (available.length > 1) return available;
  const bases = ["BTC", "ETH", "SOL", "LTC", "ADA", "XRP", "DOGE", "AVAX", "DOT", "LINK", "MATIC", "BNB", "NEAR", "APT", "ARB"];
  const quotes = ["USDT", "BTC", "ETH"];
  const symbols = new Set<string>(available);
  for (const base of bases) for (const quote of quotes) {
    if (symbols.size >= 120) break;
    if (base !== quote) symbols.add(`${base}/${quote}`);
  }
  return Array.from(symbols).sort();
};

// ─── Fallback Data ────────────────────────────────────────────────────────────

const createFallbackCandles = (count = 300, startPrice = 80721, pair = "BTC/USDT", timeframe = "1m"): Candle[] => {
  const now = Math.floor(Date.now() / 1000);
  const seedBase = `${pair}:${timeframe}:${Math.floor(now / 60)}`;
  const deterministic = (index: number) => {
    let hash = 2166136261;
    const text = `${seedBase}:${index}`;
    for (let i = 0; i < text.length; i++) {
      hash ^= text.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
    return (hash >>> 0) / 0xffffffff;
  };

  const candles: Candle[] = [];
  let price = startPrice;
  for (let i = count - 1; i >= 0; i--) {
    price += (deterministic(i * 4) - 0.5) * 800;
    const open = price;
    const close = price + (deterministic(i * 4 + 1) - 0.5) * 400;
    const high = Math.max(open, close) + deterministic(i * 4 + 2) * 200;
    const low = Math.min(open, close) - deterministic(i * 4 + 3) * 200;
    candles.push({
      time: Math.floor((now - i * 60) / 60) * 60,
      open: +open.toFixed(2),
      high: +high.toFixed(2),
      low: +low.toFixed(2),
      close: +close.toFixed(2),
      volume: +(deterministic(i * 4 + 4) * 10 + 1).toFixed(2),
    });
  }
  return candles;
};

const createFallbackAccountSummary = (): AccountSummary => ({

  available: 0, locked: 0, equity: 0,
  holdings: [{ asset: "BTC", amount: 0, value: 0 }, { asset: "ETH", amount: 0, value: 0 }, { asset: "USDT", amount: 0, value: 0 }],
});
const createFallbackUserOrders = (): UserOrder[] => [
  { id: "o-1", pair: "BTC/USDT", type: "limit", side: "buy", price: 79750, amount: 0.12, status: "open", createdAt: Math.floor(Date.now() / 1000) - 4300 },
  { id: "o-2", pair: "BTC/USDT", type: "stop-loss", side: "sell", price: 81200, amount: 0.05, stopLoss: 80000, takeProfit: 82400, status: "open", createdAt: Math.floor(Date.now() / 1000) - 7800 },

];
const createFallbackTradeHistory = (): TradeHistoryItem[] => [
  { time: Math.floor(Date.now() / 1000) - 480, price: 80080, quantity: 0.09, side: "buy", pair: "BTC/USDT", type: "market" },
  { time: Math.floor(Date.now() / 1000) - 1280, price: 80145, quantity: 0.03, side: "sell", pair: "BTC/USDT", type: "limit" },
];

// ─── Layout Persistence ───────────────────────────────────────────────────────

const LAYOUT_KEY = "trading-layout-v3";
interface LayoutPrefs { symbol: string; timeframe: string; showSMA: boolean; showEMA: boolean; showBollinger: boolean; depthLimit: number }
const saveLayout = (p: LayoutPrefs) => { try { localStorage.setItem(LAYOUT_KEY, JSON.stringify(p)); } catch {} };
const loadLayout = (): Partial<LayoutPrefs> => { try { const s = localStorage.getItem(LAYOUT_KEY); return s ? JSON.parse(s) : {}; } catch { return {}; } };

// ─── Technical Indicators ─────────────────────────────────────────────────────

function calcSMA(candles: Candle[], period: number) {
  return candles.map((c, i) => {
    if (i < period - 1) return null;
    const sum = candles.slice(i - period + 1, i + 1).reduce((s, x) => s + x.close, 0);
    return { time: c.time, value: +(sum / period).toFixed(6) };
  }).filter(Boolean) as { time: number; value: number }[];
}
function calcEMA(candles: Candle[], period: number) {
  const k = 2 / (period + 1); let ema = candles[0]?.close || 0;
  return candles.map((c, i) => {
    ema = i === 0 ? c.close : c.close * k + ema * (1 - k);
    if (i < period - 1) return null;
    return { time: c.time, value: +ema.toFixed(6) };
  }).filter(Boolean) as { time: number; value: number }[];
}
function calcBB(candles: Candle[], period = 20, mult = 2) {
  return candles.map((c, i) => {
    if (i < period - 1) return null;
    const sl = candles.slice(i - period + 1, i + 1);
    const mean = sl.reduce((s, x) => s + x.close, 0) / period;
    const std = Math.sqrt(sl.reduce((s, x) => s + (x.close - mean) ** 2, 0) / period);
    return { time: c.time, upper: +(mean + mult * std).toFixed(6), middle: +mean.toFixed(6), lower: +(mean - mult * std).toFixed(6) };
  }).filter(Boolean) as { time: number; upper: number; middle: number; lower: number }[];
}
function calcRSI(candles: Candle[], period = 14) {
  let avgGain = 0, avgLoss = 0;
  const result: { time: number; value: number }[] = [];
  for (let i = 1; i < candles.length; i++) {
    const delta = candles[i].close - candles[i - 1].close;
    const gain = Math.max(delta, 0), loss = Math.max(-delta, 0);
    if (i <= period) { avgGain += gain / period; avgLoss += loss / period; if (i === period) result.push({ time: candles[i].time, value: +(100 - 100 / (1 + avgGain / (avgLoss || 0.0001))).toFixed(2) }); }
    else { avgGain = (avgGain * (period - 1) + gain) / period; avgLoss = (avgLoss * (period - 1) + loss) / period; result.push({ time: candles[i].time, value: +(100 - 100 / (1 + avgGain / (avgLoss || 0.0001))).toFixed(2) }); }
  }
  return result;
}
function calcMACD(candles: Candle[], fast = 12, slow = 26, signal = 9) {
  const emaFast = calcEMA(candles, fast), emaSlow = calcEMA(candles, slow);
  const fastMap: Record<number, number> = Object.fromEntries(emaFast.map(p => [p.time, p.value]));
  const macdLine = emaSlow.map(p => ({ time: p.time, value: +(fastMap[p.time] - p.value).toFixed(6) })).filter(p => fastMap[p.time] !== undefined);
  const k = 2 / (signal + 1); let sig = macdLine[0]?.value || 0;
  const sigLine = macdLine.map((p, i) => { sig = i === 0 ? p.value : p.value * k + sig * (1 - k); return { time: p.time, value: +sig.toFixed(6) }; });
  const histogram = macdLine.map((p, i) => ({ time: p.time, value: +(p.value - (sigLine[i]?.value || 0)).toFixed(6) }));
  return { macdLine, sigLine, histogram };
}
function calcVWAP(candles: Candle[]) {
  let cumVol = 0, cumTPV = 0;
  return candles.map(c => { const tp = (c.high + c.low + c.close) / 3; cumVol += c.volume; cumTPV += tp * c.volume; return { time: c.time, value: cumVol > 0 ? +(cumTPV / cumVol).toFixed(6) : c.close }; });
}

// ─── Canvas Chart Engine ──────────────────────────────────────────────────────

interface CandleChartProps {
  candles: Candle[];
  deepMarketData: { time: number; value: number }[];
  indicators: { sma: { time: number; value: number }[]; ema: { time: number; value: number }[]; bb: { time: number; upper: number; middle: number; lower: number }[]; vwap: { time: number; value: number }[] };
  chartType: "candlestick" | "line" | "area" | "bar";
  tf: string; pair: string;
  rsiData: { time: number; value: number }[];
  macdData: { macdLine: any[]; sigLine: any[]; histogram: any[] } | null;
  showRSI: boolean; showMACD: boolean; liveStatus: string;
  activeTool: DrawingTool;
  drawings: DrawingObject[];
  onDrawingsChange: (d: DrawingObject[]) => void;
  drawingColor: string; drawingWidth: number;
  lastPrice: number;
  entryPriceLine?: number | null;
}

function CandleChart({ candles, deepMarketData, indicators, chartType, tf, pair, rsiData, macdData, showRSI, showMACD, liveStatus, activeTool, drawings, onDrawingsChange, drawingColor, drawingWidth, lastPrice, entryPriceLine }: CandleChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({ offset: 0, zoom: 1.0, dragging: false, dragStart: 0, dragOffset: 0, mouseX: -1, mouseY: -1 });
  const drawingRef = useRef<{ active: boolean; current: DrawingObject | null; brushPoints: { x: number; y: number }[] }>({ active: false, current: null, brushPoints: [] });
  const rafRef = useRef<number | null>(null);
  const [pageVisible, setPageVisible] = useState<boolean>(typeof document !== "undefined" ? !document.hidden : true);

  const CHART_WEIGHT = showRSI && showMACD ? 0.52 : (showRSI || showMACD) ? 0.65 : 0.76;
  const VOL_WEIGHT = 0.10;
  const SUB_WEIGHT = 1 - CHART_WEIGHT - VOL_WEIGHT;

  const getMainPlotBounds = useCallback((height: number) => {
    const mainH = Math.floor(height * CHART_WEIGHT);
    const mainPlotTop = Math.min(56, Math.max(34, Math.floor(mainH * 0.22)));
    const mainPlotH = Math.max(48, mainH - mainPlotTop - 6);
    return {
      mainH,
      mainPlotTop,
      mainPlotH,
      mainPlotBottom: mainPlotTop + mainPlotH,
    };
  }, [CHART_WEIGHT]);

  const getPriceRange = useCallback((visible: Candle[]) => {
    let pMin = Infinity, pMax = -Infinity;
    visible.forEach(c => { if (c.low < pMin) pMin = c.low; if (c.high > pMax) pMax = c.high; });
    if (indicators.bb?.length) {
      const vbb = indicators.bb.filter(b => b.time >= visible[0]?.time && b.time <= visible[visible.length - 1]?.time);
      vbb.forEach(b => { if (b.upper > pMax) pMax = b.upper; if (b.lower < pMin) pMin = b.lower; });
    }
    const pad = (pMax - pMin) * 0.06;
    return { pMin: pMin - pad, pMax: pMax + pad };
  }, [indicators.bb]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !candles.length) return;
    const ctx = canvas.getContext("2d")!;
    const dpr = window.devicePixelRatio || 1;
    const W = canvas.width / dpr, H = canvas.height / dpr;

    const { mainH, mainPlotTop, mainPlotH, mainPlotBottom } = getMainPlotBounds(H);
    const volH  = Math.floor(H * VOL_WEIGHT);
    const rsiH  = showRSI && !showMACD ? Math.floor(H * SUB_WEIGHT) : showRSI ? Math.floor(H * SUB_WEIGHT * 0.5) : 0;
    const macdH = showMACD && !showRSI ? Math.floor(H * SUB_WEIGHT) : showMACD ? Math.floor(H * SUB_WEIGHT * 0.5) : 0;
    const PRICE_AXIS_W = 88, TIME_AXIS_H = 28;
    const plotW = W - PRICE_AXIS_W;

    ctx.save(); ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = COLORS.bg; ctx.fillRect(0, 0, W, H);

    const st = stateRef.current;
    const visibleCount = Math.max(20, Math.floor(plotW / (8 * st.zoom)));
    const totalCandles = candles.length;
    st.offset = Math.max(0, Math.min(st.offset, Math.max(0, totalCandles - visibleCount)));
    const startIdx = Math.max(0, totalCandles - visibleCount - st.offset);
    const endIdx   = Math.max(0, totalCandles - st.offset);
    const visible  = candles.slice(startIdx, endIdx);
    if (!visible.length) { ctx.restore(); return; }

    const candleW = plotW / visible.length;
    const bodyW = Math.max(1, candleW * 0.6);
    const { pMin, pMax } = getPriceRange(visible);

    const toY = (p: number, top: number, h: number) => top + h - ((p - pMin) / (pMax - pMin || 1)) * h;
    const toX = (i: number) => i * candleW + candleW / 2;

    // Grid lines
    const gridCount = 6;
    ctx.strokeStyle = COLORS.grid; ctx.lineWidth = 0.5;
    for (let g = 0; g <= gridCount; g++) { const y = mainPlotTop + Math.floor(mainPlotH * g / gridCount) + 0.5; ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(plotW, y); ctx.stroke(); }
    const timeStep = Math.max(1, Math.floor(visible.length / 8));
    for (let g = 0; g < visible.length; g += timeStep) { const x = Math.floor(toX(g)) + 0.5; ctx.beginPath(); ctx.moveTo(x, mainPlotTop); ctx.lineTo(x, mainH + volH); ctx.stroke(); }

    // Separator lines
    ctx.strokeStyle = COLORS.border; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(0, mainH + volH); ctx.lineTo(W, mainH + volH); ctx.stroke();

    // Price axis
    ctx.fillStyle = COLORS.text; ctx.font = `10px 'JetBrains Mono', monospace`; ctx.textAlign = "right";
    for (let g = 0; g <= gridCount; g++) {
      const p = pMin + (pMax - pMin) * (1 - g / gridCount);
      const y = mainPlotTop + Math.floor(mainPlotH * g / gridCount);
      ctx.fillText(formatPrice(p), W - 4, y + 4);
    }

    ctx.save();
    ctx.beginPath();
    ctx.rect(0, mainPlotTop, plotW, mainPlotH);
    ctx.clip();

    // BB
    if (indicators.bb?.length) {
      const vbb = indicators.bb.filter(b => b.time >= visible[0].time && b.time <= visible[visible.length - 1].time);
      ctx.beginPath();
      vbb.forEach((b, i) => { const ci = visible.findIndex(c => c.time === b.time); if (ci < 0) return; i === 0 ? ctx.moveTo(toX(ci), toY(b.upper, mainPlotTop, mainPlotH)) : ctx.lineTo(toX(ci), toY(b.upper, mainPlotTop, mainPlotH)); });
      [...vbb].reverse().forEach(b => { const ci = visible.findIndex(c => c.time === b.time); if (ci < 0) return; ctx.lineTo(toX(ci), toY(b.lower, mainPlotTop, mainPlotH)); });
      ctx.fillStyle = "rgba(59,130,246,0.04)"; ctx.fill();
      const drawBBLine = (key: "upper" | "middle" | "lower", color: string, dash: number[] = []) => {
        ctx.beginPath(); ctx.strokeStyle = color; ctx.lineWidth = 1; if (dash.length) ctx.setLineDash(dash);
        vbb.forEach((b, i) => { const ci = visible.findIndex(c => c.time === b.time); if (ci < 0) return; const x = toX(ci), y = toY(b[key], mainPlotTop, mainPlotH); i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); });
        ctx.stroke(); ctx.setLineDash([]);
      };
      drawBBLine("upper", COLORS.bbUpper, [3, 3]); drawBBLine("middle", COLORS.bbMid); drawBBLine("lower", COLORS.bbLow, [3, 3]);
    }

    // SMA / EMA / VWAP
    const drawLine = (data: { time: number; value: number }[], color: string, dash: number[] = [], lw = 1.5) => {
      const vis = data.filter(p => p.time >= visible[0].time && p.time <= visible[visible.length - 1].time);
      ctx.beginPath(); ctx.strokeStyle = color; ctx.lineWidth = lw; if (dash.length) ctx.setLineDash(dash);
      vis.forEach((p, i) => { const ci = visible.findIndex(c => c.time === p.time); if (ci < 0) return; i === 0 ? ctx.moveTo(toX(ci), toY(p.value, mainPlotTop, mainPlotH)) : ctx.lineTo(toX(ci), toY(p.value, mainPlotTop, mainPlotH)); });
      ctx.stroke(); ctx.setLineDash([]);
    };
    if (indicators.sma?.length) drawLine(indicators.sma, COLORS.sma);
    if (indicators.ema?.length) drawLine(indicators.ema, COLORS.ema);
    if (indicators.vwap?.length) drawLine(indicators.vwap, COLORS.vwap, [4, 4]);

    // DeepMarket data
    if (deepMarketData?.length) {
      const visDeepMarket = deepMarketData.filter(p => p.time >= visible[0].time && p.time <= visible[visible.length - 1].time);
      ctx.beginPath(); ctx.strokeStyle = COLORS.blue; ctx.lineWidth = 1.5; ctx.setLineDash([2, 2]);
      visDeepMarket.forEach((p, i) => {
        const ci = visible.findIndex(c => c.time === p.time);
        if (ci < 0) return;
        const x = toX(ci), y = toY(p.value, mainPlotTop, mainPlotH);
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      });
      ctx.stroke(); ctx.setLineDash([]);
    }

    // Main chart series
    if (chartType === "line" || chartType === "area") {
      if (chartType === "area") {
        ctx.beginPath();
        visible.forEach((c, i) => { const x = toX(i), y = toY(c.close, mainPlotTop, mainPlotH); i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); });
        ctx.lineTo(toX(visible.length - 1), mainPlotBottom); ctx.lineTo(toX(0), mainPlotBottom); ctx.closePath();
        const grad = ctx.createLinearGradient(0, mainPlotTop, 0, mainPlotBottom);
        grad.addColorStop(0, "rgba(14,203,129,0.18)"); grad.addColorStop(1, "rgba(14,203,129,0.01)");
        ctx.fillStyle = grad; ctx.fill();
      }
      ctx.beginPath(); ctx.strokeStyle = COLORS.green; ctx.lineWidth = 2;
      visible.forEach((c, i) => { const x = toX(i), y = toY(c.close, mainPlotTop, mainPlotH); i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); });
      ctx.stroke();
    } else {
      visible.forEach((c, i) => {
        const isGreen = c.close >= c.open;
        const col = isGreen ? COLORS.green : COLORS.red;
        const x = toX(i), openY = toY(c.open, mainPlotTop, mainPlotH), closeY = toY(c.close, mainPlotTop, mainPlotH);
        const highY = toY(c.high, mainPlotTop, mainPlotH), lowY = toY(c.low, mainPlotTop, mainPlotH);
        if (chartType === "bar") {
          ctx.strokeStyle = col; ctx.lineWidth = Math.max(1, bodyW * 0.5);
          ctx.beginPath(); ctx.moveTo(x, highY); ctx.lineTo(x, lowY); ctx.stroke();
          ctx.lineWidth = Math.max(1, bodyW * 0.4);
          ctx.beginPath(); ctx.moveTo(x - bodyW * 0.5, openY); ctx.lineTo(x, openY); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(x, closeY); ctx.lineTo(x + bodyW * 0.5, closeY); ctx.stroke();
        } else {
          const bTop = Math.min(openY, closeY), bH = Math.max(1, Math.abs(openY - closeY)), hw = bodyW / 2;
          ctx.strokeStyle = col; ctx.lineWidth = Math.max(1, Math.min(1.5, candleW * 0.08));
          ctx.beginPath(); ctx.moveTo(x, highY); ctx.lineTo(x, bTop); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(x, bTop + bH); ctx.lineTo(x, lowY); ctx.stroke();
          ctx.fillStyle = col; ctx.strokeStyle = col; ctx.lineWidth = 1;
          candleW > 3 ? ctx.fillRect(x - hw, bTop, bodyW, bH) : ctx.fillRect(x - 0.5, bTop, 1, bH);
        }
      });
    }

    ctx.restore();

    // Volume
    const volTop = mainH, volPlotH = volH - TIME_AXIS_H;
    let vMax = Math.max(...visible.map(c => c.volume), 1);
    visible.forEach((c, i) => {
      const isGreen = c.close >= c.open;
      const barH = Math.max(1, (c.volume / vMax) * volPlotH);
      const x = toX(i), hw = Math.max(0.5, bodyW / 2);
      ctx.fillStyle = isGreen ? "rgba(14,203,129,0.25)" : "rgba(246,70,93,0.25)";
      ctx.fillRect(x - hw, volTop + volPlotH - barH, bodyW, barH);
    });
    ctx.fillStyle = COLORS.textMuted; ctx.font = "10px monospace"; ctx.textAlign = "right";
    ctx.fillText("Vol: " + formatVol(vMax), W - 4, volTop + 12);

    // Time axis
    ctx.fillStyle = COLORS.text; ctx.font = "10px monospace"; ctx.textAlign = "center";
    for (let i = 0; i < visible.length; i += timeStep) {
      const x = toX(i); if (x > plotW - 20) continue;
      ctx.fillText(formatChartTime(visible[i].time, tf), x, mainH + volH - 6);
    }

    // RSI
    if (showRSI && rsiData?.length) {
      const rsiTop = mainH + volH, rsiPlotH = rsiH - TIME_AXIS_H;
      ctx.fillStyle = "rgba(22,26,30,0.7)"; ctx.fillRect(0, rsiTop, W, rsiH);
      ctx.strokeStyle = COLORS.border; ctx.lineWidth = 0.5; ctx.beginPath(); ctx.moveTo(0, rsiTop); ctx.lineTo(W, rsiTop); ctx.stroke();
      ctx.fillStyle = COLORS.textMuted; ctx.font = "10px monospace"; ctx.textAlign = "left"; ctx.fillText("RSI(14)", 6, rsiTop + 14);
      const visRSI = rsiData.filter(p => p.time >= visible[0].time && p.time <= visible[visible.length - 1].time);
      const rsiToY = (v: number) => rsiTop + rsiPlotH - ((v - 0) / 100) * rsiPlotH;
      [70, 50, 30].forEach(level => {
        ctx.strokeStyle = level === 50 ? COLORS.border : (level === 70 ? "rgba(246,70,93,0.3)" : "rgba(14,203,129,0.3)");
        ctx.lineWidth = 0.5; const y = rsiToY(level);
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(plotW, y); ctx.stroke();
        ctx.fillStyle = COLORS.textMuted; ctx.font = "9px monospace"; ctx.textAlign = "right"; ctx.fillText(String(level), W - 4, y + 3);
      });
      ctx.beginPath(); ctx.strokeStyle = COLORS.amber; ctx.lineWidth = 1.5;
      visRSI.forEach((p, i) => { const ci = visible.findIndex(c => c.time === p.time); if (ci < 0) return; const x = toX(ci), y = rsiToY(p.value); i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); });
      ctx.stroke();
      if (visRSI.length) { const last = visRSI[visRSI.length - 1]; ctx.fillStyle = last.value > 70 ? COLORS.red : last.value < 30 ? COLORS.green : COLORS.amber; ctx.font = "bold 10px monospace"; ctx.textAlign = "left"; ctx.fillText(last.value.toFixed(1), 50, rsiTop + 14); }
    }

    // MACD
    if (showMACD && macdData) {
      const macdTop = mainH + volH + (showRSI ? rsiH : 0), macdPlotH = macdH - TIME_AXIS_H;
      ctx.fillStyle = "rgba(22,26,30,0.7)"; ctx.fillRect(0, macdTop, W, macdH);
      ctx.strokeStyle = COLORS.border; ctx.lineWidth = 0.5; ctx.beginPath(); ctx.moveTo(0, macdTop); ctx.lineTo(W, macdTop); ctx.stroke();
      ctx.fillStyle = COLORS.textMuted; ctx.font = "10px monospace"; ctx.textAlign = "left"; ctx.fillText("MACD(12,26,9)", 6, macdTop + 14);
      const visHist = (macdData.histogram || []).filter((p: any) => p.time >= visible[0].time && p.time <= visible[visible.length - 1].time);
      const visML = (macdData.macdLine || []).filter((p: any) => p.time >= visible[0].time && p.time <= visible[visible.length - 1].time);
      const visSL = (macdData.sigLine || []).filter((p: any) => p.time >= visible[0].time && p.time <= visible[visible.length - 1].time);
      let mMin = Infinity, mMax = -Infinity;
      visHist.forEach((p: any) => { if (p.value < mMin) mMin = p.value; if (p.value > mMax) mMax = p.value; });
      const mAbs = Math.max(Math.abs(mMin), Math.abs(mMax)) || 1;
      const mToY = (v: number) => macdTop + macdPlotH / 2 - (v / mAbs) * (macdPlotH / 2);
      const zeroY = macdTop + macdPlotH / 2;
      ctx.strokeStyle = COLORS.border; ctx.lineWidth = 0.5; ctx.beginPath(); ctx.moveTo(0, zeroY); ctx.lineTo(plotW, zeroY); ctx.stroke();
      visHist.forEach((p: any) => { const ci = visible.findIndex(c => c.time === p.time); if (ci < 0) return; const x = toX(ci), hw = Math.max(0.5, bodyW / 2); const barTop = Math.min(mToY(p.value), zeroY), barH = Math.abs(mToY(p.value) - zeroY); ctx.fillStyle = p.value >= 0 ? "rgba(14,203,129,0.5)" : "rgba(246,70,93,0.5)"; ctx.fillRect(x - hw, barTop, bodyW, Math.max(1, barH)); });
      const drawMLine = (data: any[], color: string) => { ctx.beginPath(); ctx.strokeStyle = color; ctx.lineWidth = 1.5; data.forEach((p: any, i: number) => { const ci = visible.findIndex(c => c.time === p.time); if (ci < 0) return; i === 0 ? ctx.moveTo(toX(ci), mToY(p.value)) : ctx.lineTo(toX(ci), mToY(p.value)); }); ctx.stroke(); };
      drawMLine(visML, COLORS.blue); drawMLine(visSL, COLORS.red);
    }

    // Drawings
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, mainPlotTop, plotW, mainPlotH);
    ctx.clip();
    drawings.forEach(d => {
      if (!d.complete && d.points.length < 1) return;
      ctx.strokeStyle = d.color; ctx.lineWidth = d.lineWidth; ctx.setLineDash([]);
      if (d.tool === "trendline" && d.points.length >= 2) {
        ctx.beginPath(); ctx.moveTo(d.points[0].x, d.points[0].y); ctx.lineTo(d.points[1].x, d.points[1].y); ctx.stroke();
      } else if (d.tool === "hline" && d.points.length >= 1) {
        ctx.beginPath(); ctx.moveTo(0, d.points[0].y); ctx.lineTo(plotW, d.points[0].y); ctx.stroke();
        ctx.fillStyle = d.color; ctx.font = "10px monospace"; ctx.textAlign = "left";
        const canvasPrice = d.points[0].price ?? NaN;
        ctx.fillText(isValidPrice(canvasPrice) ? formatPrice(canvasPrice) : "Market price unavailable", 4, d.points[0].y - 3);
      } else if (d.tool === "vline" && d.points.length >= 1) {
        ctx.beginPath(); ctx.moveTo(d.points[0].x, mainPlotTop); ctx.lineTo(d.points[0].x, mainPlotBottom); ctx.stroke();
      } else if (d.tool === "rect" && d.points.length >= 2) {
        const x1 = d.points[0].x, y1 = d.points[0].y, x2 = d.points[1].x, y2 = d.points[1].y;
        ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);
        ctx.fillStyle = d.color.replace(")", ",0.06)").replace("rgb", "rgba"); ctx.fillRect(x1, y1, x2 - x1, y2 - y1);
      } else if (d.tool === "fib" && d.points.length >= 2) {
        const levels = [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1];
        const y1 = d.points[0].y, y2 = d.points[1].y;
        levels.forEach(l => { const y = y1 + (y2 - y1) * l; ctx.strokeStyle = d.color; ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(plotW, y); ctx.stroke(); ctx.setLineDash([]); ctx.fillStyle = d.color; ctx.font = "9px monospace"; ctx.textAlign = "left"; ctx.fillText(`${(l * 100).toFixed(1)}%`, 4, y - 2); });
      } else if (d.tool === "brush" && d.points.length > 1) {
        ctx.beginPath(); ctx.moveTo(d.points[0].x, d.points[0].y); d.points.slice(1).forEach(p => ctx.lineTo(p.x, p.y)); ctx.stroke();
      } else if (d.tool === "text" && d.points.length >= 1 && d.text) {
        ctx.fillStyle = d.color; ctx.font = "13px monospace"; ctx.textAlign = "left"; ctx.fillText(d.text, d.points[0].x, d.points[0].y);
      }
    });
    ctx.restore();

    // Crosshair
    const mx = st.mouseX, my = st.mouseY;
    if (mx >= 0 && mx <= plotW && my >= mainPlotTop && my <= mainPlotBottom) {
      ctx.strokeStyle = COLORS.crosshair; ctx.lineWidth = 0.5; ctx.setLineDash([4, 4]);
      ctx.beginPath(); ctx.moveTo(mx, mainPlotTop); ctx.lineTo(mx, mainPlotBottom); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, my); ctx.lineTo(plotW, my); ctx.stroke();
      ctx.setLineDash([]);
      const ci = Math.floor(mx / candleW);
      if (ci >= 0 && ci < visible.length) {
        const c = visible[ci];
        const isGreen = c.close >= c.open;
        const chg = ((c.close - c.open) / c.open * 100).toFixed(2);
        // Header stats bar (like Binance)
        ctx.fillStyle = "rgba(22,26,30,0.95)"; ctx.fillRect(0, 0, plotW, 28);
        const stats = [`O: ${formatPrice(c.open)}`, `H: ${formatPrice(c.high)}`, `L: ${formatPrice(c.low)}`, `C: ${formatPrice(c.close)}`, `V: ${formatVol(c.volume)}`, `${Number(chg) >= 0 ? "+" : ""}${chg}%`];
        ctx.font = "11px monospace"; ctx.textAlign = "left";
        stats.forEach((s, i) => {
          ctx.fillStyle = i === 5 ? (Number(chg) >= 0 ? COLORS.green : COLORS.red) : (i === 1 ? COLORS.green : i === 2 ? COLORS.red : COLORS.textBright);
          ctx.fillText(s, 8 + i * 130, 18);
        });
        // Price tag on right axis
        const priceY = Math.max(mainPlotTop + 6, Math.min(mainPlotBottom - 4, my));
        const priceAtY = pMin + (pMax - pMin) * (1 - (priceY - mainPlotTop) / mainPlotH);
        ctx.fillStyle = "#2a2e35"; ctx.fillRect(plotW, priceY - 9, PRICE_AXIS_W, 18);
        ctx.strokeStyle = COLORS.text; ctx.lineWidth = 0.5; ctx.strokeRect(plotW, priceY - 9, PRICE_AXIS_W, 18);
        ctx.fillStyle = COLORS.textBright; ctx.font = "bold 10px monospace"; ctx.textAlign = "center";
        ctx.fillText(formatPrice(priceAtY), plotW + PRICE_AXIS_W / 2, priceY + 4);
      }
    }

    // Entry price line (active trade only)
    if (Number.isFinite(entryPriceLine) && (entryPriceLine as number) > 0) {
      const entryY = Math.max(mainPlotTop + 2, Math.min(mainPlotBottom - 2, toY(entryPriceLine as number, mainPlotTop, mainPlotH)));
      ctx.strokeStyle = COLORS.amber;
      ctx.lineWidth = 1;
      ctx.setLineDash([6, 4]);
      ctx.beginPath(); ctx.moveTo(0, entryY); ctx.lineTo(plotW, entryY); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = COLORS.amber;
      ctx.font = "10px monospace";
      ctx.textAlign = "left";
      ctx.fillText(`Entry ${formatPrice(entryPriceLine as number)}`, 8, entryY - 4);
    }

    // Last price line (Binance style)
    const lastC = visible[visible.length - 1];
    if (lastC) {
      const priceForLast = Number.isFinite(lastPrice) && lastPrice > 0 ? lastPrice : lastC.close;
      const referencePrice = visible.length > 1 ? visible[visible.length - 2].close : lastC.open;
      const lastY = Math.max(mainPlotTop + 2, Math.min(mainPlotBottom - 2, toY(priceForLast, mainPlotTop, mainPlotH)));
      const isGreen = priceForLast >= referencePrice;
      ctx.strokeStyle = isGreen ? COLORS.green : COLORS.red;
      ctx.lineWidth = 0.75; ctx.setLineDash([3, 5]);
      ctx.beginPath(); ctx.moveTo(0, lastY); ctx.lineTo(plotW, lastY); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = isGreen ? COLORS.green : COLORS.red;
      ctx.fillRect(plotW, lastY - 10, PRICE_AXIS_W, 20);
      ctx.fillStyle = "#000"; ctx.font = "bold 11px monospace"; ctx.textAlign = "center";
      ctx.fillText(formatPrice(priceForLast), plotW + PRICE_AXIS_W / 2, lastY + 4);
    }

    // MA info overlay (top-left like Binance)
    const maInfoY = Math.max(6, Math.min(my >= 0 && my <= 28 ? 30 : 8, mainPlotTop - 18));
    let maX = 8;
    const maInfo: { label: string; value: string; color: string }[] = [];
    if (indicators.sma?.length) { const last = indicators.sma[indicators.sma.length - 1]; maInfo.push({ label: "MA(7)", value: formatPrice(last?.value || 0), color: COLORS.sma }); }
    if (indicators.ema?.length) { const last = indicators.ema[indicators.ema.length - 1]; maInfo.push({ label: "MA(99)", value: formatPrice(last?.value || 0), color: COLORS.ema }); }
    ctx.font = "11px monospace";
    maInfo.forEach(m => { ctx.fillStyle = m.color; ctx.textAlign = "left"; ctx.fillText(`${m.label}: ${m.value}`, maX, maInfoY + 15); maX += ctx.measureText(`${m.label}: ${m.value}`).width + 16; });

    ctx.restore();
  }, [candles, indicators, chartType, tf, rsiData, macdData, showRSI, showMACD, liveStatus, lastPrice, entryPriceLine, CHART_WEIGHT, VOL_WEIGHT, SUB_WEIGHT, getMainPlotBounds, getPriceRange, drawings, deepMarketData]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      setPageVisible(!document.hidden);
    };
    if (typeof document !== "undefined") {
      handleVisibilityChange();
      document.addEventListener("visibilitychange", handleVisibilityChange);
    }
    return () => {
      if (typeof document !== "undefined") {
        document.removeEventListener("visibilitychange", handleVisibilityChange);
      }
    };
  }, []);

  useEffect(() => {
    let alive = true;
    let fallbackTimer: number | null = null;

    const renderLoop = () => {
      if (!alive) return;
      draw();
      rafRef.current = window.requestAnimationFrame(renderLoop);
    };

    const startFallback = () => {
      if (!alive || fallbackTimer !== null) return;
      fallbackTimer = window.setInterval(() => draw(), 500);
    };

    if (pageVisible) {
      renderLoop();
    } else {
      startFallback();
    }

    return () => {
      alive = false;
      if (rafRef.current !== null) window.cancelAnimationFrame(rafRef.current);
      if (fallbackTimer !== null) window.clearInterval(fallbackTimer);
    };
  }, [draw, pageVisible]);

  useEffect(() => {
    const resize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const parent = canvas.parentElement;
      if (!parent) return;
      const w = parent.clientWidth;
      const h = parent.clientHeight;
      if (w <= 0 || h <= 0) return;
      const dpr = window.devicePixelRatio || 1;
      const newWidth = w * dpr;
      const newHeight = h * dpr;
      if (canvas.width === newWidth && canvas.height === newHeight && canvas.style.width === `${w}px` && canvas.style.height === `${h}px`) {
        return;
      }
      canvas.width = newWidth;
      canvas.height = newHeight;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
    };
    resize();
    const ro = new ResizeObserver(resize);
    if (canvasRef.current?.parentElement) ro.observe(canvasRef.current.parentElement);
    return () => ro.disconnect();
  }, []);

  // Mouse events (pan, zoom, drawing)
  useEffect(() => {

    const canvas = canvasRef.current;
    if (!canvas) return;
    const st = stateRef.current;
    const dr = drawingRef.current;
    const dpr = window.devicePixelRatio || 1;
    const getPos = (e: MouseEvent) => { const r = canvas.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };
    const getTouchPos = (touch: Touch) => {
      const r = canvas.getBoundingClientRect();
      return { x: touch.clientX - r.left, y: touch.clientY - r.top };
    };
    const getTouchDistance = (touches: TouchList) => {
      const a = getTouchPos(touches[0]);
      const b = getTouchPos(touches[1]);
      return Math.hypot(a.x - b.x, a.y - b.y);
    };
    const getTouchMidpoint = (touches: TouchList) => {
      const a = getTouchPos(touches[0]);
      const b = getTouchPos(touches[1]);
      return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
    };
    const getCanvasInfo = () => {
      const W = canvas.width / dpr;
      const H = canvas.height / dpr;
      const plotW = W - 88;
      return { plotW, ...getMainPlotBounds(H) };
    };
    const getVisibleCount = (zoom = st.zoom) => {
      const { plotW } = getCanvasInfo();
      return Math.max(20, Math.floor(Math.max(1, plotW) / (8 * zoom)));
    };
    const clampOffset = (offset: number, zoom = st.zoom) => {
      const maxOffset = Math.max(0, candles.length - getVisibleCount(zoom));
      return Math.max(0, Math.min(offset, maxOffset));
    };
    const getCandleWidth = (zoom = st.zoom) => {
      const { plotW } = getCanvasInfo();
      return Math.max(1, plotW) / getVisibleCount(zoom);
    };
    const getPriceAtY = (y: number) => {
      const { mainPlotTop, mainPlotH, mainPlotBottom } = getCanvasInfo();
      const visible = candles.slice(Math.max(0, candles.length - Math.max(20, Math.floor(getCanvasInfo().plotW / (8 * st.zoom))) - st.offset), Math.max(0, candles.length - st.offset));
      if (!visible.length) return 0;
      const { pMin, pMax } = getPriceRange(visible);
      const boundedY = Math.max(mainPlotTop, Math.min(mainPlotBottom, y));
      return pMin + (pMax - pMin) * (1 - (boundedY - mainPlotTop) / mainPlotH);
    };

    const onMove = (e: MouseEvent) => {
      const { x, y } = getPos(e); st.mouseX = x; st.mouseY = y;
      if (activeTool === "cursor" && st.dragging) {
        const delta = x - st.dragStart;
        const cw = (canvas.clientWidth - 88) / Math.max(20, Math.floor((canvas.clientWidth - 88) / (8 * st.zoom)));
        st.offset = Math.max(0, st.dragOffset - Math.round(delta / cw));
      } else if (activeTool === "brush" && dr.active && dr.current) {
        dr.current.points.push({ x, y });
      } else if (activeTool === "trendline" && dr.active && dr.current && dr.current.points.length === 1) {
        const clone = { ...dr.current, points: [dr.current.points[0], { x, y }] };
        dr.current = clone;
        onDrawingsChange([...drawings.filter(d => d.id !== clone.id), clone]);
      } else if (activeTool === "rect" && dr.active && dr.current && dr.current.points.length >= 1) {
        const clone = { ...dr.current, points: [dr.current.points[0], { x, y }] };
        dr.current = clone;
        onDrawingsChange([...drawings.filter(d => d.id !== clone.id), clone]);
      }
    };
    const onDown = (e: MouseEvent) => {
      const { x, y } = getPos(e);
      if (activeTool === "cursor") {
        st.dragging = true; st.dragStart = x; st.dragOffset = st.offset; canvas.style.cursor = "grabbing";
      } else if (activeTool === "hline") {
        const price = getPriceAtY(y);
        const nd: DrawingObject = { id: Date.now().toString(), tool: "hline", points: [{ x, y, price }], color: drawingColor, lineWidth: drawingWidth, complete: true };
        onDrawingsChange([...drawings, nd]);
      } else if (activeTool === "vline") {
        const nd: DrawingObject = { id: Date.now().toString(), tool: "vline", points: [{ x, y }], color: drawingColor, lineWidth: drawingWidth, complete: true };
        onDrawingsChange([...drawings, nd]);
      } else if (activeTool === "trendline" || activeTool === "fib") {
        if (!dr.active) {
          const nd: DrawingObject = { id: Date.now().toString(), tool: activeTool, points: [{ x, y }], color: drawingColor, lineWidth: drawingWidth, complete: false };
          dr.current = nd; dr.active = true;
          onDrawingsChange([...drawings, nd]);
        } else if (dr.current) {
          const completed = { ...dr.current, points: [dr.current.points[0], { x, y }], complete: true };
          onDrawingsChange([...drawings.filter(d => d.id !== completed.id), completed]);
          dr.active = false; dr.current = null;
        }
      } else if (activeTool === "rect") {
        if (!dr.active) {
          const nd: DrawingObject = { id: Date.now().toString(), tool: "rect", points: [{ x, y }], color: drawingColor, lineWidth: drawingWidth, complete: false };
          dr.current = nd; dr.active = true;
          onDrawingsChange([...drawings, nd]);
        }
      } else if (activeTool === "brush") {
        const nd: DrawingObject = { id: Date.now().toString(), tool: "brush", points: [{ x, y }], color: drawingColor, lineWidth: drawingWidth, complete: false };
        dr.current = nd; dr.active = true;
        onDrawingsChange([...drawings, nd]);
      } else if (activeTool === "text") {
        const text = window.prompt("Enter text:");
        if (text) {
          const nd: DrawingObject = { id: Date.now().toString(), tool: "text", points: [{ x, y }], color: drawingColor, lineWidth: drawingWidth, text, complete: true };
          onDrawingsChange([...drawings, nd]);
        }
      } else if (activeTool === "eraser") {
        const filtered = drawings.filter(d => {
          if (d.tool === "hline" && d.points.length > 0) return Math.abs(d.points[0].y - y) > 10;
          if (d.tool === "vline" && d.points.length > 0) return Math.abs(d.points[0].x - x) > 10;
          return true;
        });
        onDrawingsChange(filtered);
      }
    };
    const onUp = (e: MouseEvent) => {
      const { x, y } = getPos(e);
      st.dragging = false; canvas.style.cursor = activeTool === "cursor" ? "default" : "crosshair";
      if (activeTool === "rect" && dr.active && dr.current) {
        const completed = { ...dr.current, points: [dr.current.points[0], { x, y }], complete: true };
        onDrawingsChange([...drawings.filter(d => d.id !== completed.id), completed]);
        dr.active = false; dr.current = null;
      } else if (activeTool === "brush" && dr.active && dr.current) {
        const completed = { ...dr.current, complete: true };
        onDrawingsChange([...drawings.filter(d => d.id !== completed.id), completed]);
        dr.active = false; dr.current = null;
      }
    };
    const onWheel = (e: WheelEvent) => {
      if (window.innerWidth < 1024 && !e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      st.zoom = Math.max(0.3, Math.min(5, st.zoom * (e.deltaY > 0 ? 0.9 : 1.1)));
      st.offset = clampOffset(st.offset);
    };
    const onLeave = () => { st.mouseX = -1; st.mouseY = -1; };

    let touchMode: "none" | "pan" | "pinch" = "none";
    let touchStartX = 0;
    let touchStartY = 0;
    let touchStartOffset = 0;
    let pinchStartDistance = 0;
    let pinchStartZoom = 1;
    let pinchStartMidX = 0;
    let pinchAnchorIndex = 0;
    let pinchAnchorRatio = 0.5;

    const startPinch = (touches: TouchList) => {
      touchMode = "pinch";
      const midpoint = getTouchMidpoint(touches);
      const { plotW } = getCanvasInfo();
      const visibleCount = getVisibleCount(st.zoom);
      const startIndex = Math.max(0, candles.length - visibleCount - st.offset);

      pinchStartDistance = Math.max(1, getTouchDistance(touches));
      pinchStartZoom = st.zoom;
      pinchStartMidX = midpoint.x;
      pinchAnchorRatio = Math.max(0, Math.min(1, midpoint.x / Math.max(1, plotW)));
      pinchAnchorIndex = startIndex + pinchAnchorRatio * visibleCount;
      st.dragging = false;
      canvas.style.cursor = "grabbing";
    };

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length >= 2) {
        e.preventDefault();
        startPinch(e.touches);
        return;
      }

      if (e.touches.length === 1) {
        const point = getTouchPos(e.touches[0]);
        touchMode = "none";
        touchStartX = point.x;
        touchStartY = point.y;
        touchStartOffset = st.offset;
        st.mouseX = point.x;
        st.mouseY = point.y;
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length >= 2) {
        e.preventDefault();
        if (touchMode !== "pinch") startPinch(e.touches);

        const distance = Math.max(1, getTouchDistance(e.touches));
        const midpoint = getTouchMidpoint(e.touches);
        const newZoom = Math.max(0.3, Math.min(5, pinchStartZoom * (distance / pinchStartDistance)));
        const visibleCount = getVisibleCount(newZoom);
        const candleW = getCandleWidth(newZoom);
        const anchoredOffset = candles.length - pinchAnchorIndex - visibleCount * (1 - pinchAnchorRatio);
        const midpointPanOffset = (midpoint.x - pinchStartMidX) / Math.max(1, candleW);

        st.zoom = newZoom;
        st.offset = clampOffset(Math.round(anchoredOffset - midpointPanOffset), newZoom);
        st.mouseX = midpoint.x;
        st.mouseY = midpoint.y;
        return;
      }

      if (e.touches.length === 1) {
        const point = getTouchPos(e.touches[0]);
        const dx = point.x - touchStartX;
        const dy = point.y - touchStartY;
        st.mouseX = point.x;
        st.mouseY = point.y;

        if (activeTool === "cursor" && touchMode !== "pan" && Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy) * 1.15) {
          touchMode = "pan";
        }

        if (touchMode === "pan") {
          e.preventDefault();
          st.offset = clampOffset(touchStartOffset - Math.round(dx / Math.max(1, getCandleWidth(st.zoom))));
        }
      }
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (e.touches.length >= 2) {
        startPinch(e.touches);
        return;
      }

      if (e.touches.length === 1) {
        const point = getTouchPos(e.touches[0]);
        touchMode = "none";
        touchStartX = point.x;
        touchStartY = point.y;
        touchStartOffset = st.offset;
        return;
      }

      touchMode = "none";
      st.dragging = false;
      canvas.style.cursor = activeTool === "cursor" ? "default" : "crosshair";
    };

    const onTouchCancel = () => {
      touchMode = "none";
      st.dragging = false;
      canvas.style.cursor = activeTool === "cursor" ? "default" : "crosshair";
    };

    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("mousedown", onDown);
    canvas.addEventListener("mouseup", onUp);
    canvas.addEventListener("mouseleave", onLeave);
    canvas.addEventListener("wheel", onWheel, { passive: false });
    canvas.addEventListener("touchstart", onTouchStart, { passive: false });
    canvas.addEventListener("touchmove", onTouchMove, { passive: false });
    canvas.addEventListener("touchend", onTouchEnd, { passive: false });
    canvas.addEventListener("touchcancel", onTouchCancel, { passive: false });
    document.addEventListener("mouseup", onUp);
    return () => {
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mousedown", onDown);
      canvas.removeEventListener("mouseup", onUp);
      canvas.removeEventListener("mouseleave", onLeave);
      canvas.removeEventListener("wheel", onWheel);
      canvas.removeEventListener("touchstart", onTouchStart);
      canvas.removeEventListener("touchmove", onTouchMove);
      canvas.removeEventListener("touchend", onTouchEnd);
      canvas.removeEventListener("touchcancel", onTouchCancel);
      document.removeEventListener("mouseup", onUp);
    };
  }, [activeTool, drawings, onDrawingsChange, drawingColor, drawingWidth, candles, getPriceRange, getMainPlotBounds]);

  const cursorStyle = activeTool === "cursor" ? "default" : activeTool === "eraser" ? "cell" : "crosshair";
  return <canvas ref={canvasRef} style={{ display: "block", cursor: cursorStyle, width: "100%", height: "100%", touchAction: "pan-y" }} />;
}

type DepthOrder = Order & { cumulative?: number };
type DepthChartProps = { buyLevels: DepthOrder[]; sellLevels: DepthOrder[]; depthLimit: number; baseSymbol: string; quoteSymbol: string };

type DepthHoverState = {
  x: number;
  y: number;
  price: number;
  size: number;
  total: number;
  side: "buy" | "sell";
  snapX: number;
  snapY: number;
};

function DepthChart({ buyLevels, sellLevels, depthLimit, baseSymbol, quoteSymbol }: DepthChartProps) {
  const [hoverPoint, setHoverPoint] = useState<DepthHoverState | null>(null);
  const [zoom, setZoom] = useState(1);
  const [priceStepIndex, setPriceStepIndex] = useState(2);
  const svgRef = useRef<SVGSVGElement | null>(null);

  const priceStepOptions = [0.01, 0.1, 1, 10];
  const priceStep = priceStepOptions[priceStepIndex];

  const chartInfo = useMemo(() => {
    const buy = buyLevels.map((o) => ({ ...o } as DepthOrder)).sort((a, b) => a.price - b.price);
    const sell = sellLevels.map((o) => ({ ...o } as DepthOrder)).sort((a, b) => a.price - b.price);
    const bidTotal = buy[buy.length - 1]?.cumulative ?? 0;
    const askTotal = sell[sell.length - 1]?.cumulative ?? 0;
    const minPrice = buy[0]?.price ?? sell[0]?.price ?? 0;
    const maxPrice = sell[sell.length - 1]?.price ?? buy[buy.length - 1]?.price ?? minPrice + 1;
    const bestBid = buy[buy.length - 1]?.price ?? minPrice;
    const bestAsk = sell[0]?.price ?? maxPrice;
    return {
      buy,
      sell,
      bidTotal,
      askTotal,
      minPrice,
      maxPrice: Math.max(maxPrice, minPrice + 1),
      bestBid,
      bestAsk,
      maxVolume: Math.max(bidTotal, askTotal, 1),
    };
  }, [buyLevels, sellLevels]);

  const { buy, sell, bidTotal, askTotal, minPrice, maxPrice, bestBid, bestAsk, maxVolume } = chartInfo;
  const hasData = buy.length || sell.length;
  const width = 1000;
  const height = 300;
  const padding = { left: 64, right: 24, top: 14, bottom: 46 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  const midPrice = bestBid && bestAsk ? (bestBid + bestAsk) / 2 : bestBid || bestAsk;
  const priceRange = Math.max(1, maxPrice - minPrice);
  const visibleRange = Math.min(priceRange, priceRange / Math.max(0.5, Math.min(5, zoom)));
  let displayMin = Math.max(minPrice, midPrice - visibleRange / 2);
  let displayMax = Math.min(maxPrice, midPrice + visibleRange / 2);

  if (displayMax - displayMin < visibleRange) {
    if (displayMin === minPrice) {
      displayMax = Math.min(maxPrice, displayMin + visibleRange);
    } else if (displayMax === maxPrice) {
      displayMin = Math.max(minPrice, displayMax - visibleRange);
    }
  }


  const normalizeX = (price: number) => padding.left + ((price - displayMin) / Math.max(1, displayMax - displayMin)) * chartWidth;
  const baselineY = height - padding.bottom;
  const normalizeY = (volume: number) => {
    const unbounded = baselineY - (volume / maxVolume) * chartHeight * 0.92;
    return Math.min(baselineY, Math.max(padding.top, unbounded));
  };

  const buildBidAreaPath = (points: { price: number; cumulative: number }[]) => {
    if (!points.length) return "";
    const first = points[0];
    const last = points[points.length - 1];
    const minX = normalizeX(first.price);
    const maxX = normalizeX(last.price);
    const startY = normalizeY(first.cumulative);
    let path = `M ${minX} ${baselineY} L ${minX} ${startY}`;
    for (let i = 1; i < points.length; i += 1) {
      const prev = points[i - 1];
      const curr = points[i];
      const currX = Math.min(maxX, normalizeX(curr.price));
      const prevY = normalizeY(prev.cumulative);
      const currY = normalizeY(curr.cumulative);
      path += ` L ${currX} ${prevY} L ${currX} ${currY}`;
      if (currX >= maxX) break;
    }
    path += ` L ${maxX} ${baselineY} Z`;
    return path;
  };

  const buildAskAreaPath = (points: { price: number; cumulative: number }[]) => {
    if (!points.length) return "";
    const first = points[0];
    const last = points[points.length - 1];
    const minX = normalizeX(first.price);
    const maxX = normalizeX(last.price);
    const startY = normalizeY(first.cumulative);
    let path = `M ${minX} ${baselineY} L ${minX} ${startY}`;
    for (let i = 1; i < points.length; i += 1) {
      const prev = points[i - 1];
      const curr = points[i];
      const currX = Math.max(minX, normalizeX(curr.price));
      const prevY = normalizeY(prev.cumulative);
      const currY = normalizeY(curr.cumulative);
      path += ` L ${currX} ${prevY} L ${currX} ${currY}`;
      if (currX <= minX) continue;
    }
    path += ` L ${maxX} ${baselineY} Z`;
    return path;
  };

  const buildBidLinePath = (points: { price: number; cumulative: number }[]) => {
    if (!points.length) return "";
    const first = points[0];
    const last = points[points.length - 1];
    const maxX = normalizeX(last.price);
    let path = `M ${normalizeX(first.price)} ${normalizeY(first.cumulative)}`;
    for (let i = 1; i < points.length; i += 1) {
      const prev = points[i - 1];
      const curr = points[i];
      const currX = Math.min(maxX, normalizeX(curr.price));
      const prevY = normalizeY(prev.cumulative);
      const currY = normalizeY(curr.cumulative);
      path += ` L ${currX} ${prevY} L ${currX} ${currY}`;
      if (currX >= maxX) break;
    }
    return path;
  };

  const buildAskLinePath = (points: { price: number; cumulative: number }[]) => {
    if (!points.length) return "";
    const first = points[0];
    const minX = normalizeX(first.price);
    let path = `M ${minX} ${normalizeY(first.cumulative)}`;
    for (let i = 1; i < points.length; i += 1) {
      const prev = points[i - 1];
      const curr = points[i];
      const currX = Math.max(minX, normalizeX(curr.price));
      const prevY = normalizeY(prev.cumulative);
      const currY = normalizeY(curr.cumulative);
      path += ` L ${currX} ${prevY} L ${currX} ${currY}`;
    }
    return path;
  };

  const buyPath = buildBidAreaPath(buy.map((level) => ({ price: level.price, cumulative: level.cumulative ?? 0 })));
  const sellPath = buildAskAreaPath(sell.map((level) => ({ price: level.price, cumulative: level.cumulative ?? 0 })));
  const buyLinePath = buildBidLinePath(buy.map((level) => ({ price: level.price, cumulative: level.cumulative ?? 0 })));
  const sellLinePath = buildAskLinePath(sell.map((level) => ({ price: level.price, cumulative: level.cumulative ?? 0 })));

  const bestBidX = normalizeX(bestBid);
  const bestAskX = normalizeX(bestAsk);
  const midX = (bestBidX + bestAskX) / 2;
  const spreadPct = bestBid > 0 && bestAsk > 0 ? (((bestAsk - bestBid) / midPrice) * 100).toFixed(2) : "0.00";

  const tickPrices = useMemo(() => {
    const step = Math.max(priceStep, (displayMax - displayMin) / 4);
    const startTick = Math.ceil(displayMin / step) * step;
    const ticks: number[] = [];
    for (let p = startTick; p <= displayMax + 1e-9; p += step) {
      ticks.push(Number(p.toFixed(8)));
      if (ticks.length > 6) break;
    }
    [displayMin, displayMax, bestBid, bestAsk, midPrice].forEach((value) => {
      if (value >= displayMin && value <= displayMax) ticks.push(Number(value.toFixed(8)));
    });
    return Array.from(new Set(ticks)).sort((a, b) => a - b);
  }, [displayMin, displayMax, priceStep, bestBid, bestAsk, midPrice]);

  const allLevels = useMemo(
    () => [
      ...buy.map((level) => ({ ...level, side: "buy" as const })),
      ...sell.map((level) => ({ ...level, side: "sell" as const })),
    ],
    [buy, sell]
  );

  const findNearest = useCallback(
    (xValue: number) => {
      if (!allLevels.length) return null;
      let best: { level: DepthOrder & { side: "buy" | "sell" }; distance: number; x: number } | null = null;
      for (const level of allLevels) {
        const currentX = normalizeX(level.price);
        const distance = Math.abs(currentX - xValue);
        if (!best || distance < best.distance) {
          best = { level, distance, x: currentX };
        }
      }
      return best;
    },
    [allLevels, normalizeX]
  );

  const handleMouseMove = useCallback(
    (event: React.MouseEvent<SVGSVGElement>) => {
      const svg = svgRef.current;
      if (!svg) return;
      const rect = svg.getBoundingClientRect();
      const relativeX = ((event.clientX - rect.left) / rect.width) * width;
      const relativeY = ((event.clientY - rect.top) / rect.height) * height;
      const nearest = findNearest(relativeX);
      if (!nearest) {
        setHoverPoint(null);
        return;
      }
      const rawPrice = displayMin + ((relativeX - padding.left) / chartWidth) * (displayMax - displayMin);
      const displayPrice = Number(Math.min(Math.max(rawPrice, displayMin), displayMax).toFixed(8));
      const hoverY = normalizeY(nearest.level.cumulative ?? 0);
      setHoverPoint({
        x: Math.min(Math.max(relativeX, padding.left + 12), width - padding.right - 12),
        y: Math.min(Math.max(relativeY, padding.top + 12), baselineY - 12),
        price: Number(displayPrice.toFixed(8)),
        size: nearest.level.amount,
        total: nearest.level.cumulative ?? 0,
        snapX: nearest.x,
        snapY: hoverY,
        side: nearest.level.side,
      });
    },
    [findNearest, normalizeY, baselineY, padding.left, padding.top, width, displayMin, displayMax, chartWidth, height]
  );

  const tooltipLeft = hoverPoint ? `${Math.min(Math.max((hoverPoint.x / width) * 100, 6), 94)}%` : "0";

  return (
    <div className="depth-chart__wrapper">
      <div className="depth-chart__header">
        <div>
          <div className="depth-chart__title">Depth Chart</div>
          <div className="depth-chart__subtitle">Cumulative orderbook curves for the top {depthLimit} levels</div>
        </div>
        <div className="depth-chart__controls">
          <div className="depth-chart__control-group">
            <button className="depth-chart__tool-btn" onClick={() => setZoom((z) => Math.max(0.6, z - 0.2))}>1</button>
            <button className="depth-chart__tool-btn" onClick={() => setZoom((z) => Math.min(3, z + 0.2))}>+</button>
            <span className="depth-chart__control-label">Zoom {zoom.toFixed(1)}x</span>
          </div>
          <div className="depth-chart__control-group">
            {priceStepOptions.map((step, index) => (
              <button
                key={step}
                className={`depth-chart__step-btn ${index === priceStepIndex ? "active" : ""}`}
                onClick={() => setPriceStepIndex(index)}
              >
                {step}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="depth-chart__canvas">
        <div className="depth-chart__mid-pill">
          <strong>{formatPrice(midPrice)} {quoteSymbol}</strong>
          <span>Spread {spreadPct}%</span>
        </div>
        {hoverPoint && (
          <div className="depth-chart__tooltip" style={{ left: tooltipLeft, top: `${Math.max(12, hoverPoint.y - 60)}px` }}>
            <div className="depth-chart__tooltip-label">{hoverPoint.side === "buy" ? "Bid" : "Ask"} depth</div>
            <div className="depth-chart__tooltip-row">
              <span>Price</span>
              <strong>{formatPrice(hoverPoint.price)} {quoteSymbol}</strong>
            </div>
            <div className="depth-chart__tooltip-row">
              <span>Size</span>
              <strong>{formatVol(hoverPoint.size)} {baseSymbol}</strong>
            </div>
            <div className="depth-chart__tooltip-row">
              <span>Total</span>
              <strong>{formatVol(hoverPoint.total)} {quoteSymbol}</strong>
            </div>
          </div>
        )}
        {hasData ? (
          <svg
            ref={svgRef}
            viewBox={`0 0 ${width} ${height}`}
            preserveAspectRatio="none"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setHoverPoint(null)}
            className="depth-chart__svg"
          >
            <defs>
              <linearGradient id="depthBidGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#02c076" stopOpacity="0.16" />
                <stop offset="100%" stopColor="#02c076" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="depthAskGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#e44b55" stopOpacity="0.16" />
                <stop offset="100%" stopColor="#e44b55" stopOpacity="0" />
              </linearGradient>
              <clipPath id="depthClip">
                <rect x={padding.left} y={padding.top} width={chartWidth} height={chartHeight} />
              </clipPath>
            </defs>
            <rect x="0" y="0" width={width} height={height} fill="transparent" />
            <g clipPath="url(#depthClip)">
              <rect x={bestBidX} y={padding.top} width={Math.max(bestAskX - bestBidX, 2)} height={baselineY - padding.top} fill="rgba(255,255,255,0.06)" />
              {tickPrices.map((price) => (
                <g key={price}>
                  <line x1={normalizeX(price)} y1={padding.top} x2={normalizeX(price)} y2={baselineY} stroke={COLORS.border} strokeWidth="0.5" />
                </g>
              ))}
              <path d={buyPath} fill="url(#depthBidGrad)" />
              <path d={sellPath} fill="url(#depthAskGrad)" />
              <path d={buyLinePath} fill="none" stroke="#26a69a" strokeWidth="2.4" strokeLinecap="round" />
              <path d={sellLinePath} fill="none" stroke="#ef5350" strokeWidth="2.4" strokeLinecap="round" />
              <line x1={bestBidX} y1={padding.top} x2={bestBidX} y2={baselineY} stroke="#26a69a" strokeWidth="1" strokeDasharray="3 4" />
              <line x1={bestAskX} y1={padding.top} x2={bestAskX} y2={baselineY} stroke="#ef5350" strokeWidth="1" strokeDasharray="3 4" />
              <line x1={midX} y1={padding.top} x2={midX} y2={baselineY} stroke="rgba(255,255,255,0.24)" strokeWidth="1" strokeDasharray="4 4" />
              {hoverPoint && (
                <>
                  <line x1={hoverPoint.x} y1={padding.top} x2={hoverPoint.x} y2={baselineY} stroke="rgba(255,255,255,0.18)" strokeWidth="1" strokeDasharray="2 4" />
                  <line x1={padding.left} y1={hoverPoint.y} x2={width - padding.right} y2={hoverPoint.y} stroke="rgba(255,255,255,0.12)" strokeWidth="1" strokeDasharray="2 4" />
                  <circle cx={hoverPoint.snapX} cy={hoverPoint.snapY} r={4} fill={hoverPoint.side === "buy" ? "#02c076" : "#e44b55"} />
                </>
              )}
            </g>
            <text x={padding.left} y={padding.top - 8} fill={COLORS.textMuted} fontSize="10">
              Depth volume
            </text>
            <text x={bestBidX} y={baselineY - 12} fill="#26a69a" fontSize="10" textAnchor="middle" fontWeight="700">
              Bid {formatPrice(bestBid)}
            </text>
            <text x={bestAskX} y={baselineY - 12} fill="#ef5350" fontSize="10" textAnchor="middle" fontWeight="700">
              Ask {formatPrice(bestAsk)}
            </text>
          </svg>
        ) : (
          <div className="depth-chart__empty-state">No depth data available yet</div>
        )}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Trading() {
  const saved = loadLayout();

  const [symbols, setSymbols] = useState<string[]>([]);
  const [symbol, setSymbol] = useState(saved.symbol || "BTC/USDT");
  const [timeframe, setTimeframe] = useState(normalizeTimeframe(saved.timeframe || "1d"));
  const [orderbook, setOrderbook] = useState<{ buy: Order[]; sell: Order[] }>({ buy: [], sell: [] });
  const [trades, setTrades] = useState<Trade[]>([]);
  const [candles, setCandles] = useState<Candle[]>([]);
  const deepMarketData: { time: number; value: number }[] = [];
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredSymbols, setFilteredSymbols] = useState<string[]>([]);
  const [coinImages, setCoinImages] = useState<Record<string, string>>(DEFAULT_COIN_IMAGES);
  const [marketMovers, setMarketMovers] = useState<{ pair: string; change: number; volume: number; high: number; low: number }[]>([]);
  const [allTickerPrices, setAllTickerPrices] = useState<Record<string, number>>({});
  const [marketState, setMarketState] = useState<MarketState | null>(null);
  const [priceInput, setPriceInput] = useState("");
  const [savedManualPriceInput, setSavedManualPriceInput] = useState("");
  const [buyAmountInput, setBuyAmountInput] = useState("");
  const [buyTotalInput, setBuyTotalInput] = useState("");
  const [sellAmountInput, setSellAmountInput] = useState("");
  const [sellTotalInput, setSellTotalInput] = useState("");
  const [lastPrice, setLastPrice] = useState(0);
  const [displayPrice, setDisplayPrice] = useState(0);
  const [priceUpdateDirection, setPriceUpdateDirection] = useState<"up" | "down">("up");
  const priceMovementRef = useRef({ direction: "up" as "up" | "down", streak: 0, targetGreenCount: 2 });
  const lastPriceRef = useRef(0);
  const symbolRef = useRef(symbol);
  symbolRef.current = symbol;
  const [baseSymbol, quoteSymbol] = symbol.includes("/") ? symbol.split("/") as [string, string] : [symbol, "USDT"] as [string, string];
  const [change24h, setChange24h] = useState(0);
  const [changePct, setChangePct] = useState(0);
  const [high24h, setHigh24h] = useState(0);
  const [low24h, setLow24h] = useState(0);
  const [vol24h, setVol24h] = useState(0);
  const [vol24hUSDT, setVol24hUSDT] = useState(0);
  const [lastPriceUpdate, setLastPriceUpdate] = useState<number>(Date.now());
  const [showSMA, setShowSMA] = useState(saved.showSMA !== undefined ? saved.showSMA : true);
  const [showEMA, setShowEMA] = useState(saved.showEMA !== undefined ? saved.showEMA : true);
  const [showRSI, setShowRSI] = useState(false);
  const [toolbarCollapsed, setToolbarCollapsed] = useState(false);
  const [showBollinger, setShowBollinger] = useState(saved.showBollinger !== undefined ? saved.showBollinger : false);
  const [showMACD, setShowMACD] = useState(false);
  const [showVWAP, setShowVWAP] = useState(false);
  const [chartType, setChartType] = useState<"candlestick" | "line" | "area" | "bar">("candlestick");
  const [activeChartTab, setActiveChartTab] = useState<"original" | "tradingview" | "depth">("original");
  const [activeViewTab, setActiveViewTab] = useState<"chart" | "orderbook" | "trades" | "info" | "tradingdata">("chart");
  const [orderType, setOrderType] = useState<"limit" | "market" | "stop-limit" | "oco">("limit");
  const [buyStopLoss, setBuyStopLoss] = useState("");
  const [buyTakeProfit, setBuyTakeProfit] = useState("");
  const [sellStopLoss, setSellStopLoss] = useState("");
  const [sellTakeProfit, setSellTakeProfit] = useState("");
  const [buySliderPct, setBuySliderPct] = useState(0);
  const [sellSliderPct, setSellSliderPct] = useState(0);
  const [orderError, setOrderError] = useState("");
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [pendingOrderSide, setPendingOrderSide] = useState<"buy" | "sell" | null>(null);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [sortBy, setSortBy] = useState<"name" | "change" | "volume">("name");
  const [depthLimit, setDepthLimit] = useState(saved.depthLimit || 15);

  // ── Toast Notification System ──────────────────────────────────────────────
  const [toasts, setToasts] = useState<{ id: number; msg: string; type: "success" | "error" | "info" }[]>([]);
  const toastIdRef = useRef(0);
  const showToast = useCallback((msg: string, type: "success" | "error" | "info" = "info") => {
    const id = ++toastIdRef.current;
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  }, []);

  const handleOrderTypeChange = (type: "limit" | "market" | "stop-limit" | "oco") => {
    if (type === orderType) return;
    if (type === "market") {
      setSavedManualPriceInput(priceInput);
      setPriceInput("");
    } else if (orderType === "market") {
      setPriceInput(savedManualPriceInput);
    }
    setOrderType(type);
  };
  const [liveStatus, setLiveStatus] = useState("offline");
  const [accountSummary, setAccountSummary] = useState<AccountSummary>(createFallbackAccountSummary());
  const [userOrders, setUserOrders] = useState<UserOrder[]>(createFallbackUserOrders());
  const [lockedUSDT, setLockedUSDT] = useState(0);
  const [tradeHistory, setTradeHistory] = useState<TradeHistoryItem[]>(createFallbackTradeHistory());
  const [serverPositions, setServerPositions] = useState<any[]>([]);
  const [simulationFeedActive, setSimulationFeedActive] = useState(false);
  const [priceTransitionActive, setPriceTransitionActive] = useState(false);
  const [entryPriceOverlay, setEntryPriceOverlay] = useState<number | null>(null);
  const closePosition = async (position: { pair: string; id?: string; _id?: string; markPrice?: number; entryPrice?: number; }) => {
    try {
      const positionId = position.id || position._id;
      if (!positionId) {
        console.error('Close position failed: missing position id', position);
        return;
      }
      const api = await getAxios();
      await api.post('/api/trade/close-position', { pair: position.pair, positionId });
      await refreshAccountData();
    } catch (err) {
      console.error('Close position error:', err);
    }
  };
  const [rightTab, setRightTab] = useState<"market" | "mytrades">("market");
  const [bottomTab, setBottomTab] = useState<"openorders" | "positions" | "orderhistory" | "tradehistory" | "holdings" | "bots">("openorders");
  const [pairTab, setPairTab] = useState<"usdt" | "fav">("usdt");
  const [activeTool, setActiveTool] = useState<DrawingTool>("cursor");
  const [drawings, setDrawings] = useState<DrawingObject[]>([]);
  const [drawingColor, setDrawingColor] = useState("#f0b90b");
  const [drawingWidth, setDrawingWidth] = useState(1.5);
  const [showPortfolioModal, setShowPortfolioModal] = useState(false);
  const [slippageTol, setSlippageTol] = useState(false);
  const [activeTab, setActiveTab] = useState<"spot" | "cross" | "isolated" | "grid">("spot");
  const [gridBotActive, setGridBotActive] = useState(false);
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);
  const [showWallet, setShowWallet] = useState(false);
  const [showPairSelector, setShowPairSelector] = useState(false);
  const [gridBotConfig, setGridBotConfig] = useState({ lowerPrice: "", upperPrice: "", gridNum: "10", investAmount: "" });
  const [windowWidth, setWindowWidth] = useState<number>(typeof window !== "undefined" ? window.innerWidth : 1200);
  const [orderbookViewMode, setOrderbookViewMode] = useState<"combined" | "bids" | "asks">("combined");
  const [spread, setSpread] = useState(0);
  const [spreadPct, setSpreadPct] = useState(0);
  const prevSpreadRef = useRef<number | null>(null);
  const [spreadDirection, setSpreadDirection] = useState<'tighten' | 'widen' | 'neutral'>('neutral');
  const tradingPageRef = useRef<HTMLDivElement | null>(null);
  const bottomScrollRef = useRef<HTMLDivElement | null>(null);
  const isChartView = activeViewTab === "chart";
  const isDesktopLayout = windowWidth >= 1024;
  const isCompactLayout = !isDesktopLayout;
  const [orderSide, setOrderSide] = useState<"buy" | "sell">("buy");
  const isAuthenticated = authService.isSessionValid();
  const navigate = useNavigate();
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => { saveLayout({ symbol, timeframe, showSMA, showEMA, showBollinger, depthLimit }); }, [symbol, timeframe, showSMA, showEMA, showBollinger, depthLimit]);

  // Close time dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showTimeDropdown && !(event.target as Element).closest('.time-dropdown')) {
        setShowTimeDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showTimeDropdown]);

  useEffect(() => {
    let mounted = true;

    const unsubscribeConnection = subscribeConnectionStatus((status) => {
      if (!mounted) return;
      console.log("[Trading] connection status", { symbol, status });
      setLiveStatus(status);
    });

    const unsubscribeMarket = subscribeMarketState(symbol, (state) => {
      if (!mounted) return;
      console.log("[Trading] subscribeMarketState callback", { symbol, statePair: state.pair, lastPrice: state.lastPrice, markPrice: state.markPrice, orderbookBids: state.orderbook.bids.length, orderbookAsks: state.orderbook.asks.length });
      setMarketState(prev => {
        // Only update if values actually changed
        if (prev && prev.lastPrice === state.lastPrice && 
            prev.markPrice === state.markPrice &&
            prev.orderbook.bids === state.orderbook.bids &&
            prev.orderbook.asks === state.orderbook.asks &&
            prev.volume24h === state.volume24h &&
            prev.high24h === state.high24h &&
            prev.low24h === state.low24h &&
            prev.change24h === state.change24h &&
            prev.changePct === state.changePct) {
          return prev;
        }
        return state;
      });
    });

    return () => {
      mounted = false;
      unsubscribeConnection();
      unsubscribeMarket();
    };
  }, [symbol]);

  useEffect(() => {
    lastPriceRef.current = lastPrice;
  }, [lastPrice]);

  useEffect(() => {
    const primary = serverPositions.find((p) => p.pair === symbol);
    if (primary && Number(primary.entryPrice) > 0) {
      setSimulationFeedActive(true);
      setEntryPriceOverlay(Number(primary.entryPrice));
    } else if (!priceTransitionActive) {
      setSimulationFeedActive(false);
      setEntryPriceOverlay(null);
    }
  }, [serverPositions, symbol, priceTransitionActive]);

  // Refresh account-related data from backend (debounced to prevent flooding)
  const refreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const refreshAccountData = useCallback(async () => {
    if (refreshTimerRef.current) return;
    refreshTimerRef.current = setTimeout(() => { refreshTimerRef.current = null; }, 3000);
    try {
      const api = await getAxios();

      const [summaryRes, ordersRes, positionsRes, balancesRes, historyRes] = await Promise.all([
        api.get('/api/account/summary'),
        api.get('/api/account/open-orders'),
        api.get('/api/account/positions'),
        api.get('/api/wallet'),
        api.get('/api/trade/history').catch(() => ({ data: [] })),
      ]);
      
      if (summaryRes?.data) {
        const data = summaryRes.data;
        const available = Number(data.available) || 0;
        const locked = Number(data.locked) || 0;
        const unrealizedPnl = Number(data.unrealizedPnl) || 0;
        const holdingsVal = (data.holdings || []).reduce(
          (sum: number, h: { value?: number }) => sum + (Number(h.value) || 0),
          0
        );
        const derivedEquity = available + locked + holdingsVal;
        const derivedPortfolio = derivedEquity;

        setAccountSummary((prev) => ({
          ...prev,
          ...data,
          available,
          locked,
          unrealizedPnl,
          equity: derivedEquity,
          totalEquity: derivedEquity,
          totalPortfolio: derivedPortfolio,
        }));
      }
      if (positionsRes?.data) setServerPositions((positionsRes.data || []).filter((p: any) => p && (p.size || p.quantity) && Number(p.size || p.quantity) !== 0));
      if (ordersRes?.data) {
        const orders = (ordersRes.data || []).map((o: any) => ({
          id: o.orderId,
          pair: o.pair || o.symbol,
          type: o.type,
          side: o.side,
          price: Number(o.price) || 0,
          amount: Number(o.amount) || 0,
          status: o.status,
          createdAt: Math.floor(new Date(o.createdAt).getTime() / 1000),
        }));
        setUserOrders(orders);
        setLockedUSDT(Number(summaryRes?.data?.locked || 0));
      }
      if (historyRes?.data && Array.isArray(historyRes.data)) {
        setTradeHistory(historyRes.data.map((t: any) => ({
          time:       Math.floor(new Date(t.createdAt || t.time).getTime() / 1000),
          price:      t.price || 0,          // close price
          entryPrice: t.entryPrice || 0,     // entry price
          quantity:   t.amount || t.quantity || 0,
          side:       t.side,
          pair:       t.pair || t.symbol || symbol,
          type:       t.type || 'market',
          profit:     t.pnl ?? t.profit ?? 0,
          pnl:        t.pnl ?? t.profit ?? 0,
        })));
      }

      const walletData = balancesRes?.data?.data ?? balancesRes?.data ?? {};
      const walletAvailable = Number(walletData.availableBalance ?? walletData.available ?? walletData.balance) || 0;
      const walletLocked = Number(walletData.lockedBalance ?? walletData.locked ?? 0) || 0;
      const walletTotal = Number(walletData.totalBalance ?? walletData.totalPortfolio ?? walletAvailable + walletLocked) || walletAvailable + walletLocked;

      setLockedUSDT(walletLocked);
      setAccountSummary((prev) => ({
        ...prev,
        available: walletAvailable,
        locked: walletLocked,
        equity: walletTotal,
        totalEquity: walletTotal,
        totalPortfolio: walletTotal,
      }));
    } catch (err) {
      console.error('Error refreshing account data:', err);
      // ignore; keep existing fallback
    }
  }, []);

  // Initial load: fetch balances, open orders, and trade history from backend
  useEffect(() => {
    refreshAccountData();
  }, [refreshAccountData]);

  // WebSocket listeners for real-time balance and position updates
  useEffect(() => {
    let socket: any = null;

    const connectSocket = async () => {
      try {
        const token = localStorage.getItem('token') || localStorage.getItem('sessionToken') || '';

        const { io } = await import('socket.io-client');
        const API_BASE = process.env.REACT_APP_API_URL
          ? process.env.REACT_APP_API_URL.replace(/\/+$/, '')
          : 'http://localhost:5000';

        socket = io(API_BASE, {
          auth: token ? { token } : undefined,
          transports: ['websocket', 'polling'],
          path: '/socket.io',
        });

        // Balance updated by admin or position close
        socket.on('balanceUpdated', (data: any) => {
          const available = Number(data.available ?? data.balance) || 0;
          const locked = Number(data.locked ?? data.lockedBalance) || 0;
          const equity = Number(data.totalEquity ?? data.equity ?? data.balance ?? available + locked) || 0;
          setAccountSummary(prev => ({
            ...prev,
            available: available || prev.available,
            locked,
            equity,
            totalEquity: equity,
            totalPortfolio: Number(data.totalPortfolio ?? data.totalBalance ?? equity) || equity,
          }));
          refreshAccountData();
        });

        socket.on('balanceUpdate', (data: any) => {
          if (data?.available != null) {
            const available = Number(data.available) || 0;
            const locked = Number(data.locked ?? data.lockedBalance) || 0;
            const equity = Number(data.totalEquity ?? data.equity ?? data.balance ?? available + locked) || 0;
            setAccountSummary(prev => ({
              ...prev,
              available,
              locked,
              equity,
              totalEquity: equity,
              totalPortfolio: Number(data.totalPortfolio ?? data.totalBalance ?? equity) || equity,
            }));
          }
          // Full refresh to get all updated values
          refreshAccountData();
        });

        // Position closed — begin gradual transition back to Binance
        socket.on('positionClosed', (data: any) => {
          setPriceTransitionActive(true);
          setSimulationFeedActive(true);
          setEntryPriceOverlay(null);
          refreshAccountData();
        });

        socket.on('simulationEnded', () => {
          setPriceTransitionActive(false);
          setSimulationFeedActive(false);
          setEntryPriceOverlay(null);
          refreshAccountData();
        });

        // Drift stopped — snap-back to Binance in progress
        socket.on('driftStopped', () => {
          setPriceTransitionActive(true);
          refreshAccountData();
        });

        // Per-user simulated price feed (State 2 natural / State 3 admin drift)
        socket.on('simulatedPriceUpdate', (data: any) => {
          if (!data?.pair || !data?.price) return;
          if (data.mode === 'snapback') {
            setPriceTransitionActive(true);
          } else if (data.mode === 'natural' || data.mode === 'drift') {
            setSimulationFeedActive(true);
            setPriceTransitionActive(false);
          }
          setServerPositions(prev => prev.map((p: any) => {
            if (p.pair !== data.pair) return p;
            const quantity = Math.abs(p.size || p.quantity || 0);
            const markPrice = data.price;
            const pnlData = calculateUnrealizedPnL({
              entryPrice: p.entryPrice || 0,
              quantity,
              leverage: p.leverage || 1,
              side: p.side || 'long',
              isGenuine: p.isGenuine !== false,
              isDemo: p.isDemo === true,
            }, markPrice);
            return {
              ...p,
              markPrice,
              unrealizedPnl: pnlData.pnl,
              unrealizedPnlPercent: pnlData.pnlPercent,
              rawUnrealizedPnl: pnlData.rawPnl,
              rawUnrealizedPnlPercent: pnlData.rawPnlPercent,
            };
          }));
        });

        socket.on('market_update', (data: any) => {
          if (data?.unrealizedPnl != null) {
            const available = Number(data.available ?? data.balance ?? 0);
            const locked = Number(data.locked ?? 0);
            const unrealizedPnl = Number(data.unrealizedPnl ?? 0);
            const derivedEquity =
              Number(data.totalEquity ?? data.equity) ||
              available + locked + unrealizedPnl;

            setAccountSummary(prev => ({
              ...prev,
              unrealizedPnl,
              available: data.available ?? data.balance ?? prev.available,
              locked: data.locked ?? prev.locked,
              equity: derivedEquity,
              totalEquity: derivedEquity,
              totalPortfolio: Number(data.totalPortfolio ?? data.totalBalance ?? derivedEquity) || derivedEquity,
            }));
          }
        });

        // allTickers — live prices for ALL pairs from backend
        socket.on('allTickers', (tickers: any[]) => {
          if (!Array.isArray(tickers)) return;
          const priceMap: Record<string, number> = {};
          const movers: { pair: string; change: number; volume: number; high: number; low: number }[] = [];
          const currentSym = symbolRef.current.replace("/", "");
          for (const t of tickers) {
            const price = Number(t.price) || Number(t.lastPrice) || 0;
            const sym = t.symbol;
            if (!sym) continue;
            if (sym !== currentSym && price > 0) priceMap[sym] = price;
            if (sym.endsWith('USDT')) {
              const base = sym.replace('USDT', '');
              movers.push({
                pair: `${base}/USDT`,
                change: Number(t.changePct) || 0,
                volume: Number(t.quoteVol) || Number(t.volume24h) || 0,
                high: Number(t.high24h) || 0,
                low: Number(t.low24h) || 0,
              });
            }
          }
          if (Object.keys(priceMap).length) setAllTickerPrices(prev => ({ ...prev, ...priceMap }));
          if (movers.length) setMarketMovers(movers);
        });

        // priceUpdate — real-time price for tracked pairs
        socket.on('priceUpdate', (data: any) => {
          if (!data?.pair || !data?.price) return;
          const price = Number(data.price);
          if (!Number.isFinite(price) || price <= 0) return;
          const binanceSym = data.pair.replace("/", "");
          setAllTickerPrices(prev => ({ ...prev, [binanceSym]: price }));
          if (data.pair === symbolRef.current) {
            const prevPrice = lastPriceRef.current;
            const direction = price >= prevPrice ? "up" : "down";
            lastPriceRef.current = price;
            setLastPrice(price);
            setDisplayPrice(price);
            setPriceUpdateDirection(direction);
            setLastPriceUpdate(data.time || Date.now());
          }
        });

      } catch (err) {
        console.error('Socket connection error:', err);
      }
    };

    connectSocket();

    return () => {
      if (socket) socket.disconnect();
    };
  }, [refreshAccountData]);

  useEffect(() => {
    if (!marketState) return;
    setOrderbook({ buy: marketState.orderbook.bids, sell: marketState.orderbook.asks });
    setTrades(marketState.trades);
    // Keep local mirror for display only; single source of truth remains marketState.lastPrice
    setLastPrice(marketState.lastPrice);
    setHigh24h(marketState.high24h);
    setLow24h(marketState.low24h);
    setVol24h(marketState.volume24h);
    setChange24h(marketState.change24h);
    setChangePct(marketState.changePct);
    setLastPriceUpdate(marketState.lastPriceUpdate);
    setVol24hUSDT(isValidPrice(marketState.lastPrice) ? marketState.volume24h * marketState.lastPrice : 0);
    // compute spread and direction (widening / tightening)
    try {
      const bestBid = marketState.orderbook.bids?.[0]?.price;
      const bestAsk = marketState.orderbook.asks?.[0]?.price;
      const newSpread = isValidPrice(bestAsk) && isValidPrice(bestBid) ? Math.max(0, bestAsk - bestBid) : 0;
      const mid = isValidPrice(bestAsk) && isValidPrice(bestBid)
        ? (bestAsk + bestBid) / 2
        : (isValidPrice(marketState.lastPrice) ? marketState.lastPrice : NaN);
      const newSpreadPct = Number.isFinite(mid) && mid > 0 ? (newSpread / mid) * 100 : 0;
      const prev = prevSpreadRef.current;
      if (prev == null) setSpreadDirection('neutral');
      else if (newSpread > prev) setSpreadDirection('widen');
      else if (newSpread < prev) setSpreadDirection('tighten');
      else setSpreadDirection('neutral');
      prevSpreadRef.current = newSpread;
      setSpread(newSpread);
      setSpreadPct(newSpreadPct);
    } catch (e) {}
    // Update the latest candle on every live quote.
    if (isValidPrice(marketState.lastPrice) && candles.length) {
      const updated = updateLatestCandle(marketState.lastPrice, Date.now());
      if (updated) {
        setCandles(getCandles());
      }
    }
  }, [marketState, candles.length]);

  const indicators = useMemo(() => ({
    sma:  showSMA       ? calcSMA(candles, 7)     : [],
    ema:  showEMA       ? calcEMA(candles, 99)    : [],
    bb:   showBollinger ? calcBB(candles, 20, 2)  : [],
    vwap: showVWAP      ? calcVWAP(candles)       : [],
  }), [candles, showSMA, showEMA, showBollinger, showVWAP]);
  const rsiData  = useMemo(() => showRSI  ? calcRSI(candles, 14) : [], [candles, showRSI]);
  const macdData = useMemo(() => showMACD ? calcMACD(candles, 12, 26, 9) : null, [candles, showMACD]);

    const buyOrders = orderbook.buy.slice().sort((a, b) => b.price - a.price).slice(0, depthLimit).map(o => ({ ...o, total: +(o.price * o.amount).toFixed(2) }));
  const sellOrders = orderbook.sell.slice().sort((a, b) => a.price - b.price).slice(0, depthLimit).map(o => ({ ...o, total: +(o.price * o.amount).toFixed(2) }));
  
  let buyCum = 0, sellCum = 0;
  const buyDisplay  = buyOrders.map(o => { buyCum += o.total || 0;  return { ...o, cumulative: buyCum }; });
  const sellDisplay = sellOrders.map(o => { sellCum += o.total || 0; return { ...o, cumulative: sellCum }; });
  
  const maxBid = Math.max(...buyDisplay.map(b => b.cumulative || 0), 1);
  const maxAsk = Math.max(...sellDisplay.map(a => a.cumulative || 0), 1);
  
  const totalBidVol  = buyCum;
  const totalAskVol  = sellCum;
  const bestBid = buyDisplay[0]?.price || 0;
  const bestAsk = sellDisplay[0]?.price || 0;
  const midPrice = isValidPrice(bestBid) && isValidPrice(bestAsk) ? (bestBid + bestAsk) / 2 : lastPrice;
  const askRows = sellDisplay.slice().reverse();
  const bidRows = buyDisplay;
  
  const bidPct = totalBidVol + totalAskVol > 0 ? (totalBidVol / (totalBidVol + totalAskVol) * 100).toFixed(1) : "50.0";
  const askPct = totalBidVol + totalAskVol > 0 ? (totalAskVol / (totalBidVol + totalAskVol) * 100).toFixed(1) : "50.0";
  
  const activeOrders = userOrders.filter(o => o.status === "open");
  
  const pendingLocked = useMemo(() => userOrders
    .filter(o => o.status === "open" && o.side === "buy")
    .reduce((sum, order) => sum + order.price * order.amount, 0), [userOrders]);
    
  const pendingSellLockedBTC = useMemo(() => userOrders
    .filter(o => o.status === "open" && o.side === "sell")
    .reduce((sum, order) => sum + order.amount, 0), [userOrders]);

  // ─── UNIFIED BALANCES & RECONCILIATION ─────────────────────────────────────
  const availableBalanceRaw = Number.isFinite(accountSummary.available) ? Number(accountSummary.available) : 0;
  const availableBalance    = availableBalanceRaw;
  const reservedUSDT        = Number.isFinite(accountSummary.locked) ? Number(accountSummary.locked) : lockedUSDT;

  const livePositionsUnrealizedPnl = useMemo(() => {
    if (!serverPositions.length) return null;
    return serverPositions.reduce((sum, p: any) => {
      const currentPairMark = p.pair === symbol
        ? (Number.isFinite(lastPrice) && lastPrice > 0 ? lastPrice : NaN)
        : (Number(marketState?.markPrice) || Number(marketState?.lastPrice));
      const storedMark = Number(p.markPrice);
      const mark = Number.isFinite(currentPairMark) && currentPairMark > 0
        ? currentPairMark
        : Number.isFinite(storedMark) && storedMark > 0
          ? storedMark
          : NaN;
      const entry = Number(p.entryPrice);
      const size = Math.abs(Number(p.size || p.quantity || 0));
      const leverage = Number(p.leverage || 1);
      const direction = (p.side || "long") === "short" ? -1 : 1;

      if (Number.isFinite(mark) && mark > 0 && Number.isFinite(entry) && entry > 0 && size > 0) {
        return sum + (mark - entry) * size * leverage * direction;
      }

      const fallbackPnl = Number(p.unrealizedPnl ?? p.unrealizedPnL ?? 0);
      return sum + (Number.isFinite(fallbackPnl) ? fallbackPnl : 0);
    }, 0);
  }, [serverPositions, symbol, lastPrice, marketState?.pair, marketState?.markPrice, marketState?.lastPrice]);

  const accountUnrealizedPnl = useMemo(() => {
    return livePositionsUnrealizedPnl !== null
      ? livePositionsUnrealizedPnl
      : typeof accountSummary.unrealizedPnl === "number" ? accountSummary.unrealizedPnl : 0;
  }, [livePositionsUnrealizedPnl, accountSummary.unrealizedPnl]);

  const holdingsValue = useMemo(
    () => (accountSummary.holdings || []).reduce((sum, h) => sum + (Number(h.value) || 0), 0),
    [accountSummary.holdings]
  );

  // 3. Equity / portfolio — cash (available + locked) plus marked crypto holdings
  const totalEquity = useMemo(() => {
    return availableBalanceRaw + reservedUSDT + holdingsValue;
  }, [availableBalanceRaw, reservedUSDT, holdingsValue]);

  // 1. Total Portfolio Value — same as equity for spot (USDT + marked positions)
  const portfolioTotal = useMemo(() => totalEquity, [totalEquity]);

  // 2. Free To Trade — spendable USDT (not equity / unrealized PnL)
  const freeToTrade = useMemo(
    () => Math.max(0, availableBalanceRaw),
    [availableBalanceRaw]
  );

  // Legacy fallback safety mappings
  const accountEquity = totalEquity;
  
  // 4. Crypto Position Holdings Mapping
  const btcHolding   = accountSummary.holdings.find(h => h.asset === "BTC")?.amount || 0;
  const availableBTC = Math.max(0, btcHolding - pendingSellLockedBTC);



  const parseNumber = (value: unknown) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  };
  const getEffectivePrice = (input: unknown, lastP: number) => {
    const p = Number(input);
    if (Number.isFinite(p) && p > 0) return p;
    if (isValidPrice(lastP)) return lastP;
    return null;
  };

  const limitPrice = Number(priceInput);
  const marketPrice = isValidPrice(lastPrice) ? lastPrice : NaN;
  const orderPriceDisplay = orderType === "market"
    ? (isValidPrice(marketPrice) ? marketPrice.toFixed(2) : "")
    : priceInput;
  const buyPrice = orderType === "market" ? marketPrice : (Number.isFinite(limitPrice) && limitPrice > 0 ? limitPrice : NaN);
  const sellPrice = orderType === "market" ? marketPrice : (Number.isFinite(limitPrice) && limitPrice > 0 ? limitPrice : NaN);

  // pricing values computed above

  const buyAmount = parseNumber(buyAmountInput || 0);
  const sellAmount = parseNumber(sellAmountInput || 0);
  const buyTotal = orderType === "market"
    ? buyAmount * buyPrice
    : Number(buyTotalInput || (buyAmount > 0 && isValidPrice(buyPrice) ? buyAmount * buyPrice : 0));
  const sellTotal = orderType === "market"
    ? sellAmount * sellPrice
    : Number(sellTotalInput || (sellAmount > 0 && isValidPrice(sellPrice) ? sellAmount * sellPrice : 0));
  const buyFee = buyTotal * FEE_RATE;
  const sellFee = sellTotal * FEE_RATE;
  const estimatedBuyReceive = buyAmount;
  const estimatedSellReceive = Math.max(0, sellTotal - sellFee);
  const buyStop = buyStopLoss ? parseNumber(buyStopLoss) : undefined;
  const buyTp = buyTakeProfit ? parseNumber(buyTakeProfit) : undefined;
  const sellStop = sellStopLoss ? parseNumber(sellStopLoss) : undefined;
  const sellTp = sellTakeProfit ? parseNumber(sellTakeProfit) : undefined;
  const marketPriceUnavailable = orderType === "market" && !isValidPrice(marketPrice);
  const tradingReady = liveStatus === "live" || isValidPrice(marketPrice);
  const buyError = buyAmount <= 0
    ? "Enter buy amount"
    : buyTotal < MIN_ORDER_TOTAL
      ? "Minimum order is 5 USDT"
      : buyTotal > availableBalance
        ? "Insufficient Balance"
        : marketPriceUnavailable
          ? "Market price unavailable"
          : orderType !== "market" && !isValidPrice(buyPrice)
            ? "Enter valid price"
            : !tradingReady
              ? "Connection is offline"
              : buyStop && buyStop >= buyPrice
                ? "Stop Loss must be below entry price"
                : buyTp && buyTp <= buyPrice
                  ? "Take Profit must be above entry price"
                  : "";
  const sellError = sellAmount <= 0
    ? "Enter sell amount"
    : sellAmount > availableBTC
      ? "Insufficient BTC Balance"
      : sellTotal < MIN_ORDER_TOTAL
        ? "Minimum order is 5 USDT"
        : marketPriceUnavailable
          ? "Market price unavailable"
          : orderType !== "market" && !isValidPrice(sellPrice)
            ? "Enter valid price"
            : !tradingReady
              ? "Connection is offline"
            : sellStop && sellStop <= sellPrice
              ? "Stop Loss must be above entry price"
              : sellTp && sellTp >= sellPrice
                ? "Take Profit must be below entry price"
                : "";
  const isReady = tradingReady && isValidPrice(marketPrice);
  const buyDisabled = !!buyError || isPlacingOrder || buyAmount <= 0 || !tradingReady || (orderType !== "market" && !isValidPrice(buyPrice));
  const sellDisabled = !!sellError || isPlacingOrder || sellAmount <= 0 || availableBTC <= 0 || !tradingReady || (orderType !== "market" && !isValidPrice(sellPrice));
  const buyButtonLabel = !isReady ? "Connecting..." : "Buy / Long";
  const marketWarning = orderType === "market"
    ? isValidPrice(marketPrice)
      ? "Execution price may change due to market volatility."
      : "Market price unavailable. Check your connection."
    : "";
  useEffect(() => {
    if (availableBTC <= 0 && sellAmountInput) {
      setSellAmountInput("");
      setSellTotalInput("");
      setSellSliderPct(0);
    }
  }, [availableBTC, sellAmountInput]);

  const orderbookVariant = windowWidth >= 1024 ? "desktop" : windowWidth >= 768 ? "tablet" : "mobile";
  const bidPctNum = parseFloat(bidPct) || 0;
  const askPctNum = parseFloat(askPct) || 0;
  const orderbookSummary = (
    <div className="orderbook__summary">
      <div className="orderbook__bid-ask-bar">
        <span className="orderbook__bid-pct">B {bidPct}%</span>
        <span className="orderbook__ask-pct">S {askPct}%</span>
      </div>
    </div>
  );
  const renderOrderbook = () => {
    const showAsk = orderbookViewMode !== "bids";
    const showBid = orderbookViewMode !== "asks";

    const header = (
      <div className="orderbook__col-headers">
        <span>Price ({quoteSymbol})</span>
        <span className="col-amount">Size ({baseSymbol})</span>
        <span className="col-total">Total ({quoteSymbol})</span>
      </div>
    );

    const renderRow = (row: DepthOrder, side: "buy" | "sell", index: number) => {
      const isBest = side === "buy" ? row.price === bestBid : row.price === bestAsk;
      const rowFillWidth = Math.min(100, ((row.cumulative || row.total || 0) / (side === "sell" ? maxAsk : maxBid)) * 100);
      return (
        <div
          key={`${side}-${row.price}-${index}`}
          className={`orderbook__row orderbook__row--${side === "sell" ? "ask" : "bid"}${isBest ? " orderbook__row--best" : ""}`}
          onClick={() => { if (orderType === "market") return; setPriceInput(row.price.toFixed(2)); }}
        >
          <div className={`orderbook__row-fill orderbook__row-fill--${side === "sell" ? "ask" : "bid"}`} style={{ width: `${rowFillWidth}%` }} />
          <span className="col-price">{formatPrice(row.price)}</span>
          <span className="col-amount">{row.amount.toFixed(5)}</span>
          <span className="col-total">{(row.total || 0).toFixed(2)}</span>
        </div>
      );
    };

    if (orderbookViewMode === "combined") {
      return (
        <>
          {orderbookSummary}
          {header}
          <div className="orderbook__asks">
            {askRows.length > 0 ? askRows.map((ask, index) => renderRow(ask, "sell", index)) : (
              <div className="orderbook__row" style={{ justifyContent: "center", color: COLORS.textMuted }}>
                No ask data available
              </div>
            )}
          </div>
          {/* spread/mid-price removed as requested */}
          <div className="orderbook__bids">
            {bidRows.length > 0 ? bidRows.map((bid, index) => renderRow(bid, "buy", index)) : (
              <div className="orderbook__row" style={{ justifyContent: "center", color: COLORS.textMuted }}>
                No bid data available
              </div>
            )}
          </div>
        </>
      );
    }

    const visibleRows = showAsk
      ? askRows.map(o => ({ ...o, side: "sell" as const }))
      : showBid
        ? bidRows.map(o => ({ ...o, side: "buy" as const }))
        : [];

    return (
      <>
        {orderbookSummary}
        {header}
        <div style={{ flex: 1, overflow: "auto" }}>
          {visibleRows.length > 0 ? visibleRows.map((row, index) => renderRow(row, row.side, index)) : (
            <div className="orderbook__row" style={{ justifyContent: "center", color: COLORS.textMuted }}>
              No orderbook rows available
            </div>
          )}
        </div>
      </>
    );
  };

  const orderBookPanel = (placement: "side" | "embedded") => (
    <aside
      className={`trading-orderbook trading-orderbook--${placement}`}
      style={{
        width: placement === "side" ? 260 : "100%",
        background: COLORS.bgPanel,
        borderLeft: placement === "side" ? `1px solid ${COLORS.border}` : "none",
        borderTop: placement === "embedded" ? `1px solid ${COLORS.border}` : "none",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        overflow: "hidden",
        minHeight: placement === "side" ? 0 : 320,
      }}
    >
      <div style={{ padding: "8px 10px", borderBottom: `1px solid ${COLORS.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontWeight: 700, fontSize: 13, color: COLORS.textBright }}>Order Book</span>
        </div>
        <div style={{ display: "flex", gap: 4, alignItems: "center", flexWrap: "wrap", justifyContent: "flex-end" }}>
          {(["combined", "bids", "asks"] as const).map(mode => (
            <button
              key={mode}
              onClick={() => setOrderbookViewMode(mode)}
              title={mode === "combined" ? "Both" : mode}
              style={{
                background: orderbookViewMode === mode ? COLORS.bgHover : "transparent",
                border: `1px solid ${orderbookViewMode === mode ? COLORS.border : "transparent"}`,
                color: orderbookViewMode === mode ? COLORS.textBright : COLORS.text,
                cursor: "pointer",
                padding: "2px 6px",
                borderRadius: 3,
                fontSize: 10,
                textTransform: "capitalize",
              }}
            >
              {mode === "combined" ? orderBookIcon('both') : mode === 'bids' ? orderBookIcon('bid') : orderBookIcon('ask')}
            </button>
          ))}
          {[10, 15, 20].map(limit => (
            <button
              key={limit}
              onClick={() => setDepthLimit(limit)}
              style={{
                background: depthLimit === limit ? COLORS.bgHover : "transparent",
                border: `1px solid ${depthLimit === limit ? COLORS.border : "transparent"}`,
                color: depthLimit === limit ? COLORS.amber : COLORS.text,
                cursor: "pointer",
                padding: "2px 5px",
                borderRadius: 3,
                fontSize: 10,
                fontFamily: "monospace",
              }}
            >
              {limit}
            </button>
          ))}
        </div>
      </div>
      {renderOrderbook()}
    </aside>
  );

  const switchSymbol = (pair: string) => {
    setSymbol(pair);
    const binanceSym = pair.replace("/", "");
    const tickerPrice = allTickerPrices[binanceSym];
    if (tickerPrice && tickerPrice > 0) {
      setLastPrice(tickerPrice);
      setDisplayPrice(tickerPrice);
      lastPriceRef.current = tickerPrice;
    }
  };

  const topMoversSection = () => (
    <div style={{ borderTop: `1px solid ${COLORS.border}`, background: COLORS.bgPanel, display: "flex", flexDirection: "column", flexShrink: 0, overflow: "hidden" }}>
      <div style={{ padding: "6px 10px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: COLORS.textBright }}>Top Movers</span>
        <span style={{ fontSize: 11, color: COLORS.text }}>FAQ ▾</span>
      </div>
      <div style={{ display: "flex", gap: 4, padding: "0 10px 6px" }}>
        {["All", "Change", "New High/Low", "Fluctuation", "Volume"].map(tab => (
          <button key={tab} style={{ fontSize: 10, padding: "2px 6px", background: tab === "All" ? COLORS.bgAlt : "transparent", border: `1px solid ${tab === "All" ? COLORS.border : "transparent"}`, borderRadius: 3, color: COLORS.text, cursor: "pointer", whiteSpace: "nowrap" }}>{tab}</button>
        ))}
      </div>
      {marketMovers.slice().sort((a, b) => Math.abs(b.change) - Math.abs(a.change)).slice(0, 3).map(m => (
        <div key={m.pair} onClick={() => switchSymbol(m.pair)} style={{ display: "flex", alignItems: "center", padding: "4px 10px", cursor: "pointer", gap: 8 }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = COLORS.bgAlt}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}
        >
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: COLORS.textBright }}>{m.pair}</div>
            <div style={{ fontSize: 10, color: COLORS.textMuted }}>{new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <span style={{ fontSize: 11, background: m.change >= 0 ? COLORS.greenDim : COLORS.redDim, color: m.change >= 0 ? COLORS.green : COLORS.red, padding: "2px 6px", borderRadius: 3 }}>
              {m.change >= 0 ? "+" : ""}{m.change.toFixed(2)}%
            </span>
            <div style={{ fontSize: 9, color: COLORS.textMuted, marginTop: 1 }}>New 7day High</div>
          </div>
        </div>
      ))}
    </div>
  );

  const marketPairsPanel = () => (
    <div style={{ background: COLORS.bgPanel, display: "flex", flexDirection: "column", flexShrink: 0, overflow: "hidden" }}>
      {/* Search */}
      <div style={{ padding: "8px 10px", borderBottom: `1px solid ${COLORS.border}` }}>
        <div style={{ display: "flex", alignItems: "center", background: COLORS.bgAlt, border: `1px solid ${COLORS.border}`, borderRadius: 4, padding: "4px 10px", gap: 6 }}>
          <span style={{ color: COLORS.textMuted, fontSize: 13 }}>🔍</span>
          <input type="text" placeholder="Search" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ background: "transparent", border: "none", outline: "none", color: COLORS.textBright, fontSize: 12, flex: 1 }} />
        </div>
      </div>

      {/* Pair tabs */}
      <div style={{ display: "flex", borderBottom: `1px solid ${COLORS.border}`, padding: "0 6px" }}>
        {(["fav", "usdt"] as const).map(tab => (
          <button key={tab} onClick={() => setPairTab(tab)} style={{ flex: 1, padding: "6px 0", background: "transparent", border: "none", cursor: "pointer", fontSize: 11, color: pairTab === tab ? COLORS.amber : COLORS.text, borderBottom: pairTab === tab ? `2px solid ${COLORS.amber}` : "2px solid transparent", fontWeight: pairTab === tab ? 700 : 400 }}>
            {tab === "fav" ? "★" : tab.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Pair list header */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", padding: "4px 10px", fontSize: 10, color: COLORS.textMuted, borderBottom: `1px solid ${COLORS.border}` }}>
        <button onClick={() => setSortBy("name")} style={{ background: "none", border: "none", color: COLORS.textMuted, cursor: "pointer", textAlign: "left", fontSize: 10 }}>Pair {sortBy === "name" ? "↕" : ""}</button>
        <button onClick={() => setSortBy("change")} style={{ background: "none", border: "none", color: COLORS.textMuted, cursor: "pointer", textAlign: "right", fontSize: 10 }}>Last Price {sortBy === "change" ? "↕" : ""}</button>
        <button onClick={() => setSortBy("volume")} style={{ background: "none", border: "none", color: COLORS.textMuted, cursor: "pointer", textAlign: "right", fontSize: 10 }}>24h Chg% {sortBy === "volume" ? "↕" : ""}</button>
      </div>

      {/* Pair list */}
      <div style={{ flex: 1, overflowY: "auto", maxHeight: 336 }}>
        {displayedPairs.map(pair => {
          const mover = marketMovers.find(m => m.pair === pair);
          const chg = mover?.change || 0;
          const symbolLabel = pair.split("/")[0];
          return (
            <div key={pair} onClick={() => switchSymbol(pair)} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", padding: "5px 10px", minHeight: 46, cursor: "pointer", background: pair === symbol ? COLORS.bgHover : "transparent", borderLeft: pair === symbol ? `2px solid ${COLORS.amber}` : "2px solid transparent" }}
              onMouseEnter={e => { if (pair !== symbol) (e.currentTarget as HTMLElement).style.background = COLORS.bgAlt; }}
              onMouseLeave={e => { if (pair !== symbol) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 28, height: 28, borderRadius: 999, background: COLORS.bgAlt, display: "grid", placeItems: "center", overflow: "hidden", flexShrink: 0 }}>
                  <CoinIcon symbol={symbolLabel} size={20} images={coinImages} />
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: pair === symbol ? 700 : 500, color: COLORS.textBright }}>
                    {symbolLabel}/<span style={{ color: COLORS.textMuted, fontSize: 10 }}>{pair.split("/")[1]}</span>
                  </div>
                  {mover && <div style={{ fontSize: 9, color: COLORS.textMuted }}>{formatVol(mover.volume)}</div>}
                </div>
              </div>
              <div style={{ textAlign: "right", fontFamily: "monospace", fontSize: 11, color: COLORS.textBright }}>
                {pair === symbol ? formatPrice(lastPrice) : formatPrice(allTickerPrices[pair.replace("/", "")] || 0)}
              </div>
              <div style={{ textAlign: "right" }}>
                <span style={{ fontSize: 11, fontFamily: "monospace", background: chg >= 0 ? COLORS.greenDim : COLORS.redDim, color: chg >= 0 ? COLORS.green : COLORS.red, padding: "1px 5px", borderRadius: 3 }}>{chg >= 0 ? "+" : ""}{chg.toFixed(2)}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const marketTradesPanel = (showMovers: boolean) => (
    <div style={{ borderTop: `1px solid ${COLORS.border}`, background: COLORS.bgPanel }}>
      <div style={{ display: "flex", borderBottom: `1px solid ${COLORS.border}` }}>
        {(["market", "mytrades"] as const).map(tab => (
          <button key={tab} onClick={() => setRightTab(tab)} style={{ flex: 1, padding: "6px 0", background: "transparent", border: "none", cursor: "pointer", fontSize: 12, color: rightTab === tab ? COLORS.textBright : COLORS.text, borderBottom: rightTab === tab ? `2px solid ${COLORS.amber}` : "2px solid transparent", fontWeight: rightTab === tab ? 600 : 400 }}>
            {tab === "market" ? "Market Trades" : "My Trades"}
          </button>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", padding: "4px 10px", fontSize: 10, color: COLORS.textMuted }}>
        <span>Price ({quoteSymbol})</span><span style={{ textAlign: "right" }}>Amount ({baseSymbol})</span><span style={{ textAlign: "right" }}>Time</span>
      </div>
      <div style={{ maxHeight: 180, overflow: "auto" }}>
        {(rightTab === "market" ? trades : tradeHistory).slice(0, 15).map((t, i) => {
          const side = "side" in t ? t.side : (t as TradeHistoryItem).side;
          const price = t.price;
          const amount = "amount" in t ? (t as Trade).amount : (t as TradeHistoryItem).quantity;
          const time = t.time;
          return (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", padding: "2px 10px", fontSize: 11, fontFamily: "monospace" }}>
              <span style={{ color: side === "buy" ? COLORS.green : COLORS.red }}>{price.toFixed(2)}</span>
              <span style={{ textAlign: "right", color: COLORS.textBright }}>{amount.toFixed(4)}</span>
              <span style={{ textAlign: "right", color: COLORS.textMuted }}>{formatTime(time)}</span>
            </div>
          );
        })}
      </div>
      {showMovers && topMoversSection()}
    </div>
  );

  const marketPanel = () => (
    <aside className="trading-right trading-market-panel" style={{ width: isCompactLayout ? 240 : "100%", background: COLORS.bgPanel, borderLeft: isCompactLayout ? `1px solid ${COLORS.border}` : "none", borderTop: isDesktopLayout ? `1px solid ${COLORS.border}` : "none", display: "flex", flexDirection: "column", flexShrink: 0, overflow: "hidden" }}>
      {marketTradesPanel(true)}
    </aside>
  );

  const fetchSymbols = async () => {
  // A comprehensive list of your system altcoins to ensure your layout 
  // never collapses into a pure Bitcoin clone if a network drift hits.
  const EMERGENCY_FALLBACK_PAIRS = [
    "BTC/USDT", "ETH/USDT", "BNB/USDT", "ADA/USDT", "SOL/USDT", "XRP/USDT",
    "DOT/USDT", "AVAX/USDT", "LINK/USDT", "1INCH/USDT", "AAVE/USDT", "ALGO/USDT",
    "ANKR/USDT", "ARDR/USDT", "ARPA/USDT", "ASR/USDT", "ATM/USDT", "ATOM/USDT"
  ];

  // Helper function to safely extract realistic High/Low points based on asset type
  const getDynamicHighLow = (pair: string) => {
    const isBtc = pair.startsWith("BTC/");
    const baseHigh = isBtc ? 76000 : 100; // Realistic placeholder seed range
    const baseLow  = isBtc ? 74000 : 90;
    return {
      high: +(baseHigh + Math.random() * (isBtc ? 1000 : 10)).toFixed(2),
      low:  +(baseLow - Math.random() * (isBtc ? 1000 : 10)).toFixed(2)
    };
  };

  try {
    const api = await getAxios();
    const res = await api.get("/api/market/symbols");
    
    // Fall back to our extensive array if the backend array returns empty or corrupted
    const sourceSymbols = (res.data?.symbols && res.data.symbols.length > 0) 
      ? res.data.symbols 
      : EMERGENCY_FALLBACK_PAIRS;

    const available = generateSyntheticPairs(sourceSymbols).filter(pair => pair.endsWith("/USDT"));
    setSymbols(available); 
    setFilteredSymbols(available);
    
    setMarketMovers(available.map((pair: string) => {
      const bounds = getDynamicHighLow(pair);
      return {
        pair,
        change: +((Math.random() - 0.5) * 12).toFixed(2),
        volume: +(Math.random() * 150 + 10).toFixed(2),
        high: bounds.high,
        low: bounds.low
      };
    }));

  } catch (error) {
    console.warn("⚠️ Market API drift detected. Injecting robust UI recovery symbols:", error);
    
    const available = generateSyntheticPairs(EMERGENCY_FALLBACK_PAIRS).filter(pair => pair.endsWith("/USDT"));
    setSymbols(available); 
    setFilteredSymbols(available);
    
    setMarketMovers(available.slice(0, 30).map((pair: string) => {
      const bounds = getDynamicHighLow(pair);
      return {
        pair,
        change: +((Math.random() - 0.5) * 12).toFixed(2),
        volume: +(Math.random() * 150 + 10).toFixed(2),
        high: bounds.high,
        low: bounds.low
      };
    }));
  }
};

  const updateOrderPrice = (value: string) => {
    if (orderType === "market") return;
    setPriceInput(value);
    const price = Number(value);
    if (!value || isNaN(price) || price <= 0) return;
    if (buyAmountInput) {
      setBuyTotalInput((Number(buyAmountInput) * price).toFixed(2));
    }
    if (sellAmountInput) {
      setSellTotalInput((Number(sellAmountInput) * price).toFixed(2));
    }
  };

  const updateBuyAmount = (value: string) => {
    setBuyAmountInput(value);
    const amount = Number(value);
    const price = buyPrice;
    if (!value || isNaN(amount) || !Number.isFinite(price) || price <= 0) {
      setBuyTotalInput("");
      return;
    }
    setBuyTotalInput((amount * price).toFixed(2));
    setBuySliderPct(0);
  };

  const updateBuyTotal = (value: string) => {
    setBuyTotalInput(value);
    const total = Number(value);
    const price = buyPrice;
    if (!value || isNaN(total) || !Number.isFinite(price) || price <= 0) {
      setBuyAmountInput("");
      return;
    }
    setBuyAmountInput((total / price).toFixed(8));
    setBuySliderPct(0);
  };

  const updateSellAmount = (value: string) => {
    setSellAmountInput(value);
    const amount = Number(value);
    const price = sellPrice;
    if (!value || isNaN(amount) || !Number.isFinite(price) || price <= 0) {
      setSellTotalInput("");
      return;
    }
    setSellTotalInput((amount * price).toFixed(2));
    setSellSliderPct(0);
  };

  const updateSellTotal = (value: string) => {
    setSellTotalInput(value);
    const total = Number(value);
    const price = sellPrice;
    if (!value || isNaN(total) || !Number.isFinite(price) || price <= 0) {
      setSellAmountInput("");
      return;
    }
    setSellAmountInput((total / price).toFixed(8));
    setSellSliderPct(0);
  };

  const applyBuyPct = (p: number) => {
    setBuySliderPct(p);
    const price = orderType === "market" ? marketPrice : getEffectivePrice(priceInput, lastPrice);
    const total = availableBalance * (p / 100);
    if (!price) {
      setBuyAmountInput("");
      setBuyTotalInput("0.00");
      return;
    }
    const amount = total / price;
    setBuyAmountInput(amount.toFixed(8));
    setBuyTotalInput(total.toFixed(2));
  };

  const applySellPct = (p: number) => {
    setSellSliderPct(p);
    const amount = availableBTC * (p / 100);
    const price = orderType === "market" ? marketPrice : getEffectivePrice(priceInput, lastPrice);
    setSellAmountInput(amount.toFixed(8));
    if (!price) { setSellTotalInput("0.00"); return; }
    setSellTotalInput((amount * price).toFixed(2));
  };

  const effectiveBuyPrice = Number.isFinite(buyPrice) && buyPrice > 0 ? buyPrice : lastPrice;
  const effectiveBuyPriceForMax = (Number.isFinite(effectiveBuyPrice) && effectiveBuyPrice > 0)
    ? effectiveBuyPrice
    : (Number.isFinite(marketState?.lastPrice ?? 0) && (marketState?.lastPrice ?? 0) > 0 ? (marketState?.lastPrice ?? 0) : 0);
  const estimatedMaxBuyBTC = availableBalance > 0 && effectiveBuyPriceForMax > 0
    ? (availableBalance / effectiveBuyPriceForMax).toFixed(8)
    : "0.00000000";
  const estimatedMaxSellUSDT = availableBTC > 0 && Number.isFinite(sellPrice) && sellPrice > 0
    ? (availableBTC * sellPrice).toFixed(2)
    : "0.00";
  const modeBalanceSummary = useMemo(() => {
    const usableMargin = availableBalance;
    const effPrice = orderType === "market" ? marketPrice : getEffectivePrice(priceInput, lastPrice);
    const pairNotional = effPrice ? ((Number(buyAmountInput) || 0) * effPrice).toFixed(2) : "0.00";
    const formattedTotalEquity = `$${totalEquity.toFixed(2)}`;
    if (activeTab === "cross") return [
      { label: "Available USDT", value: `$${availableBalance.toFixed(2)}` },
      { label: "Locked USDT", value: `$${lockedUSDT.toFixed(2)}` },
      { label: "Total Equity", value: formattedTotalEquity },
      { label: "Total Portfolio", value: `$${portfolioTotal.toFixed(2)}` },
    ];
    if (activeTab === "isolated") return [
      { label: "Available USDT", value: `$${availableBalance.toFixed(2)}` },
      { label: "Estimated Max BTC", value: `${estimatedMaxBuyBTC} BTC` },
      { label: "Total Equity", value: formattedTotalEquity },
      { label: "Pair Exposure", value: `$${pairNotional}` },
    ];
    return [
      { label: "Available USDT", value: `$${availableBalance.toFixed(2)}` },
      { label: "Locked USDT", value: `$${lockedUSDT.toFixed(2)}` },
      { label: "Total Equity", value: formattedTotalEquity },
      { label: "Total Portfolio", value: `$${portfolioTotal.toFixed(2)}` },
    ];
  }, [activeTab, availableBalance, pendingLocked, buyAmountInput, buyPrice, lastPrice, portfolioTotal, totalEquity, lockedUSDT]);

  const confirmOrderDetails = useMemo(() => [
    { label: "Pair", value: symbol },
    { label: "Order Type", value: orderType.charAt(0).toUpperCase() + orderType.slice(1) },
    { label: "Side", value: pendingOrderSide === "buy" ? "Buy / Long" : "Sell / Short", color: pendingOrderSide === "buy" ? COLORS.green : COLORS.red },
    { label: "Price", value: orderType === "market" ? `~${formatPrice(lastPrice)} USDT (Market)` : `${formatPrice(Number(priceInput))} USDT` },
    { label: "Amount", value: `${pendingOrderSide === "buy" ? buyAmountInput || "0" : sellAmountInput || "0"} BTC` },
    { label: "Total", value: `~$${pendingOrderSide === "buy" ? (buyTotal || 0).toFixed(2) : (sellTotal || 0).toFixed(2)} USDT` },
    { label: "Est. Fee (0.1%)", value: `~$${pendingOrderSide === "buy" ? buyFee.toFixed(4) : sellFee.toFixed(4)} USDT`, color: COLORS.amber },
  ], [symbol, orderType, pendingOrderSide, lastPrice, priceInput, buyAmountInput, sellAmountInput, buyTotal, sellTotal, buyFee, sellFee]);

  const initChartCandles = useCallback((nextCandles: Candle[]) => {
    initializeCandles(nextCandles);
    setCandles(nextCandles);
  }, []);

  const fetchMarketData = useCallback(async (sym: string, tf: string) => {
    // Fetch chart/candle data for the symbol and timeframe
    // Uses fallback synthetic data if backend endpoint unavailable
    try {
      const api = await getAxios();
      const encodedPair = encodeURIComponent(sym);
      const res = await api.get(`/api/market/candles/${encodedPair}?timeframe=${tf}`);
      if (res.data?.candles) {
        initChartCandles(res.data.candles);
      } else if (Array.isArray(res.data)) {
        initChartCandles(res.data);
      }
    } catch (err) {
      // Backend endpoint unavailable - use fallback synthetic candles
      initChartCandles(createFallbackCandles(300, 80721, sym, tf));
    }
  }, [initChartCandles]);

  useEffect(() => {
    resetCandles();
    setCandles([]);
    if (!symbol) return;
    fetchMarketData(symbol, timeframe);
  }, [symbol, timeframe, fetchMarketData]);
  useEffect(() => {
    const q = searchQuery.toLowerCase();
    const filtered = symbols.filter(s => s.toLowerCase().includes(q)).sort((a, b) => {
      if (sortBy === "change") return Math.abs(marketMovers.find(m => m.pair === b)?.change || 0) - Math.abs(marketMovers.find(m => m.pair === a)?.change || 0);
      if (sortBy === "volume") return (marketMovers.find(m => m.pair === b)?.volume || 0) - (marketMovers.find(m => m.pair === a)?.volume || 0);
      return a.localeCompare(b);
    });
    setFilteredSymbols(filtered);
  }, [searchQuery, symbols, sortBy, marketMovers]);

  useEffect(() => { fetchSymbols(); }, []);

  useEffect(() => {
    fetch("/api/coin-images")
      .then(r => r.json())
      .then((map: Record<string, string>) => {
        if (map && Object.keys(map).length) {
          setCoinImages(prev => ({ ...prev, ...map }));
        }
      })
      .catch(() => {});
  }, []);

  const applyDisplayPriceUpdate = useCallback((rawPrice: number) => {
    const state = priceMovementRef.current;
    let direction = state.direction;
    if (direction === "up") {
      if (state.streak >= state.targetGreenCount) {
        direction = "down";
        state.direction = "down";
        state.streak = 1;
      } else {
        state.streak += 1;
      }
    } else {
      direction = "up";
      state.direction = "up";
      state.targetGreenCount = 2 + Math.floor(Math.random() * 2);
      state.streak = 1;
    }

    const magnitude = direction === "up"
      ? 0.0003 + Math.random() * 0.00045
      : 0.00018 + Math.random() * 0.00032;
    const nextPrice = direction === "up"
      ? rawPrice * (1 + magnitude)
      : rawPrice * (1 - magnitude);

    setDisplayPrice(Number(nextPrice.toFixed(2)));
    setPriceUpdateDirection(direction);
  }, []);

  useEffect(() => {
    if (!lastPrice) return;
    const interval = window.setInterval(() => applyDisplayPriceUpdate(lastPrice), 1000);
    return () => window.clearInterval(interval);
  }, [lastPrice, applyDisplayPriceUpdate]);

  const getSideConfig = (side: "buy" | "sell") => {
    const amount = side === "buy" ? Number(buyAmountInput || 0) : Number(sellAmountInput || 0);
    const priceVal = orderType === "market"
      ? (isValidPrice(lastPrice) ? lastPrice : NaN)
      : (Number.isFinite(Number(priceInput)) && Number(priceInput) > 0 ? Number(priceInput) : NaN);
    const total = Number((side === "buy" ? buyTotalInput : sellTotalInput)) || (amount > 0 && Number.isFinite(priceVal) ? amount * priceVal : 0);
    const stopLossValue = side === "buy" ? (buyStopLoss ? Number(buyStopLoss) : undefined) : (sellStopLoss ? Number(sellStopLoss) : undefined);
    const takeProfitValue = side === "buy" ? (buyTakeProfit ? Number(buyTakeProfit) : undefined) : (sellTakeProfit ? Number(sellTakeProfit) : undefined);
    return { amount, price: priceVal, total, stopLoss: stopLossValue, takeProfit: takeProfitValue };
  };

  const openOrderConfirmation = (side: "buy" | "sell") => {
    const error = side === "buy" ? buyError : sellError;
    if (error) {
      setOrderError(error);
      return;
    }
    setOrderError("");
    setPendingOrderSide(side);
    setConfirmModalOpen(true);
  };

  const executeOrder = async (side: "buy" | "sell") => {
    if (isPlacingOrder) return;
    const { amount, price, total, stopLoss, takeProfit } = getSideConfig(side);
    if (!amount || !Number.isFinite(price) || price <= 0 || amount <= 0 || total < MIN_ORDER_TOTAL) {
      setOrderError("Unable to place order. Check amount and price.");
      return;
    }

    // Prevent buy when user available balance is insufficient (client-side guard)
    if (side === "buy") {
      if (total > availableBalance) {
        setOrderError("Insufficient USDT balance");
        return;
      }
    }
    setIsPlacingOrder(true);
    setConfirmModalOpen(false);
    // place order on backend and refresh account data
    try {
      const api = await getAxios();
      const payload: Record<string, unknown> = {
        symbol,
        pair: symbol,
        side,
        type: orderType,
        amount,
        slippageTolerance: slippageTol ? 0.01 : 0,
      };
      // Only send price for non-market orders
      if (orderType !== "market") {
        payload.price = price;
      }
      if (stopLoss) payload.stopLoss = stopLoss;
      if (takeProfit) payload.takeProfit = takeProfit;
      const resp = await api.post("/api/trade/place", payload);
      showToast(`${side === "buy" ? "Buy" : "Sell"} order placed successfully!`, "success");
      // refresh account info and open orders from backend
      await refreshAccountData();
    } catch (err: any) {
      console.error(err);
      const serverData = err?.response?.data;
      const msg = serverData?.error || serverData?.message || err?.message || "Order failed. Please try again.";
      showToast(msg, "error");
      // failed to place: refresh to ensure UI matches backend
      await refreshAccountData();
    }
    if (side === "buy") {
      setBuyAmountInput("");
      setBuyTotalInput("");
      setBuyStopLoss("");
      setBuyTakeProfit("");
      setBuySliderPct(0);
    } else {
      setSellAmountInput("");
      setSellTotalInput("");
      setSellStopLoss("");
      setSellTakeProfit("");
      setSellSliderPct(0);
    }
    setOrderError("");
    setIsPlacingOrder(false);
  };
  const cancelOrder = async (id: string) => {
    try {
      const api = await getAxios();
      await api.post("/api/trade/cancel", { orderId: id });
      setUserOrders(prev => prev.filter(o => o.id !== id));
      showToast("Order cancelled successfully.", "success");
      await refreshAccountData();
    } catch (err) {
      console.error("Cancel failed", err);
      showToast("Failed to cancel order. Please try again.", "error");
      // Do not remove the order from UI if the backend cancel fails.
    }
  };
  const isPriceUp = priceUpdateDirection === "up";
  const is24hPositive = change24h >= 0;

  // Pair tab filter
  const pairFilter = pairTab === "fav" ? [] : "USDT";
  const displayedPairs = filteredSymbols.filter(p => pairTab === "fav" || p.endsWith("/" + pairFilter)).slice(0, 50);
  
  const headerStats = useMemo(() => [
    { label: "24h Chg", value: `${changePct.toFixed(2)}%`, color: changePct >= 0 ? COLORS.green : COLORS.red },
    { label: "24h High", value: formatPrice(high24h), color: COLORS.textBright },
    { label: "24h Low",  value: formatPrice(low24h),  color: COLORS.textBright },
    { label: "24h Vol(BTC)",  value: formatFullAmount(vol24h),   color: COLORS.textBright },
    { label: "24h Vol(USDT)", value: formatFullAmount(vol24hUSDT), color: COLORS.textBright },
    { label: "Networks", value: "BTC (5)", color: COLORS.textBright },
  ], [changePct, high24h, low24h, vol24h, vol24hUSDT, isPriceUp]);

  return (
    <div ref={tradingPageRef} className="trading-page trading-dashboard" style={{ display: "flex", flexDirection: "column", height: "auto", background: COLORS.bg, color: COLORS.textBright, fontFamily: "'IBM Plex Sans', 'Helvetica Neue', sans-serif", fontSize: 13, overflowY: "auto", overflowX: "hidden", minHeight: "100dvh", scrollBehavior: "smooth", WebkitOverflowScrolling: "touch", touchAction: "pan-y", overscrollBehaviorY: "auto" }}>
      <div className="trading-rotate-prompt" role="status" aria-live="polite">
        <div className="trading-rotate-prompt__panel">
          <div className="trading-rotate-prompt__icon">↻</div>
          <div>
            <div className="trading-rotate-prompt__title">Rotate Device</div>
            <div className="trading-rotate-prompt__text">Landscape gives the trading chart and order entry room to breathe.</div>
          </div>
        </div>
      </div>

      {/* ── TOP HEADER BAR (Binance style) ── */}
      <div className="trading-header trading-dashboard__header" style={{ display: "flex", alignItems: "center", height: 52, borderBottom: `1px solid ${COLORS.border}`, padding: "0 16px", gap: 24, background: COLORS.bgPanel, flexShrink: 0, overflow: "hidden" }}>
        {/* Symbol + price */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
          <div style={{ width: 28, height: 28, background: "transparent", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
            <CoinIcon symbol={symbol.split("/")[0]} size={20} images={coinImages} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, letterSpacing: 0.3 }}>{symbol}</div>
            <div style={{ fontSize: 10, color: isPriceUp ? COLORS.green : COLORS.red }}>{symbol.split("/")[0]} Price {isPriceUp ? "↑" : "↓"}</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 2, marginLeft: 8 }}>
            <div style={{ fontWeight: 700, fontSize: 22, color: isPriceUp ? COLORS.green : COLORS.red }}>{isValidPrice(displayPrice) ? formatPrice(displayPrice) : isValidPrice(lastPrice) ? formatPrice(lastPrice) : "Market price unavailable"}</div>
            <div style={{ fontSize: 10, color: COLORS.textMuted }}>{formatMsTime(lastPriceUpdate)}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginLeft: 12, flexShrink: 0 }}>
            {!isDesktopLayout && (
            <button className="trading-pairs-toggle" onClick={() => setShowPairSelector(p => !p)} style={{ padding: "3px 8px", height: 26, background: showPairSelector ? COLORS.amber : "transparent", border: `1px solid ${showPairSelector ? COLORS.amber : COLORS.border}`, borderRadius: 4, color: showPairSelector ? "#000" : COLORS.text, cursor: "pointer", fontSize: 10, fontWeight: 600, display: "flex", alignItems: "center", gap: 3 }}>
              {showPairSelector ? "▲" : "☰"} <span style={{ fontSize: 9, opacity: 0.7 }}>Pairs</span>
            </button>
            )}
            <button onClick={() => setShowWallet(p => !p)} style={{ padding: "3px 8px", height: 26, background: showWallet ? COLORS.amber : "transparent", border: `1px solid ${showWallet ? COLORS.amber : COLORS.border}`, borderRadius: 4, color: showWallet ? "#000" : COLORS.text, cursor: "pointer", fontSize: 10, fontWeight: 600, display: "flex", alignItems: "center", gap: 3 }}>
              <Wallet size={12} /> Wallet {showWallet ? "▲" : "▼"}
            </button>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: liveStatus === "live" ? COLORS.green : COLORS.red, display: "inline-block", boxShadow: liveStatus === "live" ? `0 0 6px ${COLORS.green}` : "none" }} />
            <span style={{ fontSize: 11, color: liveStatus === "live" ? COLORS.green : COLORS.red }}>{liveStatus.toUpperCase()}</span>
          </div>
        </div>
        {/* Stats bar */}
        <div style={{ display: "flex", gap: 24, alignItems: "center", flex: 1, overflow: "hidden" }}>
          {headerStats.map(stat => (
            <div key={stat.label} style={{ flexShrink: 0 }}>
              <div style={{ fontSize: 10, color: COLORS.text, marginBottom: 2 }}>{stat.label}</div>
              <div style={{ fontSize: 12, color: stat.color, fontWeight: stat.color !== COLORS.textBright ? 700 : 400, fontFamily: "monospace" }}>{stat.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 3-PANEL BODY (desktop: flex row; compact: normal flow) ── */}
      <div style={{ display: isDesktopLayout ? "flex" : "block", flex: isDesktopLayout ? 1 : undefined, overflow: isDesktopLayout ? "hidden" : undefined, minHeight: isDesktopLayout ? 0 : undefined }}>

        {/* ── LEFT PANEL: Order Book + Market Trades + Top Movers (desktop only) ── */}
        {isDesktopLayout && isChartView && (
          <aside style={{ width: 'var(--left-width, 340px)', background: COLORS.bgPanel, borderRight: `1px solid ${COLORS.border}`, display: "flex", flexDirection: "column", flexShrink: 0, overflow: "hidden" }}>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0, overflow: "hidden" }}>
              <div style={{ padding: "8px 10px", borderBottom: `1px solid ${COLORS.border}`, display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                <span style={{ fontWeight: 700, fontSize: 12, color: COLORS.textBright }}>Order Book</span>
                <span style={{ fontSize: 10, color: COLORS.textMuted }}>{symbol}</span>
              </div>
              <div style={{ flex: 1, overflow: "hidden", minHeight: 0 }}>
                {orderBookPanel("side")}
              </div>
            </div>
          </aside>
        )}

        {/* ── CENTER COLUMN (scrollable on desktop) ── */}
        <div style={{ flex: isDesktopLayout ? 1 : undefined, overflowY: isDesktopLayout ? "auto" : undefined, display: "flex", flexDirection: "column", minHeight: isDesktopLayout ? 0 : undefined }}>

      {/* ── COLLAPSIBLE PAIRS SELECTOR (mobile/tablet) ── */}
      <div className="trading-pairs-dropdown" style={{ maxHeight: showPairSelector && isCompactLayout ? 400 : 0, overflow: "hidden", transition: "max-height 0.35s ease", borderBottom: showPairSelector && isCompactLayout ? `1px solid ${COLORS.border}` : "none", background: COLORS.bgPanel }}>
        {showPairSelector && isCompactLayout && marketPairsPanel()}
      </div>

      {/* ── COLLAPSIBLE WALLET PANEL ── */}
      <div style={{ maxHeight: showWallet ? 600 : 0, overflow: "hidden", transition: "max-height 0.35s ease", borderBottom: showWallet ? `1px solid ${COLORS.border}` : "1px solid transparent" }}>
        <div style={{ padding: "12px 16px", background: COLORS.bg }}>
          <TradingBalanceCard />
        </div>
      </div>

      {/* ── MAIN VIEW TABS (between left & right panels) ── */}
      <div className="trading-main-tabs" style={{ display: "flex", alignItems: "center", height: 38, borderBottom: `1px solid ${COLORS.border}`, background: COLORS.bgPanel, padding: "0 12px", gap: 0, flexShrink: 0 }}>
        {([
          { id: "chart", label: "Chart" },
          { id: "trades", label: "Trades" },
          { id: "info", label: "Info" },
          { id: "tradingdata", label: "Trading Data" },
        ] as const).map(tab => (
          <button key={tab.id} onClick={() => setActiveViewTab(tab.id)} style={{ padding: "0 16px", height: "100%", background: "transparent", border: "none", cursor: "pointer", fontSize: 13, color: activeViewTab === tab.id ? COLORS.textBright : COLORS.text, borderBottom: activeViewTab === tab.id ? `2px solid ${COLORS.amber}` : "2px solid transparent", fontWeight: activeViewTab === tab.id ? 600 : 400 }}>{tab.label}</button>
        ))}
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10, padding: "8px 14px", borderRadius: 10, background: COLORS.bgAlt, border: `1px solid ${COLORS.border}` }}>
          <img src={logo} alt="SwanCore logo" style={{ width: 32, height: 32, borderRadius: 4, objectFit: "contain", imageRendering: "auto", background: COLORS.bg, padding: 2 }} />
          <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.1 }}>
            <span style={{ color: COLORS.amber, fontSize: 14, fontWeight: 800 }}>SwanCore</span>
            <span style={{ color: COLORS.textMuted, fontSize: 10 }}>Simplified Trading</span>
          </div>
        </div>
      </div>

      {/* ── TIMEFRAME TOOLBAR (between left & right panels) ── */}
      {isChartView && (
      <div style={{ display: "flex", alignItems: "center", height: 34, borderBottom: `1px solid ${COLORS.border}`, background: COLORS.bgPanel, padding: "0 10px", gap: 2, flexShrink: 0, flexWrap: "nowrap", overflow: "hidden" }}>
        {/* Pinned Timeframes */}
        <div style={{ display: "flex", gap: 1 }}>
          {["1m", "15m", "1h", "4h", "1d", "1w"].map(tf => (
            <button key={tf} onClick={() => setTimeframe(normalizeTimeframe(tf))} style={{ padding: "3px 6px", background: timeframe === tf ? COLORS.bgHover : "transparent", border: timeframe === tf ? `1px solid ${COLORS.border}` : "1px solid transparent", borderRadius: 3, color: timeframe === tf ? COLORS.amber : COLORS.text, cursor: "pointer", fontSize: 11, fontWeight: timeframe === tf ? 700 : 400, minWidth: "32px", textAlign: "center" }}>{tf}</button>
          ))}
        </div>
        {/* Time dropdown */}
        <div className="time-dropdown" style={{ position: "relative", marginLeft: 4, zIndex: 1000 }}>
          <button onClick={() => setShowTimeDropdown(!showTimeDropdown)} style={{ padding: "3px 6px", background: "transparent", border: `1px solid ${COLORS.border}`, borderRadius: 3, color: COLORS.text, cursor: "pointer", fontSize: 11, display: "flex", alignItems: "center", gap: 2, zIndex: 1001, position: "relative" }}>
            <span>Time</span>
            <span style={{ fontSize: 8 }}>{showTimeDropdown ? "▲" : "▼"}</span>
          </button>
          {showTimeDropdown && (
            <div style={{ position: "absolute", top: "100%", left: 0, background: COLORS.bgPanel, border: `1px solid ${COLORS.border}`, borderRadius: 4, zIndex: 1002, minWidth: "120px", maxHeight: "200px", overflow: "auto" }}>
              <div style={{ padding: "4px 8px", fontSize: 10, color: COLORS.textMuted, fontWeight: 700, borderBottom: `1px solid ${COLORS.borderLight}` }}>Available</div>
              {["3m", "5m", "30m", "2h", "6h", "8h", "12h"].map(tf => (
                <button key={tf} onClick={() => { setTimeframe(normalizeTimeframe(tf)); setShowTimeDropdown(false); }} style={{ width: "100%", padding: "6px 8px", background: timeframe === tf ? COLORS.bgHover : "transparent", border: "none", color: timeframe === tf ? COLORS.amber : COLORS.text, cursor: "pointer", fontSize: 11, textAlign: "left", display: "block" }}>{tf}</button>
              ))}
            </div>
          )}
        </div>
        <div style={{ width: 1, height: 18, background: COLORS.border, margin: "0 6px" }} />
        {/* Chart types */}
        {([[<ChartCandlestick size={16} />, "candlestick"], [<ChartLine size={16} />, "line"], [<ChartArea size={16} />, "area"], [<BarChart3 size={16} />, "bar"]] as [React.ReactNode, typeof chartType][]).map(([icon, ct]) => (
          <button key={ct} onClick={() => setChartType(ct)} title={ct} style={{ width: 26, height: 26, background: chartType === ct ? COLORS.bgHover : "transparent", border: chartType === ct ? `1px solid ${COLORS.border}` : "1px solid transparent", borderRadius: 3, color: chartType === ct ? COLORS.amber : COLORS.text, cursor: "pointer", fontSize: 14 }}>{icon}</button>
        ))}
        <div style={{ width: 1, height: 18, background: COLORS.border, margin: "0 6px" }} />
        {/* View tabs (Original / Trading View / Depth) */}
        {(["original", "tradingview", "depth"] as const).map(tab => (
          <button key={tab} onClick={() => setActiveChartTab(tab)} style={{ padding: "3px 8px", background: activeChartTab === tab ? COLORS.bgHover : "transparent", border: activeChartTab === tab ? `1px solid ${COLORS.border}` : "1px solid transparent", borderRadius: 3, color: activeChartTab === tab ? COLORS.amber : COLORS.text, cursor: "pointer", fontSize: 11, fontWeight: activeChartTab === tab ? 700 : 400 }}>
            {tab === "original" ? "Original" : tab === "tradingview" ? "Trading View" : "Depth"}
          </button>
        ))}
        <div style={{ width: 1, height: 18, background: COLORS.border, margin: "0 6px" }} />
        {/* Indicators */}
        {[
          { k: "SMA", a: showSMA, s: setShowSMA, c: COLORS.sma },
          { k: "EMA", a: showEMA, s: setShowEMA, c: COLORS.ema },
          { k: "BB",  a: showBollinger, s: setShowBollinger, c: COLORS.bbUpper },
          { k: "VWAP",a: showVWAP, s: setShowVWAP, c: COLORS.vwap },
          { k: "RSI", a: showRSI, s: setShowRSI, c: COLORS.amber },
          { k: "MACD",a: showMACD, s: setShowMACD, c: "#8b5cf6" },
        ].map(ind => (
          <button key={ind.k} onClick={() => ind.s((p: boolean) => !p)} style={{ padding: "2px 7px", borderRadius: 3, border: `1px solid ${ind.a ? ind.c : COLORS.border}`, background: ind.a ? `${ind.c}22` : "transparent", color: ind.a ? ind.c : COLORS.text, cursor: "pointer", fontSize: 10, fontWeight: ind.a ? 700 : 400 }}>{ind.k}</button>
        ))}
      </div>
      )}

      {/* ── CHART / CONTENT AREA (between left & right panels) ── */}
      <div className="trading-chart-panel trading-dashboard__chart-panel" style={{ flex: 1, position: "relative", overflow: "hidden", minHeight: 0, background: COLORS.bg }}>
        {/* Left toolbar attached to chart (desktop/tablet/mobile) */}
        {activeViewTab === "chart" && (
          <div className="trading-toolbar trading-dashboard__tools--desktop" style={{ width: toolbarCollapsed ? 36 : 44, background: COLORS.bgPanel, borderRight: `1px solid ${COLORS.border}`, display: "flex", flexDirection: "column", alignItems: "center", padding: "8px 6px", gap: 6, flexShrink: 0, boxSizing: "border-box", overflowY: "auto", WebkitOverflowScrolling: "touch", position: "absolute", left: 0, top: 0, bottom: 0, zIndex: 30, transition: "width 0.18s ease" }}>
            <button title={toolbarCollapsed ? "Expand toolbar" : "Collapse toolbar"} onClick={() => setToolbarCollapsed(prev => !prev)} style={{ width: 32, height: 32, flexShrink: 0, background: "transparent", border: "1px solid transparent", borderRadius: 4, color: COLORS.text, fontSize: 15, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {toolbarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>
            {!toolbarCollapsed && (
              <>
                {DRAWING_TOOLS.map(tool => (
                  <button key={tool.id} title={tool.label} onClick={() => setActiveTool(tool.id)} style={{ width: 32, height: 32, flexShrink: 0, background: activeTool === tool.id ? COLORS.bgHover : "transparent", border: activeTool === tool.id ? `1px solid ${COLORS.border}` : "1px solid transparent", borderRadius: 4, color: activeTool === tool.id ? COLORS.amber : COLORS.text, fontSize: 15, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s" }}
                    onMouseEnter={e => { if (activeTool !== tool.id) (e.currentTarget as HTMLElement).style.background = COLORS.bgHover; }}
                    onMouseLeave={e => { if (activeTool !== tool.id) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                  >{tool.icon}</button>
                ))}
                <div style={{ width: 24, height: 1, background: COLORS.border, margin: "4px 0" }} />
                <input type="color" value={drawingColor} onChange={e => setDrawingColor(e.target.value)} style={{ width: 28, height: 28, border: `2px solid ${COLORS.border}`, borderRadius: 4, cursor: "pointer", padding: 2, background: "none" }} />
                {[1, 2, 3].map(w => (
                  <button key={w} title={`Line ${w}px`} onClick={() => setDrawingWidth(w)} style={{ width: 32, height: 20, flexShrink: 0, background: drawingWidth === w ? COLORS.bgHover : "transparent", border: drawingWidth === w ? `1px solid ${COLORS.amber}` : `1px solid transparent`, borderRadius: 3, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ width: 18, height: w, background: drawingWidth === w ? COLORS.amber : COLORS.text, borderRadius: 1 }} />
                  </button>
                ))}
                <button title="Clear all drawings" onClick={() => setDrawings([])} style={{ width: 32, height: 32, flexShrink: 0, background: "transparent", border: "1px solid transparent", borderRadius: 4, color: COLORS.red, cursor: "pointer", marginTop: 4, display: "grid", placeItems: "center" }}>
                  <Trash size={16} />
                </button>
              </>
            )}
          </div>
        )}

        {activeViewTab === "chart" && (
          <div className="trading-chart-layout" style={{ display: "flex", height: "100%" }}>
            <div className="trading-chart-stage" style={{ flex: 1, position: "relative", minWidth: 0, marginLeft: toolbarCollapsed ? 36 : 44, transition: "margin-left 0.18s ease" }}>
              {activeChartTab === "original" && (
                <CandleChart candles={candles} deepMarketData={deepMarketData} indicators={indicators} chartType={chartType} tf={timeframe} pair={symbol} rsiData={rsiData} macdData={macdData} showRSI={showRSI} showMACD={showMACD} liveStatus={liveStatus} activeTool={activeTool} drawings={drawings} onDrawingsChange={setDrawings} drawingColor={drawingColor} drawingWidth={drawingWidth} lastPrice={lastPrice} entryPriceLine={entryPriceOverlay} />
              )}
              {activeChartTab === "depth" && (
                <div style={{ height: "100%", display: "flex", flexDirection: "column", padding: 16, gap: 16, background: COLORS.bgPanel, minHeight: 360 }}>
                  <DepthChart buyLevels={buyDisplay} sellLevels={sellDisplay} depthLimit={depthLimit} baseSymbol={baseSymbol} quoteSymbol={quoteSymbol} />
                </div>
              )}
              {activeChartTab === "tradingview" && (
                <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: COLORS.text }}>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 48, marginBottom: 12 }}>📈</div>
                    <div>TradingView chart widget</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        {activeViewTab === "trades" && (
          <div style={{ height: "100%", display: "flex", flexDirection: "column", background: COLORS.bgPanel, overflow: "hidden" }}>
            <div style={{ padding: "10px 12px", borderBottom: `1px solid ${COLORS.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontWeight: 700, fontSize: 13, color: COLORS.textBright }}>Trades</span>
              </div>
            </div>
            <div style={{ flex: 1, overflow: "auto", padding: "10px 12px" }}>
              {trades.slice(0, 50).map((t, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8, marginBottom: 8, fontSize: 11, fontFamily: "monospace", color: t.side === "buy" ? COLORS.green : COLORS.red }}>
                  <span>{formatTime(t.time)}</span>
                  <span>{t.side.toUpperCase()}</span>
                  <span style={{ textAlign: "right" }}>{t.price.toFixed(2)}</span>
                  <span style={{ textAlign: "right" }}>{t.amount.toFixed(5)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        {activeViewTab === "info" && (
          <div style={{ height: "100%", display: "flex", flexDirection: "column", background: COLORS.bgPanel, overflow: "hidden" }}>
            <div style={{ padding: "10px 12px", borderBottom: `1px solid ${COLORS.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontWeight: 700, fontSize: 13, color: COLORS.textBright }}>Info</span>
              </div>
            </div>
            <div style={{ flex: 1, overflow: "auto", padding: "10px 12px" }}>
              <div style={{ fontSize: 12, color: COLORS.text }}>
                <p>Bitcoin (BTC) is a decentralized digital currency, without a central bank or single administrator, that can be sent from user to user on the peer-to-peer bitcoin network without the need for intermediaries.</p>
                <p>Market Cap: $1.2T | Volume: $50B | Circulating Supply: 19.7M BTC</p>
              </div>
            </div>
          </div>
        )}
        {activeViewTab === "tradingdata" && (
          <div style={{ height: "100%", display: "flex", flexDirection: "column", background: COLORS.bgPanel, overflow: "hidden" }}>
            <div style={{ padding: "10px 12px", borderBottom: `1px solid ${COLORS.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontWeight: 700, fontSize: 13, color: COLORS.textBright }}>Trading Data</span>
              </div>
            </div>
            <div style={{ flex: 1, overflow: "auto", padding: "10px 12px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {tradeHistory.slice(0, 6).map((t, i) => (
                  <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 8, fontSize: 11 }}>
                    <span>{t.pair}</span>
                    <span style={{ color: t.side === "buy" ? COLORS.green : COLORS.red }}>{t.side}</span>
                    <span style={{ textAlign: "right" }}>${t.price.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── BALANCE STRIP (between left & right panels) ── */}
      {isChartView && (
      <div className="trading-balance-strip" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, padding: "8px 16px", borderBottom: `1px solid ${COLORS.border}`, background: COLORS.bgPanel, flexShrink: 0 }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 10, color: COLORS.text }}>Available USDT</div>
          <div style={{ fontSize: 12, color: COLORS.textBright, fontWeight: 600, fontFamily: "monospace" }}>${availableBalance.toFixed(2)}</div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 10, color: COLORS.text }}>Locked USDT</div>
          <div style={{ fontSize: 12, color: COLORS.textBright, fontWeight: 600, fontFamily: "monospace" }}>${lockedUSDT.toFixed(2)}</div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 10, color: COLORS.text }}>Total Equity</div>
          <div style={{ fontSize: 12, color: COLORS.textBright, fontWeight: 600, fontFamily: "monospace" }}>${totalEquity.toFixed(2)}</div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 10, color: COLORS.text }}>Total Portfolio</div>
          <div style={{ fontSize: 12, color: COLORS.textBright, fontWeight: 600, fontFamily: "monospace" }}>${portfolioTotal.toFixed(2)}</div>
        </div>
      </div>
      )}

      {/* ── ORDER FORM (between left & right panels) ── */}
      {isChartView && (
      <div className="trading-order-form trading-dashboard__ticket" style={{ height: isDesktopLayout ? "auto" : 210, minHeight: isDesktopLayout ? 320 : undefined, borderTop: `1px solid ${COLORS.border}`, background: COLORS.bgPanel, display: "flex", flexShrink: 0, overflow: isDesktopLayout ? "visible" : "hidden" }}>
        {/* Spot/Cross tabs */}
        <div className="trading-order-form__inner" style={{ width: "100%", display: "flex", flexDirection: "column", minHeight: 0 }}>
          {/* Tab row */}
          <div className="trading-order-form__tabs" style={{ display: "flex", alignItems: "center", height: 36, borderBottom: `1px solid ${COLORS.border}`, padding: "0 12px", gap: 0, flexShrink: 0 }}>
            {(["Spot", "Cross", "Isolated", "Grid"] as const).map(t => (
              <button key={t} onClick={() => setActiveTab(t.toLowerCase() as any)} style={{ padding: "0 14px", height: "100%", background: "transparent", border: "none", cursor: "pointer", fontSize: 13, color: activeTab === t.toLowerCase() ? COLORS.textBright : COLORS.text, borderBottom: activeTab === t.toLowerCase() ? `2px solid ${COLORS.amber}` : "2px solid transparent", fontWeight: activeTab === t.toLowerCase() ? 600 : 400 }}>{t}</button>
            ))}
          </div>
          {activeTab === "grid" ? (
            <div style={{ flex: 1, padding: "10px 12px" }}>Grid bot placeholder</div>
          ) : (

            <>
              {!isDesktopLayout && (
                <div style={{ display: "flex", borderBottom: `1px solid ${COLORS.border}`, flexShrink: 0 }}>
                  <button onClick={() => setOrderSide("buy")} style={{ flex: 1, height: 34, background: orderSide === "buy" ? COLORS.green : "transparent", border: "none", borderRadius: 0, color: orderSide === "buy" ? "#000" : COLORS.text, fontWeight: 700, fontSize: 13, cursor: "pointer", borderRight: `1px solid ${COLORS.border}` }}>BUY / Long</button>
                  <button onClick={() => setOrderSide("sell")} style={{ flex: 1, height: 34, background: orderSide === "sell" ? COLORS.red : "transparent", border: "none", borderRadius: 0, color: orderSide === "sell" ? "#fff" : COLORS.text, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>SELL / Short</button>
                </div>
              )}
              <div className="trading-order-form__columns" style={{ display: "flex", flex: 1, overflow: "hidden", minHeight: 0 }}>
            {/* Left: Buy form */}
            <div className="trading-order-form__side trading-order-form__side--buy" style={{ flex: 1, padding: "10px 16px", borderRight: `1px solid ${COLORS.border}`, display: !isDesktopLayout && orderSide !== "buy" ? "none" : "flex", flexDirection: "column", gap: 6 }}>
            {/* Order type tabs */}
            <div style={{ display: "flex", gap: 12, marginBottom: 2 }}>
              {(["Limit", "Market", "Stop Limit", "OCO"] as const).map(t => (
                <button key={t} onClick={() => handleOrderTypeChange(t.toLowerCase().replace(" ", "-") as any)} style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: 12, color: orderType === t.toLowerCase().replace(" ", "-") ? COLORS.textBright : COLORS.text, borderBottom: orderType === t.toLowerCase().replace(" ", "-") ? `2px solid ${COLORS.amber}` : "2px solid transparent", paddingBottom: 2 }}>{t}</button>
              ))}
            </div>
            {/* Price input */}
            <div style={{ display: "flex", alignItems: "center", border: `1px solid ${COLORS.border}`, borderRadius: 4, background: COLORS.bgAlt, padding: "0 10px", height: 34 }}>
              <span style={{ fontSize: 11, color: COLORS.textMuted, width: 40 }}>Price</span>
              <input type="number" value={orderPriceDisplay} onChange={e => updateOrderPrice(e.target.value)} style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: COLORS.textBright, fontSize: 12, fontFamily: "monospace", textAlign: "right" }} placeholder={orderType === "market" ? "Market Price" : "0.00"} disabled={orderType === "market"} />
              <span style={{ fontSize: 11, color: COLORS.textMuted, marginLeft: 8 }}>USDT</span>
            </div>
            {/* Amount input */}
            <div style={{ display: "flex", alignItems: "center", border: `1px solid ${COLORS.border}`, borderRadius: 4, background: COLORS.bgAlt, padding: "0 10px", height: 34 }}>
              <span style={{ fontSize: 11, color: COLORS.textMuted, width: 50 }}>Amount</span>
              <input type="number" value={buyAmountInput} onChange={e => updateBuyAmount(e.target.value)} style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: COLORS.textBright, fontSize: 12, fontFamily: "monospace", textAlign: "right" }} placeholder="0.0000" />
              <span style={{ fontSize: 11, color: COLORS.textMuted, marginLeft: 8 }}>BTC ▾</span>
            </div>
            {/* Slider */}
            <div style={{ padding: "2px 0" }}>
              <input type="range" min={0} max={100} value={buySliderPct} onChange={e => applyBuyPct(Number(e.target.value))} style={{ width: "100%", accentColor: COLORS.green }} />
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                {[0, 25, 50, 75, 100].map(p => (
                  <button key={p} onClick={() => applyBuyPct(p)} style={{ background: "transparent", border: "none", fontSize: 10, color: COLORS.textMuted, cursor: "pointer", padding: 0 }}>{p}%</button>
                ))}
              </div>
            </div>
            {/* Total */}
            <div style={{ display: "flex", alignItems: "center", border: `1px solid ${COLORS.border}`, borderRadius: 4, background: COLORS.bgAlt, padding: "0 10px", height: 32 }}>
              <span style={{ fontSize: 11, color: COLORS.textMuted, width: 40 }}>Total</span>
              <input type="number" value={buyTotalInput} onChange={e => updateBuyTotal(e.target.value)} style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: COLORS.textBright, fontSize: 12, fontFamily: "monospace", textAlign: "right" }} placeholder="Minimum 5 USDT" />
              <span style={{ fontSize: 11, color: COLORS.textMuted, marginLeft: 8 }}>USDT ▾</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, fontSize: 10, color: COLORS.textMuted, padding: "0 2px" }}>
              <div>Available {accountSummary.available.toFixed(2)} USDT</div>
              <div>Reserved {reservedUSDT.toFixed(2)} USDT</div>
              <div style={{ gridColumn: "1 / span 2", color: COLORS.textBright }}>Free to trade {freeToTrade.toFixed(2)} USDT</div>
              <div style={{ gridColumn: "1 / span 2" }}>Minimum Order: 5 USDT</div>
            </div>
            {/* Stop Loss */}
            <div style={{ display: "flex", alignItems: "center", border: `1px solid ${COLORS.border}`, borderRadius: 4, background: COLORS.bgAlt, padding: "0 10px", height: 32 }}>
              <span style={{ fontSize: 11, color: COLORS.textMuted, width: 50 }}>Stop Loss</span>
              <input type="number" value={buyStopLoss} onChange={e => setBuyStopLoss(e.target.value)} style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: COLORS.textBright, fontSize: 12, fontFamily: "monospace", textAlign: "right" }} placeholder="Optional" />
              <span style={{ fontSize: 11, color: COLORS.textMuted, marginLeft: 8 }}>USDT</span>
            </div>
            {/* Take Profit */}
            <div style={{ display: "flex", alignItems: "center", border: `1px solid ${COLORS.border}`, borderRadius: 4, background: COLORS.bgAlt, padding: "0 10px", height: 32 }}>
              <span style={{ fontSize: 11, color: COLORS.textMuted, width: 50 }}>Take Profit</span>
              <input type="number" value={buyTakeProfit} onChange={e => setBuyTakeProfit(e.target.value)} style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: COLORS.textBright, fontSize: 12, fontFamily: "monospace", textAlign: "right" }} placeholder="Optional" />
              <span style={{ fontSize: 11, color: COLORS.textMuted, marginLeft: 8 }}>USDT</span>
            </div>
            {/* Slippage */}
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <input type="checkbox" id="slip-buy" checked={slippageTol} onChange={e => setSlippageTol(e.target.checked)} style={{ accentColor: COLORS.amber, width: 13, height: 13 }} />
              <label htmlFor="slip-buy" style={{ fontSize: 11, color: COLORS.text, cursor: "pointer" }}>Slippage Tolerance (1%)</label>
            </div>
            {/* Market warning */}
            {marketWarning && (
              <div style={{ fontSize: 10, color: COLORS.amber, background: COLORS.blueDim, padding: "4px 8px", borderRadius: 3, border: `1px solid ${COLORS.amber}` }}>{marketWarning}</div>
            )}
            {/* Error message */}
            {buyError && buyAmount > 0 && (
              <div style={{ fontSize: 10, color: COLORS.red, background: COLORS.redDim, padding: "4px 8px", borderRadius: 3, border: `1px solid ${COLORS.red}` }}>{buyError}</div>
            )}
          </div>
          {/* Right: Sell form */}
          <div className="trading-order-form__side trading-order-form__side--sell" style={{ flex: 1, padding: "10px 16px", display: !isDesktopLayout && orderSide !== "sell" ? "none" : "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ display: "flex", gap: 12, marginBottom: 2 }}>
              {(["Limit", "Market", "Stop Limit", "OCO"] as const).map(t => (
                <button key={t} onClick={() => handleOrderTypeChange(t.toLowerCase().replace(" ", "-") as any)} style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: 12, color: orderType === t.toLowerCase().replace(" ", "-") ? COLORS.textBright : COLORS.text, borderBottom: orderType === t.toLowerCase().replace(" ", "-") ? `2px solid ${COLORS.amber}` : "2px solid transparent", paddingBottom: 2 }}>{t}</button>
              ))}
            </div>
            <div style={{ display: "flex", alignItems: "center", border: `1px solid ${COLORS.border}`, borderRadius: 4, background: COLORS.bgAlt, padding: "0 10px", height: 34 }}>
              <span style={{ fontSize: 11, color: COLORS.textMuted, width: 40 }}>Price</span>
              <input type="number" value={orderPriceDisplay} onChange={e => updateOrderPrice(e.target.value)} style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: COLORS.textBright, fontSize: 12, fontFamily: "monospace", textAlign: "right" }} placeholder={orderType === "market" ? "Market Price" : "0.00"} disabled={orderType === "market"} />
              <span style={{ fontSize: 11, color: COLORS.textMuted, marginLeft: 8 }}>USDT</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", border: `1px solid ${COLORS.border}`, borderRadius: 4, background: COLORS.bgAlt, padding: "0 10px", height: 34 }}>
              <span style={{ fontSize: 11, color: COLORS.textMuted, width: 50 }}>Amount</span>
              <input type="number" value={sellAmountInput} onChange={e => updateSellAmount(e.target.value)} style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: COLORS.textBright, fontSize: 12, fontFamily: "monospace", textAlign: "right" }} placeholder="0.0000" />
              <span style={{ fontSize: 11, color: COLORS.textMuted, marginLeft: 8 }}>BTC ▾</span>
            </div>
            <div style={{ padding: "2px 0" }}>
              <input type="range" min={0} max={100} value={sellSliderPct} onChange={e => applySellPct(Number(e.target.value))} style={{ width: "100%", accentColor: COLORS.red }} />
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                {[0, 25, 50, 75, 100].map(p => (
                  <button key={p} onClick={() => applySellPct(p)} style={{ background: "transparent", border: "none", fontSize: 10, color: COLORS.textMuted, cursor: "pointer", padding: 0 }}>{p}%</button>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", border: `1px solid ${COLORS.border}`, borderRadius: 4, background: COLORS.bgAlt, padding: "0 10px", height: 32 }}>
              <span style={{ fontSize: 11, color: COLORS.textMuted, width: 40 }}>Total</span>
              <input type="number" value={sellTotalInput} onChange={e => updateSellTotal(e.target.value)} style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: COLORS.textBright, fontSize: 12, fontFamily: "monospace", textAlign: "right" }} placeholder="0.00" />
              <span style={{ fontSize: 11, color: COLORS.textMuted, marginLeft: 8 }}>USDT ▾</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 10, fontSize: 10, color: COLORS.textMuted, padding: "0 2px" }}>
              <span>Available {availableBTC.toFixed(6)} BTC</span>
              <span>Minimum Order: 5 USDT</span>
            </div>
            {/* Stop Loss */}
            <div style={{ display: "flex", alignItems: "center", border: `1px solid ${COLORS.border}`, borderRadius: 4, background: COLORS.bgAlt, padding: "0 10px", height: 32 }}>
              <span style={{ fontSize: 11, color: COLORS.textMuted, width: 50 }}>Stop Loss</span>
              <input type="number" value={sellStopLoss} onChange={e => setSellStopLoss(e.target.value)} style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: COLORS.textBright, fontSize: 12, fontFamily: "monospace", textAlign: "right" }} placeholder="Optional" />
              <span style={{ fontSize: 11, color: COLORS.textMuted, marginLeft: 8 }}>USDT</span>
            </div>
            {/* Take Profit */}
            <div style={{ display: "flex", alignItems: "center", border: `1px solid ${COLORS.border}`, borderRadius: 4, background: COLORS.bgAlt, padding: "0 10px", height: 32 }}>
              <span style={{ fontSize: 11, color: COLORS.textMuted, width: 50 }}>Take Profit</span>
              <input type="number" value={sellTakeProfit} onChange={e => setSellTakeProfit(e.target.value)} style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: COLORS.textBright, fontSize: 12, fontFamily: "monospace", textAlign: "right" }} placeholder="Optional" />
              <span style={{ fontSize: 11, color: COLORS.textMuted, marginLeft: 8 }}>USDT</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <input type="checkbox" id="slip-sell" checked={slippageTol} onChange={e => setSlippageTol(e.target.checked)} style={{ accentColor: COLORS.amber, width: 13, height: 13 }} />
              <label htmlFor="slip-sell" style={{ fontSize: 11, color: COLORS.text, cursor: "pointer" }}>Slippage Tolerance (1%)</label>
            </div>
            {/* Sell error */}
            {sellError && sellAmount > 0 && (
              <div style={{ fontSize: 10, color: COLORS.red, background: COLORS.redDim, padding: "4px 8px", borderRadius: 3, border: `1px solid ${COLORS.red}` }}>{sellError}</div>
            )}
          </div>
        </div>
        {/* BUY / SELL buttons */}
        <div className="trading-order-actions" style={{ display: "flex", gap: 8, padding: "8px 16px", borderTop: `1px solid ${COLORS.border}`, flexShrink: 0 }}>
          {!isAuthenticated ? (
            <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 8, gridColumn: "1 / -1" }}>
              {isDesktopLayout ? (
                <>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="login-prompt-btn" onClick={() => navigate("/login")} style={{ flex: 1, height: 44, background: COLORS.green, border: "none", borderRadius: 8, color: "#000", fontWeight: 700, fontSize: 15, cursor: "pointer" }}>Log in</button>
                <button className="login-prompt-btn" onClick={() => navigate("/login")} style={{ flex: 1, height: 44, background: COLORS.red, border: "none", borderRadius: 8, color: "#fff", fontWeight: 700, fontSize: 15, cursor: "pointer" }}>Log in</button>
              </div>
              <div style={{ display: "flex", gap: 4 }}>
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
                  <div style={{ fontSize: 10, color: COLORS.textMuted }}>Available USDT</div>
                  <div style={{ fontSize: 12, color: COLORS.textBright, fontFamily: "monospace" }}>$0.00</div>
                  <div style={{ fontSize: 10, color: COLORS.textMuted }}>Estimated Max Buy</div>
                  <div style={{ fontSize: 12, color: COLORS.textBright, fontFamily: "monospace" }}>0.00000000 BTC</div>
                </div>
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
                  <div style={{ fontSize: 10, color: COLORS.textMuted }}>Available BTC</div>
                  <div style={{ fontSize: 12, color: COLORS.textBright, fontFamily: "monospace" }}>0.000000 BTC</div>
                  <div style={{ fontSize: 10, color: COLORS.textMuted }}>Estimated Max Sell</div>
                  <div style={{ fontSize: 12, color: COLORS.textBright, fontFamily: "monospace" }}>$0.00</div>
                </div>
              </div>
                </>
              ) : orderSide === "buy" ? (
                <>
              <button className="login-prompt-btn" onClick={() => navigate("/login")} style={{ width: "100%", height: 44, background: COLORS.green, border: "none", borderRadius: 8, color: "#000", fontWeight: 700, fontSize: 15, cursor: "pointer" }}>Log in</button>
              <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                <span style={{ fontSize: 11, color: COLORS.textMuted, whiteSpace: "nowrap" }}>Available USDT</span>
                <span style={{ fontSize: 12, color: COLORS.textBright, fontFamily: "monospace", whiteSpace: "nowrap" }}>$0.00</span>
                <span style={{ fontSize: 11, color: COLORS.textMuted, whiteSpace: "nowrap" }}>Est. Max Buy</span>
                <span style={{ fontSize: 12, color: COLORS.textBright, fontFamily: "monospace", whiteSpace: "nowrap" }}>0.00000000 BTC</span>
              </div>
                </>
              ) : (
                <>
              <button className="login-prompt-btn" onClick={() => navigate("/login")} style={{ width: "100%", height: 44, background: COLORS.red, border: "none", borderRadius: 8, color: "#fff", fontWeight: 700, fontSize: 15, cursor: "pointer" }}>Log in</button>
              <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                <span style={{ fontSize: 11, color: COLORS.textMuted, whiteSpace: "nowrap" }}>Available BTC</span>
                <span style={{ fontSize: 12, color: COLORS.textBright, fontFamily: "monospace", whiteSpace: "nowrap" }}>0.000000 BTC</span>
                <span style={{ fontSize: 11, color: COLORS.textMuted, whiteSpace: "nowrap" }}>Est. Max Sell</span>
                <span style={{ fontSize: 12, color: COLORS.textBright, fontFamily: "monospace", whiteSpace: "nowrap" }}>$0.00</span>
              </div>
                </>
              )}
            </div>
          ) : (
          <>
          <div className="trading-order-actions__balance" style={{ flex: 1, display: !isDesktopLayout && orderSide !== "buy" ? "none" : "flex", flexDirection: "column", gap: 4 }}>
            <div style={{ fontSize: 10, color: COLORS.textMuted }}>Available USDT</div>
            <div style={{ fontSize: 12, color: COLORS.textBright, fontFamily: "monospace" }}>${availableBalance.toFixed(2)}</div>
            <div style={{ fontSize: 10, color: COLORS.textMuted }}>Estimated Max Buy</div>
            <div style={{ fontSize: 12, color: COLORS.textBright, fontFamily: "monospace" }}>{estimatedMaxBuyBTC} BTC</div>
          </div>
          <button
            className="trading-order-actions__button"
            type="button"
            onClick={() => openOrderConfirmation("buy")}
            disabled={buyDisabled}
            style={{
              flex: 1,
              height: 36,
              background: COLORS.green,
              border: "none",
              borderRadius: 4,
              color: "#000",
              fontWeight: 700,
              fontSize: 13,
              cursor: buyDisabled ? "not-allowed" : "pointer",
              opacity: buyDisabled ? 0.5 : 1,
              display: !isDesktopLayout && orderSide !== "buy" ? "none" : undefined,
            }}
          >{buyButtonLabel}</button>
          <button
            className="trading-order-actions__button"
            type="button"
            onClick={() => openOrderConfirmation("sell")}
            disabled={sellDisabled}
            style={{
              flex: 1,
              height: 36,
              background: COLORS.red,
              border: "none",
              borderRadius: 4,
              color: "#fff",
              fontWeight: 700,
              fontSize: 13,
              cursor: sellDisabled ? "not-allowed" : "pointer",
              opacity: sellDisabled ? 0.5 : 1,
              display: !isDesktopLayout && orderSide !== "sell" ? "none" : undefined,
            }}
          >Sell / Short</button>
          <div className="trading-order-actions__balance" style={{ flex: 1, display: !isDesktopLayout && orderSide !== "sell" ? "none" : "flex", flexDirection: "column", gap: 4 }}>
            <div style={{ fontSize: 10, color: COLORS.textMuted }}>Available BTC</div>
            <div style={{ fontSize: 12, color: COLORS.textBright, fontFamily: "monospace" }}>{availableBTC.toFixed(6)} BTC</div>
            <div style={{ fontSize: 10, color: COLORS.textMuted }}>Estimated Max Sell</div>
            <div style={{ fontSize: 12, color: COLORS.textBright, fontFamily: "monospace" }}>${estimatedMaxSellUSDT}</div>
          </div>
          </>
          )}
        </div>
            </>
          )}
      </div>
      </div>
      )}

      {isCompactLayout && isChartView && orderBookPanel("embedded")}

      {/* ── BOTTOM TAB BAR (between left & right panels) ── */}
      <div ref={bottomScrollRef} className="trading-bottom-panel trading-dashboard__activity" style={{ borderTop: `1px solid ${COLORS.border}`, background: COLORS.bgPanel, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", height: 36, padding: "0 12px", gap: 0, borderBottom: `1px solid ${COLORS.border}` }}>
          {[["openorders", `Open Orders(${activeOrders.length})`], ["positions", `Positions(${serverPositions.length})`], ["orderhistory", "Order History"], ["tradehistory", "Trade History"], ["holdings", "Holdings"], ["bots", "Bots"]].map(([key, label]) => (
            <button key={key} onClick={() => setBottomTab(key as any)} style={{ padding: "0 14px", height: "100%", background: "transparent", border: "none", cursor: "pointer", fontSize: 12, color: bottomTab === key ? COLORS.textBright : COLORS.text, borderBottom: bottomTab === key ? `2px solid ${COLORS.amber}` : "2px solid transparent", whiteSpace: "nowrap" }}>{label}</button>
          ))}
        </div>
        <div style={{ maxHeight: 120, overflow: "auto" }}>
          {bottomTab === "positions" && (
serverPositions.length === 0
  ? <div style={{ padding: 20, textAlign: "center", color: COLORS.textMuted, fontSize: 12 }}>No open positions</div>
  : <>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr 1fr 100px", padding: "8px 14px", fontSize: 10, fontFamily: "monospace", color: COLORS.textMuted, borderBottom: `1px solid ${COLORS.border}` }}>
      <span>Pair</span><span>Side</span><span>Entry</span><span>Mark</span><span>Size</span><span>PnL</span><span style={{ textAlign: "right" }}>Action</span>
    </div>
    {serverPositions.map((p, idx) => (
      <div key={p.id || p._id || String(idx)} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr 1fr 100px", padding: "6px 14px", fontSize: 11, fontFamily: "monospace", borderBottom: `1px solid ${COLORS.border}` }}>
        <span style={{ color: COLORS.textBright }}>{p.pair}</span>
        <span style={{ color: p.side === "long" ? COLORS.green : COLORS.red }}>{p.side.toUpperCase()}</span>
        <span style={{ color: COLORS.text }}>{Number(p.entryPrice || 0).toFixed(2)}</span>
        <span style={{ color: COLORS.text }}>{Number((marketState?.pair === p.pair && marketState?.markPrice ? marketState.markPrice : p.markPrice ?? p.entryPrice ?? 0)).toFixed(2)}</span>
        <span style={{ color: COLORS.text }}>{Number(p.quantity ?? p.size ?? 0).toFixed(4)}</span>
        <span style={{ color: COLORS.text }}>
{(() => {
  const mark = (marketState?.pair === p.pair && marketState?.markPrice) ? marketState.markPrice : (p.markPrice ?? p.entryPrice ?? 0);
  const side = p.side || 'long';
  const size = Math.abs(p.size || p.quantity || 0);
  const entry = p.entryPrice || 0;
  const leverage = p.leverage || 1;
  const direction = side === 'short' ? -1 : 1;
  const livePnl = (mark - entry) * size * leverage * direction;
  return <span style={{ color: livePnl >= 0 ? COLORS.green : COLORS.red }}>{livePnl >= 0 ? "+" : ""}{livePnl.toFixed(2)}</span>;
})()}
</span>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button onClick={() => closePosition(p)} style={{ padding: "2px 10px", fontSize: 10, background: COLORS.red, color: "#fff", border: "none", borderRadius: 3, cursor: "pointer" }}>Close</button>
        </div>
      </div>
    ))}
  </>
)}
{bottomTab === "openorders" && (
              activeOrders.length === 0
                ? <div style={{ padding: 20, textAlign: "center", color: COLORS.textMuted, fontSize: 12 }}>No open orders</div>
                : activeOrders.map(o => (
                  <div key={o.id} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr 80px", padding: "6px 14px", fontSize: 11, fontFamily: "monospace", borderBottom: `1px solid ${COLORS.border}` }}>
                    <span style={{ color: COLORS.text }}>{new Date(o.createdAt * 1000).toLocaleString()}</span>
                    <span style={{ color: COLORS.textBright }}>{o.pair}</span>
                    <span style={{ color: o.side === "buy" ? COLORS.green : COLORS.red }}>{o.type} {o.side.toUpperCase()}</span>
                    <span style={{ color: COLORS.textBright }}>{o.price.toFixed(2)}</span>
                    <span style={{ color: COLORS.textBright }}>{o.amount.toFixed(4)}</span>
                    <button onClick={() => cancelOrder(o.id)} style={{ background: "transparent", border: `1px solid ${COLORS.red}`, color: COLORS.red, borderRadius: 3, cursor: "pointer", fontSize: 10, padding: "2px 6px" }}>Cancel</button>
                  </div>
                ))
            )}
            {bottomTab === "tradehistory" && (
              tradeHistory.length === 0
                ? <div style={{ padding: 20, textAlign: "center", color: COLORS.textMuted, fontSize: 12 }}>No trade history</div>
                : <>
                  <div style={{ display: "grid", gridTemplateColumns: "1.5fr 0.8fr 0.6fr 1fr 1fr 1fr", padding: "8px 14px", fontSize: 10, fontFamily: "monospace", color: COLORS.textMuted, borderBottom: `1px solid ${COLORS.border}` }}>
                    <span>Date</span><span>Pair</span><span>Side</span><span>Entry</span><span>Close</span><span style={{ textAlign: "right" }}>PnL</span>
                  </div>
                  {tradeHistory.slice(0, 50).map((t: any, i: number) => (
                    <div key={i} style={{ display: "grid", gridTemplateColumns: "1.5fr 0.8fr 0.6fr 1fr 1fr 1fr", padding: "6px 14px", fontSize: 11, fontFamily: "monospace", borderBottom: `1px solid ${COLORS.border}` }}>
                      <span style={{ color: COLORS.textMuted }}>{new Date(t.time * 1000).toLocaleString()}</span>
                      <span style={{ color: COLORS.textBright }}>{t.pair}</span>
                      <span style={{ color: t.side === "buy" ? COLORS.green : COLORS.red }}>{t.side?.toUpperCase()}</span>
                      <span style={{ color: COLORS.text }}>{Number(t.entryPrice || 0).toFixed(2)}</span>
                      <span style={{ color: COLORS.text }}>{Number(t.price || 0).toFixed(2)}</span>
                      <span style={{ textAlign: "right", color: (t.pnl ?? 0) >= 0 ? COLORS.green : COLORS.red }}>{(t.pnl ?? 0) >= 0 ? "+" : ""}{Number(t.pnl ?? 0).toFixed(2)}</span>
                    </div>
                  ))}
                </>
            )}
            {bottomTab === "orderhistory" && (
              tradeHistory.length === 0
                ? <div style={{ padding: 20, textAlign: "center", color: COLORS.textMuted, fontSize: 12 }}>No order history</div>
                : <>
                  <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 0.7fr 0.7fr 1fr 1fr 1fr", padding: "8px 14px", fontSize: 10, fontFamily: "monospace", color: COLORS.textMuted, borderBottom: `1px solid ${COLORS.border}` }}>
                    <span>Date</span><span>Pair</span><span>Side</span><span>Type</span><span>Price</span><span>Qty</span><span style={{ textAlign: "right" }}>PnL</span>
                  </div>
                  {tradeHistory.slice(0, 50).map((t, i) => (
                    <div key={i} style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 0.7fr 0.7fr 1fr 1fr 1fr", padding: "6px 14px", fontSize: 11, fontFamily: "monospace", borderBottom: `1px solid ${COLORS.border}` }}>
                      <span style={{ color: COLORS.textMuted }}>{new Date(t.time * 1000).toLocaleString()}</span>
                      <span style={{ color: COLORS.textBright }}>{t.pair}</span>
                      <span style={{ color: t.side === "buy" ? COLORS.green : COLORS.red }}>{t.side.toUpperCase()}</span>
                      <span style={{ color: COLORS.textMuted }}>{t.type?.toUpperCase() ?? "MARKET"}</span>
                      <span style={{ color: COLORS.text }}>{t.price.toFixed(2)}</span>
                      <span style={{ color: COLORS.text }}>{t.quantity.toFixed(6)}</span>
                      <span style={{ textAlign: "right", color: (t.profit ?? 0) >= 0 ? COLORS.green : COLORS.red }}>{(t.profit ?? 0) >= 0 ? "+" : ""}{(t.profit ?? 0).toFixed(2)}</span>
                    </div>
                  ))}
                </>
            )}
            {bottomTab === "holdings" && accountSummary.holdings.map(h => (
              <div key={h.asset} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", padding: "6px 14px", fontSize: 11, fontFamily: "monospace", borderBottom: `1px solid ${COLORS.border}` }}>
                <span style={{ color: COLORS.textBright }}>{h.asset}</span>
                <span style={{ color: COLORS.text }}>{h.amount.toFixed(6)}</span>
                <span style={{ color: COLORS.textBright }}>${h.value.toLocaleString()}</span>
              </div>
            ))}
        </div>
      </div>

      {/* ── MAIN BODY ── */}
      <div className="trading-body trading-dashboard__body" style={{ display: "flex", flex: 1, overflow: "hidden", minHeight: 0 }}>

        

        {/* ── CENTER: (empty) ── */}
        <div className="trading-main trading-dashboard__main" style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" }}>
        </div>

        {/* COMPACT: Market Trades + Pairs */}
        {isCompactLayout && marketPanel()}
      </div>
      </div>

        {/* ── RIGHT PANEL: Trading Pairs + Market Trades (desktop only) ── */}
        {isDesktopLayout && (
          <aside style={{ width: 'var(--right-width, 340px)', background: COLORS.bgPanel, borderLeft: `1px solid ${COLORS.border}`, display: "flex", flexDirection: "column", flexShrink: 0, overflow: "hidden" }}>
            {marketPairsPanel()}
            {marketTradesPanel(false)}
            {topMoversSection()}
          </aside>
        )}
      </div>

      {/* ── TOAST NOTIFICATIONS ── */}
      <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 9999, display: "flex", flexDirection: "column", gap: 10, pointerEvents: "none" }}>
        {toasts.map(t => (
          <div key={t.id} style={{ padding: "12px 18px", borderRadius: 6, background: t.type === "success" ? "#0ecb81" : t.type === "error" ? "#f6465d" : COLORS.bgPanel, color: t.type === "info" ? COLORS.textBright : "#000", fontWeight: 600, fontSize: 13, boxShadow: "0 4px 20px rgba(0,0,0,0.4)", border: t.type === "info" ? `1px solid ${COLORS.border}` : "none", animation: "fadeIn 0.2s ease", display: "flex", alignItems: "center", gap: 10, minWidth: 260 }}>
            <span>{t.type === "success" ? "✓" : t.type === "error" ? "✕" : "ℹ"}</span>
            {t.msg}
          </div>
        ))}
      </div>

      {/* ── ORDER CONFIRMATION MODAL ── */}
      {confirmModalOpen && pendingOrderSide && (
        <div onClick={() => setConfirmModalOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div onClick={e => e.stopPropagation()} style={{ width: 400, background: COLORS.bgPanel, border: `1px solid ${COLORS.border}`, borderRadius: 10, overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.6)" }}>
            {/* Modal Header */}
            <div style={{ padding: "16px 20px", borderBottom: `1px solid ${COLORS.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: pendingOrderSide === "buy" ? COLORS.green : COLORS.red }} />
                <span style={{ fontWeight: 700, fontSize: 15, color: COLORS.textBright }}>Confirm {pendingOrderSide === "buy" ? "Buy" : "Sell"} Order</span>
              </div>
              <button onClick={() => setConfirmModalOpen(false)} style={{ background: "transparent", border: "none", color: COLORS.text, fontSize: 20, cursor: "pointer", lineHeight: 1 }}>×</button>
            </div>
            {/* Order Details */}
            <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 10 }}>
              {confirmOrderDetails.map(row => (
                <div key={row.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "4px 0", borderBottom: `1px solid ${COLORS.border}` }}>
                  <span style={{ fontSize: 12, color: COLORS.text }}>{row.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: (row as any).color || COLORS.textBright, fontFamily: "monospace" }}>{row.value}</span>
                </div>
              ))}
              {orderType === "market" && (
                <div style={{ background: COLORS.blueDim, border: `1px solid ${COLORS.amber}`, borderRadius: 4, padding: "8px 12px", fontSize: 11, color: COLORS.amber }}>
                  ⚠ Market orders execute at the best available price. Final price may differ slightly.
                </div>
              )}
              {orderError && (
                <div style={{ background: COLORS.redDim, border: `1px solid ${COLORS.red}`, borderRadius: 4, padding: "8px 12px", fontSize: 11, color: COLORS.red }}>
                  {orderError}
                </div>
              )}
            </div>
            {/* Buttons */}
            <div style={{ display: "flex", gap: 10, padding: "12px 20px 16px", borderTop: `1px solid ${COLORS.border}` }}>
              <button onClick={() => setConfirmModalOpen(false)} style={{ flex: 1, height: 40, background: "transparent", border: `1px solid ${COLORS.border}`, borderRadius: 6, color: COLORS.textBright, fontWeight: 600, fontSize: 13, cursor: "pointer" }}>Cancel</button>
              <button
                onClick={() => executeOrder(pendingOrderSide)}
                disabled={isPlacingOrder}
                style={{ flex: 2, height: 40, background: pendingOrderSide === "buy" ? COLORS.green : COLORS.red, border: "none", borderRadius: 6, color: "#000", fontWeight: 700, fontSize: 14, cursor: isPlacingOrder ? "not-allowed" : "pointer", opacity: isPlacingOrder ? 0.7 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
              >
                {isPlacingOrder ? (
                  <><span style={{ width: 14, height: 14, border: "2px solid rgba(0,0,0,0.3)", borderTopColor: "#000", borderRadius: "50%", display: "inline-block", animation: "spin 0.6s linear infinite" }} />Placing...</>
                ) : `Confirm ${pendingOrderSide === "buy" ? "Buy" : "Sell"}`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── PORTFOLIO MODAL ── */}
      {showPortfolioModal && (
        <div onClick={() => setShowPortfolioModal(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div onClick={e => e.stopPropagation()} style={{ width: 520, background: COLORS.bgPanel, border: `1px solid ${COLORS.border}`, borderRadius: 8, overflow: "hidden", maxHeight: "80vh", display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "16px 20px", borderBottom: `1px solid ${COLORS.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 10, color: COLORS.text, marginBottom: 2 }}>Portfolio</div>
                <div style={{ fontWeight: 700, fontSize: 18 }}>Portfolio Overview</div>
              </div>
              <button onClick={() => setShowPortfolioModal(false)} style={{ background: "transparent", border: "none", color: COLORS.text, fontSize: 22, cursor: "pointer" }}>×</button>
            </div>
            <div style={{ padding: "14px 20px", borderBottom: `1px solid ${COLORS.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 11, color: COLORS.text }}>Total value</div>
                <div style={{ fontSize: 20, fontWeight: 700 }}>${portfolioTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })} <span style={{ fontSize: 12, color: COLORS.text }}>USD</span></div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                {["Withdraw", "Deposit", "Convert"].map(a => (
                  <button key={a} style={{ padding: "6px 14px", borderRadius: 4, background: a === "Deposit" ? COLORS.amber : "transparent", border: `1px solid ${a === "Deposit" ? COLORS.amber : COLORS.border}`, color: a === "Deposit" ? "#000" : COLORS.textBright, cursor: "pointer", fontWeight: a === "Deposit" ? 700 : 400, fontSize: 12 }}>{a}</button>
                ))}
              </div>
            </div>
            <div style={{ overflow: "auto", flex: 1 }}>
              <div style={{ padding: "10px 20px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {[{ label: "Available", value: `$${availableBalanceRaw.toLocaleString(undefined, { minimumFractionDigits: 2 })}` }, { label: "Locked", value: `$${(Number.isFinite(accountSummary.locked) ? accountSummary.locked : lockedUSDT).toLocaleString(undefined, { minimumFractionDigits: 2 })}` }, { label: "Realized P&L", value: "$0.00" }, { label: "Rewards earned", value: "$0.00 USD" }].map(m => (
                  <div key={m.label} style={{ background: COLORS.bgAlt, borderRadius: 6, padding: "10px 14px" }}>
                    <div style={{ fontSize: 11, color: COLORS.text }}>{m.label}</div>
                    <div style={{ fontSize: 15, fontWeight: 700, marginTop: 4 }}>{m.value}</div>
                  </div>
                ))}
              </div>
              <div style={{ padding: "0 20px 14px" }}>
                <div style={{ fontWeight: 600, marginBottom: 8, fontSize: 13 }}>Holdings</div>
                {accountSummary.holdings.map(h => (
                  <div key={h.asset} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", padding: "8px 0", borderBottom: `1px solid ${COLORS.border}`, fontSize: 12 }}>
                    <span style={{ fontWeight: 700 }}>{h.asset}</span>
                    <span style={{ color: COLORS.text, fontFamily: "monospace" }}>{h.amount.toFixed(6)}</span>
                    <span style={{ textAlign: "right", fontFamily: "monospace", fontWeight: 600 }}>${h.value.toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div style={{ padding: "0 20px 14px" }}>
                <div style={{ fontWeight: 600, marginBottom: 8, fontSize: 13 }}>Trade History</div>
                {tradeHistory.slice(0, 8).map((t, i) => (
                  <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", padding: "5px 0", borderBottom: `1px solid ${COLORS.border}`, fontSize: 11, fontFamily: "monospace" }}>
                    <span style={{ color: t.side === "buy" ? COLORS.green : COLORS.red }}>{t.side.toUpperCase()}</span>
                    <span style={{ color: COLORS.textBright }}>{t.pair}</span>
                    <span style={{ color: COLORS.text }}>{t.quantity.toFixed(6)}</span>
                    <span style={{ textAlign: "right" }}>${t.price.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; }
        input[type=number]::-webkit-inner-spin-button, input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; }
        input[type=range] { height: 3px; }
        ::-webkit-scrollbar { width: 3px; height: 3px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #2a2e35; border-radius: 2px; }
        ::-webkit-scrollbar-thumb:hover { background: #3a3e45; }
        input:focus { outline: none; border-color: #f0b90b !important; }

        .trading-header { flex-wrap: nowrap; gap: 12px; }
        .trading-body { display: flex !important; align-items: stretch !important; }
        .trading-toolbar,
        .trading-orderbook,
        .trading-right,
        .trading-left-panel,
        .trading-main { display: flex !important; }
        .trading-left-panel { flex: 0 0 340px !important; min-width: 340px !important; max-width: 340px !important; order: 0 !important; }
        .trading-toolbar { flex: 0 0 44px !important; width: 44px !important; min-width: 44px !important; flex-direction: column !important; align-items: center !important; justify-content: flex-start !important; padding-top: 8px !important; gap: 2px !important; order: 0 !important; scrollbar-width: none !important; -ms-overflow-style: none !important; }
        .trading-toolbar::-webkit-scrollbar { width: 0 !important; height: 0 !important; }
        .trading-main { flex: 1 1 auto !important; min-width: 0 !important; order: 1 !important; }
        .trading-right { flex: 0 0 340px !important; min-width: 340px !important; max-width: 340px !important; order: 2 !important; }
        .trading-chart-stage,
        .trading-chart-stage canvas { touch-action: pan-y; }
        .trading-balance-strip {
          display: flex !important;
          flex-wrap: nowrap !important;
          overflow-x: auto !important;
          gap: 8px;
          padding: 8px 16px;
          border-bottom: 1px solid #2a2e35;
          align-items: center;
          min-width: 0;
        }
        .trading-balance-strip > div {
          flex: 1 1 0 !important;
          min-width: 72px !important;
          padding: 8px 10px;
        }
        .trading-orderbook--embedded { display: none !important; }
        .trading-rotate-prompt {
          display: none;
          position: fixed;
          inset: 0;
          z-index: 4000;
          align-items: center;
          justify-content: center;
          padding: 24px;
          background: rgba(11, 14, 17, 0.88);
          backdrop-filter: blur(8px);
        }
        .trading-rotate-prompt__panel {
          display: flex;
          align-items: center;
          gap: 14px;
          max-width: 360px;
          padding: 18px;
          border: 1px solid #2a2e35;
          border-radius: 8px;
          background: #161a1e;
          box-shadow: 0 18px 50px rgba(0, 0, 0, 0.35);
        }
        .trading-rotate-prompt__icon {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          background: rgba(240, 185, 11, 0.12);
          color: #f0b90b;
          font-size: 24px;
          flex: 0 0 auto;
        }
        .trading-rotate-prompt__title {
          color: #eaecef;
          font-size: 15px;
          font-weight: 800;
          margin-bottom: 4px;
        }
        .trading-rotate-prompt__text {
          color: #848e9c;
          font-size: 12px;
          line-height: 1.4;
        }

        @media (min-width: 768px) {
          .trading-balance-strip { padding: 12px 20px; gap: 12px; }
          .trading-balance-strip > div { padding: 6px 8px; }
          .trading-balance-strip > div > div { font-size: 13px !important; }
          .trading-balance-strip > div > div:last-child { font-size: 18px !important; font-weight: 700 !important; }
        }

        @media (min-width: 1024px) {
          .trading-dashboard { --left-width: 340px; --right-width: 340px; }
          .trading-page { height: 100dvh !important; min-height: 0 !important; overflow: hidden !important; }
          .trading-body { flex: 1 1 auto !important; flex-wrap: nowrap !important; gap: 0 !important; min-height: 0 !important; overflow: hidden !important; }
          .trading-page.trading-dashboard .trading-body.trading-dashboard__body { display: flex !important; grid-template-columns: none !important; gap: 0 !important; padding: 0 !important; overflow: hidden !important; }
          .trading-toolbar { flex: 0 0 44px !important; width: 44px !important; }
          .trading-main { width: auto !important; min-height: 0 !important; overflow: hidden !important; }
          .trading-chart-panel { flex: 1 1 auto !important; min-height: 0 !important; overflow: hidden !important; }
          .trading-chart-layout,
          .trading-chart-stage { height: 100% !important; min-height: 0 !important; }
          .trading-left-panel { flex: 0 0 340px !important; min-width: 340px !important; max-width: 340px !important; }
          .trading-right { flex: 0 0 340px !important; min-width: 340px !important; max-width: 340px !important; }
          .trading-order-form {
            height: auto !important;
            min-height: 320px !important;
            overflow: visible !important;
          }
          .trading-order-form__inner {
            min-height: 0 !important;
            overflow: visible !important;
          }
          .trading-order-form__columns {
            flex: 0 0 auto !important;
            min-height: 0 !important;
            overflow: visible !important;
          }
          .trading-order-form__side {
            flex: 1 1 0 !important;
            min-height: 200px !important;
            overflow: visible !important;
          }
          .trading-order-actions {
            flex: 0 0 auto !important;
          }
          .trading-orderbook--embedded { display: none !important; }
          .trading-bottom-panel { max-height: 280px; overflow: hidden; }
          .trading-bottom-panel > div:last-child { max-height: 240px !important; overflow: auto !important; }
        }

        @media (min-width: 1024px) and (max-width: 1439px) {
          .trading-dashboard { --left-width: 280px; --right-width: 280px; }
          .trading-left-panel {
            flex: 0 0 280px !important;
            min-width: 280px !important;
            max-width: 280px !important;
          }
          .trading-right {
            flex: 0 0 280px !important;
            min-width: 280px !important;
            max-width: 280px !important;
          }
          .trading-balance-strip { grid-template-columns: repeat(4, 1fr); }
        }

        @media (max-width: 1023px) {
          html, body, #root { height: auto !important; min-height: 100%; overflow-y: auto !important; }
          body { overflow: auto !important; }
          .trading-page {
            height: auto !important;
            min-height: 100svh !important;
            overflow-y: visible !important;
            overflow-x: hidden !important;
            -webkit-overflow-scrolling: touch;
            overscroll-behavior-y: auto;
            touch-action: pan-y;
          }
          .trading-header { flex-wrap: wrap !important; height: auto !important; min-height: 56px !important; padding: 6px 10px !important; gap: 8px !important; overflow: visible !important; }
          .trading-body {
            flex-direction: column !important;
            flex-wrap: nowrap !important;
            gap: 0 !important;
            min-height: auto !important;
            overflow: visible !important;
            align-items: stretch !important;
          }
          .trading-orderbook--side { display: none !important; }
          .trading-main {
            flex: 0 0 auto !important;
            width: 100% !important;
            min-height: 0 !important;
            overflow: visible !important;
            order: 1 !important;
          }
          .trading-chart-panel {
            flex: 0 0 auto !important;
            min-height: 0 !important;
            height: auto !important;
            overflow: visible !important;
          }
          .trading-chart-layout { display: block !important; height: auto !important; }
          .trading-chart-stage {
            height: clamp(260px, 38dvh, 420px) !important;
            min-height: 260px !important;
            width: 100% !important;
            border-bottom: 1px solid #2a2e35;
            touch-action: pan-y !important;
          }
          .trading-chart-stage canvas {
            touch-action: pan-y !important;
          }
          .trading-order-form {
            height: auto !important;
            min-height: 0 !important;
            overflow: visible !important;
          }
          .trading-order-form__inner { min-height: 0 !important; overflow: visible !important; }
          .trading-balance-strip {
            display: flex !important;
            flex-wrap: nowrap !important;
            overflow-x: auto !important;
            gap: 6px;
            padding: 6px 8px;
            align-items: center;
          }
          .trading-balance-strip > div {
            flex: 1 1 0 !important;
            min-width: 68px !important;
          }
          .trading-balance-strip > div > div { font-size: 10px !important; }
          .trading-balance-strip > div > div:last-child { font-size: 13px !important; }
          .trading-order-form__columns { overflow: visible !important; min-height: 0 !important; }
          .trading-bottom-panel { order: 4 !important; overflow: visible !important; }
          .trading-bottom-panel > div:last-child { max-height: none !important; overflow: visible !important; }
          .trading-orderbook--embedded {
            display: flex !important;
            flex: 0 0 auto !important;
            width: 100% !important;
            max-width: 100% !important;
            min-height: 360px !important;
            height: 360px !important;
            order: 3 !important;
            border-left: none !important;
            border-top: 1px solid #2a2e35 !important;
          }
          .trading-market-panel {
            display: flex !important;
            width: 100% !important;
            max-width: 100% !important;
            min-height: 420px !important;
            height: auto !important;
            order: 5 !important;
            border-left: none !important;
            border-top: 1px solid #2a2e35 !important;
          }
        }

        @media (max-width: 767px) {
          .trading-main-tabs { height: 34px !important; padding: 0 6px !important; }
          .trading-main-tabs button { padding: 0 8px !important; font-size: 11px !important; }
          .trading-header > div:nth-child(2) { width: 100%; overflow-x: auto !important; padding-bottom: 2px; }
          .trading-header > div:nth-child(2) > div:nth-child(n+5) { display: none !important; }
          .trading-chart-stage { height: 240px !important; min-height: 240px !important; }
          .trading-order-form { height: auto !important; min-height: 0 !important; }
          .trading-order-form__columns { flex-direction: column !important; }
          .trading-order-form__side {
            flex: 0 0 auto !important;
            min-height: 0 !important;
            padding: 8px 10px !important;
          }
          .trading-order-form__side--buy {
            border-right: none !important;
            border-bottom: 1px solid #2a2e35 !important;
          }
          .trading-order-actions {
            flex-wrap: wrap !important;
            padding: 8px 10px !important;
          }
          .trading-order-actions__balance { display: none !important; }
          .trading-order-actions__button {
            flex: 1 1 calc(50% - 4px) !important;
            min-width: 120px !important;
          }
          .trading-orderbook--embedded { height: 340px !important; min-height: 340px !important; }
          .trading-bottom-panel > div:first-child { overflow-x: auto; }
        }

        @media (max-width: 479px) {
          .trading-main-tabs { height: 30px !important; padding: 0 4px !important; overflow-x: auto !important; }
          .trading-main-tabs button { padding: 0 6px !important; font-size: 10px !important; white-space: nowrap; }
          .trading-header { min-height: 62px !important; }
          .trading-header button,
          .trading-header span,
          .trading-header div { max-width: 100%; }
          .trading-chart-stage { height: 220px !important; min-height: 220px !important; }
          .trading-order-form { height: auto !important; min-height: 0 !important; }
          .trading-order-form__tabs { overflow-x: auto !important; }
          .trading-order-form__tabs button { padding: 0 10px !important; white-space: nowrap; }
          .trading-balance-strip {
            display: flex !important;
            flex-wrap: nowrap !important;
            overflow-x: auto !important;
            gap: 3px;
            padding: 4px 6px;
            align-items: center;
          }
          .trading-balance-strip > div {
            flex: 0 0 auto !important;
            min-width: 60px !important;
            padding: 4px 6px !important;
          }
          .trading-balance-strip > div > div { font-size: 8px !important; line-height: 1.1 !important; }
          .trading-balance-strip > div > div:last-child { font-size: 11px !important; font-weight: 700 !important; }
          .trading-order-form__side { min-height: 0 !important; }
          .trading-order-actions__button { min-width: 0 !important; height: 38px !important; }
          .trading-orderbook--embedded { height: 320px !important; min-height: 320px !important; }
        }

        @media (max-width: 1023px) and (orientation: portrait) and (pointer: coarse) {
          .trading-rotate-prompt { display: none; }
        }

        @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: none; } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
