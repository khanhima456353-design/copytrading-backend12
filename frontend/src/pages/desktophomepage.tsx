import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.jpg";
import { AccountScreen } from "./home";

// ─── Types ────────────────────────────────────────────────────────────────────

type Screen = "home" | "portfolio" | "markets" | "trade" | "account";

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
  title: string;
  time: string;
  content?: string;
  image?: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const MARKETS: MarketRow[] = [
  { symbol: "₿",    pair: "BTC / USDT",  volume: "Vol $42.1B", price: "$95,412",  change:  2.10, sparkUp: true  },
  { symbol: "Ξ",    pair: "ETH / USDT",  volume: "Vol $18.7B", price: "$2,841",   change:  0.80, sparkUp: true  },
  { symbol: "BNB",  pair: "BNB / USDT",  volume: "Vol $3.2B",  price: "$612.30",  change:  1.40, sparkUp: true  },
  { symbol: "AVAX", pair: "AVAX / USDT", volume: "Vol $890M",  price: "$64.97",   change: -3.40, sparkUp: false },
  { symbol: "SOL",  pair: "SOL / USDT",  volume: "Vol $5.6B",  price: "$178.40",  change: -1.20, sparkUp: false },
  { symbol: "USDC", pair: "USDC / USDT", volume: "Vol $1.1B",  price: "$1.00",    change:  0.00, sparkUp: true  },
];

const TICKERS = [
  { name: "BTC",  price: "$95,412", change: "+2.1%",  up: true  },
  { name: "ETH",  price: "$2,841",  change: "+0.8%",  up: true  },
  { name: "BNB",  price: "$612",    change: "+1.4%",  up: true  },
  { name: "SOL",  price: "$178",    change: "−1.2%",  up: false },
  { name: "AVAX", price: "$64.97",  change: "−3.4%",  up: false },
  { name: "USDC", price: "$1.00",   change: "0.0%",   up: true  },
];

const SAMPLE_NEWS: Array<{ id: string | number; src: string; title: string; time: string }> = [
  { id: "sample-1", src: "CoinDesk",  title: "Bitcoin breaks past $95K as institutional demand surges ahead of ETF rebalancing", time: "2 hours ago" },
  { id: "sample-2", src: "The Block", title: "Ethereum gas fees hit 3-month low as Layer 2 adoption accelerates", time: "5 hours ago" },
  { id: "sample-3", src: "Reuters",   title: "SEC signals clearer crypto regulatory framework expected before year-end", time: "8 hours ago" },
  { id: "sample-4", src: "Bloomberg", title: "BNB Chain daily active addresses hit all-time high driven by DeFi growth", time: "11 hours ago" },
];

const NEW_MARKETS: MarketRow[] = [
  { symbol: "MATIC", pair: "MATIC / USDT", volume: "Vol $1.2B", price: "$0.90", change: 4.12, sparkUp: true },
  { symbol: "LINK",  pair: "LINK / USDT",  volume: "Vol $630M", price: "$18.45", change: 3.02, sparkUp: true },
  { symbol: "ADA",   pair: "ADA / USDT",   volume: "Vol $1.9B", price: "$0.66", change: 2.28, sparkUp: true },
  { symbol: "SOL",   pair: "SOL / USDT",   volume: "Vol $5.6B", price: "$178.40", change: -1.20, sparkUp: false },
];

const LIVE_MARKETS: MarketRow[] = TICKERS.map((ticker) => ({
  symbol: ticker.name,
  pair: `${ticker.name} / USDT`,
  volume: "Vol live", 
  price: ticker.price,
  change: parseFloat(ticker.change.replace("%", "").replace("+", "").replace("−", "-")) || 0,
  sparkUp: ticker.up,
}));

const COIN_COLORS: Record<string, { bg: string; color: string }> = {
  "₿":    { bg: "#F7931A22", color: "#F7931A" },
  "Ξ":    { bg: "#627EEA22", color: "#627EEA" },
  "BNB":  { bg: "#F3BA2F22", color: "#F3BA2F" },
  "AVAX": { bg: "#E8414222", color: "#E84142" },
  "SOL":  { bg: "#14F19522", color: "#14F195" },
  "USDC": { bg: "#2775CA22", color: "#2775CA" },
};

const navItems = ["Dashboard", "Markets", "Trade", "Portfolio", "Account"];
const sideMenuItems = [
  { label: "Dashboard", icon: "⊞" },
  { label: "Markets",   icon: "📈" },
  { label: "Trade",     icon: "⇄"  },
  { label: "About",     icon: "ℹ️", link: "/about" },
];
const accountItems = [
  { label: "History",      icon: "🕐" },
  { label: "Verification", icon: "🪪", link: "/verification" },
  { label: "Security",     icon: "🔒" },
];


// ─── Sparkline ────────────────────────────────────────────────────────────────

function Sparkline({ up }: { up: boolean }) {
  const color = up ? "#0ecb81" : "#f6465d";
  const path = up
    ? "M0,20 L10,17 L20,12 L30,14 L40,7 L50,4 L56,2"
    : "M0,8 L10,10 L20,16 L30,13 L40,20 L50,18 L56,24";
  return (
    <svg width={56} height={28} viewBox="0 0 56 28" style={{ flexShrink: 0 }}>
      <defs>
        <linearGradient id={`sg-${up ? "up" : "dn"}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d={up
          ? "M0,20 L10,17 L20,12 L30,14 L40,7 L50,4 L56,2 L56,28 L0,28 Z"
          : "M0,8 L10,10 L20,16 L30,13 L40,20 L50,18 L56,24 L56,28 L0,28 Z"}
        fill={`url(#sg-${up ? "up" : "dn"})`}
      />
      <path d={path} fill="none" stroke={color} strokeWidth={1.5} />
    </svg>
  );
}

// ─── Notification Panel ───────────────────────────────────────────────────────

function NotificationPanel({
  notifications, isVisible, onClose, onMarkAsRead, onMarkAllAsRead,
}: {
  notifications: Notification[];
  isVisible: boolean;
  onClose: () => void;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
}) {
  if (!isVisible) return null;

  const getTypeColor = (type: string) => ({
    success: "#0ecb81", warning: "#f0b90b", error: "#f6465d", admin: "#a78bfa",
  }[type] ?? "#378ADD");

  const getTypeIcon = (type: string) =>
    ({ success: "✅", warning: "⚠️", error: "❌", admin: "📢" }[type] ?? "ℹ️");

  const formatDate = (d: string) => {
    const ms = Date.now() - new Date(d).getTime();
    const m = Math.floor(ms / 60000);
    if (m < 1) return "Just now";
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  };

  return (
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 200, display: "flex", alignItems: "flex-start", justifyContent: "flex-end", paddingTop: 70, paddingRight: 24 }}
      onClick={onClose}
    >
      <div
        style={{ background: "#13102a", border: "1px solid #2a2550", borderRadius: 16, width: 360, maxHeight: "70vh", overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #2a2550", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#e8e4ff", fontFamily: "'Syne', sans-serif" }}>Notifications</h3>
          <div style={{ display: "flex", gap: 8 }}>
            {notifications.some(n => !n.isRead) && (
              <button onClick={onMarkAllAsRead} style={{ padding: "4px 10px", fontSize: 11, background: "rgba(124,106,247,0.12)", border: "1px solid rgba(124,106,247,0.3)", borderRadius: 8, cursor: "pointer", color: "#a78bfa" }}>
                Mark all read
              </button>
            )}
            <button onClick={onClose} style={{ padding: "4px 8px", fontSize: 14, background: "none", border: "none", cursor: "pointer", color: "#6b6590" }}>✕</button>
          </div>
        </div>
        <div style={{ maxHeight: "calc(70vh - 60px)", overflowY: "auto" }}>
          {notifications.length === 0 ? (
            <div style={{ padding: "40px 20px", textAlign: "center", color: "#6b6590" }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🔔</div>
              <div style={{ fontSize: 14, color: "#9b95c4", fontWeight: 500, marginBottom: 6 }}>No notifications yet</div>
              <div style={{ fontSize: 13 }}>Updates and alerts will appear here.</div>
            </div>
          ) : notifications.map(n => (
            <div key={n.id} style={{ padding: "14px 20px", borderBottom: "1px solid #1a1638", background: n.isRead ? "transparent" : "rgba(124,106,247,0.05)", cursor: "pointer" }} onClick={() => !n.isRead && onMarkAsRead(n.id)}>
              <div style={{ display: "flex", gap: 10 }}>
                <span style={{ fontSize: 18, color: getTypeColor(n.type), flexShrink: 0 }}>{getTypeIcon(n.type)}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#e8e4ff", marginBottom: 3 }}>{n.title}</div>
                  <div style={{ fontSize: 12, color: "#9b95c4", lineHeight: 1.4, marginBottom: 6 }}>{n.message}</div>
                  <div style={{ fontSize: 11, color: "#6b6590" }}>{formatDate(n.createdAt)}</div>
                </div>
                {!n.isRead && <div style={{ width: 7, height: 7, borderRadius: "50%", background: getTypeColor(n.type), flexShrink: 0, marginTop: 4 }} />}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function DesktopHomePage() {
  const [userProfile, setUserProfile] = useState<{ kycVerified: boolean; kycStatus: string } | null>(null);
  
  const [activeNav, setActiveNav] = useState("Dashboard");
  const [activeSide, setActiveSide] = useState("Dashboard");
  const [activeTab, setActiveTab] = useState<"Hot" | "Gainers" | "Losers" | "New" | "Live">("Hot");
  const [searchVal, setSearchVal] = useState("");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [newsFeed, setNewsFeed] = useState<NewsItem[]>([]);
  const [balance, setBalance] = useState<number>(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);


  useEffect(() => {
    fetchBalance();
    fetchUserProfile();

    const socket = (window as any).socket;

  if (socket) {
    socket.on("balanceUpdated", (data: any) => {
      setBalance(data.balance);
    });
  }

  return () => {
    if (socket) {
      socket.off("balanceUpdated");
    }
  };
}, []);

const fetchBalance = async () => {
  try {
    const res = await fetch(
      `${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api/profile`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    const data = await res.json();

    if (data.success) {
      setBalance(data.user.balance || 0);
    }
  } catch (err) {
    console.log(err);
  }
};

const fetchUserProfile = async () => {
  try {
    const res = await fetch(
      `${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api/profile`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    const data = await res.json();

    if (data.success) {
      setUserProfile({
        kycVerified: data.user?.kycVerified || false,
        kycStatus: data.user?.kycStatus || "pending",
      });
    }
  } catch (err) {
    console.log(err);
  }
};

  useEffect(() => {
    const cached = localStorage.getItem("news-cache");
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length) {
          setNewsFeed(parsed);
        }
      } catch (error) {
        console.warn("Failed to parse news cache", error);
      }
    }
  }, []);

  const displayedNews: Array<{ id: string | number; src: string; title: string; time: string }> = newsFeed.length > 0
    ? newsFeed.slice(0, 4).map((item) => ({
        id: item.id,
        src: "Swancore's News",
        title: item.title,
        time: item.time || "Just now",
      }))
    : SAMPLE_NEWS;

  const filterMarkets = () => {
    if (activeTab === "Hot") return MARKETS;
    if (activeTab === "Gainers") return MARKETS.filter((m) => m.change > 0);
    if (activeTab === "Losers") return MARKETS.filter((m) => m.change < 0);
    if (activeTab === "New") return NEW_MARKETS;
    if (activeTab === "Live") return LIVE_MARKETS;
    return MARKETS;
  };

  const userEmail = localStorage.getItem("userEmail") || "user@example.com";
  const userId = localStorage.getItem("userId") || "SW-000000";
  const displayName = userEmail.includes("@")
    ? userEmail.split("@")[0].charAt(0).toUpperCase() + userEmail.split("@")[0].slice(1)
    : "User";
  const avatarInitials = displayName.charAt(0).toUpperCase();
  const navigate = useNavigate();
  const tickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api/notifications`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}`, "Content-Type": "application/json" },
      });
      if (res.ok) {
        const d = await res.json();
        if (d.success) setNotifications(d.notifications);
      }
    } catch {}
  };

  const fetchUnreadCount = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api/notifications/unread-count`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (res.ok) {
        const d = await res.json();
        if (d.success) setUnreadCount(d.unreadCount);
      }
    } catch {}
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api/notifications/${id}/read`, {
        method: "PUT", headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (res.ok) {
        setNotifications(p => p.map(n => n.id === id ? { ...n, isRead: true } : n));
        setUnreadCount(p => Math.max(0, p - 1));
      }
    } catch {}
  };

  const handleMarkAllAsRead = async () => {
    try {
      await fetch(`${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api/notifications/mark-all-read`, {
        method: "PUT", headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setNotifications(p => p.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch {}
  };

  const handleNav = (item: string) => {
    setActiveNav(item);
    setActiveSide(item);
    const routes: Record<string, string> = { Markets: "/markets", Trade: "/trade" };
    if (item === "Account") {
      navigate("/home");
      return;
    }
    navigate(routes[item] ?? "/home");
  };

  const closeAccountSection = () => {
    setActiveNav("Dashboard");
    setActiveSide("Dashboard");
    navigate("/home");
  };

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const isAccountMode = activeNav === "Account";
  const bodyClassName = `dt-body${isAccountMode || !isSidebarOpen ? " dt-body-collapsed" : ""}`;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');

        :root {
          --bg: #0a0d1a;
          --surface: #10132a;
          --surface2: #161938;
          --surface3: #1c2040;
          --border: #232649;
          --border2: #2c3060;
          --accent: #7c6af7;
          --accent2: #9b8fff;
          --accent-glow: rgba(124,106,247,0.18);
          --green: #0ecb81;
          --red: #f6465d;
          --gold: #F0B90B;
          --text: #e8e4ff;
          --text2: #9b95c4;
          --text3: #6b6590;
        }

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        html, body, #root {
          height: 100%;
          background: var(--bg);
          font-family: 'DM Sans', sans-serif;
          color: var(--text);
        }

        /* ── Topbar ── */
        .dt-root { min-height: 100vh; display: flex; flex-direction: column; background: radial-gradient(circle at top, rgba(120, 200, 255, 0.25), transparent 45%), radial-gradient(circle at top right, rgba(0, 180, 255, 0.18), transparent 55%), radial-gradient(circle at bottom left, rgba(0, 120, 200, 0.20), transparent 60%), linear-gradient(180deg, #0a1a2a 0%, #06121f 60%, #040b14 100%); }

        .dt-topbar {
          position: sticky; top: 0; z-index: 100;
          display: flex !important; align-items: center; justify-content: space-between;
          padding: 0 28px; height: 64px;
          background: rgba(10,13,26,0.92);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid var(--border);
        }

        .dt-logo-wrap { display: flex; align-items: center; gap: 10px; }
        .dt-logo-img { width: 32px; height: 32px; border-radius: 50%; object-fit: cover; }
        .dt-logo-text {
          font-family: 'Syne', sans-serif; font-size: 18px; font-weight: 800;
          color: var(--text); letter-spacing: -0.04em;
        }
        .dt-logo-text span { color: var(--gold); }

        .dt-nav { display: flex; gap: 4px; margin-left: 28px; }
        .dt-nav-btn {
          padding: 8px 14px; border-radius: 10px;
          border: 1px solid transparent; background: transparent;
          color: var(--text2); font-size: 13px; font-weight: 500;
          cursor: pointer; transition: all 0.15s; font-family: 'DM Sans', sans-serif;
        }
        .dt-nav-btn:hover { background: var(--accent-glow); color: var(--text); }
        .dt-nav-btn.active {
          background: var(--accent-glow); border-color: rgba(124,106,247,0.3);
          color: var(--text); box-shadow: 0 0 0 1px rgba(124,106,247,0.15) inset;
        }

        .dt-top-right { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
        .dt-search-wrap { position: relative; }
        .dt-search-input {
          width: 220px; height: 38px;
          padding: 0 38px 0 14px;
          border-radius: 10px; border: 1px solid var(--border2);
          background: var(--surface2); color: var(--text);
          font-size: 13px; outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          font-family: 'DM Sans', sans-serif;
        }
        .dt-search-input::placeholder { color: var(--text3); }
        .dt-search-input:focus { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(124,106,247,0.12); }
        .dt-search-icon {
          position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
          color: var(--text3); font-size: 14px; pointer-events: none;
        }
        .dt-icon-btn {
          width: 38px; height: 38px; border-radius: 10px;
          background: var(--surface2); border: 1px solid var(--border);
          color: var(--text2); cursor: pointer; display: grid; place-items: center;
          font-size: 16px; transition: all 0.15s; position: relative;
        }
        .dt-icon-btn:hover { border-color: var(--border2); color: var(--text); }
        .dt-notif-badge {
          position: absolute; top: -3px; right: -3px;
          background: var(--red); color: white;
          width: 16px; height: 16px; border-radius: 50%;
          font-size: 9px; font-weight: 700;
          display: flex; align-items: center; justify-content: center;
          border: 2px solid var(--bg);
        }
        .dt-avatar {
          width: 38px; height: 38px; border-radius: 10px;
          background: linear-gradient(135deg, var(--accent), var(--accent2));
          color: white; font-family: 'Syne', sans-serif; font-weight: 800;
          font-size: 14px; display: grid; place-items: center;
          box-shadow: 0 0 16px rgba(124,106,247,0.3); cursor: pointer;
        }

        /* ── Body grid ── */
        .dt-body {
          display: grid;
          grid-template-columns: 220px minmax(0, 1fr) 280px;
          gap: 20px;
          padding: 20px 28px;
          flex: 1;
          background: radial-gradient(circle at top, rgba(120, 200, 255, 0.25), transparent 45%),
            radial-gradient(circle at top right, rgba(0, 180, 255, 0.18), transparent 55%),
            radial-gradient(circle at bottom left, rgba(0, 120, 200, 0.20), transparent 60%),
            linear-gradient(180deg, #0a1a2a 0%, #06121f 60%, #040b14 100%);
        }

        .dt-body.dt-body-collapsed {
          grid-template-columns: 0 minmax(0, 1fr) 280px;
        }

        .dt-body.dt-body-collapsed .dt-sidebar {
          display: none;
        }

        .dt-account-overlay {
          position: fixed;
          inset: 0;
          z-index: 300;
          background: rgba(0, 0, 0, 0.45);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 28px;
        }

        .dt-account-panel {
          width: min(1080px, 100%);
          max-height: calc(100vh - 56px);
          overflow: auto;
          background: rgba(8, 12, 27, 0.98);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 24px;
          box-shadow: 0 40px 100px rgba(0, 0, 0, 0.4);
          position: relative;
          padding: 24px;
        }

        .dt-account-close {
          position: absolute;
          top: 18px;
          left: 18px;
          color: var(--text);
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 999px;
          padding: 10px 14px;
          font-size: 13px;
          cursor: pointer;
          transition: transform 0.15s ease, background 0.15s ease;
        }

        .dt-account-close:hover {
          transform: translateX(-2px);
          background: rgba(255, 255, 255, 0.12);
        }

        .dt-menu-btn {
          position: relative;
          width: 44px;
          height: 38px;
          border-radius: 10px;
          border: 1px solid rgba(243,186,47,.35);
          background: rgba(243,186,47,.08);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 8px;
          gap: 5px;
          box-shadow: 0 0 16px rgba(243,186,47,.18);
          cursor: pointer;
          transition: border-color 0.3s ease, color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease;
          color: #F3BA2F;
        }

        .dt-menu-btn:hover {
          border-color: rgba(243,186,47,.85);
          color: #fff5d6;
          background: rgba(243,186,47,.14);
          box-shadow: 0 0 22px rgba(243,186,47,.6);
          transform: translateY(-1px) scale(1.04);
        }

        .dt-menu-btn span {
          display: block;
          position: absolute;
          width: 20px;
          height: 2px;
          border-radius: 999px;
          background: currentColor;
          transition: transform 0.3s ease, opacity 0.3s ease, top 0.3s ease;
        }

        .dt-menu-btn span:nth-child(1) { top: 13px; }
        .dt-menu-btn span:nth-child(2) { top: 20px; }
        .dt-menu-btn span:nth-child(3) { top: 27px; }

        .dt-menu-btn.open {
          background: rgba(243,186,47,.16);
          box-shadow: 0 0 26px rgba(243,186,47,.6);
        }

        .dt-menu-btn.open span:nth-child(1) {
          top: 20px;
          transform: rotate(45deg);
        }

        .dt-menu-btn.open span:nth-child(2) {
          opacity: 0;
        }

        .dt-menu-btn.open span:nth-child(3) {
          top: 20px;
          transform: rotate(-45deg);
        }

        .dt-mobile-menu {
          position: absolute;
          top: calc(100% + 14px);
          right: 0;
          min-width: 220px;
          padding: 12px;
          border-radius: 18px;
          border: 1px solid rgba(243,186,47,.28);
          background: rgba(7, 11, 24, .98);
          backdrop-filter: blur(18px);
          box-shadow: 0 24px 50px rgba(0,0,0,.45), 0 0 24px rgba(243,186,47,.22);
          animation: dtMenuFade .28s ease;
          z-index: 50;
        }

        .dt-mobile-menu-item {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          padding: 12px 14px;
          border-radius: 12px;
          border: 1px solid transparent;
          background: transparent;
          color: #f8fafc;
          cursor: pointer;
          transition: all .25s ease;
          text-align: left;
        }

        .dt-mobile-menu-item:hover,
        .dt-mobile-menu-item:focus-visible {
          outline: none;
          border-color: rgba(243,186,47,.4);
          background: rgba(243,186,47,.12);
          transform: translateX(3px);
          box-shadow: 0 0 16px rgba(243,186,47,.2);
        }

        @keyframes dtMenuFade {
          from { opacity: 0; transform: translateY(-10px) scale(.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        /* ── Sidebar ── */
        .dt-sidebar {
          display: flex; flex-direction: column; gap: 14px;
          position: sticky; top: 84px; align-self: start;
          max-height: calc(100vh - 104px); overflow-y: auto;
        }
        .dt-sidebar::-webkit-scrollbar { display: none; }

        .dt-card {
          background: radial-gradient(circle at top, rgba(120, 200, 255, 0.25), transparent 45%),
            radial-gradient(circle at top right, rgba(0, 180, 255, 0.18), transparent 55%),
            radial-gradient(circle at bottom left, rgba(0, 120, 200, 0.20), transparent 60%),
            linear-gradient(180deg, #0a1a2a 0%, #06121f 60%, #040b14 100%);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 18px; padding: 16px; overflow: hidden;
          box-shadow: inset 0 0 0 1px rgba(255,255,255,0.03);
        }

        .dt-account-summary-card {
          padding: 18px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .dt-account-summary-top {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .dt-account-avatar {
          width: 44px;
          height: 44px;
          border-radius: 14px;
          background: rgba(255,255,255,0.08);
          display: grid;
          place-items: center;
          color: #fff;
          font-weight: 700;
          font-size: 18px;
        }

        .dt-account-name {
          font-size: 15px;
          font-weight: 600;
          color: #fff;
        }

        .dt-account-email,
        .dt-account-uid {
          font-size: 12px;
          color: rgba(255,255,255,0.5);
          margin-top: 4px;
        }

        .dt-account-badges {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .dt-badge {
          padding: 6px 10px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.02em;
        }

        .dt-badge-unverified {
          background: rgba(240,185,11,0.13);
          color: #F0B90B;
        }

        .dt-badge-verified {
          background: rgba(16,185,129,0.14);
          color: #10B981;
        }

        .dt-badge-new {
          background: rgba(146,120,255,0.16);
          color: #c9b8ff;
        }

        .dt-kyc-banner {
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
          padding: 14px;
          border-radius: 16px;
          border: 1px solid rgba(240,185,11,0.25);
          background: rgba(240,185,11,0.08);
          color: #fff;
          cursor: pointer;
          transition: transform 0.18s ease, box-shadow 0.18s ease;
        }

        .dt-kyc-banner:hover {
          transform: translateY(-1px);
          box-shadow: 0 10px 30px rgba(240,185,11,0.12);
        }

        .dt-kyc-icon {
          width: 38px;
          height: 38px;
          border-radius: 14px;
          display: grid;
          place-items: center;
          background: rgba(240,185,11,0.18);
          font-size: 18px;
        }

        .dt-kyc-title {
          font-size: 13px;
          font-weight: 700;
          color: #f8f3e8;
        }

        .dt-kyc-sub {
          font-size: 11px;
          color: rgba(255,255,255,0.72);
          margin-top: 2px;
        }

        .dt-kyc-action {
          font-size: 11px;
          font-weight: 700;
          color: #0f172a;
          background: #f0b90b;
          border-radius: 999px;
          padding: 8px 12px;
        }

        .dt-limits-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .dt-limit-card {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 14px;
          padding: 12px;
          min-width: 0;
        }

        .dt-limit-label {
          font-size: 10px;
          color: rgba(255,255,255,0.5);
          text-transform: uppercase;
          letter-spacing: 0.06em;
          margin-bottom: 6px;
        }

        .dt-limit-value {
          font-size: 14px;
          font-weight: 700;
          color: #fff;
          margin-bottom: 4px;
        }

        .dt-limit-sub {
          font-size: 11px;
          color: rgba(255,255,255,0.55);
        }

        .dt-menu-card {
          border-color: rgba(255,255,255,0.08);
          box-shadow: inset 0 0 0 1px rgba(255,255,255,0.03);
        }

        .dt-card-title {
          font-family: 'Syne', sans-serif; font-size: 11px; font-weight: 700;
          color: var(--text3); text-transform: uppercase; letter-spacing: 0.8px;
          margin-bottom: 12px;
        }

        .dt-side-btn {
          display: flex; align-items: center; gap: 10px;
          width: 100%; padding: 10px 12px; border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.04); background: rgba(255,255,255,0.02);
          color: var(--text2); font-size: 13px; font-weight: 500;
          cursor: pointer; transition: all 0.15s; text-align: left;
          font-family: 'DM Sans', sans-serif;
        }
        .dt-side-btn:hover { background: rgba(255,255,255,0.06); color: var(--text); }
        .dt-side-btn.active {
          background: radial-gradient(circle at top, rgba(120, 200, 255, 0.18), transparent 40%),
            radial-gradient(circle at top right, rgba(0, 180, 255, 0.14), transparent 50%),
            linear-gradient(180deg, rgba(10,26,42,0.95) 0%, rgba(6,18,31,0.95) 100%);
          border-color: rgba(255,255,255,0.10);
          color: var(--text);
        }
        .dt-side-btn.active .dt-side-icon { color: var(--accent2); }
        .dt-side-icon { font-size: 15px; flex-shrink: 0; }
        .dt-side-arrow { margin-left: auto; color: var(--text3); font-size: 12px; }

        .dt-divider { height: 1px; background: var(--border); margin: 4px 0; }

        /* Balance card in sidebar */
        .dt-bal-card {
          background: radial-gradient(circle at top, rgba(120, 200, 255, 0.25), transparent 45%),
            radial-gradient(circle at top right, rgba(0, 180, 255, 0.18), transparent 55%),
            radial-gradient(circle at bottom left, rgba(0, 120, 200, 0.20), transparent 60%),
            linear-gradient(180deg, #0a1a2a 0%, #06121f 60%, #040b14 100%);
          border: 1px solid rgba(255,255,255,0.08);
        }
        .dt-bal-amount {
          font-family: 'DM Mono', monospace; font-size: 20px; font-weight: 500;
          color: var(--text); margin-bottom: 4px;
        }
        .dt-bal-sub { font-size: 11px; color: var(--text3); margin-bottom: 14px; }
        .dt-deposit-btn {
          display: flex; align-items: center; justify-content: center; gap: 6px;
          width: 100%; padding: 10px; border-radius: 12px;
          background: var(--accent); border: none;
          color: white; font-size: 13px; font-weight: 600;
          cursor: pointer; transition: opacity 0.15s;
          font-family: 'DM Sans', sans-serif;
        }
        .dt-deposit-btn:hover { opacity: 0.88; }



        /* ── Main content ── */
        .dt-main { display: flex; flex-direction: column; gap: 16px; min-width: 0; }

        /* Balance hero */
        .dt-balance-hero {
          background: radial-gradient(circle at top, rgba(120, 200, 255, 0.25), transparent 45%),
            radial-gradient(circle at top right, rgba(0, 180, 255, 0.18), transparent 55%),
            radial-gradient(circle at bottom left, rgba(0, 120, 200, 0.20), transparent 60%),
            linear-gradient(180deg, #0a1a2a 0%, #06121f 60%, #040b14 100%);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px; overflow: hidden;
          padding: 28px 28px 0;
          position: relative;
        }
        .dt-hero-glow {
          position: absolute; top: -40px; left: 50%; transform: translateX(-50%);
          width: 300px; height: 200px;
          background: radial-gradient(circle, rgba(124,106,247,0.15) 0%, transparent 70%);
          pointer-events: none;
        }
        .dt-hero-label { font-size: 12px; color: var(--text3); letter-spacing: 0.5px; margin-bottom: 6px; }
        .dt-hero-amount {
          font-family: 'DM Mono', monospace; font-size: 38px; font-weight: 500;
          color: var(--text); margin-bottom: 4px;
        }
        .dt-hero-amount span { font-size: 18px; color: var(--text2); margin-left: 6px; }
        .dt-hero-sub { font-size: 13px; color: var(--text3); margin-bottom: 24px; }

        /* Quick actions bar */
        .dt-quick-actions {
          display: grid; grid-template-columns: repeat(4, 1fr);
          border-top: 1px solid rgba(255,255,255,0.08);
        }
        .dt-qa-item {
          display: flex; flex-direction: column; align-items: center; gap: 8px;
          padding: 16px 8px; cursor: pointer;
          border-right: 1px solid var(--border);
          transition: background 0.15s;
        }
        .dt-qa-item:last-child { border-right: none; }
        .dt-qa-item:hover { background: var(--surface2); }
        .dt-qa-icon {
          width: 44px; height: 44px; border-radius: 14px;
          display: flex; align-items: center; justify-content: center; font-size: 20px;
        }
        .dt-qa-label { font-size: 12px; color: var(--text2); font-weight: 500; }

        /* Ticker strip */
        .dt-ticker-outer {
          background: radial-gradient(circle at top, rgba(120, 200, 255, 0.25), transparent 45%),
            radial-gradient(circle at top right, rgba(0, 180, 255, 0.18), transparent 55%),
            radial-gradient(circle at bottom left, rgba(0, 120, 200, 0.20), transparent 60%),
            linear-gradient(180deg, #0a1a2a 0%, #06121f 60%, #040b14 100%);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 14px; overflow: hidden;
        }
        .dt-ticker-inner {
          display: flex; gap: 0; overflow: hidden;
        }
        .dt-ticker-item {
          display: flex; align-items: center; gap: 8px;
          padding: 12px 20px; border-right: 1px solid var(--border);
          flex: 1; min-width: 0;
        }
        .dt-ticker-item:last-child { border-right: none; }
        .dt-tick-name { font-size: 12px; color: var(--text3); font-weight: 500; flex-shrink: 0; }
        .dt-tick-price { font-size: 13px; color: var(--text); font-weight: 600; font-family: 'DM Mono', monospace; }
        .dt-tick-change { font-size: 11px; font-weight: 600; flex-shrink: 0; font-family: 'DM Mono', monospace; }

        /* Referral banner */
        .dt-banner {
          background: radial-gradient(circle at top, rgba(120, 200, 255, 0.25), transparent 45%),
            radial-gradient(circle at top right, rgba(0, 180, 255, 0.18), transparent 55%),
            radial-gradient(circle at bottom left, rgba(0, 120, 200, 0.20), transparent 60%),
            linear-gradient(180deg, #0a1a2a 0%, #06121f 60%, #040b14 100%);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px; padding: 18px 22px;
          display: flex; align-items: center; gap: 14px;
          position: relative; overflow: hidden;
        }
        .dt-banner-glow {
          position: absolute; right: -20px; top: -20px;
          width: 120px; height: 120px;
          background: radial-gradient(circle, rgba(124,106,247,0.18) 0%, transparent 70%);
          pointer-events: none;
        }
        .dt-banner-icon {
          width: 48px; height: 48px; border-radius: 14px;
          background: rgba(124,106,247,0.15); display: grid; place-items: center;
          font-size: 22px; flex-shrink: 0;
        }
        .dt-banner-title { font-size: 15px; font-weight: 600; color: var(--text); margin-bottom: 3px; }
        .dt-banner-sub { font-size: 12px; color: var(--text2); }
        .dt-banner-btn {
          margin-left: auto; flex-shrink: 0;
          padding: 8px 18px; border-radius: 10px;
          background: rgba(124,106,247,0.15); border: 1px solid rgba(124,106,247,0.3);
          color: var(--accent2); font-size: 13px; font-weight: 600;
          cursor: pointer; font-family: 'DM Sans', sans-serif;
          transition: all 0.15s;
        }
        .dt-banner-btn:hover { background: rgba(124,106,247,0.25); }

        /* Markets section */
        .dt-section {
          background: radial-gradient(circle at top, rgba(120, 200, 255, 0.25), transparent 45%),
            radial-gradient(circle at top right, rgba(0, 180, 255, 0.18), transparent 55%),
            radial-gradient(circle at bottom left, rgba(0, 120, 200, 0.20), transparent 60%),
            linear-gradient(180deg, #0a1a2a 0%, #06121f 60%, #040b14 100%);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px; overflow: hidden;
        }
        .dt-section-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 16px 20px 0;
        }
        .dt-section-title {
          font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 700; color: var(--text);
        }
        .dt-section-link {
          font-size: 12px; color: var(--accent2); cursor: pointer;
          background: none; border: none; font-family: 'DM Sans', sans-serif;
        }
        .dt-tabs {
          display: flex; gap: 4px; padding: 12px 20px 0;
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }
        .dt-tab {
          padding: 8px 14px 10px; font-size: 13px; color: var(--text3);
          cursor: pointer; border: none; background: transparent;
          border-bottom: 2px solid transparent; margin-bottom: -1px;
          transition: color 0.15s; font-family: 'DM Sans', sans-serif; font-weight: 500;
        }
        .dt-tab.active { color: var(--accent2); border-bottom-color: var(--accent2); }
        .dt-tab:hover { color: var(--text2); }

        /* Market rows */
        .dt-mkt-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
        }
        .dt-mkt-row {
          display: flex; align-items: center; gap: 12px;
          padding: 13px 20px; border-bottom: 1px solid rgba(255,255,255,0.08);
          border-right: 1px solid rgba(255,255,255,0.08);
          cursor: pointer; transition: background 0.15s;
          background: transparent; border-width: 0 1px 1px 0;
          border-style: solid; border-color: rgba(255,255,255,0.08);
          width: 100%; text-align: left;
        }
        .dt-mkt-row:nth-child(2n) { border-right: none; }
        .dt-mkt-row:nth-last-child(-n+2) { border-bottom: none; }
        .dt-mkt-row:hover { background: var(--surface2); }
        .dt-coin-dot {
          width: 36px; height: 36px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-weight: 600; flex-shrink: 0; font-size: 13px;
        }
        .dt-mkt-name { font-size: 14px; color: var(--text); font-weight: 600; }
        .dt-mkt-vol { font-size: 11px; color: var(--text3); margin-top: 2px; }
        .dt-mkt-price { font-size: 14px; color: var(--text); font-weight: 600; font-family: 'DM Mono', monospace; }
        .dt-mkt-change { font-size: 11px; margin-top: 2px; font-family: 'DM Mono', monospace; font-weight: 500; }

        /* News */
        .dt-news-grid {
          display: grid; grid-template-columns: 1fr 1fr; gap: 12px;
          padding: 16px;
        }
        .dt-news-item {
          background: radial-gradient(circle at top, rgba(120, 200, 255, 0.25), transparent 45%),
            radial-gradient(circle at top right, rgba(0, 180, 255, 0.18), transparent 55%),
            radial-gradient(circle at bottom left, rgba(0, 120, 200, 0.20), transparent 60%),
            linear-gradient(180deg, #0a1a2a 0%, #06121f 60%, #040b14 100%);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px; padding: 14px;
          cursor: pointer; transition: border-color 0.15s;
          display: block; text-align: left; width: 100%;
          font-family: 'DM Sans', sans-serif;
        }
        .dt-news-item:hover { border-color: rgba(255,255,255,0.12); }
        .dt-news-src { font-size: 10px; color: var(--text3); margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px; }
        .dt-news-title { font-size: 13px; color: var(--text); line-height: 1.45; margin-bottom: 8px; }
        .dt-news-time { font-size: 11px; color: var(--text3); }

        /* ── Right panel ── */
        .dt-right {
          display: flex; flex-direction: column; gap: 14px;
          position: sticky; top: 84px; align-self: start;
          max-height: calc(100vh - 104px); overflow-y: auto;
        }
        .dt-right::-webkit-scrollbar { display: none; }

        /* Live prices */
        .dt-price-row {
          display: flex; align-items: center; justify-content: space-between;
          padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.08);
        }
        .dt-price-row:last-child { border-bottom: none; }
        .dt-pr-symbol { display: flex; align-items: center; gap: 8px; }
        .dt-pr-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
        .dt-pr-name { font-size: 13px; color: var(--text); font-weight: 500; }
        .dt-pr-vol { font-size: 11px; color: var(--text3); }
        .dt-pr-right { text-align: right; }
        .dt-pr-price { font-size: 13px; color: var(--text); font-weight: 600; font-family: 'DM Mono', monospace; }
        .dt-pr-change { font-size: 11px; font-family: 'DM Mono', monospace; font-weight: 500; }

        /* Insights */
        .dt-insight-row {
          display: flex; align-items: center; justify-content: space-between;
          padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.08);
        }
        .dt-insight-row:last-child { border-bottom: none; }
        .dt-insight-label { font-size: 12px; color: var(--text2); }
        .dt-pill {
          padding: 4px 10px; border-radius: 999px; font-size: 11px; font-weight: 600;
          background: rgba(14,203,129,0.12); color: var(--green);
          font-family: 'DM Mono', monospace;
        }

        .dt-ticker-container {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border);
          border-radius: 12px;
          overflow: hidden;
          position: relative;
          height: 48px;
          display: flex;
          align-items: center;
          margin-top: 15px;
        }

        .dt-ticker-track {
          display: flex;
          width: max-content;
          animation: scrollTicker 30s linear infinite;
        }

        .dt-ticker-track:hover {
          animation-play-state: paused;
        }

        @keyframes scrollTicker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        .dt-ticker-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 0 30px;
          white-space: nowrap;
          border-right: 1px solid var(--border);
        }
      
        .dt-pill.warn { background: rgba(240,185,11,0.12); color: var(--gold); }

        /* Summary line */
        .dt-summary-line {
          display: flex; justify-content: space-between; align-items: center;
          padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.08);
        }
        .dt-summary-line:last-child { border-bottom: none; }
        .dt-sum-label { font-size: 12px; color: var(--text3); }
        .dt-sum-val { font-size: 13px; font-weight: 600; color: var(--text); font-family: 'DM Mono', monospace; }

        /* Responsive */
        @media (max-width: 1100px) {
          .dt-body { grid-template-columns: 200px minmax(0, 1fr); }
          .dt-right { display: none; }
        }
        @media (max-width: 767px) {
          .dt-body { display: none; }
        }
      `}</style>

      <div className="dt-root">
        {/* ── Topbar ── */}
        <header className="dt-topbar">
          <div style={{ display: "flex", alignItems: "center" }}>
            <div className="dt-logo-wrap">
              <img src={logo} className="dt-logo-img" alt="SwanCore" />
              <span className="dt-logo-text">S<span>wancore</span></span>
            </div>
            <nav className="dt-nav">
              {navItems.map(item => (
                <button
                  key={item}
                  className={`dt-nav-btn${activeNav === item ? " active" : ""}`}
                  onClick={() => handleNav(item)}
                >
                  {item}
                </button>
              ))}
            </nav>
          </div>

          <div className="dt-top-right">
            <div className="dt-search-wrap">
              <input
                className="dt-search-input"
                value={searchVal}
                onChange={e => setSearchVal(e.target.value)}
                placeholder="Search markets…"
              />
              <span className="dt-search-icon">⌕</span>
            </div>
            <button
              className="dt-icon-btn"
              aria-label="Notifications"
              onClick={() => setShowNotifications(true)}
            >
              🔔
              {unreadCount > 0 && (
                <span className="dt-notif-badge">{unreadCount > 99 ? "99+" : unreadCount}</span>
              )}
            </button>
            <div style={{ position: "relative" }}>
            <button
              className={`dt-menu-btn${isMenuOpen ? " open" : ""}`}
              aria-label="Toggle navigation menu"
              aria-expanded={isMenuOpen}
              aria-haspopup="menu"
              onClick={() => setIsMenuOpen(v => !v)}
            >
              <span />
              <span />
              <span />
            </button>
            {isMenuOpen && (
              <div className="dt-mobile-menu" role="menu" aria-label="Main navigation">
                {sideMenuItems.map((item) => (
                  <button
                    key={item.label}
                    className="dt-mobile-menu-item"
                    role="menuitem"
                    onClick={() => {
                      setIsMenuOpen(false);
                      if (item.link) {
                        navigate(item.link);
                        return;
                      }
                      handleNav(item.label);
                      setActiveSide(item.label);
                    }}
                  >
                    <span aria-hidden="true">{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            )}
            </div>
          </div>
        </header>

        <div className={bodyClassName}>
          {/* ── Left Sidebar ── */}
          <aside className="dt-sidebar">
           

            <div className="dt-card dt-account-summary-card">
              <div className="dt-account-summary-top">
                <div className="dt-account-avatar">{avatarInitials}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="dt-account-name">{displayName}</div>
                  <div className="dt-account-email">{userEmail}</div>
                  <div className="dt-account-uid">UID: {userId}</div>
                </div>
              </div>
              <div
  className="dt-account-badges"
  style={{ display: "flex", justifyContent: "center", marginTop: "12px" }}
>
                <div className={`dt-badge ${userProfile?.kycVerified ? "dt-badge-verified" : "dt-badge-unverified"}`}>
                  {userProfile?.kycVerified ? "✓ Verified" : "⚠ Unverified"}
                </div>
              </div>
            </div>

            <div className="dt-divider" />

            <div
  className="dt-card"
  style={{
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  }}
>
  <div className="dt-card-title">Account</div>

  {accountItems.map((item) => {
    const isKycItem =
  item.label.toLowerCase().includes("verification");

    const isVerified =
      isKycItem && userProfile?.kycVerified;

    return (
      <button
        key={item.label}
        className="dt-side-btn"
        onClick={() => {
          if (!isVerified && item.link) {
            navigate(item.link);
          }
        }}
        style={{
          cursor: "pointer",
          opacity: isVerified ? 0.7 : 1,
        }}
        disabled={isVerified}
      >
        <span className="dt-side-icon">{item.icon}</span>

        <span>
          {isVerified ? "KYC Verified" : item.label}
        </span>

        {!isVerified && (
          <span className="dt-side-arrow">›</span>
        )}
      </button>
    );
  })}
</div>

            <div className="dt-card">
              <div className="dt-card-title">Your account</div>
              <div className="dt-summary-line">
                <span className="dt-sum-label">24h P&L</span>
                <span className="dt-sum-val" style={{ color: "var(--text3)" }}>—</span>
              </div>
              <div className="dt-summary-line">
                <span className="dt-sum-label">7d P&L</span>
                <span className="dt-sum-val" style={{ color: "var(--text3)" }}>—</span>
              </div>
              <div className="dt-summary-line">
                <span className="dt-sum-label">Open positions</span>
                <span className="dt-sum-val">0</span>
              </div>
              <div className="dt-summary-line">
                <span className="dt-sum-label">KYC status</span>
                <span style={{ fontSize: 11, color: "var(--gold)", background: "rgba(240,185,11,0.1)", padding: "3px 8px", borderRadius: 6 }}>Pending</span>
              </div>
            </div>
          </aside>
          

          {/* ── Main feed ── */}
          <main className="dt-main">
            {activeNav === "Account" ? (
              <div className="dt-account-content">
                <AccountScreen
                  onNavigate={(screen) => {
                    if (screen === "markets") return navigate("/markets");
                    if (screen === "trade") return navigate("/trade");
                    if (screen === "home") return navigate("/home");
                    setActiveNav("Dashboard");
                  }}
                  showTopBar={false}
                  showBottomNav={false}
                />
              </div>
            ) : (
              <>
                {/* Balance hero */}
                <div className="dt-balance-hero">
                  <div className="dt-hero-glow" />
                  <div className="dt-hero-label">Total balance</div>
                  <div className="dt-hero-amount">{balance.toFixed(2)}<span>USDT</span></div>
                 <div className="dt-hero-sub">
  {balance > 0
    ? "Simplified Trading"
    : "No change · deposit to get started"}
</div>

                  <div className="dt-quick-actions">
                    {[
                      { label: "Deposit",  icon: "＋", bg: "rgba(14,203,129,0.12)",  color: "#0ecb81" },
                      { label: "Withdraw", icon: "↑",  bg: "rgba(55,138,221,0.12)",  color: "#378ADD" },
                      { label: "Trade",    icon: "⇄",  bg: "rgba(124,106,247,0.12)", color: "#a78bfa" },
                      { label: "Transfer", icon: "➤",  bg: "rgba(93,202,165,0.12)",  color: "#5DCAA5" },
                    ].map((a, i) => (
                      <div key={i} className="dt-qa-item">
                        <div className="dt-qa-icon" style={{ background: a.bg }}>
                          <span style={{ fontSize: 20, color: a.color }}>{a.icon}</span>
                        </div>
                        <span className="dt-qa-label">{a.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Ticker strip */}
            {/* Replace your old static ticker with this animated one */}
<div className="dt-ticker-container">
  <div className="dt-ticker-track">
    {/* We map twice [...LIVE_MARKETS, ...LIVE_MARKETS] to make the loop seamless */}
    {[...LIVE_MARKETS, ...LIVE_MARKETS].map((t, idx) => (
      <div key={idx} className="dt-ticker-item">
        <span style={{ fontWeight: 700, color: 'var(--accent2)' }}>{t.symbol}</span>
        <span style={{ fontFamily: 'DM Mono', fontWeight: 500 }}>{t.price}</span>
        <span style={{
          fontSize: 12, 
          fontWeight: 600, 
          color: t.change >= 0 ? 'var(--green)' : 'var(--red)'
        }}>
          {t.change >= 0 ? '▲' : '▼'} {Math.abs(t.change)}%
        </span>
      </div>
    ))}
  </div>
</div>


            {/* Referral banner */}
            <div className="dt-banner">
              <div className="dt-banner-glow" />
              <div className="dt-banner-icon">🎁</div>
              <div>
                <div className="dt-banner-title">Refer a friend, earn 50 USDT</div>
                <div className="dt-banner-sub">Invite friends and earn commission rewards on every trade</div>
              </div>
              <button className="dt-banner-btn">Invite now</button>
            </div>

            {/* Markets */}
            <div className="dt-section">
              <div className="dt-section-header">
                <span className="dt-section-title">Markets</span>
                <button className="dt-section-link" onClick={() => navigate("/markets")}>See all →</button>
              </div>
              <div className="dt-tabs">
                {["Hot", "Gainers", "Losers", "New", "Live"].map(tab => (
                  <button
                    key={tab}
                    className={`dt-tab${activeTab === tab ? " active" : ""}`}
                    onClick={() => setActiveTab(tab as any)}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <div className="dt-mkt-grid">
                {filterMarkets().map(m => (
                  <button
                    key={m.pair}
                    className="dt-mkt-row"
                    onClick={() => navigate("/markets")}
                  >
                    <div
                      className="dt-coin-dot"
                      style={{
                        background: COIN_COLORS[m.symbol]?.bg ?? "#ffffff11",
                        color: COIN_COLORS[m.symbol]?.color ?? "#fff",
                        fontSize: m.symbol.length > 1 ? 10 : 14,
                      }}
                    >
                      {m.symbol}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="dt-mkt-name">{m.pair}</div>
                      <div className="dt-mkt-vol">{m.volume}</div>
                    </div>
                    <Sparkline up={m.sparkUp} />
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <div className="dt-mkt-price">{m.price}</div>
                      <div className="dt-mkt-change" style={{ color: m.change > 0 ? "var(--green)" : m.change < 0 ? "var(--red)" : "var(--text3)" }}>
                        {m.change > 0 ? "+" : ""}{m.change.toFixed(2)}%
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* News */}
            <div className="dt-section">
              <div className="dt-section-header" style={{ paddingBottom: 4 }}>
                <span className="dt-section-title">Latest News</span>
                <button className="dt-section-link" onClick={() => navigate("/news")}>More →</button>
              </div>
              <div className="dt-news-grid">
                {displayedNews.map((n) => (
                  <button key={n.id} className="dt-news-item" onClick={() => navigate("/news") }>
                    <div className="dt-news-src">{n.src}</div>
                    <div className="dt-news-title">{n.title}</div>
                    <div className="dt-news-time">{n.time}</div>
                  </button>
                ))}
              </div>
            </div>
          </>
          )}
          </main>

          {/* ── Right panel ── */}
          <aside className="dt-right">
            <div className="dt-card">
              <div className="dt-card-title">Live prices</div>
              {TICKERS.map(t => (
                <div key={t.name} className="dt-price-row">
                  <div className="dt-pr-symbol">
                    <div className="dt-pr-dot" style={{ background: COIN_COLORS[t.name === "BTC" ? "₿" : t.name === "ETH" ? "Ξ" : t.name]?.color ?? "var(--text3)" }} />
                    <div>
                      <div className="dt-pr-name">{t.name}</div>
                    </div>
                  </div>
                  <div className="dt-pr-right">
                    <div className="dt-pr-price">{t.price}</div>
                    <div className="dt-pr-change" style={{ color: t.up ? "var(--green)" : "var(--red)" }}>{t.change}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="dt-card">
              <div className="dt-card-title">Market insights</div>
              <div className="dt-insight-row">
                <span className="dt-insight-label">Market momentum</span>
                <span className="dt-pill">Strong ↑</span>
              </div>
              <div className="dt-insight-row">
                <span className="dt-insight-label">BTC dominance</span>
                <span style={{ fontSize: 13, color: "var(--text)", fontWeight: 600, fontFamily: "'DM Mono', monospace" }}>54.2%</span>
              </div>
              <div className="dt-insight-row">
                <span className="dt-insight-label">Fear & Greed</span>
                <span className="dt-pill warn">72 · Greed</span>
              </div>
              <div className="dt-insight-row">
                <span className="dt-insight-label">24h Volume</span>
                <span style={{ fontSize: 13, color: "var(--text)", fontWeight: 600, fontFamily: "'DM Mono', monospace" }}>$86.4B</span>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {activeNav === "Account" && (
        <div className="dt-account-overlay" onClick={closeAccountSection}>
          <div className="dt-account-panel" onClick={(e) => e.stopPropagation()}>
            <button className="dt-account-close" onClick={closeAccountSection}>← Back to dashboard</button>
            <AccountScreen
              onNavigate={(screen) => {
                if (screen === "markets") return navigate("/markets");
                if (screen === "trade") return navigate("/trade");
                if (screen === "home") return navigate("/home");
                setActiveNav("Dashboard");
              }}
              showTopBar={false}
              showBottomNav={false}
            />
          </div>
        </div>
      )}

      <NotificationPanel
        notifications={notifications}
        isVisible={showNotifications}
        onClose={() => setShowNotifications(false)}
        onMarkAsRead={handleMarkAsRead}
        onMarkAllAsRead={handleMarkAllAsRead}
      />
    </>
  );
}
