import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "./theme/ThemeContext";
import { useBalance } from "../context/BalanceContext";
import { BalanceDisplay } from "./BalanceDisplay";
import { subscribeServerMarketUpdate } from "../services/marketState";
import { formatCurrency } from "../services/walletService";

export function HomeBalanceCard() {
  const navigate = useNavigate();
  const { balances, loading, selectedMode, setSelectedMode } = useBalance();
  const { theme } = useTheme();
  const [dailyChange, setDailyChange] = useState<number | null>(null);
  const [weeklyChange, setWeeklyChange] = useState<number | null>(null);
  const [showTradeDropdown, setShowTradeDropdown] = useState(false);
  const tradeRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (tradeRef.current && !tradeRef.current.contains(e.target as Node)) setShowTradeDropdown(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeServerMarketUpdate((update) => {
      if (typeof update.change24h === "number") {
        setDailyChange(update.change24h);
      }
      if (typeof update.pnl === "number") {
        setWeeklyChange(update.pnl);
      }
    });

    return unsubscribe;
  }, []);

  const formatPercent = (value: number | null) => {
    if (value === null || !Number.isFinite(value)) return "—";
    return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
  };

  const colors = useMemo(
    () =>
      theme === "dark"
        ? {
            surface: "#111827",
            surfaceSoft: "#161a2b",
            border: "rgba(255,255,255,0.08)",
            text: "#f8fafc",
            muted: "#94a3b8",
            primary: "#7c6af7",
            accent: "#0ecb81",
          }
        : {
            surface: "#ffffff",
            surfaceSoft: "#f3f4ff",
            border: "rgba(15,23,42,0.08)",
            text: "#0f172a",
            muted: "#64748b",
            primary: "#4f46e5",
            accent: "#16a34a",
          },
    [theme]
  );

  const totalValue = balances?.totalPortfolioValue ?? 0;
  const modeLabel = selectedMode === "portfolio"
    ? "Portfolio"
    : selectedMode.charAt(0).toUpperCase() + selectedMode.slice(1);

  const handleTradeClick = () => {
    navigate("/trade", { state: { mode: selectedMode } });
  };

  const modeItems = [
    { key: "spot", label: "Spot" },
    { key: "cross", label: "Cross" },
    { key: "isolated", label: "Isolated" },
  ] as const;

  return (
    <section style={{ ...styles.card, background: colors.surface, borderColor: colors.border, color: colors.text }}>
      <div style={styles.header}>
        <div>
          <p style={{ ...styles.subheading, color: colors.muted }}>Portfolio dashboard</p>
          <h2 style={{ ...styles.title, color: colors.text }}>Your account balance</h2>
        </div>

        <div style={styles.headerActions}>
          <div style={styles.badgeRow}>
            <div style={{ ...styles.statBadge, background: theme === "dark" ? "rgba(14, 203, 129, 0.12)" : "rgba(14, 203, 129, 0.14)", color: "#0ecb81" }}>
              <span style={styles.badgeLabel}>24h P&L</span>
              <strong>{formatPercent(dailyChange)}</strong>
            </div>
            <div style={{ ...styles.statBadge, background: theme === "dark" ? "rgba(124, 106, 247, 0.14)" : "rgba(79, 70, 229, 0.12)", color: colors.primary }}>
              <span style={styles.badgeLabel}>7d P&L</span>
              <strong>{formatPercent(weeklyChange)}</strong>
            </div>
          </div>
          <div ref={tradeRef} style={{ position: "relative" }}>
            <button
              type="button"
              onClick={() => setShowTradeDropdown(prev => !prev)}
              style={{
                ...styles.tradeButton,
                background: colors.primary,
              }}
            >
              Trade now
            </button>
            {showTradeDropdown && (
              <div style={{ position: "absolute", top: "100%", right: 0, marginTop: 4, background: colors.surface, border: "1px solid " + colors.border, borderRadius: 12, boxShadow: "0 8px 24px rgba(0,0,0,0.3)", minWidth: 130, zIndex: 100, overflow: "hidden" }}>
                <button onClick={() => { navigate("/trade", { state: { mode: "spot" } }); setShowTradeDropdown(false); }} style={{ display: "block", width: "100%", padding: "10px 16px", background: "transparent", border: "none", color: colors.text, fontSize: 13, textAlign: "left", cursor: "pointer" }}>Spot</button>
                <button onClick={() => { navigate("/trade", { state: { mode: "futures" } }); setShowTradeDropdown(false); }} style={{ display: "block", width: "100%", padding: "10px 16px", background: "transparent", border: "none", color: colors.text, fontSize: 13, textAlign: "left", cursor: "pointer" }}>Futures</button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={{ ...styles.portfolioCard, background: colors.surfaceSoft, borderColor: colors.border }}>
        <div>
          <span style={{ ...styles.overviewLabel, color: colors.muted }}>Total portfolio value</span>
          <div style={{ ...styles.portfolioValue, color: colors.text }}>
            {formatCurrency(totalValue)}
          </div>
          <div style={{ ...styles.portfolioSubtext, color: colors.muted }}>
            {balances ? `Viewing ${modeLabel} balances and active positions` : "Loading your latest wallet values..."}
          </div>
        </div>
        <div style={styles.modeBadge}>{modeLabel}</div>
      </div>

      <div style={styles.modeTabs}>
        {modeItems.map((item) => {
          const active = selectedMode === item.key;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => setSelectedMode(item.key)}
              style={{
                ...styles.modeTab,
                background: active ? colors.primary : colors.surfaceSoft,
                color: active ? "#fff" : colors.text,
                boxShadow: active ? `0 12px 30px ${colors.primary}20` : "none",
              }}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      <div style={styles.balanceWidget}>
        <BalanceDisplay
          data={balances}
          loading={loading}
          compact={true}
        />
      </div>

      <div style={styles.ctaRow}>
        <button type="button" onClick={() => { navigate("/trade", { state: { mode: "spot" } }); }} style={{ ...styles.ctaButton, background: colors.primary }}>
          Trade Spot
        </button>
        <button type="button" onClick={() => { navigate("/trade", { state: { mode: "futures" } }); }} style={{ ...styles.ctaButton, background: colors.primary }}>
          Trade Futures
        </button>
        <button type="button" onClick={() => navigate("/trade") } style={{ ...styles.secondaryButton, borderColor: colors.border, color: colors.text }}>
          Deposit
        </button>
        <button type="button" onClick={() => navigate("/trade") } style={{ ...styles.secondaryButton, borderColor: colors.border, color: colors.text }}>
          Withdraw
        </button>
        <button type="button" onClick={() => navigate("/trade") } style={{ ...styles.secondaryButton, borderColor: colors.border, color: colors.text }}>
          Transfer
        </button>
      </div>
    </section>
  );
}

const styles = {
  card: {
    borderRadius: "22px",
    border: "1px solid",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "14px",
    boxShadow: "0 18px 35px rgba(0,0,0,0.18)",
    minWidth: 0,
    maxWidth: "100%",
  } as React.CSSProperties,
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: "12px",
  } as React.CSSProperties,
  title: {
    margin: 0,
    fontSize: "20px",
    fontWeight: 800,
  } as React.CSSProperties,
  subheading: {
    margin: 0,
    fontSize: "11px",
    letterSpacing: "0.12em",
    textTransform: "uppercase",
  } as React.CSSProperties,
  headerActions: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
    alignItems: "center",
  } as React.CSSProperties,
  badgeRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    alignItems: "center",
  } as React.CSSProperties,
  statBadge: {
    borderRadius: "14px",
    padding: "10px 14px",
    display: "flex",
    flexDirection: "column" as const,
    gap: "4px",
    minWidth: "100px",
    fontSize: "12px",
    fontWeight: 700,
    lineHeight: 1.2,
  } as React.CSSProperties,
  badgeLabel: {
    fontSize: "10px",
    fontWeight: 600,
    opacity: 0.8,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  } as React.CSSProperties,
  actionButton: {
    borderRadius: "14px",
    border: "1px solid",
    padding: "8px 14px",
    fontSize: "12px",
    fontWeight: 600,
    cursor: "pointer",
    minWidth: "100px",
    transition: "all 0.2s ease",
  } as React.CSSProperties,
  tradeButton: {
    borderRadius: "14px",
    border: "none",
    color: "#fff",
    padding: "10px 16px",
    fontSize: "13px",
    fontWeight: 700,
    cursor: "pointer",
    minWidth: "130px",
  } as React.CSSProperties,
  portfolioCard: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: "18px",
    border: "1px solid",
    padding: "18px",
    gap: "16px",
    minHeight: "100px",
    flexWrap: "wrap",
    background: "rgba(255,255,255,0.02)",
  } as React.CSSProperties,
  overviewLabel: {
    display: "block",
    fontSize: "11px",
    fontWeight: 600,
    marginBottom: "6px",
  } as React.CSSProperties,
  portfolioValue: {
    fontSize: "28px",
    fontWeight: 800,
    lineHeight: 1.1,
  } as React.CSSProperties,
  portfolioSubtext: {
    marginTop: "6px",
    fontSize: "12px",
    lineHeight: 1.4,
  } as React.CSSProperties,
  modeBadge: {
    background: "rgba(124,106,247,0.18)",
    color: "#d8d3ff",
    borderRadius: "999px",
    padding: "8px 14px",
    fontSize: "11px",
    fontWeight: 700,
    whiteSpace: "nowrap",
  } as React.CSSProperties,
  modeTabs: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: "8px",
  } as React.CSSProperties,
  modeTab: {
    borderRadius: "14px",
    border: "1px solid transparent",
    padding: "10px 12px",
    fontSize: "12px",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s ease",
  } as React.CSSProperties,
  balanceWidget: {
    minWidth: 0,
  } as React.CSSProperties,
  ctaRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
  } as React.CSSProperties,
  ctaButton: {
    borderRadius: "16px",
    border: "none",
    color: "#fff",
    padding: "12px 18px",
    fontSize: "13px",
    fontWeight: 700,
    cursor: "pointer",
    flex: 1,
    minWidth: "150px",
  } as React.CSSProperties,
  secondaryButton: {
    borderRadius: "16px",
    border: "1px solid",
    padding: "12px 18px",
    fontSize: "13px",
    fontWeight: 700,
    cursor: "pointer",
    background: "transparent",
    flex: 1,
    minWidth: "150px",
  } as React.CSSProperties,
};
