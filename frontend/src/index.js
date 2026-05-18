import React from "react";
import ReactDOM from "react-dom/client";
import "./components/theme/theme.css";
import "./index.css";
import "./i18n";
import reportWebVitals from "./reportWebVitals";

import { BrowserRouter, useLocation } from "react-router-dom";
import { ThemeProvider } from "./components/theme/ThemeContext";

// Components
import App from "./App";
import Navbar from "./Navbar";
import "./styles/theme.css";

const root = ReactDOM.createRoot(document.getElementById("root"));

function AppLayout() {
  const location = useLocation();
  const showNavbar = location.pathname !== "/" && location.pathname !== "/register";

  return (
    <div className="app-layout">
      {showNavbar && <Navbar />}
      <App />
    </div>
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