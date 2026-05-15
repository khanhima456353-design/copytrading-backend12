// ─── Shared Homepage Constants ────────────────────────────────────────────────

// These constants are extracted from duplicated definitions in home.tsx and HomeShared.tsx.
// They contain only passive data with no runtime mutations or state dependencies.
// This extraction is low risk because:
// - Constants are immutable and do not change at runtime.
// - No browser API dependencies or side effects.
// - Preserves exact values and structure for rendering behavior.
// What was intentionally not changed:
// - No renaming or restructuring of data.
// - State logic remains in components (e.g., navigation, notifications).
// - Desktop homepage constants untouched to avoid scope creep.

import type { MarketRow } from "./HomeShared";

export const MARKETS: MarketRow[] = [
  { symbol: "₿",    pair: "BTC / USDT", volume: "Vol $42.1B", price: "$95,412", change: 2.10,  sparkUp: true  },
  { symbol: "Ξ",    pair: "ETH / USDT", volume: "Vol $18.7B", price: "$2,841",  change: 0.80,  sparkUp: true  },
  { symbol: "BNB",  pair: "BNB / USDT", volume: "Vol $3.2B",  price: "$612.30", change: 1.40,  sparkUp: true  },
  { symbol: "AVAX", pair: "AVAX / USDT",volume: "Vol $890M",  price: "$64.97",  change: -3.40, sparkUp: false },
];

export const TICKERS = [
  { name: "BTC",  price: "$95,412", change: "+2.1%",  up: true  },
  { name: "ETH",  price: "$2,841",  change: "+0.8%",  up: true  },
  { name: "BNB",  price: "$612",    change: "+1.4%",  up: true  },
  { name: "SOL",  price: "$178",    change: "−1.2%",  up: false },
  { name: "AVAX", price: "$64.97",  change: "−3.4%",  up: false },
];

export const COIN_COLORS: Record<string, { bg: string; color: string }> = {
  "₿":    { bg: "#F7931A22", color: "#F7931A" },
  "Ξ":    { bg: "#627EEA22", color: "#627EEA" },
  "BNB":  { bg: "#F3BA2F22", color: "#F3BA2F" },
  "AVAX": { bg: "#E8414222", color: "#E84142" },
};