import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from './components/theme/ThemeContext';
import { ShieldCheck, ChevronDown, Sun, Moon, Menu } from 'lucide-react';
import './navbar.css';

export default function Navbar({ showAuth = true, minimal = false }) {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="navbar">
      <div className="container nav-content">
        <div className="nav-left">
          <Link to="/" className="logo">
            <div className="logo-box"><ShieldCheck className="w-6 h-6 text-white" /></div>
            <span className="logo-text">SwanCore</span>
          </Link>
          {!minimal && (
            <nav className="nav-links">
              <div className="nav-dropdown">Trade <ChevronDown className="w-4 h-4" /></div>
              <Link to="/markets">Markets</Link>
              <Link to="/earn">Earn</Link>
              <Link to="/research">Research</Link>
            </nav>
          )}
        </div>
        <div className="nav-right">
          <button onClick={toggleTheme} className="theme-toggle">
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {showAuth && !minimal && (
            <div className="nav-auth">
              <button onClick={() => navigate('/login')} className="btn-ghost">Log in</button>
              <button onClick={() => navigate('/register')} className="btn-primary">Sign Up</button>
            </div>
          )}
          <button className="mobile-menu"><Menu className="w-6 h-6" /></button>
        </div>
      </div>
    </header>
  );
}
