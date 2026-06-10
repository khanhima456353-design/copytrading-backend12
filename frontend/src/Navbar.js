import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from './components/theme/ThemeContext';
import { useMobileMenu } from './components/theme/MobileMenuContext';
import { ChevronDown, Sun, Moon, Menu, X, Bell, BookCheck, AlertTriangle, XCircle, Megaphone } from 'lucide-react';
import logo from './assets/logo.jpg';
import './navbar.css';

export default function Navbar({ showAuth = true, minimal = false, homepage = false }) {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { isMobileMenuOpen, setIsMobileMenuOpen } = useMobileMenu();
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [notifDropdown, setNotifDropdown] = useState([]);

  useEffect(() => {
    if (!homepage) return;
    const fetchUnread = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/notifications/unread-count`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        if (res.ok) { const d = await res.json(); if (d.success) setUnreadCount(d.unreadCount); }
      } catch {}
    };
    fetchUnread();
    const int = setInterval(fetchUnread, 10000);
    return () => clearInterval(int);
  }, [homepage]);

  const openNotifDropdown = async () => {
    if (!showNotifDropdown) {
      try {
        await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/notifications/mark-all-read`, {
          method: "PUT", headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
      } catch {}
      setUnreadCount(0);
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/notifications`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        if (res.ok) { const d = await res.json(); if (d.success) setNotifDropdown(d.notifications); }
      } catch {}
    }
    setShowNotifDropdown(v => !v);
  };

  const navLinks = (
    <nav className="nav-links">
      <Link to="/trade" className="nav-dropdown">Trade <ChevronDown className="w-4 h-4" /></Link>
      <Link to="/markets">Markets</Link>
      <Link to="/earn">Earn</Link>
      <Link to="/research">Research</Link>
    </nav>
  );

  return (
    <header className={`navbar${homepage ? " navbar-home" : ""}`} style={homepage ? { marginTop: 0, position: "fixed", top: 0, left: 0, right: 0, zIndex: 300 } : undefined}>
      <div className="container nav-content">
        <div className="nav-left">
          <Link to="/" style={{ textDecoration: "none" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 14px", borderRadius: 10, background: "#ff8c32", border: "1px solid #ff8c32" }}>
              <img src={logo} alt="SwanCore" style={{ width: 32, height: 32, borderRadius: 4, objectFit: "contain", background: "#0b0e11", padding: 2 }} />
              <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.1 }}>
                <span style={{ color: "#ffffff", fontSize: 18, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", fontFamily: "'Inter', 'SF Pro Display', -apple-system, sans-serif" }}>SwanCore</span>
                <span style={{ color: "#0a0a0a", fontSize: 10 }}>Simplified Trading</span>
              </div>
            </div>
          </Link>
          {!minimal && !homepage && navLinks}
        </div>
        <div className="nav-right">
          {showNotifDropdown && <div style={{ position: 'fixed', inset: 0, zIndex: 399 }} onClick={() => setShowNotifDropdown(false)} />}
          <button onClick={toggleTheme} className="theme-toggle">
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {homepage ? (
            <div style={{ display: 'inline-flex', alignItems: 'center', position: 'relative' }}>
              <button className="theme-toggle" style={{ position: 'relative', fontSize: 18 }} onClick={openNotifDropdown}>
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span style={{
                    position: 'absolute', top: -2, right: -2,
                    background: '#f6465d', color: 'white', width: 16, height: 16,
                    borderRadius: '50%', fontSize: 9, fontWeight: 700,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>{unreadCount > 99 ? '99+' : unreadCount}</span>
                )}
              </button>
              {showNotifDropdown && (
                <div style={{ position: 'absolute', top: '100%', right: 0, width: 340, maxHeight: 400, overflowY: 'auto', background: theme === 'light' ? '#fff' : '#1E2329', border: '1px solid var(--border)', borderRadius: 12, boxShadow: '0 20px 60px rgba(0,0,0,0.4)', zIndex: 400, padding: 8 }}>
                  {notifDropdown.length === 0 ? (
                    <div style={{ padding: '24px 16px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: 13 }}>No notifications yet</div>
                  ) : notifDropdown.map(n => {
                    const iconColor = { success: '#0ecb81', warning: '#ff8c32', error: '#f6465d', admin: '#ff8c32' }[n.type] || '#378ADD';
                    const icon = {
                      success: React.createElement(BookCheck, { size: 16, style: { flexShrink: 0 } }),
                      warning: React.createElement(AlertTriangle, { size: 16, style: { flexShrink: 0 } }),
                      error: React.createElement(XCircle, { size: 16, style: { flexShrink: 0 } }),
                      admin: React.createElement(Megaphone, { size: 16, style: { flexShrink: 0 } }),
                    }[n.type] || React.createElement(Bell, { size: 16, style: { flexShrink: 0 } });
                    const clean = (s) => s.replace(/^[\u{1F000}-\u{1FFFF}\u2700-\u27BF\u{2600}-\u{26FF}\u{2139}\u{2B50}\u{FE0F}]/u, '').trim();
                    return (
                      <div key={n.id} style={{ display: 'flex', gap: 8, padding: '10px 12px', borderBottom: '1px solid var(--border)', fontSize: 13, color: 'var(--text-primary)', alignItems: 'flex-start' }}>
                        <span style={{ color: iconColor, flexShrink: 0, display: 'inline-flex', marginTop: 1 }}>{icon}</span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 600, marginBottom: 2 }}>{clean(n.title)}</div>
                          <div style={{ color: 'var(--text-secondary)', fontSize: 12 }}>{n.message}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : showAuth && !minimal ? (
            <div className="nav-auth">
              <button onClick={() => navigate('/login')} className="btn-ghost">Log in</button>
              <button onClick={() => navigate('/register')} className="btn-primary">Sign Up</button>
            </div>
          ) : null}
          <button className="mobile-menu" onClick={() => setIsMobileMenuOpen(v => !v)}>
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu drawer for non-homepage pages */}
      {!homepage && isMobileMenuOpen && (
        <div className="nav-mobile-overlay" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="nav-mobile-drawer" onClick={e => e.stopPropagation()} style={{ background: theme === "light" ? "#ffffff" : "#1E2329" }}>
            <div className="nav-mobile-body">
              <nav className="nav-mobile-links">
                <Link to="/trade" className="nav-mobile-item" onClick={() => setIsMobileMenuOpen(false)}>
                  Trade
                </Link>
                <Link to="/markets" className="nav-mobile-item" onClick={() => setIsMobileMenuOpen(false)}>Markets</Link>
                <Link to="/earn" className="nav-mobile-item" onClick={() => setIsMobileMenuOpen(false)}>Earn</Link>
                <Link to="/research" className="nav-mobile-item" onClick={() => setIsMobileMenuOpen(false)}>Research</Link>
              </nav>
              {showAuth && !minimal && (
                <div className="nav-mobile-auth">
                  <button onClick={() => { navigate('/login'); setIsMobileMenuOpen(false); }} className="btn-ghost">Log in</button>
                  <button onClick={() => { navigate('/register'); setIsMobileMenuOpen(false); }} className="btn-primary">Sign Up</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
