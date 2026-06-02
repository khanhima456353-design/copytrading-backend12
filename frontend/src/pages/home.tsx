import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.jpg";
import { HomeMainContent, TopBar, BottomNav, Sparkline, Screen, MarketRow, NavItem } from "./HomeShared";
import { MARKETS, TICKERS, COIN_COLORS } from "./homeConstants";


// ─── Types ────────────────────────────────────────────────────────────────────

// Shared types (Screen, MarketRow, NavItem) imported from HomeShared.tsx to eliminate duplication.
// Local copies removed to centralize type definitions.
// Notification interface kept local (has expiresAt field not in shared version).

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error" | "admin";
  isRead: boolean;
  priority: "low" | "medium" | "high";
  createdAt: string;
  expiresAt?: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

// ─── Top Bar ──────────────────────────────────────────────────────────────────

// TopBar is now shared from HomeShared.tsx. The local copy was removed to avoid duplicated UI logic.
// Notification state and navigation handlers remain in the parent component.

// ─── Bottom Nav ───────────────────────────────────────────────────────────────

// BottomNav is now shared from HomeShared.tsx. The local copy was removed to avoid duplicated UI logic.
// Navigation state and callbacks remain in the parent component.
// This extraction is considered low risk because:
// - BottomNav is a pure presentational component with no internal state.
// - It only depends on props (active screen, onNavigate callback) passed from parent.
// - No side effects or API calls are involved.
// - Active tab behavior and styling are preserved exactly.
// What was intentionally not changed:
// - Parent component still owns navigation state and screen-switching logic.
// - No changes to routing, responsive logic, or desktop homepage.
// - No optimization or redesign of navigation architecture.

// ─── Sparkline ────────────────────────────────────────────────────────────────

// Sparkline is now shared from HomeShared.tsx. The local copy was removed to avoid duplicated UI logic.
// This extraction is considered low risk because:
// - Sparkline is a pure presentational component with no internal state.
// - It only depends on the 'up' prop for color and path selection.
// - No side effects, API calls, or state mutations.
// - Preserves exact SVG output and visual appearance.
// What was intentionally not changed:
// - No changes to chart appearance or behavior.
// - Desktop Sparkline implementation remains isolated (it has different fill/gradient behavior).
// - No optimization or memoization introduced.
// - Market state and data flow remain in parent components.

// ─── Notification Panel ────────────────────────────────────────────────────────

function NotificationPanel({
  notifications,
  isVisible,
  onClose,
  onMarkAsRead,
  onMarkAllAsRead
}: {
  notifications: Notification[];
  isVisible: boolean;
  onClose: () => void;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
}) {
  if (!isVisible) return null;

  const getTypeColor = (type: string) => {
    switch (type) {
      case "success": return "#0ecb81";
      case "warning": return "#f0b90b";
      case "error": return "#f6465d";
      case "admin": return "#a78bfa";
      default: return "#378ADD";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "success": return "✅";
      case "warning": return "⚠️";
      case "error": return "❌";
      case "admin": return "📢";
      default: return "ℹ️";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div style={{
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
      paddingTop: 60
    }} onClick={onClose}>
      <div
        style={{
          background: "white",
          borderRadius: 12,
          width: "90%",
          maxWidth: 400,
          maxHeight: "70vh",
          overflow: "hidden",
          boxShadow: "0 10px 30px rgba(0,0,0,0.3)"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          padding: "16px 20px",
          borderBottom: "1px solid #e5e7eb",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}>
          <h3 style={{
            margin: 0,
            fontSize: 18,
            fontWeight: 600,
            color: "#1f2937"
          }}>
            Notifications
          </h3>
          <div style={{ display: "flex", gap: 8 }}>
            {notifications.some(n => !n.isRead) && (
              <button
                onClick={onMarkAllAsRead}
                style={{
                  padding: "4px 8px",
                  fontSize: 12,
                  background: "#f3f4f6",
                  border: "1px solid #d1d5db",
                  borderRadius: 6,
                  cursor: "pointer",
                  color: "#374151"
                }}
              >
                Mark all read
              </button>
            )}
            <button
              onClick={onClose}
              style={{
                padding: "4px 8px",
                fontSize: 14,
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#6b7280"
              }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div style={{
          maxHeight: "calc(70vh - 80px)",
          overflowY: "auto"
        }}>
          {notifications.length === 0 ? (
            <div style={{
              padding: "40px 20px",
              textAlign: "center",
              color: "#6b7280"
            }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🔔</div>
              <div style={{ fontSize: 16, fontWeight: 500, marginBottom: 8 }}>
                No notifications yet
              </div>
              <div style={{ fontSize: 14 }}>
                You'll receive notifications about important updates and activities here.
              </div>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                style={{
                  padding: "16px 20px",
                  borderBottom: "1px solid #f3f4f6",
                  background: notification.isRead ? "white" : "#fefce8",
                  cursor: "pointer",
                  transition: "background 0.2s"
                }}
                onClick={() => !notification.isRead && onMarkAsRead(notification.id)}
              >
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                  <div style={{
                    fontSize: 20,
                    color: getTypeColor(notification.type),
                    flexShrink: 0
                  }}>
                    {getTypeIcon(notification.type)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: "#1f2937",
                      marginBottom: 4
                    }}>
                      {notification.title}
                    </div>
                    <div style={{
                      fontSize: 14,
                      color: "#4b5563",
                      lineHeight: 1.4,
                      marginBottom: 8
                    }}>
                      {notification.message}
                    </div>
                    <div style={{
                      fontSize: 12,
                      color: "#9ca3af"
                    }}>
                      {formatDate(notification.createdAt)}
                    </div>
                  </div>
                  {!notification.isRead && (
                    <div style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: getTypeColor(notification.type),
                      flexShrink: 0,
                      marginTop: 6
                    }} />
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Home Screen ──────────────────────────────────────────────────────────────

function HomeScreen({ onNavigate, showTopBar = true, showBottomNav = true }: { onNavigate: (s: Screen) => void; showTopBar?: boolean; showBottomNav?: boolean }) {
  const [activeTab, setActiveTab] = useState("Hot");
  const navigate = useNavigate();

  // User profile state
  const [userProfile, setUserProfile] = useState<{ kycVerified: boolean; kycStatus: string } | null>(null);

  // Notification state
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setUserProfile({
            kycVerified: data.user.kycVerified || false,
            kycStatus: data.user.kycStatus || 'pending'
          });
        }
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/notifications`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setNotifications(data.notifications);
        }
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/notifications/unread-count`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setUnreadCount(data.unreadCount);
        }
      }
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  useEffect(() => {
    fetchUserProfile();
    fetchNotifications();
    fetchUnreadCount();
  }, []);

  const handleNotificationClick = () => {
    setShowNotifications(true);
  };

  const handleCloseNotifications = () => {
    setShowNotifications(false);
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/notifications/${notificationId}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setNotifications(prev =>
          prev.map(n =>
            n.id === notificationId ? { ...n, isRead: true } : n
          )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/notifications/mark-all-read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setNotifications(prev =>
          prev.map(n => ({ ...n, isRead: true }))
        );
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <div style={{ flex: 1, overflow: "auto" }}>
        {showTopBar && (
          <TopBar
            showSearch
            showNotifications
            unreadCount={unreadCount}
            onNotificationClick={handleNotificationClick}
          />
        )}
        <HomeMainContent onNavigate={navigate} />
      </div>
      {showBottomNav && <BottomNav active="home" onNavigate={onNavigate} />}

      <NotificationPanel
        notifications={notifications}
        isVisible={showNotifications}
        onClose={handleCloseNotifications}
        onMarkAsRead={handleMarkAsRead}
        onMarkAllAsRead={handleMarkAllAsRead}
      />
    </div>
  );
}

// ─── Portfolio Screen ─────────────────────────────────────────────────────────

function PortfolioScreen({ onNavigate, showTopBar = true, showBottomNav = true }: { onNavigate: (s: Screen) => void; showTopBar?: boolean; showBottomNav?: boolean }) {
  const [totalValue, setTotalValue] = useState<number>(0);
  const [holdingsCount, setHoldingsCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  const portfolioLabel = loading ? "Loading portfolio..." : totalValue > 0 ? `${holdingsCount} holding${holdingsCount === 1 ? "" : "s"}` : "No holdings yet";

  const fetchPortfolioSummary = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/account/summary`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        const available = Number(data.available || 0);
        const locked = Number(data.locked || 0);
        const holdingsValue = Array.isArray(data.holdings)
          ? data.holdings.reduce((sum: number, item: any) => sum + (Number(item.value) || 0), 0)
          : 0;

        setTotalValue(Math.max(0, available + locked + holdingsValue));
        setHoldingsCount(Array.isArray(data.holdings) ? data.holdings.length : 0);
      }
    } catch (error) {
      console.error('Error fetching portfolio summary:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolioSummary();
  }, []);

  return (
    <div>
      {showTopBar && <TopBar />}
      <div style={styles.balanceHero}>
        <div style={styles.balLabel}>Total portfolio value</div>
        <div style={styles.balAmount}>
          {loading ? "Loading..." : totalValue.toFixed(2)} <span style={styles.balUnit}>USDT</span>
        </div>
        <div style={styles.balChange}>{loading ? "Please wait while we load your balance." : totalValue > 0 ? portfolioLabel : "Deposit to start building your portfolio"}</div>
      </div>
      <div style={styles.pnlBar}>
        {[["24h P&L","—"],["7d P&L","—"],["All-time","—"],["Invested","0.00"]].map(([l,v],i) => (
          <div key={i} style={styles.pnlCell}>
            <div style={styles.pnlLabel}>{l}</div>
            <div style={{ fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.25)" }}>{v}</div>
          </div>
        ))}
      </div>
      <div style={styles.sectionHeader}>
        <span style={styles.sectionLabel}>Holdings ({holdingsCount})</span>
      </div>
      <div style={styles.emptyState}>
        <div style={styles.emptyIcon}>
          <span style={{ fontSize: 24, color: "#a78bfa" }}>🥧</span>
        </div>
        <div style={styles.emptyTitle}>No holdings yet</div>
        <div style={styles.emptySub}>
          Deposit USDT and make your first trade to see your portfolio here.
        </div>
        <button onClick={() => onNavigate("home")} style={styles.depBtn}>
          ＋ Deposit now
        </button>
      </div>
      <div style={{ padding: "14px 20px", background: "#1a1a2e" }}>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.28)", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 10 }}>
          Allocation
        </div>
        <div style={{ height: 7, borderRadius: 4, background: "rgba(255,255,255,0.07)", marginBottom: 10 }} />
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.2)" }}>No assets to display</div>
      </div>
      {showBottomNav && <BottomNav active="portfolio" onNavigate={onNavigate} />}
    </div>
  );
}

// ─── Markets Screen ───────────────────────────────────────────────────────────

const ALL_MARKETS: MarketRow[] = [
  ...MARKETS,
  { symbol: "SOL",  pair: "SOL / USDT",  volume: "Vol $5.6B", price: "$178.40", change: -1.20, sparkUp: false },
  { symbol: "USDC", pair: "USDC / USDT", volume: "Vol $1.1B", price: "$1.00",   change:  0.00, sparkUp: true  },
];

const MARKET_COIN_COLORS: Record<string, { bg: string; color: string }> = {
  ...COIN_COLORS,
  "SOL":  { bg: "#14F19522", color: "#14F195" },
  "USDC": { bg: "#2775CA22", color: "#2775CA" },
};

function MarketsScreen({ onNavigate, showTopBar = true, showBottomNav = true }: { onNavigate: (s: Screen) => void; showTopBar?: boolean; showBottomNav?: boolean }) {
  const [activeTab, setActiveTab] = useState("All");
  return (
    <div>
      {showTopBar && <TopBar showSearch />}
      <div style={styles.tabRow}>
        {["All","Gainers","Losers","Watchlist"].map((t) => (
          <button key={t} onClick={() => setActiveTab(t)} style={{ ...styles.mktTab, ...(activeTab === t ? styles.mktTabActive : {}) }}>
            {t}
          </button>
        ))}
      </div>
      <div style={styles.sectionHeader}>
        <span style={styles.sectionLabel}>Top markets</span>
        <span style={styles.sectionLink}>Filter</span>
      </div>
      {ALL_MARKETS.map((m) => (
        <div key={m.pair} style={styles.marketRow}>
          <div style={{ ...styles.coinDot, background: MARKET_COIN_COLORS[m.symbol]?.bg ?? "#ffffff11", color: MARKET_COIN_COLORS[m.symbol]?.color ?? "#fff", fontSize: m.symbol.length > 1 ? 11 : 13 }}>
            {m.symbol}
          </div>
          <div style={{ flex: 1 }}>
            <div style={styles.mName}>{m.pair}</div>
            <div style={styles.mVol}>{m.volume}</div>
          </div>
          <Sparkline up={m.sparkUp} />
          <div style={{ textAlign: "right" }}>
            <div style={styles.mPrice}>{m.price}</div>
            <div style={{ fontSize: 12, color: m.change > 0 ? "#0ecb81" : m.change < 0 ? "#f6465d" : "rgba(255,255,255,0.25)", marginTop: 2 }}>
              {m.change > 0 ? "+" : ""}{m.change.toFixed(2)}%
            </div>
          </div>
        </div>
      ))}
      {showBottomNav && <BottomNav active="markets" onNavigate={onNavigate} />}
    </div>
  );
}

// ─── Account Screen ───────────────────────────────────────────────────────────

import authService from "../services/authService";

export function AccountScreen({ onNavigate, showTopBar = true, showBottomNav = true }: { onNavigate: (s: Screen) => void; showTopBar?: boolean; showBottomNav?: boolean }) {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState<{ kycVerified: boolean; kycStatus: string } | null>(null);
  const [darkMode, setDarkMode] = useState(true);
  const [twoFA, setTwoFA] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const handleLogout = () => {
    authService.logout();
    navigate("/", { replace: true });
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/profile`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setUserProfile({
            kycVerified: data.user?.kycVerified || false,
            kycStatus: data.user?.kycStatus || 'pending',
          });
        }
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  // Get user data from localStorage
  const userEmail = localStorage.getItem("userEmail") || "user@example.com";
  const userId = localStorage.getItem("userId") || "SW-000000";
  
  // Create display name from email (part before @) or fallback to "User"
  const displayName = userEmail.includes("@") 
    ? userEmail.split("@")[0].charAt(0).toUpperCase() + userEmail.split("@")[0].slice(1)
    : "User";
  
  // Create avatar initials from display name
  const avatarInitials = displayName.charAt(0).toUpperCase();

  // Fetch notifications on component mount
  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch("/api/notifications", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications);
        setUnreadCount(data.notifications.filter((n: any) => !n.isRead).length);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
  };

  const handleCloseNotifications = () => {
    setShowNotifications(false);
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch(`/api/notifications/${id}/read`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setNotifications(notifications.map((n: any) =>
          n.id === id ? { ...n, isRead: true } : n
        ));
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      // Mark all as read in the UI first
      setNotifications(notifications.map((n: any) => ({ ...n, isRead: true })));
      setUnreadCount(0);

      // Update each notification on the server
      await Promise.all(
        notifications
          .filter((n: any) => !n.isRead)
          .map((n: any) => handleMarkAsRead(n.id))
      );
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  return (
    <div>
      {showTopBar && (
        <TopBar
          onNotificationClick={handleNotificationClick}
          unreadCount={unreadCount}
        />
      )}
      {/* Profile hero */}
      <div style={styles.profileHero}>
        <div style={styles.avatar}>{avatarInitials}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 16, fontWeight: 500, color: "#fff" }}>{displayName}</div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 3 }}>{userEmail}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.25)" }}>UID:</span>
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", fontFamily: "monospace" }}>{userId}</span>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-end" }}>
          {userProfile?.kycVerified ? (
            <span style={styles.badgeVerified}>✓ Verified</span>
          ) : (
            <span style={styles.badgeUnverified}>⚠ Unverified</span>
          )}
          <span style={styles.badgePurple}>New</span>
        </div>
      </div>

      {/* KYC banner - only show if not verified */}
      {!userProfile?.kycVerified && (
        <button onClick={() => navigate("/verification")} style={{ ...styles.kycBanner, cursor: "pointer", border: "1px solid rgba(240,185,11,0.35)", background: "rgba(240,185,11,0.08)" }}>
          <span style={{ fontSize: 18, color: "#F0B90B" }}>🪪</span>
          <div style={{ flex: 1, textAlign: "left" }}>
            <div style={{ fontSize: 13, color: "#F0B90B", fontWeight: 500 }}>Complete identity verification</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>Unlock deposits, withdrawals and trading</div>
          </div>
          <div style={{ fontSize: 11, color: "#0f172a", background: "#f0b90b", borderRadius: 12, padding: "8px 14px" }}>Verify</div>
        </button>
      )}

      {/* Limits grid */}
      <div style={styles.limitsGrid}>
        {(
          userProfile?.kycVerified ? [
            { label: "Daily withdrawal", val: "Unlimited", sub: "Verified account" },
            { label: "Trading limit",    val: "Unlimited", sub: "Full access" },
          ] : [
            { label: "Daily withdrawal", val: "0 USDT",  sub: "Verify to unlock" },
            { label: "Trading limit",    val: "Locked",  sub: "KYC required"    },
          ]
        ).map((c, i) => (
          <div key={i} style={styles.limCell}>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginBottom: 4 }}>{c.label}</div>
            <div style={{ fontSize: 14, color: "#fff", fontWeight: 500 }}>{c.val}</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", marginTop: 2 }}>{c.sub}</div>
            <div style={{ height: 4, background: "rgba(255,255,255,0.08)", borderRadius: 2, marginTop: 6 }} />
          </div>
        ))}
      </div>

      {/* Security section */}
      {[
        { section: "Identity & verification", rows: [
          { icon: "🪪", color: "#F0B90B", bg: "#F0B90B15", title: "KYC verification",     sub: userProfile?.kycVerified ? "Verified · full access" : "Not started · required to trade", badge: userProfile?.kycVerified ? <span style={styles.badgeVerified}>Verified</span> : <span style={styles.badgeUnverified}>Pending</span>, link: userProfile?.kycVerified ? undefined : "/verification" },
          { icon: "💳", color: "#378ADD", bg: "#378ADD15", title: "Payment methods",      sub: "No methods linked yet" },
        ]},
        { section: "Security", rows: [
          { icon: "🔒", color: "#a78bfa", bg: "#a78bfa15", title: "Password",                    sub: "Set during registration" },
          { icon: "📱", color: "#0ecb81", bg: "#0ecb8115", title: "Two-factor authentication",   sub: twoFA ? "Authenticator app enabled" : "Not enabled · recommended",
            badge: (
              <button onClick={() => setTwoFA(!twoFA)} style={{ ...styles.toggle, background: twoFA ? "#0ecb81" : "rgba(255,255,255,0.12)" }} aria-label="Toggle 2FA">
                <div style={{ ...styles.toggleKnob, marginLeft: twoFA ? "auto" : 0 }} />
              </button>
            )
          },
          { icon: "🖥",  color: "#a78bfa", bg: "#a78bfa15", title: "Active devices",              sub: "1 device (this device)" },
        ]},
        { section: "Preferences", rows: [
          { icon: "🔔", color: "#5DCAA5", bg: "#5DCAA515", title: "Notifications",   sub: "Price alerts, security notices" },
          { icon: "🌐", color: "#378ADD", bg: "#378ADD15", title: "Language & region", sub: "English · USDT · UTC+2" },
          { icon: "🌙", color: "#EF9F27", bg: "#EF9F2715", title: "Dark mode",        sub: darkMode ? "Currently enabled" : "Currently disabled",
            badge: (
              <button onClick={() => setDarkMode(!darkMode)} style={{ ...styles.toggle, background: darkMode ? "#0ecb81" : "rgba(255,255,255,0.12)" }} aria-label="Toggle dark mode">
                <div style={{ ...styles.toggleKnob, marginLeft: darkMode ? "auto" : 0 }} />
              </button>
            )
          },
          { icon: "🎧", color: "#378ADD", bg: "#378ADD15", title: "Support & help center", sub: "Chat, tickets, FAQs" },
        ]},
      ].map(({ section, rows }) => (
        <div key={section}>
          <div style={styles.sectionDivider}>{section}</div>
          {rows.map((row: any, i) => (
            <button
              key={i}
              style={{
                ...styles.accRow,
                cursor: row.link ? "pointer" : "default",
                textAlign: "left",
                border: row.link ? "1px solid rgba(240,185,11,0.12)" : "none",
                background: row.link ? "rgba(240,185,11,0.06)" : "transparent",
              }}
              onClick={() => row.link && navigate(row.link)}
            >
              <div style={{ ...styles.accIcon, background: row.bg }}>
                <span style={{ fontSize: 16 }}>{row.icon}</span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, color: "#fff" }}>{row.title}</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", marginTop: 2 }}>{row.sub}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                {row.badge ?? <span style={{ fontSize: 14, color: "rgba(255,255,255,0.2)" }}>›</span>}
              </div>
            </button>
          ))}
        </div>
      ))}

      {/* Log out */}
      <button style={{ ...styles.logoutRow, textAlign: "left", border: "1px solid rgba(246,70,93,0.12)", background: "rgba(246,70,93,0.06)" }} onClick={handleLogout}>
        <span style={{ fontSize: 18 }}>🚪</span>
        <span style={{ fontSize: 14, color: "#f6465d" }}>Log out</span>
      </button>

      {showBottomNav && <BottomNav active="account" onNavigate={onNavigate} />}

      {/* Notification Panel */}
      <NotificationPanel
        notifications={notifications}
        isVisible={showNotifications}
        onClose={handleCloseNotifications}
        onMarkAsRead={handleMarkAsRead}
        onMarkAllAsRead={handleMarkAllAsRead}
      />
    </div>
  );
}

// ─── Root App ─────────────────────────────────────────────────────────────────

export function HomeRouter({ showTopBar = true, showBottomNav = true }: { showTopBar?: boolean; showBottomNav?: boolean }) {
  const [screen, setScreen] = useState<Screen>("home");
  const navigate = useNavigate();

  const handleScreenChange = (screenId: Screen) => {
    if (screenId === "markets") {
      navigate("/markets");
      return;
    }
    if (screenId === "trade") {
      navigate("/trade");
      return;
    }
    setScreen(screenId);
  };

  return (
    <>
      {screen === "home"      && <HomeScreen      onNavigate={handleScreenChange} showTopBar={showTopBar} showBottomNav={showBottomNav} />}
      {screen === "portfolio" && <PortfolioScreen onNavigate={handleScreenChange} showTopBar={showTopBar} showBottomNav={showBottomNav} />}
      {screen === "markets"   && <MarketsScreen   onNavigate={handleScreenChange} showTopBar={showTopBar} showBottomNav={showBottomNav} />}
      {screen === "account"   && <AccountScreen   onNavigate={handleScreenChange} showTopBar={showTopBar} showBottomNav={showBottomNav} />}
    </>
  );
}

export default function Home() {
  return (
    <div style={styles.page}>
      <div style={styles.app}>
        <HomeRouter />
      </div>
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles: Record<string, React.CSSProperties> = {
  page: {
    width: "100vw",
    height: "100vh",
    background: `radial-gradient(circle at top, rgba(120, 200, 255, 0.25), transparent 45%),
      radial-gradient(circle at top right, rgba(0, 180, 255, 0.18), transparent 55%),
      radial-gradient(circle at bottom left, rgba(0, 120, 200, 0.20), transparent 60%),
      linear-gradient(180deg, #0a1a2a 0%, #06121f 60%, #040b14 100%)`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    display: "flex",
    justifyContent: "center",
    padding: 0,
    boxSizing: "border-box",
    overflow: "hidden",
  },
  app: {
    fontFamily: "sans-serif",
    background: "#0f1320",
    borderRadius: 12,
    overflow: "hidden",
    maxWidth: 420,
    width: "100%",
    margin: 0,
    height: "100vh",
    boxShadow: "0 30px 80px rgba(0,0,0,0.35)",
  },
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
  balanceHero: {
    background: "#16213e",
    padding: "22px 20px 18px",
    textAlign: "center",
    borderBottom: "0.5px solid rgba(255,255,255,0.06)",
  },
  balLabel:  { fontSize: 12, color: "rgba(255,255,255,0.4)", letterSpacing: "0.5px", marginBottom: 6 },
  balAmount: { fontSize: 30, fontWeight: 500, color: "#fff" },
  balUnit:   { fontSize: 14, color: "rgba(255,255,255,0.4)", marginLeft: 4 },
  balChange: { fontSize: 13, color: "rgba(255,255,255,0.3)", marginTop: 5 },
  quickActions: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    background: "#16213e",
    borderBottom: "0.5px solid rgba(255,255,255,0.07)",
  },
  qaItem: {
    display: "flex", flexDirection: "column", alignItems: "center",
    gap: 6, padding: "14px 8px", cursor: "pointer",
    borderRight: "0.5px solid rgba(255,255,255,0.06)",
  },
  qaIcon: { width: 40, height: 40, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" },
  qaLabel: { fontSize: 11, color: "rgba(255,255,255,0.5)" },
  tickerStrip: {
    background: "#0f0f1a", padding: "9px 20px",
    display: "flex", gap: 18, overflow: "hidden",
    borderBottom: "0.5px solid rgba(255,255,255,0.06)",
  },
  tick:      { display: "flex", alignItems: "center", gap: 5, flexShrink: 0 },
  tickName:  { fontSize: 11, color: "rgba(255,255,255,0.4)" },
  tickPrice: { fontSize: 11, color: "#fff", fontWeight: 500 },
  banner: {
    background: "#7C5CFC18", border: "0.5px solid #7C5CFC55",
    margin: "12px 16px", borderRadius: 8,
    padding: "11px 14px", display: "flex", alignItems: "center", gap: 10,
  },
  bannerTitle: { fontSize: 13, color: "#a78bfa", fontWeight: 500 },
  bannerSub:   { fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 2 },
  bannerBtn: {
    fontSize: 11, color: "#a78bfa",
    border: "0.5px solid #a78bfa", borderRadius: 12,
    padding: "4px 10px", cursor: "pointer", flexShrink: 0,
    background: "transparent",
  },
  tabRow: {
    display: "flex", padding: "0 20px",
    background: "#16213e",
    borderBottom: "0.5px solid rgba(255,255,255,0.07)",
  },
  mktTab: {
    fontSize: 13, padding: "10px 14px 8px",
    color: "rgba(255,255,255,0.35)", cursor: "pointer",
    borderBottom: "2px solid transparent",
    background: "transparent", border: "none",
    borderBottomStyle: "solid", borderBottomWidth: 2, borderBottomColor: "transparent",
  },
  mktTabActive: { color: "#a78bfa", borderBottomColor: "#a78bfa" },
  sectionHeader: {
    padding: "10px 20px 6px", display: "flex",
    justifyContent: "space-between", alignItems: "center",
    background: "#0f0f1a",
  },
  sectionLabel: { fontSize: 11, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.8px" },
  sectionLink:  { fontSize: 12, color: "#a78bfa", cursor: "pointer" },
  sectionDivider: {
    fontSize: 11, color: "rgba(255,255,255,0.28)",
    textTransform: "uppercase", letterSpacing: "0.8px",
    padding: "12px 20px 6px", background: "#0f0f1a",
  },
  marketRow: {
    background: "#1a1a2e", borderBottom: "0.5px solid rgba(255,255,255,0.06)",
    padding: "11px 20px", display: "flex", alignItems: "center", gap: 12,
  },
  coinDot: {
    width: 34, height: 34, borderRadius: "50%",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontWeight: 500, flexShrink: 0,
  },
  mName:  { fontSize: 14, color: "#fff", fontWeight: 500 },
  mVol:   { fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 2 },
  mPrice: { fontSize: 14, color: "#fff", fontWeight: 500 },
  newsCard: {
    background: "#16213e", borderRadius: 8,
    border: "0.5px solid rgba(255,255,255,0.07)",
    padding: "12px 14px", marginTop: 8,
  },
  newsSrc:   { fontSize: 11, color: "rgba(255,255,255,0.3)", marginBottom: 4 },
  newsTitle: { fontSize: 13, color: "#fff", lineHeight: "1.4" },
  newsTime:  { fontSize: 11, color: "rgba(255,255,255,0.22)", marginTop: 5 },
  pnlBar: {
    background: "#0f0f1a", display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
  },
  pnlCell: {
    padding: "12px 14px", textAlign: "center",
    borderRight: "0.5px solid rgba(255,255,255,0.06)",
  },
  pnlLabel: { fontSize: 10, color: "rgba(255,255,255,0.3)", marginBottom: 3 },
  emptyState: { padding: "32px 20px", textAlign: "center", background: "#1a1a2e" },
  emptyIcon: {
    width: 56, height: 56, borderRadius: "50%",
    background: "#7C5CFC18", display: "flex",
    alignItems: "center", justifyContent: "center",
    margin: "0 auto 12px",
  },
  emptyTitle: { fontSize: 15, color: "#fff", fontWeight: 500, marginBottom: 6 },
  emptySub:   { fontSize: 13, color: "rgba(255,255,255,0.35)", lineHeight: "1.5" },
  depBtn: {
    display: "inline-flex", alignItems: "center", gap: 6,
    marginTop: 14, background: "#7C5CFC", borderRadius: 8,
    padding: "9px 20px", fontSize: 13, color: "#fff",
    cursor: "pointer", fontWeight: 500, border: "none",
  },
  profileHero: {
    background: "#16213e", padding: 20,
    display: "flex", alignItems: "center", gap: 14,
    borderBottom: "0.5px solid rgba(255,255,255,0.07)",
  },
  avatar: {
    width: 52, height: 52, borderRadius: "50%",
    background: "#7C5CFC22", border: "2px solid #7C5CFC",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 18, fontWeight: 500, color: "#a78bfa", flexShrink: 0,
  },
  badgeUnverified: {
    background: "#F0B90B18", color: "#F0B90B",
    fontSize: 11, padding: "2px 8px", borderRadius: 10,
  },
  badgeVerified: {
    background: "#0ecb8118", color: "#0ecb81",
    fontSize: 11, padding: "2px 8px", borderRadius: 10,
  },
  badgePurple: {
    background: "#7C5CFC20", color: "#a78bfa",
    fontSize: 11, padding: "2px 8px", borderRadius: 10,
  },
  kycBanner: {
    background: "#F0B90B12", border: "0.5px solid #F0B90B44",
    margin: "12px 16px", borderRadius: 8,
    padding: "11px 14px", display: "flex", alignItems: "center", gap: 10,
  },
  limitsGrid: {
    display: "grid", gridTemplateColumns: "1fr 1fr",
    gap: 1, background: "rgba(255,255,255,0.06)",
  },
  limCell: { background: "#1a1a2e", padding: "13px 20px" },
  accRow: {
    background: "#1a1a2e", borderBottom: "0.5px solid rgba(255,255,255,0.06)",
    padding: "12px 20px", display: "flex", alignItems: "center", gap: 12,
    cursor: "pointer",
  },
  accIcon: {
    width: 32, height: 32, borderRadius: 8,
    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
  },
  toggle: {
    width: 36, height: 20, borderRadius: 10,
    display: "flex", alignItems: "center",
    padding: 2, cursor: "pointer", border: "none",
    transition: "background 0.2s",
  },
  toggleKnob: {
    width: 16, height: 16, borderRadius: "50%", background: "#fff",
  },
  logoutRow: {
    padding: "14px 20px", display: "flex", alignItems: "center",
    gap: 10, cursor: "pointer", background: "#1a1a2e",
  },
};
