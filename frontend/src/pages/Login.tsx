import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { FaEye, FaEyeSlash, FaSpinner } from "react-icons/fa";
import i18n from "../i18n";
import logo from "../assets/logo.jpg";
import "../styles/Login.css";

interface LoginResponse {
  success?: boolean;
  message?: string;
  token?: string;
  sessionToken?: string;
  accessToken?: string;
  refreshToken?: string;
  user?: any;
  expiresIn?: number;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const loginEndpoint = "/api/auth/login"; // frontend runs on localhost:3000 and proxies /api to backend

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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

    // Validation
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
      const response = await axios.post<LoginResponse>(
        loginEndpoint,
        {
          identifier: identifier.toLowerCase().trim(),
          email: identifier.toLowerCase().trim(),
          password: password.trim(),
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const authToken =
        response.data.accessToken || response.data.token || response.data.sessionToken || "";
      const refreshToken = response.data.refreshToken;

      if (!authToken) {
        throw new Error(response.data.message || "Login failed. Please try again.");
      }

      localStorage.setItem("token", authToken);
      if (refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
      }
      localStorage.setItem("userEmail", identifier.toLowerCase().trim());
      localStorage.setItem("userId", response.data.user?.userId || "");

      const expiryMs = response.data.expiresIn
        ? Number(response.data.expiresIn) * 1000
        : 7 * 24 * 60 * 60 * 1000;
      localStorage.setItem(
        "sessionExpiry",
        (Date.now() + expiryMs).toString()
      );

      showModal("success", "Login Successful", "Welcome back! Redirecting...");

      setTimeout(() => {
        navigate("/home"); // Changed from /markets to /home as requested
      }, 2000);
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

      {/* ============= LANGUAGE SELECTOR ============= */}
      <div className="lang-selector">
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

      {/* ============= MAIN FORM ============= */}
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <img src={logo} alt="SwanCore Logo" className="login-logo" />
            <h1>Welcome Back</h1>
            <p>Sign in to your SwanCore account</p>
          </div>

          <form onSubmit={handleLogin} className="login-form">
            {/* Identifier Field */}
            <div className="form-group">
              <label htmlFor="identifier">Email</label>
              <input
                type="email"
                id="identifier"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Enter your registered email address"
                required
              />
            </div>

            {/* Password Field */}
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="password-input">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? (
                <>
                  <FaSpinner className="spinner" />
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Links */}
          <div className="login-links">
            <p>
              Don't have an account?{" "}
              <a href="/register" className="link">
                Sign up here
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* ============= FOOTER ============= */}
      <div className="login-footer">
        <span onClick={() => navigate("/cookies")}>Cookies</span>
        <span>•</span>
        <span onClick={() => navigate("/privacy")}>Privacy</span>
      </div>
    </div>
  );
};

export default Login;
