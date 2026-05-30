<<<<<<< HEAD
﻿import React from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import authService from "./services/authService";
import ThemeToggle from "./components/theme/ThemeToggle";
import "./navbar.css";
import logo from "./assets/logo.jpg";
=======
﻿import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from './components/theme/ThemeContext';
import { ShieldCheck, ChevronDown, Sun, Moon, Menu } from 'lucide-react';
>>>>>>> main

export default function Navbar({ showAuth = true, minimal = false }) {
  const navigate = useNavigate();
<<<<<<< HEAD
  const isLoggedIn = authService.isSessionValid();

  return (
    <header className="navbar">
      <div className="navbar__brand">
        <Link to="/" className="logo-box">
          <img src={logo} alt="SwanCore logo" className="logo-img" />
          <span className="logo-text">SwanCore</span>
        </Link>
      </div>

      <nav className="navbar__links" aria-label="Primary navigation">
        <NavLink to="/markets" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
          Markets
        </NavLink>
        <NavLink to="/discover" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
          Discover
        </NavLink>
        <NavLink to="/news" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
          News
        </NavLink>
        <NavLink to="/about" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
          About
        </NavLink>
        <NavLink to="/trade" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
          Trade
        </NavLink>
      </nav>

      <div className="navbar__actions">
        <ThemeToggle />
        {!isLoggedIn ? (
          <>
            <button className="nav-btn" onClick={() => navigate("/login")}>Login</button>
            <button className="nav-btn nav-btn--primary" onClick={() => navigate("/register")}>Register</button>
          </>
        ) : null}
      </div>
=======
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
>>>>>>> main
    </header>
  );
}
