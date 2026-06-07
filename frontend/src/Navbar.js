import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from './components/theme/ThemeContext';
import { useMobileMenu } from './components/theme/MobileMenuContext';
import { ChevronDown, Sun, Moon, Menu, X } from 'lucide-react';
import logo from './assets/logo.jpg';
import './navbar.css';

export default function Navbar({ showAuth = true, minimal = false, homepage = false }) {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { isMobileMenuOpen, setIsMobileMenuOpen } = useMobileMenu();
  const [unreadCount, setUnreadCount] = useState(0);

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
    const int = setInterval(fetchUnread, 30000);
    return () => clearInterval(int);
  }, [homepage]);

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
              <span style={{ color: "var(--text-current)", fontSize: 18, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", fontFamily: "'Inter', 'SF Pro Display', -apple-system, sans-serif" }}>SwanCore</span>
            </div>
          </Link>
          {!minimal && !homepage && navLinks}
        </div>
        <div className="nav-right">
          <button onClick={toggleTheme} className="theme-toggle">
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {homepage ? (
            <button className="theme-toggle" style={{ position: 'relative', fontSize: 18 }}>
              🔔
              {unreadCount > 0 && (
                <span style={{
                  position: 'absolute', top: -2, right: -2,
                  background: '#f6465d', color: 'white', width: 16, height: 16,
                  borderRadius: '50%', fontSize: 9, fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>{unreadCount > 99 ? '99+' : unreadCount}</span>
              )}
            </button>
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
          <div className="nav-mobile-drawer" onClick={e => e.stopPropagation()}>
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
