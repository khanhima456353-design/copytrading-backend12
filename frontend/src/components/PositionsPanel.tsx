import React, { useEffect, useRef, useState } from "react";
import { getAxios } from "../api";
import { subscribeMarketState, getMarketStateSnapshot } from "../services/marketState";

type Position = {
  id?: string;
  pair: string;
  size: number; // positive quantity in base currency
  side: "long" | "short";
  entryPrice: number;
  margin: number; // initial margin used
  liqPrice?: number;
  fees?: number;
  status?: string;
};

function formatPrice(p: number) {
  if (!p || isNaN(p)) return "—";
  const a = Math.abs(p);
  if (a >= 10000) return p.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  if (a >= 100) return p.toFixed(2);
  if (a >= 1) return p.toFixed(4);
  return p.toFixed(6);
}

interface PositionsPanelProps { serverPositions?: any[]; }
export default function PositionsPanel({ serverPositions }: PositionsPanelProps) {
  const [positions, setPositions] = useState<Position[]>([]);
  const latestRef = useRef<Record<string, any>>({});
  const scheduledRef = useRef<number | null>(null);
  const [throttledTick, setThrottledTick] = useState(0);

  const [summary, setSummary] = useState({ totalBalance: 0, totalEquity: 0, usedMargin: 0, freeMargin: 0, dailyPnL: 0, winRate: 0 });

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const api = await getAxios();
        const res = await api.get("/api/account/positions");
        if (!mounted) return;
        setPositions(Array.isArray(res.data) ? res.data : []);
      } catch (e) {
        // fallback to demo or empty
        const demo = localStorage.getItem("demoPositions");
        if (demo) setPositions(JSON.parse(demo));
        else setPositions([]);
      }

      try {
        const api = await getAxios();
        const res2 = await api.get("/api/account/summary");
        if (!mounted) return;
        const s = res2.data || {};
        setSummary({
          totalBalance: s.totalBalance || 0,
          totalEquity: s.totalEquity || 0,
          usedMargin: s.usedMargin || 0,
          freeMargin: s.freeMargin || 0,
          dailyPnL: s.dailyPnL || 0,
          winRate: s.winRate || 0,
        });
      } catch (e) {
        // no-op
      }
    }

    load();

    return () => { mounted = false; };
  }, []);

  // subscribe to marketState for each pair in positions
  useEffect(() => {
    const unsubMap: Record<string, () => void> = {};

    positions.forEach((pos) => {
      const pair = pos.pair;
      if (unsubMap[pair]) return;
      const unsub = subscribeMarketState(pair, (state) => {
        const prevState = latestRef.current[pair];
        // Only update if values actually changed
        if (prevState?.lastPrice === state.lastPrice && 
            prevState?.markPrice === state.markPrice &&
            prevState?.orderbook.bids === state.orderbook.bids &&
            prevState?.orderbook.asks === state.orderbook.asks) {
          return;
        }
        latestRef.current[pair] = state;
        // schedule throttled update
        if (scheduledRef.current == null) {
          scheduledRef.current = window.setTimeout(() => {
            scheduledRef.current = null;
            setThrottledTick((t) => t + 1);
          }, 200);
        }
      });
      unsubMap[pair] = unsub;
      // seed from snapshot
      const snap = getMarketStateSnapshot(pair);
      if (snap && Object.keys(snap).length) latestRef.current[pair] = snap;
    });

    return () => {
      Object.values(unsubMap).forEach(u => u());
    };
  }, [positions]);

  // recompute derived values on tick
  useEffect(() => {
    if (!positions.length) return;
    const next = positions.map((p) => {
      const s = latestRef.current[p.pair] || {};
      const candMark = Number(s?.markPrice);
      const candLast = Number(s?.lastPrice);
      const mark = (Number.isFinite(candMark) && candMark > 0)
        ? candMark
        : (Number.isFinite(candLast) && candLast > 0) ? candLast : null;
      const entryNum = Number(p.entryPrice);
      const entry = Number.isFinite(entryNum) && entryNum > 0 ? entryNum : null;
      const size = Number(p.size || 0);
      const side = p.side === "short" ? -1 : 1;
      const unrealized = (mark !== null && entry !== null) ? (mark - entry) * size * side : 0;
      const roe = p.margin ? (unrealized / p.margin) * 100 : 0;
      return { ...p, markPrice: mark, unrealizedPnL: unrealized, roePct: roe } as any;
    });
    setPositions(next);

    // update portfolio summary quick calc
    const usedMargin = next.reduce((s: number, p: any) => s + (p.margin || 0), 0);
    const unreal = next.reduce((s: number, p: any) => s + (p.unrealizedPnL || 0), 0);
    const totalBalance = summary.totalBalance || 0;
    const totalEquity = totalBalance + unreal;
    setSummary((prev) => ({ ...prev, totalEquity, usedMargin, freeMargin: totalEquity - usedMargin }));
  }, [throttledTick]);

const marginRatio = summary.totalEquity > 0 ? (summary.usedMargin / summary.totalEquity) * 100 : 0;
const meterColor = marginRatio >= 85 ? "var(--clr-red)" : marginRatio >= 60 ? "var(--clr-amber)" : "var(--clr-green)";

  return (
    <div style={{ background: "var(--clr-panel)", border: "1px solid var(--clr-border)", padding: 10, fontSize: 12, color: "var(--clr-text)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <div>
          <div style={{ fontSize: 11, color: "var(--clr-text)" }}>Total Equity</div>
          <div style={{ fontWeight: 700, fontSize: 16, color: "var(--clr-text-bright)" }}>${(summary.totalEquity || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 11, color: "var(--clr-text)" }}>Used Margin</div>
          <div style={{ fontWeight: 700, fontSize: 16, color: "var(--clr-text-bright)" }}>${(summary.usedMargin || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
        </div>
      </div>

      <div style={{ marginBottom: 10 }}>
        <div style={{ fontSize: 11, color: "var(--clr-text)", marginBottom: 6 }}>Margin Ratio</div>
        <div style={{ height: 10, width: "100%", background: "var(--clr-surface-overlay)", borderRadius: 6, overflow: "hidden", border: "1px solid var(--clr-border)" }}>
          <div style={{ width: `${Math.min(100, Math.max(0, marginRatio))}%`, height: "100%", background: meterColor, transition: "width 200ms linear" }} />
        </div>
        <div style={{ fontSize: 11, color: "var(--clr-text)", marginTop: 6 }}>{marginRatio.toFixed(2)}% — <span style={{ color: meterColor }}>{marginRatio >= 85 ? "High Risk" : marginRatio >= 60 ? "Watch" : "Healthy"}</span></div>
      </div>

      <div style={{ maxHeight: 260, overflow: "auto", borderTop: "1px solid var(--clr-border)", paddingTop: 8 }}>
        {positions.length === 0 && <div style={{ color: "var(--clr-text)", textAlign: "center", padding: 20 }}>No open positions</div>}
        {positions
          .filter((p: any) => p.id && p.pair && p.side && p.size !== undefined && p.entryPrice !== undefined)
          .map((p: any) => (
          <div key={p.id} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, padding: "8px 6px", borderBottom: "1px solid var(--clr-border)" }}>
            <div>
              <div style={{ fontSize: 11, color: "var(--clr-text)" }}>{p.pair}</div>
              <div style={{ fontWeight: 700, color: "var(--clr-text-bright)" }}>{p.side?.toUpperCase()} {p.size}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: "var(--clr-text)" }}>Entry</div>
              <div style={{ fontWeight: 700, color: "var(--clr-text-bright)" }}>{formatPrice(p.entryPrice)}</div>
              <div style={{ fontSize: 11, color: "var(--clr-text)" }}>Mark</div>
              <div style={{ fontWeight: 700, color: "var(--clr-text-bright)" }}>{formatPrice(p.markPrice)}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 11, color: "var(--clr-text)" }}>Unrealized PnL</div>
              <div style={{ fontWeight: 700, color: (p.unrealizedPnL || 0) >= 0 ? "var(--clr-green)" : "var(--clr-red)" }}>${(p.unrealizedPnL || 0).toFixed(2)}</div>
              <div style={{ fontSize: 11, color: "var(--clr-text)" }}>ROE</div>
              <div style={{ fontWeight: 700, color: (p.roePct || 0) >= 0 ? "var(--clr-green)" : "var(--clr-red)" }}>{(p.roePct || 0).toFixed(2)}%</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
