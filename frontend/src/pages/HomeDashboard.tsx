import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import authService from "../services/authService";
import { useMobileMenu } from "../components/theme/MobileMenuContext";
import { BookCheck, AlertTriangle, XCircle, Megaphone, Bell, ShieldCheck, ShieldAlert, LockKeyhole, LogOut, Globe, BriefcaseBusiness, Store, House, ShieldUser, Lightbulb } from "lucide-react";
import { subscribeAllTickers } from "../services/marketState";

type Screen = "home" | "portfolio" | "markets" | "account";

interface MarketRow {
  symbol: string;
  pair: string;
  volume: string;
  price: string;
  change: number;
  sparkUp: boolean;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error" | "admin";
  isRead: boolean;
  priority: "low" | "medium" | "high";
  createdAt: string;
}

interface NewsItem {
  id: string | number;
  src?: string;
  title: string;
  time: string;
}

const MARKETS: MarketRow[] = [
  { symbol: "₿",    pair: "BTC / USDT",  volume: "Vol $42.1B", price: "$95,412",  change:  2.10, sparkUp: true  },
  { symbol: "Ξ",    pair: "ETH / USDT",  volume: "Vol $18.7B", price: "$2,841",   change:  0.80, sparkUp: true  },
  { symbol: "BNB",  pair: "BNB / USDT",  volume: "Vol $3.2B",  price: "$612.30",  change:  1.40, sparkUp: true  },
  { symbol: "AVAX", pair: "AVAX / USDT", volume: "Vol $890M",  price: "$64.97",   change: -3.40, sparkUp: false },
  { symbol: "SOL",  pair: "SOL / USDT",  volume: "Vol $5.6B",  price: "$178.40",  change: -1.20, sparkUp: false },
];

const TICKERS = [
  { symbol: "BTC",  price: "$95,412", change: "+2.1%",  up: true  },
  { symbol: "ETH",  price: "$2,841",  change: "+0.8%",  up: true  },
  { symbol: "BNB",  price: "$612",    change: "+1.4%",  up: true  },
  { symbol: "SOL",  price: "$178",    change: "−1.2%",  up: false },
  { symbol: "AVAX", price: "$64.97",  change: "−3.4%",  up: false },
];

const SAMPLE_NEWS: NewsItem[] = [
  { id: 1, src: "CoinDesk",  title: "Bitcoin breaks past $95K as institutional demand surges", time: "2h ago" },
  { id: 2, src: "The Block", title: "Ethereum gas fees hit 3-month low as L2 adoption accelerates", time: "5h ago" },
  { id: 3, src: "Reuters",   title: "SEC signals clearer crypto regulatory framework expected", time: "8h ago" },
  { id: 4, src: "Bloomberg", title: "BNB Chain daily active addresses hit all-time high", time: "11h ago" },
];

const COIN_IMAGES: Record<string, string> = {
  BTC: "https://assets.coingecko.com/coins/images/1/small/bitcoin.png",
  ETH: "https://assets.coingecko.com/coins/images/279/small/ethereum.png",
  BNB: "https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png",
  SOL: "https://assets.coingecko.com/coins/images/4128/small/solana.png",
  AVAX: "https://assets.coingecko.com/coins/images/12559/small/Avalanche_Circle_RedWhite_Trans.png",
};

const COIN_COLORS: Record<string, { bg: string; color: string }> = {
  "₿":    { bg: "#F7931A22", color: "#F7931A" },
  "Ξ":    { bg: "#627EEA22", color: "#627EEA" },
  "BNB":  { bg: "#F3BA2F22", color: "#F3BA2F" },
  "AVAX": { bg: "#E8414222", color: "#E84142" },
  "SOL":  { bg: "#14F19522", color: "#14F195" },
};

const NAV_ITEMS: { id: Screen; label: string; icon: React.ReactNode }[] = [
  { id: "home", label: "Home", icon: <House size={18} /> },
  { id: "portfolio", label: "Portfolio", icon: <BriefcaseBusiness size={18} /> },
  { id: "markets", label: "Markets", icon: <Store size={18} /> },
  { id: "account", label: "Account", icon: <ShieldUser size={18} /> },
];

const ALL_MARKETS: MarketRow[] = [
  ...MARKETS,
];

const MARKET_COIN_COLORS: Record<string, { bg: string; color: string }> = {
  ...COIN_COLORS,
  "SOL":  { bg: "#14F19522", color: "#14F195" },
};

function Sparkline({ up }: { up: boolean }) {
  const color = up ? "#0ecb81" : "#f6465d";
  const path = up
    ? "M0,20 L10,17 L20,12 L30,14 L40,7 L50,4 L56,2"
    : "M0,8 L10,10 L20,16 L30,13 L40,20 L50,18 L56,24";
  return (
    <svg width={56} height={28} viewBox="0 0 56 28" style={{ flexShrink: 0 }}>
      <defs>
        <linearGradient id={`hd-sg-${up ? "u" : "d"}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={up
        ? "M0,20 L10,17 L20,12 L30,14 L40,7 L50,4 L56,2 L56,28 L0,28 Z"
        : "M0,8 L10,10 L20,16 L30,13 L40,20 L50,18 L56,24 L56,28 L0,28 Z"}
        fill={`url(#hd-sg-${up ? "u" : "d"})`} />
      <path d={path} fill="none" stroke={color} strokeWidth={1.5} />
    </svg>
  );
}

function NotificationPanel({ notifications, isVisible, onClose, onMarkAsRead, onMarkAllAsRead }: {
  notifications: Notification[]; isVisible: boolean; onClose: () => void;
  onMarkAsRead: (id: string) => void; onMarkAllAsRead: () => void;
}) {
  if (!isVisible) return null;
  const gt = (t: string) => ({ success: "#0ecb81", warning: "#ff8c32", error: "#f6465d", admin: "#ff8c32" }[t] ?? "#378ADD");
  const gi = (t: string) => {
    const props = { size: 18, style: { flexShrink: 0 } as React.CSSProperties };
    switch (t) {
      case "success": return <BookCheck {...props} />;
      case "warning": return <AlertTriangle {...props} />;
      case "error": return <XCircle {...props} />;
      case "admin": return <Megaphone {...props} />;
      default: return <Bell {...props} />;
    }
  };
  const fd = (d: string) => { const m = Math.floor((Date.now() - new Date(d).getTime()) / 60000); if (m < 1) return "Just now"; if (m < 60) return `${m}m ago`; const h = Math.floor(m / 60); if (h < 24) return `${h}h ago`; return `${Math.floor(h / 24)}d ago`; };
  const cleanTitle = (title: string) => title.replace(/^[\u{1F000}-\u{1FFFF}\u2700-\u27BF\u{2600}-\u{26FF}\u{2139}\u{2B50}\u{FE0F}]/u, '').trim();
  return (
    <div className="hd-notif-overlay" onClick={onClose}>
      <div className="hd-notif-panel" onClick={e => e.stopPropagation()}>
        <div className="hd-notif-header">
          <h3 className="hd-notif-title">Notifications</h3>
          <div style={{ display: "flex", gap: 8 }}>
            {notifications.some(n => !n.isRead) && (
              <button className="hd-notif-mark-read" onClick={onMarkAllAsRead}>Mark all read</button>
            )}
            <button className="hd-notif-close" onClick={onClose}>✕</button>
          </div>
        </div>
        <div className="hd-notif-list">
          {notifications.length === 0 ? (
            <div className="hd-notif-empty">
              <Bell size={40} style={{ marginBottom: 12, color: "var(--text-muted)" }} />
              <div className="hd-notif-empty-title">No notifications yet</div>
              <div className="hd-notif-empty-sub">Updates and alerts will appear here.</div>
            </div>
          ) : notifications.map(n => (
            <div key={n.id} className={`hd-notif-item${!n.isRead ? " unread" : ""}`} onClick={() => !n.isRead && onMarkAsRead(n.id)}>
              <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <span style={{ color: gt(n.type), flexShrink: 0, display: "inline-flex" }}>{gi(n.type)}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="hd-notif-item-title">{cleanTitle(n.title)}</div>
                  <div className="hd-notif-item-msg">{n.message}</div>
                  <div className="hd-notif-item-time">{fd(n.createdAt)}</div>
                </div>
                {!n.isRead && <div className="hd-notif-item-dot" style={{ background: gt(n.type) }} />}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function HomeDashboard() {
  const navigate = useNavigate();
  const loc = useLocation();

  const [screen, setScreen] = useState<Screen>("home");

  useEffect(() => {
    const target = loc.state?.targetScreen;
    if (target && (target === "home" || target === "portfolio" || target === "account")) {
      setScreen(target);
    }
  }, []);

  const [activeMarketTab, setActiveMarketTab] = useState("All");
  const [balance, setBalance] = useState(0);
  const [availableBal, setAvailableBal] = useState(0);
  const [lockedBal, setLockedBal] = useState(0);
  const [unrealizedPnl, setUnrealizedPnl] = useState(0);
  const [openPositions, setOpenPositions] = useState<number>(0);
  const [dailyPnL, setDailyPnL] = useState<number>(0);
  const [weeklyPnL, setWeeklyPnL] = useState<number>(0);
  const [userProfile, setUserProfile] = useState<{ kycVerified: boolean; kycStatus: string } | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [newsFeed, setNewsFeed] = useState<NewsItem[]>([]);
  const { isMobileMenuOpen, setIsMobileMenuOpen } = useMobileMenu();
  const [searchVal, setSearchVal] = useState("");
  const [liveTickers, setLiveTickers] = useState<{ symbol: string; price: string; change: string; up: boolean }[]>([]);
  const [liveMarkets, setLiveMarkets] = useState<MarketRow[]>([]);
  const [marketInsights, setMarketInsights] = useState<{ label: string; val: string; c: string }[] | null>(null);

  const userEmail = localStorage.getItem("userEmail") || "user@example.com";
  const userId = localStorage.getItem("userId") || "SW-000000";
  const displayName = userEmail.includes("@")
    ? userEmail.split("@")[0].charAt(0).toUpperCase() + userEmail.split("@")[0].slice(1)
    : "User";
  const avatarInitials = displayName.charAt(0).toUpperCase();

  const fetchBalance = async () => {
    try {
      const [sumRes, posRes] = await Promise.all([
        fetch(`${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api/account/summary`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }),
        fetch(`${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api/account/positions`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }),
      ]);
      if (sumRes.ok) {
        const data = await sumRes.json();
        const avail = Number(data.available) || 0;
        const locked = Number(data.locked) || 0;
        const upnl = Number(data.unrealizedPnl) || 0;
        setAvailableBal(avail);
        setLockedBal(locked);
        setUnrealizedPnl(upnl);
        setBalance(avail + locked + upnl);
        setDailyPnL(Number(data.dailyPnL) || 0);
        setWeeklyPnL(Number(data.weeklyPnL) || 0);
      }
      if (posRes.ok) {
        const positions = await posRes.json();
        const posArr = Array.isArray(positions) ? positions : Array.isArray(positions?.data) ? positions.data : [];
        setOpenPositions(posArr.length);
      }
    } catch {}
  };

  const fetchUserProfile = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api/profile`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      if (data.success) setUserProfile({ kycVerified: data.user?.kycVerified || false, kycStatus: data.user?.kycStatus || "pending" });
    } catch {}
  };

  const fetchNotifications = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api/notifications`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}`, "Content-Type": "application/json" },
      });
      if (res.ok) { const d = await res.json(); if (d.success) setNotifications(d.notifications); }
    } catch {}
  };

  const fetchUnreadCount = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api/notifications/unread-count`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (res.ok) { const d = await res.json(); if (d.success) setUnreadCount(d.unreadCount); }
    } catch {}
  };

  useEffect(() => {
    const unsub = subscribeAllTickers((data) => {
      const targets = ["BTCUSDT","ETHUSDT","BNBUSDT","SOLUSDT","AVAXUSDT"];
      const displayMap: Record<string, { sym: string; pair: string; color: string }> = {
        BTC:  { sym: "₿", pair: "BTC / USDT", color: "#F7931A" },
        ETH:  { sym: "Ξ", pair: "ETH / USDT", color: "#627EEA" },
        BNB:  { sym: "BNB", pair: "BNB / USDT", color: "#F3BA2F" },
        SOL:  { sym: "SOL", pair: "SOL / USDT", color: "#14F195" },
        AVAX: { sym: "AVAX", pair: "AVAX / USDT", color: "#E84142" },
      };
      const tickers: { symbol: string; price: string; change: string; up: boolean }[] = [];
      const markets: MarketRow[] = [];
      for (const t of data) {
        if (!targets.includes(t.symbol)) continue;
        const base = t.symbol.replace("USDT", "");
        const info = displayMap[base];
        if (!info) continue;
        const p = t.price;
        const c = t.changePct;
        const v = t.quoteVol || t.volume24h || 0;
        const pStr = p >= 100 ? `$${p.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}` : `$${p.toFixed(2)}`;
        const vStr = v >= 1e9 ? `Vol $${(v / 1e9).toFixed(1)}B` : v >= 1e6 ? `Vol $${(v / 1e6).toFixed(1)}M` : `Vol $${(v / 1e3).toFixed(0)}K`;
        tickers.push({ symbol: base, price: pStr, change: `${c >= 0 ? "+" : ""}${c.toFixed(2)}%`, up: c >= 0 });
        markets.push({ symbol: info.sym, pair: info.pair, volume: vStr, price: pStr, change: c, sparkUp: c >= 0 });
      }
      if (tickers.length > 0) {
        setLiveTickers(tickers);
        setLiveMarkets(markets);
      }
    });
    return unsub;
  }, []);

  const fetchMarketInsights = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api/market/insights`);
      if (res.ok) { const d = await res.json(); if (Array.isArray(d)) setMarketInsights(d); }
    } catch {}
  };

  const markAsRead = async (id: string) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api/notifications/${id}/read`, {
        method: "PUT", headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (res.ok) { setNotifications(p => p.map(n => n.id === id ? { ...n, isRead: true } : n)); setUnreadCount(p => Math.max(0, p - 1)); }
    } catch {}
  };

  const markAllAsRead = async () => {
    try {
      await fetch(`${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api/notifications/mark-all-read`, {
        method: "PUT", headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setNotifications(p => p.map(n => ({ ...n, isRead: true }))); setUnreadCount(0);
    } catch {}
  };

  useEffect(() => {
    fetchBalance(); fetchUserProfile(); fetchNotifications(); fetchUnreadCount(); fetchMarketInsights();
    const cached = localStorage.getItem("news-cache");
    if (cached) { try { const p = JSON.parse(cached); if (Array.isArray(p) && p.length) setNewsFeed(p); } catch {} }
    const insightInt = setInterval(fetchMarketInsights, 60000);
    const balanceInt = setInterval(fetchBalance, 1000);
    const socket = (window as any).socket;
    if (socket) { socket.on("balanceUpdated", () => fetchBalance()); return () => { socket.off("balanceUpdated"); clearInterval(insightInt); clearInterval(balanceInt); }; }
    return () => { clearInterval(insightInt); clearInterval(balanceInt); };
  }, []);

  const displayedNews = newsFeed.length > 0 ? newsFeed.slice(0, 4).map(i => ({ id: i.id, src: "Swancore's News", title: i.title, time: i.time || "Just now" })) : SAMPLE_NEWS;

  const handleScreenChange = (s: Screen | "trade") => {
    if (s === "markets") { navigate("/markets", { state: { embed: true } }); return; }
    if (s === "trade") { navigate("/trade"); return; }
    setScreen(s);
  };

  const handleLogout = () => { authService.logout(); navigate("/", { replace: true }); };
  const fmt = (n: number) => n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const renderHomeScreen = () => (
    <>
      <div className="hd-balance-hero">
        <div className="hd-hero-grid" />
        <div className="hd-hero-glow" />
          <div className="hd-hero-top">
          <div>
            <div className="hd-hero-label">
              <span className="hd-hero-dot" />
              Total Balance
            </div>
            <div className="hd-hero-amount">
              {fmt(balance)}
              <span className="hd-hero-unit">USDT</span>
            </div>
            <div className="hd-hero-sub-row">
              <span className="hd-hero-pill">
                {balance > 0 ? "▲ Active" : "— No balance"}
              </span>
              <span className="hd-hero-sub-text">
                {balance > 0 ? "Portfolio overview" : "Deposit to get started"}
              </span>
            </div>
          </div>
          <div className="hd-account-mini">
            <div className="hd-account-mini-title">Account</div>
            <div className="hd-account-mini-row">
              <span>24h P&L</span>
              <span style={{ color: dailyPnL >= 0 ? "#0ecb81" : "#f6465d" }}>{(dailyPnL >= 0 ? "+" : "") + "$" + fmt(dailyPnL)}</span>
            </div>
            <div className="hd-account-mini-row">
              <span>7d P&L</span>
              <span style={{ color: weeklyPnL >= 0 ? "#0ecb81" : "#f6465d" }}>{(weeklyPnL >= 0 ? "+" : "") + "$" + fmt(weeklyPnL)}</span>
            </div>
            <div className="hd-account-mini-row">
              <span>Open positions</span>
              <span>{openPositions}</span>
            </div>
          </div>
          <div className="hd-hero-stats">
            <div className="hd-hero-stat">
              <span className="hd-hero-stat-label">Available</span>
                    <span className="hd-hero-stat-val">${fmt(availableBal)}</span>
            </div>
            <div className="hd-hero-stat">
              <span className="hd-hero-stat-label">In Trade</span>
              <span className="hd-hero-stat-val">${fmt(lockedBal + Math.max(0, unrealizedPnl))}</span>
            </div>
            <div className="hd-hero-stat">
              <span className="hd-hero-stat-label">Unreal. P&L</span>
              <span className="hd-hero-stat-val" style={{ color: unrealizedPnl >= 0 ? "#0ecb81" : "#f6465d" }}>{unrealizedPnl >= 0 ? "+" : ""}${fmt(unrealizedPnl)}</span>
            </div>
          </div>
        </div>
        <div className="hd-qa-grid">
          {[
            { label: "Deposit",  icon: "↓", c: "#0ecb81" },
            { label: "Withdraw", icon: "↑", c: "#f6465d" },
            { label: "Trade",    icon: "⇄", c: "#378ADD" },
            { label: "Transfer", icon: "⟳", c: "#ff8c32" },
          ].map((a, i) => (
            <div key={i} className="hd-qa-item" onClick={() => { if (a.label === "Trade") navigate("/trade"); }} style={{ cursor: a.label === "Trade" ? "pointer" : undefined }}>
              <div className="hd-qa-icon" style={{ borderColor: `${a.c}44`, color: a.c, background: `${a.c}11` }}>
                {a.icon}
              </div>
              <span className="hd-qa-label" style={{ color: a.c }}>{a.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="hd-ticker-wrap">
        <div className="hd-ticker-track">
          {(liveTickers.length > 0 ? liveTickers : TICKERS).map((t, i) => (
            <div key={`${t.symbol}-${i}`} className="hd-tick-item">
              <span className="hd-tick-name">{t.symbol}</span>
              <span className="hd-tick-price">{t.price}</span>
              <span className="hd-tick-change" style={{ color: t.up ? "#0ecb81" : "#f6465d" }}>{t.change}</span>
            </div>
          ))}
          {(liveTickers.length > 0 ? liveTickers : TICKERS).map((t, i) => (
            <div key={`dup-${t.symbol}-${i}`} className="hd-tick-item">
              <span className="hd-tick-name">{t.symbol}</span>
              <span className="hd-tick-price">{t.price}</span>
              <span className="hd-tick-change" style={{ color: t.up ? "#0ecb81" : "#f6465d" }}>{t.change}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="hd-banner">
        <span className="hd-banner-icon">🎁</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="hd-banner-title">Refer a friend, earn 50 USDT</div>
          <div className="hd-banner-sub">Invite friends and earn commission rewards</div>
        </div>
        <button className="hd-banner-btn">Invite</button>
      </div>

      <div className="hd-section">
        <div className="hd-section-hdr">
          <span className="hd-section-title">Markets</span>
          <button className="hd-section-link" onClick={() => navigate("/markets", { state: { embed: true } })}>See all →</button>
        </div>
        <div className="hd-section-tabs">
          {["All", "Gainers", "Losers"].map(t => (
            <button key={t} className={`hd-tab${activeMarketTab === t ? " active" : ""}`} onClick={() => setActiveMarketTab(t)}>{t}</button>
          ))}
        </div>
        <div className="hd-mkt-grid">
          {(() => {
            const mkts = liveMarkets.length > 0 ? liveMarkets : ALL_MARKETS;
            const filtered = activeMarketTab === "All" ? mkts : activeMarketTab === "Gainers" ? mkts.filter((m: MarketRow) => m.change > 0) : mkts.filter((m: MarketRow) => m.change < 0);
            return filtered.map((m: MarketRow) => (
            <button key={m.pair} className="hd-mkt-row" onClick={() => navigate("/markets", { state: { embed: true } })}>
              <img src={COIN_IMAGES[m.pair.split(" / ")[0]]} alt={m.pair.split(" / ")[0]} style={{ width: 20, height: 20, objectFit: "contain", borderRadius: "50%" }} onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="hd-mkt-name">{m.pair}</div>
                <div className="hd-mkt-vol">{m.volume}</div>
              </div>
              <Sparkline up={m.sparkUp} />
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div className="hd-mkt-price">{m.price}</div>
                <div className="hd-mkt-change" style={{ color: m.change > 0 ? "#0ecb81" : m.change < 0 ? "#f6465d" : "rgba(255,255,255,0.25)" }}>
                  {m.change > 0 ? "+" : ""}{m.change.toFixed(2)}%
                </div>
              </div>
            </button>
          ));
          })()}
        </div>
      </div>

      <div className="hd-section">
        <div className="hd-section-hdr">
          <span className="hd-section-title">News</span>
          <button className="hd-section-link" onClick={() => navigate("/news", { state: { embed: true } })}>More →</button>
        </div>
        <div className="hd-news-grid">
          {displayedNews.map(n => (
            <button key={n.id} className="hd-news-card" onClick={() => navigate("/news", { state: { embed: true } })}>
              <div className="hd-news-src">{n.src}</div>
              <div className="hd-news-title">{n.title}</div>
              <div className="hd-news-time">{n.time}</div>
            </button>
          ))}
        </div>
      </div>
    </>
  );

  const renderPortfolioScreen = () => (
    <>
      <div className="hd-balance-hero" style={{ paddingBottom: 0 }}>
        <div className="hd-hero-grid" />
        <div className="hd-hero-glow" />
        <div className="hd-hero-top" style={{ justifyContent: "center", textAlign: "center" }}>
          <div>
            <div className="hd-hero-label" style={{ justifyContent: "center" }}>
              <span className="hd-hero-dot" /> Portfolio Value
            </div>
            <div className="hd-hero-amount">
              <span className="hd-hero-currency">$</span>
              {fmt(balance)}
              <span className="hd-hero-unit">USDT</span>
            </div>
            <span className="hd-hero-pill">No holdings yet</span>
          </div>
        </div>
      </div>
      <div className="hd-empty-state">
        <BriefcaseBusiness size={40} style={{ color: "var(--text-muted)", marginBottom: 8 }} />
        <div className="hd-empty-title">No holdings yet</div>
        <div className="hd-empty-sub">Deposit USDT and make your first trade</div>
      </div>
    </>
  );

  const renderAccountScreen = () => (
    <>
      <div className="hd-profile-hero">
        <div className="hd-avatar">{avatarInitials}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="hd-profile-name">{displayName}</div>
          <div className="hd-profile-email">{userEmail}</div>
          <div className="hd-profile-uid">UID: {userId}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-end" }}>
          <span className={`hd-badge ${userProfile?.kycVerified ? "verified" : "unverified"}`} style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
            {userProfile?.kycVerified ? <><ShieldCheck size={14} /> Verified</> : <><ShieldAlert size={14} /> Unverified</>}
          </span>
        </div>
      </div>
      {!userProfile?.kycVerified && (
        <button className="hd-kyc-banner" onClick={() => navigate("/verification")}>
          <ShieldAlert size={20} style={{ color: "#ff8c32", flexShrink: 0 }} />
          <div style={{ flex: 1, textAlign: "left" }}>
            <div className="hd-kyc-title">Complete identity verification</div>
            <div className="hd-kyc-sub">Unlock deposits, withdrawals and trading</div>
          </div>
          <span className="hd-kyc-action">Verify</span>
        </button>
      )}
      <div className="hd-section">
        <div className="hd-section-hdr">
          <span className="hd-section-title">Account</span>
        </div>
        {[
          { icon: userProfile?.kycVerified ? <ShieldCheck size={18} style={{ color: "#0ecb81" }} /> : <ShieldAlert size={18} style={{ color: "#ff8c32" }} />, title: "KYC verification", sub: userProfile?.kycVerified ? "Verified" : "Not started", action: !userProfile?.kycVerified ? () => navigate("/verification") : undefined },
          { icon: <LockKeyhole size={18} />, title: "Security", sub: "Password · 2FA" },
          { icon: <Bell size={18} />, title: "Notifications", sub: "Price alerts, security notices", action: () => setShowNotifications(true) },
          { icon: <Globe size={18} />, title: "Language & region", sub: "English · USDT" },
        ].map((r, i) => (
          <button key={i} className="hd-acc-row" onClick={r.action} style={r.action ? {} : { cursor: "default" }}>
            <span style={{ fontSize: 18 }}>{r.icon}</span>
            <div style={{ flex: 1, minWidth: 0, textAlign: "left" }}>
              <div className="hd-acc-row-title">{r.title}</div>
              <div className="hd-acc-row-sub">{r.sub}</div>
            </div>
            <span className="hd-acc-row-arrow">›</span>
          </button>
        ))}
      </div>
      <button className="hd-logout-btn" onClick={handleLogout}>
        <LogOut size={16} /> Log out
      </button>
    </>
  );

  return (
    <>
      <style>{`
        .hd-root {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: var(--bg, #0B0E11);
          color: var(--text-primary, #f8fafc);
          padding-top: 76px;
        }
        .hd-mobile-menu {
          position: absolute;
          min-width: 200px; padding: 8px; border-radius: 12px;
          border: 1px solid var(--border, #1e293b);
          background: var(--surface, #1E2329); box-shadow: 0 20px 40px rgba(0,0,0,0.4);
          z-index: 200;
        }
        .hd-mobile-menu-item {
          display: flex; align-items: center; gap: 10px;
          width: 100%; padding: 10px 12px; border-radius: 8px;
          border: none; background: transparent; color: var(--text-primary);
          cursor: pointer; font-size: 13px; font-family: inherit; text-align: left;
        }
        .hd-mobile-menu-item:hover { background: rgba(255,255,255,0.06); }
        .hd-mobile-divider { height: 1px; background: var(--border, #1e293b); margin: 6px 8px; }
        .hd-mobile-section-title {
          font-size: 10px; color: var(--primary); text-transform: uppercase;
          letter-spacing: 0.5px; padding: 6px 12px 4px;
        }
        .hd-mobile-mkt-row {
          display: flex; justify-content: space-between; align-items: center;
          padding: 4px 12px; font-size: 12px;
        }
        .hd-mobile-mkt-row span:first-child { color: var(--text-secondary); }
        .hd-mobile-mkt-row span:last-child { font-weight: 600; color: var(--text-primary); }
        .hd-mobile-price-row {
          display: flex; justify-content: space-between; align-items: center;
          padding: 3px 12px;
        }
        .hd-mobile-price-left { display: flex; align-items: center; gap: 6px; }
        .hd-mobile-price-sym {
          font-size: 11px; font-weight: 700; color: var(--text-primary);
          width: 20px; height: 20px; border-radius: 50%; background: var(--surface-strong);
          display: flex; align-items: center; justify-content: center;
        }
        .hd-mobile-price-name { font-size: 11px; color: var(--text-secondary); }
        .hd-mobile-price-right { display: flex; align-items: center; gap: 8px; }
        .hd-mobile-price-val { font-size: 11px; font-weight: 600; color: var(--text-primary); }
        .hd-mobile-price-chg { font-size: 10px; font-weight: 600; }
        .hd-body {
          display: flex; flex: 1;
          padding: 0;
          max-width: 100%;
          margin: 0 auto;
          width: 100%;
        }
        .hd-sidebar {
          display: none; flex-direction: column; gap: 12px;
          width: 220px; flex-shrink: 0; padding: 16px 0 16px 16px;
          position: sticky; top: 56px; align-self: flex-start;
          max-height: calc(100vh - 56px); overflow-y: auto;
        }
        .hd-sidebar::-webkit-scrollbar { display: none; }
        .hd-main {
          flex: 1; min-width: 0;
          padding: 16px;
          max-width: 100%;
        }
        .hd-right {
          display: none; flex-direction: column; gap: 12px;
          width: 260px; flex-shrink: 0; padding: 16px 16px 16px 0;
          position: sticky; top: 56px; align-self: flex-start;
          max-height: calc(100vh - 56px); overflow-y: auto;
        }
        .hd-right::-webkit-scrollbar { display: none; }
        .hd-bottom-nav {
          display: flex; position: fixed; bottom: 0; left: 0; right: 0;
          height: 56px; background: var(--surface, #1E2329);
          border-top: 1px solid var(--border, #1e293b);
          z-index: 100; padding: 4px 0 env(safe-area-inset-bottom);
        }
        .hd-bottom-nav-item {
          flex: 1; display: flex; flex-direction: column; align-items: center;
          justify-content: center; gap: 2px; border: none; background: transparent;
          color: var(--text-secondary, #94a3b8); cursor: pointer;
          font-size: 10px; font-family: inherit; padding: 0;
        }
        .hd-bottom-nav-item.active { color: #ff8c32; }
        .hd-bottom-nav-item span:first-child { font-size: 18px; }

        /* Balance Hero */
        .hd-balance-hero {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 16px; overflow: hidden;
          padding: 20px 20px 0; position: relative; margin-bottom: 12px;
        }
        .hd-hero-grid {
          position: absolute; inset: 0;
          background-image: linear-gradient(rgba(55,138,221,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(55,138,221,0.04) 1px, transparent 1px);
          background-size: 40px 40px; pointer-events: none;
        }
        :root[data-theme="light"] .hd-hero-grid {
          background-image: linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px);
        }
        .hd-hero-glow {
          position: absolute; top: -40px; right: -30px;
          width: 200px; height: 200px; border-radius: 50%;
          background: radial-gradient(circle, rgba(55,138,221,0.12) 0%, transparent 70%);
          pointer-events: none;
        }
        :root[data-theme="light"] .hd-hero-glow {
          background: radial-gradient(circle, rgba(255,140,50,0.06) 0%, transparent 70%);
        }
        .hd-hero-top {
          display: flex; flex-direction: column; gap: 12px;
          position: relative; z-index: 1;
        }
        .hd-hero-label {
          display: flex; align-items: center; gap: 6px;
          font-size: 11px; color: var(--primary);
          text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 6px;
        }
        .hd-hero-dot {
          width: 6px; height: 6px; border-radius: 50%; background: #0ecb81;
          box-shadow: 0 0 6px #0ecb81; animation: hdPulse 2s ease-in-out infinite;
        }
        @keyframes hdPulse { 0%,100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.6; transform: scale(0.85); } }
        .hd-hero-amount {
          font-size: 32px; font-weight: 600; color: var(--text-primary);
          letter-spacing: -0.02em; line-height: 1; margin-bottom: 8px;
          font-variant-numeric: tabular-nums;
        }
        .hd-hero-currency { font-size: 18px; color: var(--primary); font-weight: 400; }
        .hd-hero-unit { font-size: 13px; color: var(--primary); margin-left: 6px; font-weight: 400; }
        .hd-hero-sub-row { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
        .hd-hero-pill {
          display: inline-flex; align-items: center; gap: 4px; font-size: 11px; font-weight: 600;
          color: var(--primary); background: var(--surface);
          border: 1px solid var(--border); border-radius: 999px; padding: 2px 8px;
        }
        .hd-hero-sub-text { font-size: 11px; color: var(--text-muted); }
        .hd-account-mini {
          background: var(--surface-strong); border: 1px solid var(--border);
          border-radius: 10px; padding: 10px 12px; position: absolute;
          top: 0; right: 0; min-width: 140px;
        }
        .hd-account-mini-title {
          font-size: 9px; color: var(--primary); text-transform: uppercase;
          letter-spacing: 0.5px; margin-bottom: 6px;
        }
        .hd-account-mini-row {
          display: flex; justify-content: space-between; align-items: center;
          padding: 3px 0; font-size: 11px;
        }
        .hd-account-mini-row span:first-child { color: var(--text-secondary); }
        .hd-account-mini-row span:last-child { font-weight: 600; color: var(--text-primary); }
        .hd-hero-stats {
          display: flex; gap: 0; background: var(--surface-strong);
          border: 1px solid var(--border); border-radius: 8px; overflow: hidden;
          width: fit-content;
        }
        .hd-hero-stat {
          display: flex; flex-direction: column; gap: 0;
          padding: 3px 8px; min-width: 0;
        }
        .hd-hero-stat + .hd-hero-stat { border-left: 1px solid var(--border); }
        .hd-hero-stat-label { font-size: 8px; color: var(--primary); text-transform: uppercase; letter-spacing: 0.4px; }
        .hd-hero-stat-val { font-size: 11px; font-weight: 600; color: var(--text-primary); font-variant-numeric: tabular-nums; }
        .hd-hero-stat-val.mute { color: var(--text-muted); opacity: 0.6; }
        .hd-qa-grid {
          display: grid; grid-template-columns: repeat(4, 1fr);
          border-top: 1px solid var(--border); margin-top: 16px;
          position: relative; z-index: 1;
        }
        .hd-qa-item {
          display: flex; flex-direction: column; align-items: center; gap: 6px;
          padding: 14px 4px; cursor: pointer;
          border-right: 1px solid var(--border);
        }
        .hd-qa-item:last-child { border-right: none; }
        .hd-qa-icon {
          width: 40px; height: 40px; border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          font-size: 18px; border: 1px solid; transition: transform 0.15s;
        }
        .hd-qa-item:hover .hd-qa-icon { transform: translateY(-2px); }
        .hd-qa-label { font-size: 11px; color: var(--primary); font-weight: 500; }

        /* Ticker - animated marquee */
        .hd-ticker-wrap {
          overflow: hidden; white-space: nowrap;
          background: var(--surface, #1E2329);
          border: 1px solid var(--border, #1e293b);
          border-radius: 10px; margin: 12px 0;
          width: 100%;
        }
        .hd-ticker-track {
          display: inline-flex;
          animation: hdTickerScroll 40s linear infinite;
        }
        .hd-ticker-track:hover { animation-play-state: paused; }
        @keyframes hdTickerScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .hd-tick-item {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 10px 18px; flex-shrink: 0;
          border-right: 1px solid var(--border, #1e293b);
        }
        .hd-tick-name { font-size: 12px; color: var(--text-secondary, #94a3b8); font-weight: 500; }
        .hd-tick-price { font-size: 12px; color: var(--text-primary); font-weight: 600; }
        .hd-tick-change { font-size: 11px; font-weight: 600; }

        /* Banner */
        .hd-banner {
          display: flex; align-items: center; gap: 12px;
          background: rgba(255,140,50,0.08); border: 1px solid rgba(255,140,50,0.2);
          border-radius: 12px; padding: 14px 16px; margin-bottom: 12px;
        }
        .hd-banner-icon { font-size: 20px; flex-shrink: 0; }
        .hd-banner-title { font-size: 14px; color: #ff8c32; font-weight: 600; }
        .hd-banner-sub { font-size: 11px; color: rgba(255,255,255,0.35); margin-top: 2px; }
        .hd-banner-btn {
          flex-shrink: 0; padding: 6px 14px; border-radius: 8px;
          background: rgba(255,140,50,0.12); border: 1px solid rgba(255,140,50,0.3);
          color: #ff8c32; font-size: 12px; font-weight: 600; cursor: pointer; font-family: inherit;
        }

        /* Section */
        .hd-section {
          background: var(--surface, #1E2329);
          border: 1px solid var(--border, #1e293b);
          border-radius: 12px; overflow: hidden; margin-bottom: 12px;
        }
        .hd-section-hdr {
          display: flex; align-items: center; justify-content: space-between;
          padding: 14px 16px;
        }
        .hd-section-title { font-size: 13px; font-weight: 600; color: var(--text-primary); }
        .hd-section-link { font-size: 12px; color: #ff8c32; cursor: pointer; border: none; background: none; font-family: inherit; }
        .hd-section-tabs {
          display: flex; gap: 2px; padding: 0 16px;
          border-bottom: 1px solid var(--border, #1e293b);
        }
        .hd-tab {
          padding: 8px 12px 8px; font-size: 12px; color: var(--text-secondary, #94a3b8);
          cursor: pointer; border: none; background: transparent;
          border-bottom: 2px solid transparent; margin-bottom: -1px;
          font-family: inherit; font-weight: 500;
        }
        .hd-tab.active { color: #ff8c32; border-bottom-color: #ff8c32; }

        /* Markets */
        .hd-mkt-grid { display: grid; }
        .hd-mkt-row {
          display: flex; align-items: center; gap: 10px;
          padding: 11px 16px; border-bottom: 1px solid var(--border, #1e293b);
          cursor: pointer; background: transparent; border-left: none; border-right: none;
          border-top: none; width: 100%; text-align: left; font-family: inherit;
        }
        .hd-mkt-row:last-child { border-bottom: none; }
        .hd-mkt-row:hover { background: rgba(255,255,255,0.03); }
        .hd-coin-dot {
          width: 32px; height: 32px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-weight: 600; flex-shrink: 0; font-size: 12px;
        }
        .hd-mkt-name { font-size: 13px; color: var(--text-primary); font-weight: 500; }
        .hd-mkt-vol { font-size: 10px; color: var(--text-secondary); margin-top: 1px; }
        .hd-mkt-price { font-size: 13px; color: var(--text-primary); font-weight: 600; }
        .hd-mkt-change { font-size: 11px; margin-top: 1px; font-weight: 500; }

        /* News */
        .hd-news-grid { display: grid; gap: 8px; padding: 12px 16px; }
        .hd-news-card {
          background: rgba(255,255,255,0.03); border: 1px solid var(--border, #1e293b);
          border-radius: 8px; padding: 12px; cursor: pointer;
          text-align: left; width: 100%; font-family: inherit;
        }
        .hd-news-card:hover { border-color: rgba(255,255,255,0.12); }
        .hd-news-src { font-size: 10px; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.4px; margin-bottom: 4px; }
        .hd-news-title { font-size: 12px; color: var(--text-primary); line-height: 1.4; margin-bottom: 6px; }
        .hd-news-time { font-size: 10px; color: var(--text-secondary); }

        /* Profile */
        .hd-profile-hero {
          display: flex; align-items: center; gap: 12px;
          padding: 16px; margin-bottom: 12px;
          background: var(--surface, #1E2329);
          border: 1px solid var(--border, #1e293b);
          border-radius: 12px;
        }
        .hd-avatar {
          width: 44px; height: 44px; border-radius: 50%;
          background: rgba(255,140,50,0.15); border: 2px solid #ff8c32;
          display: flex; align-items: center; justify-content: center;
          font-size: 16px; font-weight: 600; color: #ff8c32; flex-shrink: 0;
        }
        .hd-profile-name { font-size: 15px; font-weight: 600; color: var(--text-primary); }
        .hd-profile-email { font-size: 12px; color: var(--text-secondary); margin-top: 2px; }
        .hd-profile-uid { font-size: 11px; color: var(--text-secondary); margin-top: 1px; }
        .hd-badge { font-size: 10px; padding: 2px 8px; border-radius: 999px; }
        .hd-badge.verified { background: rgba(14,203,129,0.12); color: #0ecb81; }
        .hd-badge.unverified { background: rgba(255,140,50,0.12); color: #ff8c32; }
        .hd-kyc-banner {
          display: flex; align-items: center; gap: 10px; width: 100%;
          padding: 12px 16px; margin-bottom: 12px;
          border-radius: 12px; border: 1px solid rgba(255,140,50,0.25);
          background: rgba(255,140,50,0.06); cursor: pointer; font-family: inherit;
        }
        .hd-kyc-title { font-size: 13px; color: #ff8c32; font-weight: 500; }
        .hd-kyc-sub { font-size: 11px; color: rgba(255,255,255,0.35); margin-top: 2px; }
        .hd-kyc-action { font-size: 11px; color: #0f172a; background: #ff8c32; border-radius: 999px; padding: 6px 12px; font-weight: 600; flex-shrink: 0; }
        .hd-acc-row {
          display: flex; align-items: center; gap: 12px; width: 100%;
          padding: 12px 16px; border: none; background: transparent;
          border-bottom: 1px solid var(--border, #1e293b); font-family: inherit;
        }
        .hd-acc-row:last-child { border-bottom: none; }
        .hd-acc-row:hover { background: rgba(255,255,255,0.03); }
        .hd-acc-row-title { font-size: 13px; color: var(--text-primary); }
        .hd-acc-row-sub { font-size: 11px; color: var(--text-secondary); margin-top: 2px; }
        .hd-acc-row-arrow { color: var(--text-secondary); font-size: 16px; }
        .hd-logout-btn {
          display: flex; align-items: center; gap: 8px; width: 100%;
          padding: 12px 16px; border: 1px solid rgba(246,70,93,0.2);
          background: rgba(246,70,93,0.06); border-radius: 12px;
          color: #f6465d; font-size: 13px; cursor: pointer; font-family: inherit; margin-top: 4px;
        }

        /* Empty state */
        .hd-empty-state {
          display: flex; flex-direction: column; align-items: center;
          padding: 40px 20px; text-align: center;
          background: var(--surface, #1E2329);
          border: 1px solid var(--border, #1e293b);
          border-radius: 12px;
        }
        .hd-empty-icon {
          width: 48px; height: 48px; border-radius: 50%;
          background: rgba(255,140,50,0.1); display: flex;
          align-items: center; justify-content: center;
          font-size: 22px; color: #ff8c32; margin-bottom: 12px;
        }
        .hd-empty-title { font-size: 15px; color: var(--text-primary); font-weight: 500; margin-bottom: 6px; }
        .hd-empty-sub { font-size: 13px; color: var(--text-secondary); line-height: 1.4; }

        /* Notifications */
        .hd-notif-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: 500;
          display: flex; align-items: flex-start; justify-content: flex-end;
          padding: 64px 16px 16px;
        }
        .hd-notif-panel {
          width: 100%; max-width: 360px; max-height: 70vh;
          background: var(--surface, #1E2329);
          border: 1px solid var(--border, #1e293b);
          border-radius: 16px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.5);
        }
        .hd-notif-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 14px 16px; border-bottom: 1px solid var(--border, #1e293b);
        }
        .hd-notif-title { margin: 0; font-size: 15px; font-weight: 700; color: var(--text-primary); }
        .hd-notif-mark-read {
          padding: 4px 10px; font-size: 11px; border-radius: 6px;
          background: rgba(255,140,50,0.1); border: 1px solid rgba(255,140,50,0.25);
          cursor: pointer; color: #ff8c32; font-family: inherit;
        }
        .hd-notif-close { padding: 4px 8px; font-size: 14px; background: none; border: none; cursor: pointer; color: var(--text-secondary); }
        .hd-notif-list { max-height: calc(70vh - 56px); overflow-y: auto; }
        .hd-notif-empty { padding: 40px 20px; text-align: center; color: var(--text-secondary); }
        .hd-notif-empty-title { font-size: 14px; color: var(--text-primary); font-weight: 500; margin-bottom: 4px; }
        .hd-notif-empty-sub { font-size: 12px; }
        .hd-notif-item { padding: 12px 16px; border-bottom: 1px solid var(--border, #1e293b); cursor: pointer; }
        .hd-notif-item.unread { background: rgba(255,140,50,0.04); }
        .hd-notif-item-title { font-size: 13px; font-weight: 600; color: var(--text-primary); margin-bottom: 2px; }
        .hd-notif-item-msg { font-size: 12px; color: var(--text-secondary); line-height: 1.4; margin-bottom: 4px; }
        .hd-notif-item-time { font-size: 11px; color: var(--text-secondary); }
        .hd-notif-item-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; margin-top: 4px; }

        /* Tablet */
        @media (min-width: 640px) {
          .hd-main { padding: 20px; }
          .hd-news-grid { grid-template-columns: 1fr 1fr; }
          .hd-mkt-grid { grid-template-columns: 1fr 1fr; }
          .hd-mkt-row:nth-child(odd) { border-right: 1px solid var(--border, #1e293b); }
          .hd-notif-overlay { padding-right: 24px; }
        }

        /* Desktop */
        @media (min-width: 1024px) {
          .hd-sidebar { display: flex; }
          .hd-right { display: flex; }
          .hd-bottom-nav { display: none; }
          .hd-main { padding: 24px; max-width: 900px; }
          .hd-hero-top { flex-direction: row; justify-content: space-between; align-items: flex-start; }
          .hd-hero-amount { font-size: 40px; }
          .hd-account-mini { display: none; }
          .hd-news-grid { grid-template-columns: 1fr 1fr; }
        }

        @media (min-width: 1200px) {
          .hd-body { max-width: 1440px; }
          .hd-right { width: 280px; }
        }
      `}</style>

      <div className="hd-root">
        <div style={{ position: "relative" }}>
          {isMobileMenuOpen && (
            <div className="hd-mobile-menu" style={{ right: 16, top: 8 }}>
              <div className="hd-mobile-section-title">Live Prices</div>
              {[["BTC","$62,764.29","+1.82%"],["ETH","$1,656.61","+1.21%"],["BNB","$599.29","+2.14%"],["SOL","$65.10","+1.42%"],["AVAX","$6.59","+1.03%"]].map(([sym,price,chg]) => (
                <div key={sym} className="hd-mobile-price-row">
                  <div className="hd-mobile-price-left">
                    <span className="hd-mobile-price-sym">{sym}</span>
                    <span className="hd-mobile-price-name">{sym}</span>
                  </div>
                  <div className="hd-mobile-price-right">
                    <span className="hd-mobile-price-val">{price}</span>
                    <span className="hd-mobile-price-chg" style={{color:chg.startsWith("+")?"#0ecb81":"#f6465d"}}>{chg}</span>
                  </div>
                </div>
              ))}
              <div className="hd-mobile-divider" />
              <div className="hd-mobile-section-title">Market Insights</div>
              <div className="hd-mobile-mkt-row"><span>Market momentum</span><span>Strong ↑</span></div>
              <div className="hd-mobile-mkt-row"><span>BTC dominance</span><span>49.7%</span></div>
              <div className="hd-mobile-mkt-row"><span>Fear & Greed</span><span style={{color:"#0ecb81"}}>87 · Greed</span></div>
              <div className="hd-mobile-mkt-row"><span>24h Volume</span><span>$2.2B</span></div>
              <button className="hd-mobile-menu-item" onClick={() => { setIsMobileMenuOpen(false); navigate("/about"); }}>
                <Lightbulb size={14} /> <span>About</span>
              </button>
            </div>
          )}
        </div>

        <div className="hd-body">
          <aside className="hd-sidebar">
            <div style={{ background: "var(--surface, #1E2329)", border: "1px solid var(--border, #1e293b)", borderRadius: 12, padding: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <div className="hd-avatar" style={{ width: 38, height: 38, fontSize: 14 }}>{avatarInitials}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>{displayName}</div>
                  <div style={{ fontSize: 11, color: "var(--text-secondary)" }}>UID: {userId}</div>
                </div>
              </div>
              <span className={`hd-badge ${userProfile?.kycVerified ? "verified" : "unverified"}`} style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                {userProfile?.kycVerified ? <><ShieldCheck size={14} /> Verified</> : <><ShieldAlert size={14} /> Unverified</>}
              </span>
            </div>
            <div style={{ background: "var(--surface, #1E2329)", border: "1px solid var(--border, #1e293b)", borderRadius: 12, padding: 10 }}>
              <div style={{ fontSize: 10, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.6px", padding: "4px 6px 8px" }}>Navigation</div>
              {NAV_ITEMS.map(item => (
                <button key={item.id} onClick={() => handleScreenChange(item.id)}
                  style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "8px 10px", borderRadius: 8, border: "none", background: screen === item.id ? "rgba(255,140,50,0.1)" : "transparent", color: screen === item.id ? "#ff8c32" : "var(--text-secondary)", cursor: "pointer", fontSize: 13, fontFamily: "inherit", textAlign: "left", marginBottom: 2 }}>
                  <span style={{ fontSize: 14 }}>{item.icon}</span> {item.label}
                </button>
              ))}
            </div>
            <div style={{ background: "var(--surface, #1E2329)", border: "1px solid var(--border, #1e293b)", borderRadius: 12, padding: 14 }}>
              <div style={{ fontSize: 10, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 10 }}>Account</div>
              {[
                { label: "24h P&L", val: (dailyPnL >= 0 ? "+" : "") + "$" + fmt(dailyPnL), cls: dailyPnL >= 0 ? "#0ecb81" : "#f6465d" },
                { label: "7d P&L", val: (weeklyPnL >= 0 ? "+" : "") + "$" + fmt(weeklyPnL), cls: weeklyPnL >= 0 ? "#0ecb81" : "#f6465d" },
                { label: "Open positions", val: String(openPositions) },
              ].map(r => (
                <div key={r.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: "1px solid var(--border, #1e293b)" }}>
                  <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>{r.label}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: (r as any).cls || "var(--text-primary)" }}>{r.val}</span>
                </div>
              ))}
            </div>
          </aside>

          <main className="hd-main" style={{ paddingBottom: 80 }}>
            {screen === "home" && renderHomeScreen()}
            {screen === "portfolio" && renderPortfolioScreen()}
            {screen === "markets" && renderHomeScreen()}
            {screen === "account" && renderAccountScreen()}
          </main>

          <aside className="hd-right">
            <div style={{ background: "var(--surface, #1E2329)", border: "1px solid var(--border, #1e293b)", borderRadius: 12, padding: 14 }}>
              <div style={{ fontSize: 10, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 10 }}>Live Prices</div>
              {(liveTickers.length > 0 ? liveTickers : TICKERS).map(t => (
                <div key={t.symbol} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--border, #1e293b)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <img src={COIN_IMAGES[t.symbol]} alt={t.symbol} style={{ width: 18, height: 18, objectFit: "contain", borderRadius: "50%" }} onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                    <span style={{ fontSize: 13, color: "var(--text-primary)", fontWeight: 500 }}>{t.symbol}</span>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 13, color: "var(--text-primary)", fontWeight: 600 }}>{t.price}</div>
                    <div style={{ fontSize: 11, color: t.up ? "#0ecb81" : "#f6465d" }}>{t.change}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ background: "var(--surface, #1E2329)", border: "1px solid var(--border, #1e293b)", borderRadius: 12, padding: 14 }}>
              <div style={{ fontSize: 10, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 10 }}>Market Insights</div>
              {(marketInsights || [
                { label: "Market momentum", val: "Strong ↑", c: "#0ecb81" },
                { label: "BTC dominance", val: "54.2%", c: "var(--text-primary)" },
                { label: "Fear & Greed", val: "72 · Greed", c: "#ff8c32" },
                { label: "24h Volume", val: "$86.4B", c: "var(--text-primary)" },
              ]).map(r => (
                <div key={r.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 0", borderBottom: "1px solid var(--border, #1e293b)" }}>
                  <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>{r.label}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: r.c }}>{r.val}</span>
                </div>
              ))}
            </div>
          </aside>
        </div>

        <nav className="hd-bottom-nav">
          {NAV_ITEMS.map(item => (
            <button key={item.id} className={`hd-bottom-nav-item${screen === item.id ? " active" : ""}`} onClick={() => handleScreenChange(item.id)}>
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <NotificationPanel
        notifications={notifications} isVisible={showNotifications}
        onClose={() => setShowNotifications(false)}
        onMarkAsRead={markAsRead} onMarkAllAsRead={markAllAsRead}
      />
    </>
  );
}
