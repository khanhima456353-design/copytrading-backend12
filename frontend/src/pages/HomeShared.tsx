import { useState, useEffect } from "react";
import type { CSSProperties } from "react";
import logo from "../assets/logo.jpg";
import { MARKETS, TICKERS, COIN_COLORS } from "./homeConstants";

export type Screen = "home" | "portfolio" | "markets" | "trade" | "account";

export interface MarketRow {
  symbol: string;
  pair: string;
  volume: string;
  price: string;
  change: number;
  sparkUp: boolean;
}

export interface NavItem {
  id: Screen;
  label: string;
  icon: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error" | "admin";
  isRead: boolean;
  priority: "low" | "medium" | "high";
  createdAt: string;
  expiresAt?: string;
}

// ─── Constants ───────────────────────────────────────────────────────────────

// Homepage constants are now imported from homeConstants.ts to eliminate duplication.
// Local exports removed to centralize passive data.
// This preserves exact rendering behavior while reducing maintenance overhead.

export const NAV_ITEMS: NavItem[] = [
  { id: "home",      label: "Home",      icon: "🏠" },
  { id: "portfolio", label: "Portfolio", icon: "🥧" },
  { id: "markets",   label: "Markets",   icon: "📈" },
  { id: "trade",     label: "Trade",     icon: "⇄"  },
  { id: "account",   label: "Account",   icon: "👤" },
];

export function Sparkline({ up }: { up: boolean }) {
  // Shared Sparkline component extracted from home.tsx to eliminate duplication.
  // This is a pure presentational component with no internal state.
  // Props:
  // - up: Boolean indicating if the sparkline should show upward (green) or downward (red) trend.
  // Dependencies: Hard-coded SVG paths and colors for up/down states.
  // Low risk extraction: No side effects, preserves exact SVG output and visual appearance.
  // Note: Desktop version has additional fill/gradient behavior and remains isolated.
  const color = up ? "#0ecb81" : "#f6465d";
  const path = up
    ? "M0,20 L10,17 L20,12 L30,14 L40,7 L50,4 L56,2"
    : "M0,8 L10,10 L20,16 L30,13 L40,20 L50,18 L56,24";
  return (
    <svg width={56} height={28} viewBox="0 0 56 28" style={{ flexShrink: 0 }}>
      <path d={path} fill="none" stroke={color} strokeWidth={1.5} />
    </svg>
  );
}

// Shared presentational TopBar component.
// Safe extraction note: this component is purely presentational and has no local state.
// Parent components retain notification state and navigation handlers.
export function TopBar({
  showSearch = false,
  showNotifications = false,
  unreadCount = 0,
  onNotificationClick,
}: {
  showSearch?: boolean;
  showNotifications?: boolean;
  unreadCount?: number;
  onNotificationClick?: () => void;
}) {
  return (
    <div style={styles.topBar}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <img src={logo} alt="SwanCore Logo" style={{ width: 30, height: 30, borderRadius: "50%" }} />
        <span style={styles.logo}>
          S<span style={{ color: "#F0B90B" }}>wancore</span>
        </span>
      </div>
      <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
        {showSearch && <span style={styles.topIcon}>🔍</span>}
        {showNotifications && (
          <button
            onClick={onNotificationClick}
            style={{
              ...styles.topIcon,
              position: "relative",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
            }}
            aria-label="Notifications"
          >
            🔔
            {unreadCount > 0 && (
              <span style={styles.notificationBadge}>
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

export function BottomNav({
  active,
  onNavigate,
}: {
  active: Screen;
  onNavigate: (s: Screen) => void;
}) {
  // Shared BottomNav component extracted from home.tsx to eliminate duplication.
  // This is a pure presentational component with no internal state.
  // Props:
  // - active: Current active screen for highlighting the tab.
  // - onNavigate: Callback to change screens, owned by parent component.
  // Dependencies: NAV_ITEMS (navigation items), styles (bottomNav, navItem, navItemActive).
  // Low risk extraction: No side effects, preserves exact behavior and styling.
  return (
    <div style={styles.bottomNav}>
      {NAV_ITEMS.map((item, i) => {
        const isActive =
          (i === 0 && active === "home") ||
          (i === 1 && active === "portfolio") ||
          (i === 2 && active === "markets") ||
          (i === 3 && active === "trade") ||
          (i === 4 && active === "account");
        return (
          <button
            key={i}
            onClick={() => onNavigate(item.id)}
            style={{
              ...styles.navItem,
              ...(isActive ? styles.navItemActive : {}),
            }}
            aria-label={item.label}
          >
            <span style={{ fontSize: 18 }}>{item.icon}</span>
            <span style={{ fontSize: 10 }}>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export function HomeMainContent({ onNavigate }: { onNavigate: (path: string) => void }) {
  const [activeTab, setActiveTab] = useState("Hot");
  const [balance, setBalance] = useState<number>(0);
useEffect(() => {
  fetch(`${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api/profile`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  }).then(r => r.json()).then(d => { if (d.success) setBalance(d.user.balance || 0); });
}, []);

  return (
    <>
      {/* ── Modern Balance Card ── */}
      <div style={styles.balanceCard}>
        {/* Subtle animated grid overlay */}
        <div style={styles.balCardGrid} />
        <div style={styles.balCardGlow} />

        <div style={styles.balCardTop}>
          <div>
            <div style={styles.balLabel}>
              <span style={styles.balDot} />
              Total Balance
            </div>
            <div style={styles.balAmount}>
              <span style={styles.balCurrency}>$</span>
              {balance.toFixed(2)}
              <span style={styles.balUnit}>USDT</span>
            </div>
            <div style={styles.balSubRow}>
              <span style={styles.balChangePill}>
                {balance > 0
  ? <><span style={{ color: "#0ecb81", marginRight: 3 }}>▲</span>Active Portfolio</>
  : <><span style={{ color: "#f6465d", marginRight: 3 }}>—</span>No change</>
}
              </span>
              <span style={styles.bal24h}>24h change</span>
            </div>
          </div>
          <div style={styles.balRightStats}>
            <div style={styles.balStatBox}>
              <span style={styles.balStatLabel}>Available</span>
              <span style={styles.balStatVal}>${balance.toFixed(2)} </span>
            </div>
            <div style={{ ...styles.balStatBox, borderLeft: "1px solid rgba(255,255,255,0.07)" }}>
              <span style={styles.balStatLabel}>In Trade</span>
              <span style={styles.balStatVal}>${balance.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div style={styles.quickActions}>
          {[
            { label: "Deposit",  icon: "↓", bg: "linear-gradient(135deg,#0ecb8122,#0ecb8108)", border: "#0ecb8133", color: "#0ecb81", glow: "rgba(14,203,129,0.18)" },
            { label: "Withdraw", icon: "↑", bg: "linear-gradient(135deg,#378ADD22,#378ADD08)", border: "#378ADD33", color: "#378ADD", glow: "rgba(55,138,221,0.18)" },
            { label: "Trade",    icon: "⇄", bg: "linear-gradient(135deg,#7C5CFC22,#7C5CFC08)", border: "#7C5CFC33", color: "#a78bfa", glow: "rgba(124,92,252,0.18)" },
            { label: "Transfer", icon: "⟳", bg: "linear-gradient(135deg,#F0B90B22,#F0B90B08)", border: "#F0B90B33", color: "#F0B90B", glow: "rgba(240,185,11,0.18)" },
          ].map((a, i) => (
            <div key={i} style={styles.qaItem}>
              <div style={{
                ...styles.qaIcon,
                background: a.bg,
                border: `1px solid ${a.border}`,
                boxShadow: `0 4px 14px ${a.glow}`,
              }}>
                <span style={{ fontSize: 20, color: a.color, fontWeight: 300 }}>{a.icon}</span>
              </div>
              <span style={styles.qaLabel}>{a.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={styles.tickerStrip}>
        {TICKERS.map((t) => (
          <div key={t.name} style={styles.tick}>
            <span style={styles.tickName}>{t.name}</span>
            <span style={styles.tickPrice}>{t.price}</span>
            <span style={{ fontSize: 11, color: t.up ? "#0ecb81" : "#f6465d" }}>
              {t.change}
            </span>
          </div>
        ))}
      </div>

      <div style={styles.banner}>
        <span style={{ fontSize: 20, color: "#a78bfa" }}>🎁</span>
        <div style={{ flex: 1 }}>
          <div style={styles.bannerTitle}>Refer a friend, earn 50 USDT</div>
          <div style={styles.bannerSub}>Invite friends and get commission rewards</div>
        </div>
        <div style={styles.bannerBtn}>Invite</div>
      </div>

      <div style={styles.tabRow}>
        {["Hot", "Gainers", "Losers", "New"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              ...styles.mktTab,
              ...(activeTab === tab ? styles.mktTabActive : {}),
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      <div style={styles.sectionHeader}>
        <span style={styles.sectionLabel}>Markets</span>
        <button
          type="button"
          onClick={() => onNavigate("/markets")}
          style={{ ...styles.sectionLink, border: "none", background: "none", padding: 0, cursor: "pointer" }}
        >
          See all
        </button>
      </div>

      {MARKETS.map((m) => (
        <button
          key={m.pair}
          type="button"
          onClick={() => onNavigate("/markets")}
          style={{ ...styles.marketRow, border: "none", background: "transparent", width: "100%", textAlign: "left", cursor: "pointer" }}
        >
          <div
            style={{
              ...styles.coinDot,
              background: COIN_COLORS[m.symbol]?.bg ?? "#ffffff11",
              color: COIN_COLORS[m.symbol]?.color ?? "#fff",
              fontSize: m.symbol.length > 1 ? 11 : 13,
            }}
          >
            {m.symbol}
          </div>
          <div style={{ flex: 1 }}>
            <div style={styles.mName}>{m.pair}</div>
            <div style={styles.mVol}>{m.volume}</div>
          </div>
          <Sparkline up={m.sparkUp} />
          <div style={{ textAlign: "right" }}>
            <div style={styles.mPrice}>{m.price}</div>
            <div style={{ fontSize: 12, color: m.change >= 0 ? "#0ecb81" : "#f6465d", marginTop: 2 }}>
              {m.change >= 0 ? "+" : ""}{m.change.toFixed(2)}%
            </div>
          </div>
        </button>
      ))}

      <div style={{ ...styles.sectionHeader, marginTop: 4 }}>
        <span style={styles.sectionLabel}>News</span>
        <button
          type="button"
          onClick={() => onNavigate("/news")}
          style={{ ...styles.sectionLink, border: "none", background: "none", padding: 0, cursor: "pointer" }}
        >
          More
        </button>
      </div>
      <div style={{ padding: "4px 16px 12px", background: "#1a1a2e" }}>
        {[
          { src: "CoinDesk", title: "Bitcoin breaks past $95K as institutional demand surges ahead of ETF rebalancing", time: "2 hours ago" },
          { src: "The Block", title: "Ethereum gas fees hit 3-month low as Layer 2 adoption accelerates", time: "5 hours ago" },
        ].map((n, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onNavigate("/news")}
            style={{ ...styles.newsCard, width: "100%", border: "none", background: "transparent", textAlign: "left", cursor: "pointer" }}
          >
            <div style={styles.newsSrc}>{n.src}</div>
            <div style={styles.newsTitle}>{n.title}</div>
            <div style={styles.newsTime}>{n.time}</div>
          </button>
        ))}
      </div>
    </>
  );
}

const styles: Record<string, CSSProperties> = {
  topBar: {
    background: "#16213e",
    padding: "14px 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottom: "0.5px solid rgba(255,255,255,0.07)",
  },
  logo: { fontSize: 15, fontWeight: 500, color: "#F0B90B", letterSpacing: "0.3px" },
  topIcon: { fontSize: 18, color: "rgba(255,255,255,0.4)", cursor: "pointer" },
  notificationBadge: {
    position: "absolute",
    top: -2,
    right: -2,
    background: "#f6465d",
    color: "white",
    borderRadius: "50%",
    width: 16,
    height: 16,
    fontSize: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
  },
  bottomNav: {
    background: "#16213e",
    borderTop: "0.5px solid rgba(255,255,255,0.08)",
    display: "flex",
    padding: "12px 0 8px",
  },
  navItem: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 3,
    cursor: "pointer",
    background: "transparent",
    border: "none",
    color: "rgba(255,255,255,0.28)",
    fontSize: 10,
    padding: 0,
  },
  navItemActive: { color: "#a78bfa" },
  notificationOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.5)",
    zIndex: 1000,
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    paddingTop: 60,
  },
  notificationPane: {
    background: "white",
    borderRadius: 12,
    width: "90%",
    maxWidth: 400,
    maxHeight: "70vh",
    overflow: "hidden",
    boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
  },
  notificationHeader: {
    padding: "16px 20px",
    borderBottom: "1px solid #e5e7eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  notificationTitle: {
    margin: 0,
    fontSize: 18,
    fontWeight: 600,
    color: "#1f2937",
  },
  notificationButton: {
    padding: "4px 8px",
    fontSize: 12,
    background: "#f3f4f6",
    border: "1px solid #d1d5db",
    borderRadius: 6,
    cursor: "pointer",
    color: "#374151",
  },
  notificationCloseButton: {
    padding: "4px 8px",
    fontSize: 14,
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#6b7280",
  },
  notificationList: {
    maxHeight: "calc(70vh - 80px)",
    overflowY: "auto",
  },
  notificationEmpty: {
    padding: "40px 20px",
    textAlign: "center",
    color: "#6b7280",
  },
  notificationEmptyTitle: {
    fontSize: 16,
    fontWeight: 500,
    marginBottom: 8,
  },
  notificationEmptyText: {
    fontSize: 14,
  },
  notificationItem: {
    padding: "16px 20px",
    borderBottom: "1px solid #f3f4f6",
    cursor: "pointer",
    transition: "background 0.2s",
  },
  notificationItemTitle: {
    fontSize: 14,
    fontWeight: 600,
    color: "#1f2937",
    marginBottom: 4,
  },
  notificationItemText: {
    fontSize: 14,
    color: "#4b5563",
    lineHeight: 1.4,
    marginBottom: 8,
  },
  notificationItemDate: {
    fontSize: 12,
    color: "#9ca3af",
  },
  balanceCard: {
    position: "relative" as const,
    background: "linear-gradient(160deg, #0d1f35 0%, #0a1628 40%, #070f1e 100%)",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
    overflow: "hidden" as const,
    padding: "24px 20px 0",
  },
  balCardGrid: {
    position: "absolute" as const,
    inset: 0,
    backgroundImage: "linear-gradient(rgba(55,138,221,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(55,138,221,0.04) 1px, transparent 1px)",
    backgroundSize: "40px 40px",
    pointerEvents: "none" as const,
  },
  balCardGlow: {
    position: "absolute" as const,
    top: -60,
    right: -40,
    width: 200,
    height: 200,
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(55,138,221,0.12) 0%, transparent 70%)",
    pointerEvents: "none" as const,
  },
  balCardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    position: "relative" as const,
    zIndex: 1,
    marginBottom: 22,
  },
  balLabel: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontSize: 11,
    color: "rgba(255,255,255,0.4)",
    letterSpacing: "0.8px",
    textTransform: "uppercase" as const,
    marginBottom: 8,
    fontFamily: "'DM Mono', monospace",
  },
  balDot: {
    display: "inline-block",
    width: 6,
    height: 6,
    borderRadius: "50%",
    background: "#0ecb81",
    boxShadow: "0 0 6px #0ecb81",
  },
  balAmount: {
    fontSize: 38,
    fontWeight: 600,
    color: "#fff",
    letterSpacing: "-0.02em",
    lineHeight: 1,
    marginBottom: 10,
    fontFamily: "'DM Mono', monospace",
  },
  balCurrency: { fontSize: 20, color: "rgba(255,255,255,0.5)", marginRight: 2, fontWeight: 400 },
  balUnit: { fontSize: 14, color: "rgba(255,255,255,0.35)", marginLeft: 8, fontWeight: 400 },
  balSubRow: { display: "flex", alignItems: "center", gap: 8 },
  balChangePill: {
    display: "inline-flex",
    alignItems: "center",
    fontSize: 11,
    fontWeight: 600,
    color: "#0ecb81",
    background: "rgba(14,203,129,0.1)",
    border: "1px solid rgba(14,203,129,0.2)",
    borderRadius: 999,
    padding: "3px 8px",
    fontFamily: "'DM Mono', monospace",
  },
  bal24h: { fontSize: 11, color: "rgba(255,255,255,0.3)" },
  balRightStats: {
    display: "flex",
    gap: 0,
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 12,
    overflow: "hidden" as const,
    flexShrink: 0,
  },
  balStatBox: {
    display: "flex",
    flexDirection: "column" as const,
    gap: 4,
    padding: "10px 14px",
    minWidth: 80,
  },
  balStatLabel: { fontSize: 10, color: "rgba(255,255,255,0.35)", textTransform: "uppercase" as const, letterSpacing: "0.6px" },
  balStatVal: { fontSize: 14, fontWeight: 600, color: "#fff", fontFamily: "'DM Mono', monospace" },
  quickActions: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    borderTop: "1px solid rgba(255,255,255,0.06)",
    position: "relative" as const,
    zIndex: 1,
  },
  qaItem: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    gap: 8,
    padding: "16px 8px",
    cursor: "pointer",
    borderRight: "1px solid rgba(255,255,255,0.05)",
    transition: "background 0.15s",
  },
  qaIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "transform 0.15s",
  },
  qaLabel: { fontSize: 11, color: "rgba(255,255,255,0.55)", fontWeight: 500, letterSpacing: "0.2px" },
  tickerStrip: {
    background: "#0f0f1a",
    padding: "9px 20px",
    display: "flex",
    gap: 18,
    overflow: "hidden",
    borderBottom: "0.5px solid rgba(255,255,255,0.06)",
  },
  tick: { display: "flex", alignItems: "center", gap: 5, flexShrink: 0 },
  tickName: { fontSize: 11, color: "rgba(255,255,255,0.4)" },
  tickPrice: { fontSize: 11, color: "#fff", fontWeight: 500 },
  banner: {
    background: "#7C5CFC18",
    border: "0.5px solid #7C5CFC55",
    margin: "12px 16px",
    borderRadius: 8,
    padding: "11px 14px",
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  bannerTitle: { fontSize: 13, color: "#a78bfa", fontWeight: 500 },
  bannerSub: { fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 2 },
  bannerBtn: {
    fontSize: 11,
    color: "#a78bfa",
    border: "0.5px solid #a78bfa",
    borderRadius: 12,
    padding: "4px 10px",
    cursor: "pointer",
    flexShrink: 0,
    background: "transparent",
  },
  tabRow: {
    display: "flex",
    padding: "0 20px",
    background: "#16213e",
    borderBottom: "0.5px solid rgba(255,255,255,0.07)",
  },
  mktTab: {
    fontSize: 13,
    padding: "10px 14px 8px",
    color: "rgba(255,255,255,0.35)",
    cursor: "pointer",
    borderBottom: "2px solid transparent",
    background: "transparent",
    border: "none",
  },
  mktTabActive: { color: "#a78bfa", borderBottomColor: "#a78bfa" },
  sectionHeader: {
    padding: "10px 20px 6px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#0f0f1a",
  },
  sectionLabel: { fontSize: 11, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.8px" },
  sectionLink: { fontSize: 12, color: "#a78bfa", cursor: "pointer" },
  marketRow: {
    background: "#1a1a2e",
    borderBottom: "0.5px solid rgba(255,255,255,0.06)",
    padding: "11px 20px",
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  coinDot: {
    width: 34,
    height: 34,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 500,
    flexShrink: 0,
  },
  mName: { fontSize: 14, color: "#fff", fontWeight: 500 },
  mVol: { fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 2 },
  mPrice: { fontSize: 14, color: "#fff", fontWeight: 500 },
  newsCard: {
    background: "#16213e",
    borderRadius: 8,
    border: "0.5px solid rgba(255,255,255,0.07)",
    padding: "12px 14px",
    marginTop: 8,
  },
  newsSrc: { fontSize: 11, color: "rgba(255,255,255,0.3)", marginBottom: 4 },
  newsTitle: { fontSize: 13, color: "#fff", lineHeight: "1.4" },
  newsTime: { fontSize: 11, color: "rgba(255,255,255,0.22)", marginTop: 5 },
};