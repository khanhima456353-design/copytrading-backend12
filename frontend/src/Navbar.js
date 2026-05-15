import { NavLink, useNavigate, useLocation } from "react-router-dom";
import "./navbar.css";
import logo from "./assets/logo.jpg";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  // Hide navbar on login, registration, home, market, news, trade, and the post-signup trading redirect
  if (
    location.pathname === "/" ||
    location.pathname === "/register" ||
    location.pathname === "/login" ||
    location.pathname === "/home" ||
    location.pathname === "/markets" ||
    location.pathname === "/news" ||
    location.pathname === "/trade"
  ) {
    return null;
  }

  return (
    <div className="navbar">

      {/* LEFT */}
      <div className="nav-left">
        <div className="logo-box">
  <img src={logo} alt="logo" className="logo-img" />
  <span className="logo-text">SwanCore</span>
</div>

        <div className="nav-links">
          <NavLink
            to="/markets"
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            Markets
          </NavLink>

          <NavLink
            to="/discover"
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            Discover
          </NavLink>

          <NavLink
            to="/news"
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            News
          </NavLink>

          {/* ✅ ADDED ABOUT (fix for your issue) */}
          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            About
          </NavLink>

          <NavLink
            to="/trade"  
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            Trade
          </NavLink>
        </div>
      </div>

      {/* RIGHT */}
      <div className="nav-right">

        {/* ❌ span does nothing → FIXED */}
        <span className="nav-btn" onClick={() => navigate("/login")}>
          Login
        </span>

        <span className="nav-btn primary" onClick={() => navigate("/register")}>
          Register
        </span>

      </div>

    </div>
  );
}