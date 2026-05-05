import React, { useState, useRef } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import "../App.css";
import logo from "../assets/logo.jpg";
import i18n from "../i18n";
import { FaCheckCircle } from "react-icons/fa";
import { isValidEmailFormat } from "../utils/emailValidation";
import { sendOtp, verifyOtp, setPassword } from "../services/authService";
import { getAxios } from "../api";
import {Turnstile} from "@marsidev/react-turnstile";

export default function Login() {



  const navigate = useNavigate();
  const { t } = useTranslation();

  const [step, setStep] = useState(1);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPasswordValue] = useState("");

  const [showPassword, setShowPassword] = useState(false);
const [strength, setStrength] = useState("");

  const [captchaToken, setCaptchaToken] = useState("");
  const [showLang, setShowLang] = useState(false);

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

  const currentLang = localStorage.getItem("lang") || "en";

  const toggleLangMenu = () => setShowLang(!showLang);

  const changeLang = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang);
    setShowLang(false);
  };

  const turnstileRef = useRef(null);


  const checkPasswordStrength = (pwd) => {
  const strongRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

  if (pwd.length < 8) return "Weak";
  if (strongRegex.test(pwd)) return "Strong";
  return "Medium";
};

// ================= STEP 1 =================
const handleEmail = async () => {
  if (!email) {
    alert("Enter email");
    return;
  }
console.log("captchaToken state:", captchaToken);
  if (!captchaToken) {
    alert("Complete CAPTCHA");
    return;
  }

  try {
    await sendOtp({
      email,
      captchaToken,
    });

    setStep(2);
  } catch (err) {
    alert(err?.response?.data?.message || "OTP failed");
  }
};

// ================= RESEND OTP =================
const handleResend = async () => {
  if (!captchaToken) {
    alert("Complete CAPTCHA again");
    return;
  }

  try {
    await sendOtp({
      email,
      captchaToken,
    });

    // reset captcha for next use
    setCaptchaToken("");
    turnstileRef.current?.reset?.();
    setStep(2);

    alert("OTP resent");
  } catch (err) {
    alert(err?.response?.data?.message || "Resend failed");
  }
};

  // ================= STEP 2 =================
  const handleOTP = async () => {
    try {
      await verifyOtp(email, otp);
      setStep(3);
    } catch {
      alert("Invalid OTP");
    }
  };

  // ================= STEP 3 =================
const handlePassword = async () => {
  const weakPasswords = ["123456", "password", "qwerty", "111111"];

  // Password validation logic
  if (password.length < 8) {
    return alert("Password must be at least 8 characters");
  }

  if (weakPasswords.includes(password.toLowerCase())) {
    return alert("Choose a stronger password");
  }

  if (!/[A-Z]/.test(password)) {
    return alert("Add at least 1 uppercase letter");
  }

  if (!/[0-9]/.test(password)) {
    return alert("Add at least 1 number");
  }

  if (!/[!@#$%^&*]/.test(password)) {
    return alert("Add at least 1 special character");
  }

  try {
    // Set password
    await setPassword(email, password);
    alert("Account created");
    navigate("/markets");
  } catch {
    alert("Error setting password");
  }
};

  return (
    <div className="login-page">

      {/* LEFT PROMO */}
      <div className="login-left">
        <div className="promo-box">
          <h1>
            Up to <span>100 USD</span>
          </h1>
          <h2>Sign Up Rewards</h2>

          <img src="/promo.png" alt="promo" className="promo-img" />

          <div className="promo-text">
    

<p><FaCheckCircle className="check-icon" /> 316,616,661 Users Trust SwanCore</p>
<p><FaCheckCircle className="check-icon" /> No.1 Trading Volume & Customer Asset</p>
<p><FaCheckCircle className="check-icon" /> 1,000,000,000 USDC SAFU Fund</p>

         <p className="safu-wallet">
  <span className="safu-label">SAFU Wallet:</span>{" "}
  0x420ef1f25563593aF5FE3f9b9d3bC56a8bd47c8
</p>
          </div>
        </div>
      </div>

      {/* RIGHT LOGIN */}
      <div className="login-right">
        <div className="login-card">

           <div className="brand">
  <img src={logo} alt="SwanCore" className="brand-logo" />
  <span className="brand-text">SwanCore</span>
</div>

          <h2>Welcome to Swancore</h2>

          {/* STEP 1 */}
          {step === 1 && (
            <>
              <label>Email</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

             <Turnstile
  siteKey={process.env.REACT_APP_TURNSTILE_SITE_KEY}
  onSuccess={(token) => {
    console.log("TOKEN:", token); // 🔥 ADD THIS
    setCaptchaToken(token);
  }}
  onError={() => {
    console.log("Captcha error");
    setCaptchaToken("");
  }}
  onExpire={() => {
    console.log("Captcha expired");
    setCaptchaToken("");
  }}
/>

              <div className="agreement">
                <div className="checkbox-row">
                <input type="checkbox" defaultChecked />
                </div>
                <span className="agreement-text">
        By creating an account, I agree to SwanCore's{" "}
        <span className="link" onClick={() => navigate("/privacy")}>
          Privacy Notice
        </span>
      </span>
    </div>

              <button className="login-btn" onClick={handleEmail}>
      Continue
    </button>

    <div className="divider"><span>or</span></div>

    <button className="social-btn">
      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg" alt="g"/>
      Continue with Google
    </button>

    <button className="social-btn">
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
  </>
)}
          {/* STEP 2 */}
          {step === 2 && (
            <>
              <label>OTP</label>
              <input value={otp} onChange={(e) => setOtp(e.target.value)} />

              <button className="login-btn" onClick={handleOTP}>
                Verify OTP
              </button>

              <button onClick={handleResend} className="resend-btn">
  Resend OTP
</button>
            </>
          )}

          {/* STEP 3 */}
          {step === 3 && (
  <>
    <label>Password</label>

    <div className="password-box">
      <input
        type={showPassword ? "text" : "password"}
        value={password}
        onChange={(e) => {
          const val = e.target.value;
          setPasswordValue(val);
          setStrength(checkPasswordStrength(val));
        }}
      />

      <span
        className="toggle-eye"
        onClick={() => setShowPassword(!showPassword)}
      >
        {showPassword ? "🙈 Hide" : "👁 Show"}
      </span>
    </div>

    {/* Strength Indicator */}
    {password && (
      <div className={`strength ${strength.toLowerCase()}`}>
        Password Strength: {strength}
      </div>
    )}

    <button className="login-btn" onClick={handlePassword}>
      Finish
    </button>
  </>
)}
      </div>
      </div>


      {/* FOOTER */}
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

      {/* LANGUAGE */}
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
                <div key={code} onClick={() => changeLang(code)}>
                  {name}
                </div>
              ))}
            </div>
          </div>
        </>
      )}

    </div>
  );
}