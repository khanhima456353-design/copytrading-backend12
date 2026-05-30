import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FaEye, FaEyeSlash, FaSpinner, FaGoogle } from "react-icons/fa";
import i18n from "../i18n";
import logo from "../assets/logo.jpg";
import authService from "../services/authService";
import "../styles/Login.css";

import { SiTether, SiRipple } from "react-icons/si";
import '../landing.css';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const [modal, setModal] = useState<{
    type: "success" | "error" | "warning" | null;
    title: string;
    message: string;
  }>({
    type: null,
    title: "",
    message: "",
  });

  const languages = {
    en: "English",
    hi: "हिंदी",
    ja: "日本語",
    zh: "中文",
    es: "Español",
    fr: "Français",
    de: "Deutsch",
    ru: "Русский",
    ar: "العربية",
    pt: "Português",
    tr: "Türkçe",
    ko: "한국어",
    it: "Italiano",
    nl: "Nederlands",
    pl: "Polski",
    uk: "Українська",
  };

  const currentLang = (localStorage.getItem("lang") || "en") as keyof typeof languages;

  const isValidIdentifier = (identifier: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(identifier.trim());
  };

  const showModal = (
    type: "success" | "error" | "warning",
    title: string,
    message: string
  ) => {
    setModal({ type, title, message });
    if (type === "success") {
      setTimeout(() => setModal({ type: null, title: "", message: "" }), 3000);
    }
  };

  const closeModal = () => {
    setModal({ type: null, title: "", message: "" });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!identifier.trim()) {
      showModal("warning", "Email Required", "Please enter your registered email address.");
      setLoading(false);
      return;
    }

    if (!isValidIdentifier(identifier)) {
      showModal("error", "Invalid Email", "Please enter a valid email address.");
      setLoading(false);
      return;
    }

    if (!password.trim()) {
      showModal("warning", "Password Required", "Please enter your password");
      setLoading(false);
      return;
    }

    try {
      await authService.loginWithPassword(
        identifier.toLowerCase().trim(),
        password.trim()
      );
      showModal("success", "Login Successful", "Welcome back! Redirecting...");
      setTimeout(() => navigate("/home"), 500);
    } catch (error: any) {
      const errorMsg =
        error?.response?.data?.message || "Login failed. Please try again.";
      showModal("error", "Login Error", errorMsg);
      console.error("Login Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleLang = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang);
  };

  return (

  <>

    

    <div className="login-page">
      {/* ============= MODAL ============= */}
      {modal.type && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className={`modal-header ${modal.type}`}>
              <div className="modal-icon">
                {modal.type === "success" && "✅"}
                {modal.type === "error" && "❌"}
                {modal.type === "warning" && "⚠️"}
              </div>
              <h3>{modal.title}</h3>
            </div>
            <p>{modal.message}</p>
            <button className="modal-close" onClick={closeModal}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* ============= LEFT PANEL (Crypto Visual) ============= */}
      <div className="login-left">
        <div className="crypto-bg" />
        <div className="coin-scene">
          <div className="coin coin-btc">
            <span className="coin-symbol">₿</span>
          </div>
          <div className="coin coin-eth">
            <span className="coin-symbol">Ξ</span>
          </div>

          <div className="coin coin-small coin-s1"><SiRipple className="coin-symbol" /></div>
<div className="coin coin-small coin-s2"><SiTether className="coin-symbol" /></div>
        </div>
      </div>

      {/* ============= RIGHT PANEL (Form) ============= */}
      <div className="login-right">
        {/* Language + Theme selectors */}
        <div className="top-controls">
          <select
            value={currentLang}
            onChange={(e) => toggleLang(e.target.value)}
            className="lang-select"
          >
            {Object.entries(languages).map(([code, name]) => (
              <option key={code} value={code}>
                {name}
              </option>
            ))}
          </select>
        </div>

        <div className="login-card">
          {/* Logo */}
          <div className="login-logo-wrap">
            <img src={logo} alt="SwanCore Logo" className="login-logo" />
          </div>

          <h1 className="login-title">Welcome Back!</h1>

          <form onSubmit={handleLogin} className="login-form" noValidate>
            {/* Email */}
            <div className="form-group">
              <label htmlFor="identifier">Email</label>
              <input
                type="email"
                id="identifier"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Enter your email"
                autoComplete="email"
              />
            </div>

            {/* Password */}
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="password-input">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Remember me + Forgot password */}
            <div className="form-row">
              <label className="remember-label">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="remember-checkbox"
                />
                <span className="checkmark" />
                Remember me
              </label>
              <button
                type="button"
                className="forgot-link"
                onClick={() => navigate("/forgot-password")}
              >
                Forgot password?
              </button>
            </div>

            {/* Submit */}
            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? (
                <>
                  <FaSpinner className="spinner" />
                  Signing In...
                </>
              ) : (
                "Log In"
              )}
            </button>

            {/* Divider */}
            <div className="divider">
              <span>Or</span>
            </div>

            {/* Google Sign In */}
            <button
              type="button"
              className="google-btn"
              onClick={() => {
                /* plug in Google OAuth here */
              }}
            >
              <FaGoogle className="google-icon" />
              Sign In with Google
            </button>
          </form>

          {/* Sign up link */}
          <p className="signup-text">
            Don't have an account?{" "}
            <a href="/register" className="signup-link">
              Sign up
            </a>
          </p>
        </div>

        {/* Footer */}
        <div className="login-footer">
          <span onClick={() => navigate("/help")}>Help</span>
          <span className="sep">/</span>
          <span onClick={() => navigate("/terms")}>Terms</span>
          <span className="sep">/</span>
          <span onClick={() => navigate("/privacy")}>Privacy</span>
        </div>
      </div>


    </div>
  </>
  );
};

export default Login;