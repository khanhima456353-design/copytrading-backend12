import React from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import authService from "./services/authService";
import ThemeToggle from "./components/theme/ThemeToggle";
import "./navbar.css";
import logo from "./assets/logo.jpg";

export default function Navbar() {
  const navigate = useNavigate();
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
    </header>
  );
}
