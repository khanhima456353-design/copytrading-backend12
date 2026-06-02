import React from "react";
import { Routes, Route } from "react-router-dom";
import ScrollToTop from "./ScrollToTop";
import { BalanceProvider } from "./context/BalanceContext";

// Pages
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import Markets from "./Markets";
import Discover from "./Discover";
import Privacy from "./Privacy";
import Terms from "./Terms";
import Cookies from "./Cookies";
import Landing from "./Landing";
import News from "./News";
import About from "./About";
import LegalPage from "./LegalPage";
import Careers from "./pages/Careers";
import Imformation from "./Imformation";
import BuildingTrust from "./pages/BuildingTrust";
import Trading from './pages/Trading.tsx';
import Verification from './pages/Verification';
import ResponsiveHomepage from './pages/ResponsiveHomepage';
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminUserDetails from "./pages/AdminUserDetails";
import AdminDeposits from "./pages/AdminDeposits";
import AdminWithdrawals from "./pages/AdminWithdrawals";
import AdminBalances from "./pages/AdminBalances";
import AuthWrapper from "./AuthWrapper";
import ProtectedRoute from "./ProtectedRoute";

/* ─────────────────────────────────────
   DEFAULT THEME
──────────────────────────────────── */
if (!document.documentElement.getAttribute("data-theme")) {
  document.documentElement.setAttribute("data-theme", "dark");
}

export default function App() {
  return (
    <BalanceProvider>
      <ScrollToTop />

      <Routes>
        <Route path="/" element={<AuthWrapper />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/markets" element={<Markets />} />
        <Route path="/discover" element={<Discover />} />
        <Route path="/news" element={<News />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/cookies" element={<Cookies />} />
        <Route path="/about" element={<About />} />
        <Route path="/legal" element={<LegalPage />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/imformation" element={<Imformation />} />
        <Route path="/legal/privacy" element={<Privacy />} />
        <Route
          path="/trade"
          element={
            <ProtectedRoute>
              <Trading />
            </ProtectedRoute>
          }
        />
        <Route
          path="/verification"
          element={
            <ProtectedRoute>
              <Verification />
            </ProtectedRoute>
          }
        />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <ResponsiveHomepage />
            </ProtectedRoute>
          }
        />
        <Route path="/building-trust" element={<BuildingTrust />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/user/:id" element={<AdminUserDetails />} />
        <Route path="/admin/deposits" element={<AdminDeposits />} />
        <Route path="/admin/withdrawals" element={<AdminWithdrawals />} />
        <Route path="/admin/balances" element={<AdminBalances />} />
      </Routes>
    </BalanceProvider>
  );
}
