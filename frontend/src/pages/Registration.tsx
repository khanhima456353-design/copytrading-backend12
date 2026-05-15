import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaCheckCircle, FaEye, FaEyeSlash, FaSpinner } from "react-icons/fa";
import { getAPIBase } from "../api";
import i18n from "../i18n";
import logo from "../assets/logo.jpg";
import "../styles/Login.css";

interface LoginResponse {
  success: boolean;
  message: string;
  token?: string;
  sessionToken?: string;
  expiresIn?: number;
  user?: {
    id: string;
    userId: string;
    email: string;
  };
}

interface OtpResponse {
  success: boolean;
  message: string;
  otpId?: string;
}

const Registration: React.FC = () => {
  const navigate = useNavigate();

  // ============= STATE MANAGEMENT =============
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [strength, setStrength] = useState("");

  const [loading, setLoading] = useState(false);
  const [showLang, setShowLang] = useState(false);
  
  // Session management
  const [token, setToken] = useState("");
  const [otpId, setOtpId] = useState("");
  const [resendCountdown, setResendCountdown] = useState(0);
  const [otpAttempts, setOtpAttempts] = useState(0);
  const [showWelcome, setShowWelcome] = useState(false);

  // Modal state
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

  // ============= UTILITIES =============
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const checkPasswordStrength = (pwd: string): string => {
    const strongRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

    if (pwd.length < 8) return "Weak";
    if (strongRegex.test(pwd)) return "Strong";
    return "Medium";
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

  // ============= RESEND COUNTDOWN =============
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendCountdown > 0) {
      interval = setInterval(() => {
        setResendCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendCountdown]);

  // ============= STEP 1: EMAIL VERIFICATION =============
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Validation
    if (!email.trim()) {
      showModal("warning", "Email Required", "Please enter your email address");
      setLoading(false);
      return;
    }

    if (!isValidEmail(email)) {
      showModal("error", "Invalid Email", "Please enter a valid email address");
      setLoading(false);
      return;
    }

    try {
      const apiBaseUrl = await getAPIBase();
      const response = await axios.post<OtpResponse>(
        `${apiBaseUrl}/api/auth/send-otp`,
        {
          email: email.toLowerCase().trim(),
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const sendSuccess = response.data.success ?? true;
      if (sendSuccess) {
        setOtpId(response.data.otpId || email.toLowerCase().trim());
        setOtpAttempts(0);
        setResendCountdown(60);
        setStep(2);
        showModal(
          "success",
          "OTP Sent",
          `Verification code sent to ${email}. Check your inbox.`
        );
      }
    } catch (error: any) {
      const errorMsg =
        error?.response?.data?.message || "Failed to send OTP. Please try again.";
      showModal("error", "OTP Error", errorMsg);
      console.error("OTP Send Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // ============= STEP 2: OTP VERIFICATION =============
  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!otp.trim()) {
      showModal("warning", "OTP Required", "Please enter the verification code");
      setLoading(false);
      return;
    }

    if (otp.length !== 6 && otp.length !== 8) {
      showModal("warning", "Invalid OTP", "Verification code should be 6-8 digits");
      setLoading(false);
      return;
    }

    try {
      const apiBaseUrl = await getAPIBase();
      const response = await axios.post<LoginResponse>(
        `${apiBaseUrl}/api/auth/verify-otp`,
        {
          email: email.toLowerCase().trim(),
          otp: otp.trim(),
          otpId,
        }
      );

      const verified = response.data.success;
      if (verified) {
        setToken(response.data.token || response.data.sessionToken || "");
        setOtpAttempts(0);
        setStep(3);
        showModal("success", "OTP Verified", "Proceeding to password setup...");
      }
    } catch (error: any) {
      const errorMsg = error?.response?.data?.message || "Invalid OTP. Please try again.";
      setOtpAttempts((prev) => prev + 1);

      if (otpAttempts >= 4) {
        showModal(
          "error",
          "Too Many Attempts",
          "Maximum OTP attempts exceeded. Please resend OTP."
        );
        setStep(1);
      } else {
        showModal(
          "error",
          "Invalid OTP",
          `${errorMsg} (Attempt ${otpAttempts + 1}/5)`
        );
      }
      console.error("OTP Verify Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // ============= RESEND OTP =============
  const handleResendOTP = async () => {
    setLoading(true);

    try {
      const apiBaseUrl = await getAPIBase();
      const response = await axios.post<OtpResponse>(
        `${apiBaseUrl}/api/auth/resend-otp`,
        {
          email: email.toLowerCase().trim(),
          otpId,
        }
      );

      const resendSuccess = response.data.success ?? true;
      if (resendSuccess) {
        setOtpAttempts(0);
        setResendCountdown(60);
        setOtp("");
        setOtpId(response.data.otpId || otpId);
        showModal(
          "success",
          "OTP Resent",
          `New verification code sent to ${email}`
        );
      }
    } catch (error: any) {
      const errorMsg = error?.response?.data?.message || "Failed to resend OTP";
      showModal("error", "Resend Failed", errorMsg);
      console.error("Resend OTP Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // ============= STEP 3: PASSWORD SETUP =============
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Validation
    if (password.length < 8) {
      showModal(
        "warning",
        "Password Too Short",
        "Password must be at least 8 characters long"
      );
      setLoading(false);
      return;
    }

    if (!/[A-Z]/.test(password)) {
      showModal(
        "warning",
        "Missing Uppercase",
        "Password must contain at least 1 uppercase letter"
      );
      setLoading(false);
      return;
    }

    if (!/[a-z]/.test(password)) {
      showModal(
        "warning",
        "Missing Lowercase",
        "Password must contain at least 1 lowercase letter"
      );
      setLoading(false);
      return;
    }

    if (!/[0-9]/.test(password)) {
      showModal(
        "warning",
        "Missing Number",
        "Password must contain at least 1 number"
      );
      setLoading(false);
      return;
    }

    if (!/[!@#$%^&*]/.test(password)) {
      showModal(
        "warning",
        "Missing Special Character",
        "Password must contain at least 1 special character (!@#$%^&*)"
      );
      setLoading(false);
      return;
    }

    const weakPasswords = [
      "123456",
      "password",
      "qwerty",
      "111111",
      "abc123",
      "123123",
    ];
    if (weakPasswords.includes(password.toLowerCase())) {
      showModal("warning", "Weak Password", "Please choose a stronger password");
      setLoading(false);
      return;
    }

    try {
      const apiBaseUrl = await getAPIBase();
      const response = await axios.post<LoginResponse>(
        `${apiBaseUrl}/api/auth/set-password`,
        {
          email: email.toLowerCase().trim(),
          password,
          sessionToken: token,
        }
      );

      if (response.data.success) {
        // Store session and user info
        localStorage.setItem("token", response.data.token || response.data.sessionToken || "");
        localStorage.removeItem("sessionToken");
        localStorage.setItem("userEmail", email);
        localStorage.setItem("userId", response.data.user?.userId || "");
        if (response.data.expiresIn) {
          localStorage.setItem(
            "sessionExpiry",
            (Date.now() + response.data.expiresIn * 1000).toString()
          );
        }

        setShowWelcome(true);

        setTimeout(() => {
          navigate("/home");
        }, 3000);
      } else {
        showModal(
          "error",
          "Account Creation Failed",
          response.data.message || "Unable to complete registration. Please try again."
        );
      }
    } catch (error: any) {
      const errorMsg =
        error?.response?.data?.message || "Failed to create account";
      showModal("error", "Account Creation Error", errorMsg);
      console.error("Password Setup Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // ============= LANGUAGE MANAGEMENT =============
  const toggleLangMenu = () => setShowLang(!showLang);

  const changeLang = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang);
    setShowLang(false);
  };

  return (
    <>
      {showWelcome && (
        <div className="welcome-screen">
          <div className="welcome-content">
            <img src={logo} alt="SwanCore Logo" className="welcome-logo" />
            <h1>Welcome to SwanCore!</h1>
            <p>Your account has been created successfully.</p>
            <div className="user-id-display">
              <p><strong>Your User ID:</strong></p>
              <p className="user-id">{localStorage.getItem("userId") || "Generating..."}</p>
              <p className="user-id-note">Save this ID! You can use it to login along with your email.</p>
            </div>
            <p>Redirecting to home page...</p>
            <div className="welcome-spinner"></div>
          </div>
        </div>
      )}

      {!showWelcome && (
        <div className="login-page registration-page">
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
              <button className="modal-close" onClick={closeModal}>✕</button>
            </div>
            <p className="modal-message">{modal.message}</p>
            <div className="modal-actions">
              <button className="modal-btn" onClick={closeModal}>
                {modal.type === "success" ? "Continue" : "Dismiss"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============= LEFT PROMO ============= */}
      <div className="login-left">
        <div className="promo-box">
          <h1>Up to <span>500 USD</span></h1>
          <h2>Sign Up Rewards</h2>

          <img src="/promo.png" alt="promo" className="promo-img" />

          <div className="promo-text">
            <p>
              <FaCheckCircle className="check-icon" /> 316,616,661 Users Trust
              SwanCore
            </p>
            <p>
              <FaCheckCircle className="check-icon" /> No.1 Trading Volume &
              Customer Asset
            </p>
            <p>
              <FaCheckCircle className="check-icon" /> 1,000,000,000 USDC SAFU
              Fund
            </p>

            <p className="safu-wallet">
              <span className="safu-label">SAFU Wallet:</span>{" "}
              0x420ef1f25563593aF5FE3f9b9d3bC56a8bd47c8
            </p>
          </div>
        </div>
      </div>

      <div className="login-middle">
        <p>
          Already have an account?{" "}
          <span className="link" onClick={() => navigate("/login")}>Sign in here</span>
        </p>
      </div>

      {/* ============= RIGHT LOGIN ============= */}
      <div className="login-right">
        <div className="login-card">
          {/* BRAND */}
          <div className="brand">
            <img src={logo} alt="SwanCore" className="brand-logo" />
            <span className="brand-text">SwanCore</span>
          </div>

          <h2>Welcome to SwanCore</h2>

          {/* ============= STEP 1: EMAIL ============= */}
          {step === 1 && (
            <form onSubmit={handleEmailSubmit} className="login-form">
              {loading && (
                <div className="verification-overlay">
                  <div className="verification-message">
                    <FaSpinner className="spinner" /> Please wait while we send your verification code...
                  </div>
                </div>
              )}
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>

              {/* TERMS AGREEMENT */}
              <div className="agreement">
                <div className="checkbox-row">
                  <input type="checkbox" required defaultChecked />
                </div>
                <span className="agreement-text">
                  By creating an account, I agree to SwanCore's{" "}
                  <span className="link" onClick={() => navigate("/privacy")}>
                    Privacy Notice
                  </span>{" "}
                  and{" "}
                  <span className="link" onClick={() => navigate("/terms")}>
                    Terms of Service
                  </span>
                </span>
              </div>

              <button
                type="submit"
                className="login-btn"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <FaSpinner className="spinner" /> Verifying...
                  </>
                ) : (
                  "Continue"
                )}
              </button>

              <div className="divider">
                <span>or</span>
              </div>

              <button type="button" className="social-btn" disabled={loading}>
                <img
                  src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg"
                  alt="Google"
                />
                Continue with Google
              </button>

              <button type="button" className="social-btn" disabled={loading}>
                <img
                  src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apple/apple-original.svg"
                  alt="Apple"
                  className="apple-icon"
                />
                Continue with Apple
              </button>

              <div className="bottom-auth">
                <span onClick={() => navigate("/register")}>Sign Up</span>
                <span className="or">or</span>
                <span onClick={() => navigate("/login")}>Log in</span>
              </div>
            </form>
          )}

          {/* ============= STEP 2: OTP ============= */}
          {step === 2 && (
            <form onSubmit={handleOTPSubmit} className="login-form">
              {loading && (
                <div className="verification-overlay">
                  <div className="verification-message">
                    <FaSpinner className="spinner" /> Please wait while we verify your code...
                  </div>
                </div>
              )}
              <div className="step-info">
                <p>
                  Verification code sent to <strong>{email}</strong>
                </p>
              </div>

              <div className="form-group">
                <label htmlFor="otp">Verification Code</label>
                <input
                  id="otp"
                  type="text"
                  placeholder="000000"
                  value={otp}
                  onChange={(e) =>
                    setOtp(e.target.value.replace(/\D/g, "").slice(0, 8))
                  }
                  disabled={loading}
                  maxLength={8}
                  required
                  className="otp-input"
                />
                <small className="otp-hint">
                  Enter the 6-8 digit code from your email
                </small>
              </div>

              <button
                type="submit"
                className="login-btn"
                disabled={loading || otp.length < 6}
              >
                {loading ? (
                  <>
                    <FaSpinner className="spinner" /> Verifying...
                  </>
                ) : (
                  "Verify Code"
                )}
              </button>

              <button
                type="button"
                className="resend-btn"
                onClick={handleResendOTP}
                disabled={resendCountdown > 0 || loading}
              >
                {resendCountdown > 0
                  ? `Resend in ${resendCountdown}s`
                  : "Resend Code"}
              </button>

              <button
                type="button"
                className="back-btn"
                onClick={() => setStep(1)}
                disabled={loading}
              >
                ← Change Email
              </button>
            </form>
          )}

          {/* ============= STEP 3: PASSWORD ============= */}
          {step === 3 && (
            <form onSubmit={handlePasswordSubmit} className="login-form">
              <div className="step-info">
                <p>Create your secure password</p>
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="password-input-wrapper">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => {
                      const val = e.target.value;
                      setPassword(val);
                      setStrength(checkPasswordStrength(val));
                    }}
                    disabled={loading}
                    required
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              {/* PASSWORD STRENGTH INDICATOR */}
              {password && (
                <div className={`strength-indicator ${strength.toLowerCase()}`}>
                  <div className="strength-bar">
                    <div
                      className="strength-fill"
                      style={{
                        width:
                          strength === "Weak"
                            ? "33%"
                            : strength === "Medium"
                            ? "66%"
                            : "100%",
                      }}
                    />
                  </div>
                  <span className="strength-text">
                    Strength: <strong>{strength}</strong>
                  </span>
                </div>
              )}

              {/* PASSWORD REQUIREMENTS */}
              <div className="password-requirements">
                <p className="req-title">Password must contain:</p>
                <ul>
                  <li
                    className={password.length >= 8 ? "met" : ""}
                  >
                    {password.length >= 8 ? "✓" : "○"} At least 8 characters
                  </li>
                  <li
                    className={/[A-Z]/.test(password) ? "met" : ""}
                  >
                    {/[A-Z]/.test(password) ? "✓" : "○"} Uppercase letter (A-Z)
                  </li>
                  <li
                    className={/[a-z]/.test(password) ? "met" : ""}
                  >
                    {/[a-z]/.test(password) ? "✓" : "○"} Lowercase letter (a-z)
                  </li>
                  <li
                    className={/[0-9]/.test(password) ? "met" : ""}
                  >
                    {/[0-9]/.test(password) ? "✓" : "○"} Number (0-9)
                  </li>
                  <li
                    className={/[!@#$%^&*]/.test(password) ? "met" : ""}
                  >
                    {/[!@#$%^&*]/.test(password) ? "✓" : "○"} Special character
                    (!@#$%^&*)
                  </li>
                </ul>
              </div>

              <button
                type="submit"
                className="login-btn"
                disabled={loading || strength !== "Strong"}
              >
                {loading ? (
                  <>
                    <FaSpinner className="spinner" /> Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </button>

              <button
                type="button"
                className="back-btn"
                onClick={() => setStep(2)}
                disabled={loading}
              >
                ← Back to Verification
              </button>
            </form>
          )}
        </div>
      </div>
      {/* ============= FOOTER ============= */}
      <div className="footer-bar">
        <div className="footer-left" onClick={toggleLangMenu}>
          🌐 {languages[currentLang]}
        </div>

        <div className="footer-links">
          <span onClick={() => navigate("/cookies")}>Cookies</span>
          <span onClick={() => navigate("/terms")}>Terms</span>
          <span onClick={() => navigate("/privacy")}>Privacy</span>
        </div>
      </div>

      {/* ============= LANGUAGE PANEL ============= */}
      {showLang && (
        <>
          <div className="lang-overlay" onClick={toggleLangMenu} />
          <div className="lang-panel open">
            <div className="lang-header">
              <span>Select Language</span>
              <button onClick={toggleLangMenu}>✕</button>
            </div>

            <div className="lang-list">
              {Object.entries(languages).map(([code, name]) => (
                <div
                  key={code}
                  className={`lang-item ${code === currentLang ? "active" : ""}`}
                  onClick={() => changeLang(code)}
                >
                  {name}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
    )}
  </>
  );
};

export default Registration;
