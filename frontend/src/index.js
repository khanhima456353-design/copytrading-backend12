import React from "react";
import ReactDOM from "react-dom/client";
import "./components/theme/theme.css";
import "./index.css";
import "./i18n";
import reportWebVitals from "./reportWebVitals";

import { BrowserRouter, useLocation } from "react-router-dom";
import { ThemeProvider } from "./components/theme/ThemeContext";
import { MobileMenuProvider } from "./components/theme/MobileMenuContext";

// Components
import App from "./App";
import Navbar from "./Navbar";
import authService from "./services/authService";
import "./styles/theme.css";

const root = ReactDOM.createRoot(document.getElementById("root"));

function AppLayout() {
  const location = useLocation();
  const isTradingPage = location.pathname === "/trade";
  const isAuthenticated = authService.isSessionValid();
  const showNavbar =
    location.pathname !== "/" &&
    location.pathname !== "/register" &&
    location.pathname !== "/login" &&
    location.pathname !== "/news" &&
    !(isTradingPage && isAuthenticated);

  return (
    <MobileMenuProvider>
      <div className="app-layout">
        {showNavbar && <Navbar showAuth={true} minimal={location.pathname === "/login"} homepage={location.pathname === "/home"} />}
        <App />
      </div>
    </MobileMenuProvider>
  );
}

root.render(
  <React.StrictMode>
    <ThemeProvider>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        {/* GLOBAL LAYOUT */}
        <AppLayout />
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);

reportWebVitals();
