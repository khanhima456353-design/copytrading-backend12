import React, { useState, useEffect, CSSProperties } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaCheckCircle, FaEye, FaEyeSlash, FaSpinner } from "react-icons/fa";
import { Sun, Moon } from "lucide-react";
import { getAPIBase } from "../api";
import i18n from "../i18n";
import logo from "../assets/logo.jpg";
import { useTheme } from "../components/theme/ThemeContext";


/* ─────────────────────────────────────────────────────────────
   TYPES
───────────────────────────────────────────────────────────── */
interface LoginResponse {
  success: boolean;
  message: string;
  token?: string;
  sessionToken?: string;
  expiresIn?: number;
  user?: { id: string; userId: string; email: string };
}
interface OtpResponse {
  success: boolean;
  message: string;
  otpId?: string;
}

/* ─────────────────────────────────────────────────────────────
   INLINE STYLES  (no external CSS file needed)
───────────────────────────────────────────────────────────── */
const S = {
  /* page shell */
  page: {
    minHeight: "100vh",
    display: "flex",
    background: "var(--bg)",
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    color: "var(--text-primary)",
    overflow: "hidden",
    position: "relative",
  },

  /* ── LEFT PANEL ── */
  left: {
    position: "relative",
    flex: "0 0 48%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    overflow: "hidden",
    minHeight: "100vh",
  },
  leftBg: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(160deg, var(--bg) 0%, rgba(15, 23, 42, 0.8) 40%, var(--bg) 100%)",
    zIndex: 0,
  },
  gridOverlay: {
    position: "absolute",
    inset: 0,
    backgroundImage:
      "linear-gradient(rgba(255,140,50,.07) 1px,transparent 1px),linear-gradient(90deg,rgba(255,140,50,.07) 1px,transparent 1px)",
    backgroundSize: "48px 48px",
    zIndex: 1,
  },
  orb1: {
    position: "absolute",
    width: 420,
    height: 420,
    borderRadius: "50%",
    background:
      "radial-gradient(circle,rgba(255,120,30,.25) 0%,transparent 70%)",
    top: "5%",
    left: "-80px",
    zIndex: 2,
    filter: "blur(2px)",
  },
  orb2: {
    position: "absolute",
    width: 260,
    height: 260,
    borderRadius: "50%",
    background:
      "radial-gradient(circle,rgba(60,130,255,.2) 0%,transparent 70%)",
    bottom: "20%",
    right: "-40px",
    zIndex: 2,
    filter: "blur(2px)",
  },
  leftContent: {
    position: "relative",
    zIndex: 10,
    padding: "48px 44px",
  },
  leftTag: {
    display: "inline-block",
    background: "rgba(255,140,50,.15)",
    border: "1px solid rgba(255,140,50,.3)",
    borderRadius: 20,
    padding: "4px 14px",
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: "0.12em",
    color: "#ff8c32",
    textTransform: "uppercase" as const,
    marginBottom: 20,
  },
  leftHeading: {
    fontSize: "clamp(28px,3.5vw,46px)",
    fontWeight: 800,
    lineHeight: 1.1,
    marginBottom: 10,
    color: "var(--text-primary)",
    letterSpacing: "-0.02em",
  },
  leftSub: {
    fontSize: 14,
    color: "var(--text-secondary)",
    marginBottom: 36,
    lineHeight: 1.6,
  },
  statsRow: {
    display: "flex",
    gap: 20,
    marginBottom: 32,
    flexWrap: "wrap" as const,
  },
  statBox: {
    flex: 1,
    minWidth: 110,
    background: "var(--surface-strong)",
    border: "1px solid var(--border)",
    borderRadius: 14,
    padding: "16px 18px",
    backdropFilter: "blur(8px)",
  },
  statNum: {
    fontSize: 22,
    fontWeight: 800,
    color: "#ff8c32",
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    color: "var(--text-secondary)",
    letterSpacing: "0.04em",
  },
  safu: {
    background: "var(--surface-strong)",
    border: "1px solid var(--border)",
    borderRadius: 12,
    padding: "12px 16px",
    fontSize: 11,
    color: "var(--text-secondary)",
    wordBreak: "break-all" as const,
    lineHeight: 1.7,
  },
  safuLabel: { color: "var(--accent)", fontWeight: 600, marginRight: 6 },

  /* trader card */
  traderCard: {
    position: "absolute",
    top: 28,
    left: 36,
    zIndex: 10,
    display: "flex",
    alignItems: "center",
    gap: 12,
    background: "var(--surface-strong)",
    border: "1px solid var(--border)",
    borderRadius: 50,
    padding: "8px 18px 8px 8px",
    backdropFilter: "blur(12px)",
  },
  profBtn: {
    background: "linear-gradient(135deg,#ff8c32,#e84c4c)",
    color: "var(--text-primary)",
    border: "none",
    borderRadius: 10,
    padding: "10px 14px",
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 8px 20px rgba(232,76,76,0.12)",
  },
  traderAvatar: {
    width: 36,
    height: 36,
    borderRadius: "50%",
    background: "linear-gradient(135deg,#ff8c32,#e84c4c)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 14,
    fontWeight: 700,
    color: "#fff",
  },
  traderName: { fontSize: 13, fontWeight: 600, color: "var(--text-primary)" },
  traderRole: { fontSize: 11, color: "var(--text-secondary)" },

  /* live badge */
  liveBadge: {
    position: "absolute",
    top: 28,
    right: 36,
    zIndex: 10,
    display: "flex",
    alignItems: "center",
    gap: 6,
    background: "var(--surface-strong)",
    border: "1px solid var(--border)",
    borderRadius: 50,
    padding: "6px 14px",
    fontSize: 12,
    color: "var(--text-primary)",
    backdropFilter: "blur(8px)",
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: "50%",
    background: "#22c55e",
    boxShadow: "0 0 6px #22c55e",
    animation: "pulse 1.5s infinite",
  },

  /* ── RIGHT PANEL ── */
  right: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 24px",
    position: "relative",
    overflowY: "auto" as const,
    minHeight: "100vh",
  },
  rightBg: {
    position: "absolute",
    inset: 0,
    background: "var(--surface)",
    zIndex: 0,
  },
  card: {
    position: "relative",
    zIndex: 1,
    width: "100%",
    maxWidth: 420,
  },

  /* brand */
  brand: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 32,
  },
  brandLogo: {
    width: 36,
    height: 36,
    borderRadius: 10,
    objectFit: "cover" as const,
  },
  brandText: {
    fontSize: 20,
    fontWeight: 800,
    color: "var(--text-primary)",
    letterSpacing: "-0.02em",
  },

  /* heading */
  heading: {
    fontSize: "clamp(28px,4vw,40px)",
    fontWeight: 800,
    color: "var(--text-primary)",
    letterSpacing: "-0.03em",
    marginBottom: 6,
    lineHeight: 1.1,
  },
  subHeading: {
    fontSize: 13,
    color: "var(--text-secondary)",
    marginBottom: 28,
  },

  /* step pills */
  stepRow: {
    display: "flex",
    gap: 8,
    marginBottom: 28,
  },
  stepPill: (active: boolean): React.CSSProperties => ({
    flex: 1,
    textAlign: "center",
    fontSize: 11,
    fontWeight: 600,
    padding: "6px 4px",
    borderRadius: 8,
    border: `1px solid ${active ? "rgba(255,140,50,.5)" : "var(--border)"}`,
    background: active ? "rgba(255,140,50,.12)" : "transparent",
    color: active ? "#ff8c32" : "var(--text-secondary)",
    letterSpacing: "0.04em",
    transition: "all .3s",
    whiteSpace: "nowrap" as const,
  }),

  /* form */
  formGroup: { marginBottom: 16 },
  label: {
    display: "block",
    fontSize: 12,
    fontWeight: 600,
    color: "var(--text-secondary)",
    marginBottom: 7,
    letterSpacing: "0.06em",
    textTransform: "uppercase" as const,
  },
  input: {
    width: "100%",
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: 12,
    padding: "14px 16px",
    fontSize: 14,
    color: "var(--text-primary)",
    outline: "none",
    transition: "border-color .2s",
    boxSizing: "border-box" as const,
  },
  passwordWrap: { position: "relative" as const },
  eyeBtn: {
    position: "absolute",
    right: 14,
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    color: "var(--text-secondary)",
    cursor: "pointer",
    padding: 0,
    fontSize: 15,
  },

  /* primary button */
  btn: (disabled: boolean): React.CSSProperties => ({
    width: "100%",
    background: disabled
      ? "rgba(255,140,50,.3)"
      : "linear-gradient(135deg,#ff8c32,#e84c4c)",
    border: "none",
    borderRadius: 12,
    padding: "15px",
    fontSize: 15,
    fontWeight: 700,
    color: "#fff",
    cursor: disabled ? "not-allowed" : "pointer",
    letterSpacing: "0.02em",
    transition: "opacity .2s, transform .1s",
    marginTop: 4,
    opacity: disabled ? 0.6 : 1,
  }),

  /* secondary buttons */
  secondaryBtn: {
    width: "100%",
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: 12,
    padding: "13px",
    fontSize: 14,
    fontWeight: 600,
    color: "var(--text-primary)",
    cursor: "pointer",
    marginTop: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  ghostBtn: {
    width: "100%",
    background: "none",
    border: "none",
    padding: "10px",
    fontSize: 13,
    color: "var(--text-secondary)",
    cursor: "pointer",
    marginTop: 4,
    letterSpacing: "0.02em",
  },

  /* divider */
  divider: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    margin: "18px 0",
    color: "var(--text-secondary)",
    fontSize: 12,
  },
  divLine: {
    flex: 1,
    height: 1,
    background: "var(--border)",
  },

  /* agreement */
  agreement: {
    display: "flex",
    alignItems: "flex-start",
    gap: 10,
    marginBottom: 16,
    fontSize: 12,
    color: "var(--text-secondary)",
    lineHeight: 1.6,
  },
  link: {
    color: "#ff8c32",
    cursor: "pointer",
    textDecoration: "underline",
    textDecorationColor: "rgba(255,140,50,.3)",
  },

  /* OTP input */
  otpInput: {
    width: "100%",
    background: "var(--surface-strong)",
    border: "1px solid var(--border)",
    borderRadius: 12,
    padding: "18px 16px",
    fontSize: 24,
    fontWeight: 700,
    color: "var(--text-primary)",
    letterSpacing: "0.3em",
    textAlign: "center" as const,
    outline: "none",
    boxSizing: "border-box" as const,
  },
  otpHint: {
    display: "block",
    marginTop: 6,
    fontSize: 11,
    color: "var(--text-secondary)",
    textAlign: "center" as const,
  },

  /* strength bar */
  strengthWrap: { marginBottom: 12 },
  strengthTrack: {
    height: 4,
    background: "var(--border)",
    borderRadius: 4,
    marginBottom: 6,
    overflow: "hidden",
  },
  strengthFill: (pct: string, color: string): React.CSSProperties => ({
    height: "100%",
    width: pct,
    background: color,
    borderRadius: 4,
    transition: "width .4s, background .4s",
  }),
  strengthText: { fontSize: 11, color: "var(--text-secondary)" },

  /* requirements list */
  reqList: {
    listStyle: "none",
    padding: 0,
    margin: "0 0 16px",
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "4px 12px",
    fontSize: 11,
    color: "var(--text-secondary)",
  },
  reqMet: { color: "#22c55e" },

  /* step info */
  stepInfo: {
    background: "var(--surface-strong)",
    border: "1px solid rgba(255,140,50,.15)",
    borderRadius: 10,
    padding: "10px 14px",
    fontSize: 12,
    color: "var(--text-secondary)",
    marginBottom: 20,
    lineHeight: 1.5,
  },
  stepInfoAccent: { color: "#ff8c32", fontWeight: 600 },

  /* bottom nav */
  bottomNav: {
    display: "flex",
    justifyContent: "center",
    gap: 12,
    marginTop: 20,
    fontSize: 13,
    color: "var(--text-secondary)",
  },

  /* footer */
  footer: {
    position: "fixed",
    bottom: 0,
    right: 0,
    width: "52%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 36px",
    borderTop: "1px solid var(--border)",
    background: "var(--surface)",
    backdropFilter: "blur(8px)",
    zIndex: 50,
    fontSize: 12,
    color: "var(--text-secondary)",
    boxSizing: "border-box" as const,
  },
  footerLinks: { display: "flex", gap: 20 },

  /* lang panel */
  langOverlay: {
    position: "fixed",
    inset: 0,
    zIndex: 100,
  },
  langPanel: {
    position: "fixed",
    bottom: 44,
    right: 36,
    zIndex: 101,
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: 16,
    padding: "16px",
    width: 260,
    boxShadow: "0 20px 60px rgba(0,0,0,.5)",
  },
  langHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    fontSize: 14,
    fontWeight: 600,
    color: "var(--text-primary)",
  },
  langGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 6,
    maxHeight: 260,
    overflowY: "auto" as const,
  },
  langItem: (active: boolean): React.CSSProperties => ({
    padding: "8px 10px",
    borderRadius: 8,
    fontSize: 12,
    cursor: "pointer",
    background: active ? "rgba(255,140,50,.15)" : "transparent",
    color: active ? "#ff8c32" : "var(--text-secondary)",
    border: `1px solid ${active ? "rgba(255,140,50,.3)" : "transparent"}`,
    transition: "all .15s",
  }),

  /* modal */
  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,.7)",
    backdropFilter: "blur(4px)",
    zIndex: 200,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  modalBox: {
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: 20,
    padding: "28px",
    width: "100%",
    maxWidth: 380,
    boxShadow: "0 24px 80px rgba(0,0,0,.6)",
  },
  modalHeader: (type: string): React.CSSProperties => ({
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
    color:
      type === "success" ? "#22c55e" : type === "error" ? "#ef4444" : "#f59e0b",
  }),
  modalIcon: { fontSize: 22 },
  modalTitle: { flex: 1, fontSize: 15, fontWeight: 700, color: "var(--text-primary)" },
  modalClose: {
    background: "none",
    border: "none",
    color: "var(--text-secondary)",
    cursor: "pointer",
    fontSize: 14,
  },
  modalMsg: {
    fontSize: 13,
    color: "var(--text-secondary)",
    lineHeight: 1.6,
    marginBottom: 20,
  },
  modalBtn: (type: string): React.CSSProperties => ({
    width: "100%",
    padding: "12px",
    borderRadius: 10,
    border: "none",
    fontWeight: 600,
    fontSize: 13,
    cursor: "pointer",
    background:
      type === "success"
        ? "linear-gradient(135deg,#22c55e,#16a34a)"
        : type === "error"
        ? "linear-gradient(135deg,#ef4444,#dc2626)"
        : "linear-gradient(135deg,#f59e0b,#d97706)",
    color: "#fff",
  }),

  /* welcome screen */
  welcome: {
    position: "fixed",
    inset: 0,
    background: "var(--bg)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 300,
    flexDirection: "column" as const,
    textAlign: "center" as const,
    padding: 40,
  },
  welcomeLogo: {
    width: 80,
    height: 80,
    borderRadius: 20,
    marginBottom: 28,
    objectFit: "cover" as const,
  },
  welcomeH1: {
    fontSize: 36,
    fontWeight: 800,
    color: "var(--text-primary)",
    marginBottom: 8,
    letterSpacing: "-0.03em",
  },
  welcomeSub: {
    fontSize: 14,
    color: "var(--text-secondary)",
    marginBottom: 32,
  },
  welcomeIdBox: {
    background: "rgba(255,140,50,.08)",
    border: "1px solid rgba(255,140,50,.2)",
    borderRadius: 16,
    padding: "20px 28px",
    marginBottom: 24,
    maxWidth: 380,
    width: "100%",
  },
  welcomeIdLabel: {
    fontSize: 11,
    color: "var(--text-secondary)",
    marginBottom: 6,
    textTransform: "uppercase" as const,
    letterSpacing: "0.08em",
    fontWeight: 600,
  },
  welcomeId: {
    fontSize: 20,
    fontWeight: 800,
    color: "#ff8c32",
    letterSpacing: "0.04em",
  },
  welcomeNote: {
    fontSize: 11,
    color: "var(--text-secondary)",
    marginTop: 8,
  },
  welcomeSpinner: {
    width: 32,
    height: 32,
    border: "3px solid rgba(255,140,50,.2)",
    borderTop: "3px solid #ff8c32",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },

  /* loading overlay */
  loadingOverlay: {
    position: "absolute",
    inset: 0,
    background: "var(--surface-strong)",
    borderRadius: 16,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 20,
    backdropFilter: "blur(2px)",
    flexDirection: "column" as const,
    gap: 12,
    color: "var(--text-secondary)",
    fontSize: 13,
  },
} as const;
/* ─────────────────────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────────────────────── */
const Registration: React.FC = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [strength, setStrength] = useState("");
  const [loading, setLoading] = useState(false);
  const [showLang, setShowLang] = useState(false);
  const [token, setToken] = useState("");
  const [otpId, setOtpId] = useState("");
  const [resendCountdown, setResendCountdown] = useState(0);
  const [otpAttempts, setOtpAttempts] = useState(0);
  const [showWelcome, setShowWelcome] = useState(false);
  const [modal, setModal] = useState<{
    type: "success" | "error" | "warning" | null;
    title: string;
    message: string;
  }>({ type: null, title: "", message: "" });

  const languages: Record<string, string> = {
    en: "English", hi: "हिंदी", ja: "日本語", zh: "中文",
    es: "Español", fr: "Français", de: "Deutsch", ru: "Русский",
    ar: "العربية", pt: "Português", tr: "Türkçe", ko: "한국어",
    it: "Italiano", nl: "Nederlands", pl: "Polski", uk: "Українська",
  };
  const currentLang = (localStorage.getItem("lang") || "en") as string;

  // ── utilities ──
  const isValidEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  const checkStrength = (pwd: string): string => {
    if (pwd.length < 8) return "Weak";
    if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/.test(pwd))
      return "Strong";
    return "Medium";
  };
  const showModal = (type: "success" | "error" | "warning", title: string, message: string) => {
    setModal({ type, title, message });
    if (type === "success") setTimeout(() => setModal({ type: null, title: "", message: "" }), 3000);
  };
  const closeModal = () => setModal({ type: null, title: "", message: "" });

  // ── countdown ──
  useEffect(() => {
    if (resendCountdown <= 0) return;
    const t = setTimeout(() => setResendCountdown((p) => p - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCountdown]);

  // ── Step 1 ──
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) { showModal("warning", "Email Required", "Please enter your email address"); return; }
    if (!isValidEmail(email)) { showModal("error", "Invalid Email", "Please enter a valid email address"); return; }
    setLoading(true);
    try {
      const apiBaseUrl = await getAPIBase();
      const res = await axios.post<OtpResponse>(`${apiBaseUrl}/api/auth/send-otp`, {
        email: email.toLowerCase().trim(),
      });
      if (res.data.success ?? true) {
        setOtpId(res.data.otpId || email.toLowerCase().trim());
        setOtpAttempts(0);
        setResendCountdown(60);
        setStep(2);
        showModal("success", "OTP Sent", `Verification code sent to ${email}. Check your inbox.`);
      }
    } catch (err: any) {
      showModal("error", "OTP Error", err?.response?.data?.message || "Failed to send OTP. Please try again.");
    } finally { setLoading(false); }
  };

  // ── Step 2 ──
  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.trim()) { showModal("warning", "OTP Required", "Please enter the verification code"); return; }
    if (otp.length < 6) { showModal("warning", "Invalid OTP", "Verification code should be 6–8 digits"); return; }
    setLoading(true);
    try {
      const apiBaseUrl = await getAPIBase();
      const res = await axios.post<LoginResponse>(`${apiBaseUrl}/api/auth/verify-otp`, {
        email: email.toLowerCase().trim(), otp: otp.trim(), otpId,
      });
      if (res.data.success) {
        setToken(res.data.token || res.data.sessionToken || "");
        setOtpAttempts(0);
        setStep(3);
        showModal("success", "OTP Verified", "Proceeding to password setup...");
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Invalid OTP. Please try again.";
      setOtpAttempts((p) => p + 1);
      if (otpAttempts >= 4) {
        showModal("error", "Too Many Attempts", "Maximum OTP attempts exceeded. Please resend OTP.");
        setStep(1);
      } else {
        showModal("error", "Invalid OTP", `${msg} (Attempt ${otpAttempts + 1}/5)`);
      }
    } finally { setLoading(false); }
  };

  // ── Resend ──
  const handleResendOTP = async () => {
    setLoading(true);
    try {
      const apiBaseUrl = await getAPIBase();
      const res = await axios.post<OtpResponse>(`${apiBaseUrl}/api/auth/resend-otp`, {
        email: email.toLowerCase().trim(), otpId,
      });
      if (res.data.success ?? true) {
        setOtpAttempts(0);
        setResendCountdown(60);
        setOtp("");
        setOtpId(res.data.otpId || otpId);
        showModal("success", "OTP Resent", `New verification code sent to ${email}`);
      }
    } catch (err: any) {
      showModal("error", "Resend Failed", err?.response?.data?.message || "Failed to resend OTP");
    } finally { setLoading(false); }
  };

  // ── Step 3 ──
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const checks = [
      [password.length < 8, "Password Too Short", "Password must be at least 8 characters long"],
      [!/[A-Z]/.test(password), "Missing Uppercase", "Password must contain at least 1 uppercase letter"],
      [!/[a-z]/.test(password), "Missing Lowercase", "Password must contain at least 1 lowercase letter"],
      [!/[0-9]/.test(password), "Missing Number", "Password must contain at least 1 number"],
      [!/[!@#$%^&*]/.test(password), "Missing Special Character", "Password must contain at least 1 special character (!@#$%^&*)"],
    ] as [boolean, string, string][];
    for (const [fail, title, msg] of checks) {
      if (fail) { showModal("warning", title, msg); return; }
    }
    setLoading(true);
    try {
      const apiBaseUrl = await getAPIBase();
      const res = await axios.post<LoginResponse>(`${apiBaseUrl}/api/auth/set-password`, {
        email: email.toLowerCase().trim(), password, sessionToken: token,
      });
      if (res.data.success) {
        localStorage.setItem("token", res.data.token || res.data.sessionToken || "");
        localStorage.setItem("userEmail", email);
        localStorage.setItem("userId", res.data.user?.userId || "");
        if (res.data.expiresIn)
          localStorage.setItem("sessionExpiry", (Date.now() + res.data.expiresIn * 1000).toString());
        setShowWelcome(true);
        setTimeout(() => navigate("/home"), 3000);
      } else {
        showModal("error", "Account Creation Failed", res.data.message || "Unable to complete registration.");
      }
    } catch (err: any) {
      showModal("error", "Account Creation Error", err?.response?.data?.message || "Failed to create account");
    } finally { setLoading(false); }
  };

  // ── language ──
  const changeLang = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang);
    setShowLang(false);
  };

  // ── strength meta ──
  const strengthColor = strength === "Strong" ? "#22c55e" : strength === "Medium" ? "#f59e0b" : "#ef4444";
  const strengthPct = strength === "Strong" ? "100%" : strength === "Medium" ? "60%" : "28%";

  const reqCheck = (ok: boolean, label: string) => (
    <li style={ok ? S.reqMet : { color: "var(--text-secondary)" }}>
      {ok ? "✓" : "○"} {label}
    </li>
  );

  return (
    <>
      {/* ─── global keyframes ─── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:.4; } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes float { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-10px); } }
        .reg-input:focus { border-color: rgba(255,140,50,.5) !important; background: rgba(255,140,50,.04) !important; }
        .reg-social:hover { background: var(--surface-strong) !important; border-color: var(--border) !important; }
        .reg-ghost:hover { color: var(--text-primary) !important; }
        .reg-btn-main:hover:not(:disabled) { opacity:.88; transform:translateY(-1px); }
        .reg-lang-item:hover { background: rgba(255,140,50,.1) !important; color: rgba(255,140,50,.8) !important; }
        .reg-footer-link:hover { color: var(--text-primary) !important; cursor:pointer; }
        .reg-link:hover { color: #ffaa5c !important; }

        /* ── RESPONSIVE ── */
        @media (max-width: 900px) {
          .reg-left { display: none !important; }
          .reg-right { min-height: 100vh; padding-bottom: 70px !important; }
          .reg-footer { width: 100% !important; left: 0 !important; right: 0 !important; }
        }
        @media (max-width: 480px) {
          .reg-card { padding: 0 4px !important; }
          .reg-req-grid { grid-template-columns: 1fr !important; }
        }
        @media (min-width: 901px) and (max-width: 1200px) {
          .reg-left { flex: 0 0 42% !important; }
        }
      `}</style>

      {/* ── WELCOME SCREEN ── */}
      {showWelcome && (
        <div style={S.welcome}>
          <div style={{ position: "fixed", top: 16, right: 20, zIndex: 400 }}>
            <button
              onClick={toggleTheme}
              style={{
                background: "var(--card-current)",
                border: "1px solid var(--border-current)",
                padding: 8,
                borderRadius: 10,
                cursor: "pointer",
                color: "var(--text-current)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "8px 14px", borderRadius: 10, background: "#ff8c32", border: "1px solid #ff8c32", marginBottom: 28 }}>
            <img src={logo} alt="SwanCore" style={{ width: 32, height: 32, borderRadius: 4, objectFit: "contain", background: "#0b0e11", padding: 2 }} />
            <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.1 }}>
                  <span style={{ color: "#ffffff", fontSize: 18, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", fontFamily: "'Inter', 'SF Pro Display', -apple-system, sans-serif" }}>SwanCore</span>
                  <span style={{ color: "#0a0a0a", fontSize: 10 }}>Simplified Trading</span>
                </div>
          </div>
          <div style={{ animation: "fadeUp .6s ease" }}>
            <h1 style={S.welcomeH1}>Welcome to SwanCore! 🎉</h1>
            <p style={S.welcomeSub}>Your account has been created successfully.</p>
            <div style={S.welcomeIdBox}>
              <p style={S.welcomeIdLabel}>Your User ID</p>
              <p style={S.welcomeId}>{localStorage.getItem("userId") || "Generating..."}</p>
              <p style={S.welcomeNote}>Save this ID — you can use it to log in along with your email.</p>
            </div>
            <p style={{ ...S.welcomeSub, marginBottom: 20 }}>Redirecting to home page…</p>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <div style={S.welcomeSpinner} />
            </div>
          </div>
        </div>
      )}

      {!showWelcome && (
        <div style={S.page}>

          <div style={{ position: "fixed", top: 16, right: 20, zIndex: 400, display: "flex", gap: 8 }}>
            <button
              onClick={toggleTheme}
              style={{
                background: "var(--card-current)",
                border: "1px solid var(--border-current)",
                padding: 8,
                borderRadius: 10,
                cursor: "pointer",
                color: "var(--text-current)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              style={S.profBtn}
              onClick={() => navigate("/")}
              aria-label="Back to Dashboard"
            >
              ← Back to Dashboard
            </button>
          </div>

          {/* ── MODAL ── */}
          {modal.type && (
            <div style={S.modalOverlay} onClick={closeModal}>
              <div style={S.modalBox} onClick={(e) => e.stopPropagation()}>
                <div style={S.modalHeader(modal.type)}>
                  <span style={S.modalIcon}>
                    {modal.type === "success" ? "✅" : modal.type === "error" ? "❌" : "⚠️"}
                  </span>
                  <span style={S.modalTitle}>{modal.title}</span>
                  <button style={S.modalClose} onClick={closeModal}>✕</button>
                </div>
                <p style={S.modalMsg}>{modal.message}</p>
                <button style={S.modalBtn(modal.type)} onClick={closeModal}>
                  {modal.type === "success" ? "Continue" : "Dismiss"}
                </button>
              </div>
            </div>
          )}

          {/* ── LEFT PANEL ── */}
          <div style={S.left} className="reg-left">
            <div style={S.leftBg} />
            <div style={S.gridOverlay} />
            <div style={S.orb1} />
            <div style={S.orb2} />

            {/* trader badge */}
            <div style={S.traderCard}>
              <div style={S.traderAvatar}>AL</div>
              <div>
                <div style={S.traderName}>Alex Ledger</div>
                <div style={S.traderRole}>Pro Trader &amp; Analyst</div>
              </div>
            </div>

            {/* live badge */}
            <div style={S.liveBadge}>
              <div style={S.liveDot} />
              Live Markets
            </div>

            {/* decorative animated chart lines */}
            <svg
              style={{ position: "absolute", bottom: "30%", left: 0, right: 0, zIndex: 3, opacity: 0.15 }}
              viewBox="0 0 600 120"
              fill="none"
              preserveAspectRatio="none"
            >
              <polyline points="0,80 60,60 120,75 200,30 280,55 360,20 440,45 520,15 600,35"
                stroke="#ff8c32" strokeWidth="2" fill="none" />
              <polyline points="0,100 80,88 160,95 240,70 320,80 400,55 480,70 600,50"
                stroke="#3b82f6" strokeWidth="1.5" fill="none" />
            </svg>

            {/* bottom content */}
            <div style={S.leftContent}>
              <div style={S.leftTag}>Sign Up Rewards</div>
              <h1 style={S.leftHeading}>
                Up to <span style={{ color: "#ff8c32" }}>$500</span><br />
                Welcome Bonus
              </h1>
              <p style={S.leftSub}>
                Join millions of traders on the platform trusted for<br />
                performance, security, and exceptional support.
              </p>

              <div style={S.statsRow}>
                {[
                  ["316M+", "Users Worldwide"],
                  ["#1", "Trading Volume"],
                  ["1B USDC", "SAFU Fund"],
                ].map(([num, label]) => (
                  <div key={label} style={S.statBox}>
                    <div style={S.statNum}>{num}</div>
                    <div style={S.statLabel}>{label}</div>
                  </div>
                ))}
              </div>

              <div style={S.safu}>
                <span style={S.safuLabel}>SAFU Wallet:</span>
                0x420ef1f25563593aF5FE3f9b9d3bC56a8bd47c8
              </div>
            </div>
          </div>

          {/* ── RIGHT PANEL ── */}
          <div style={S.right} className="reg-right">
            <div style={S.rightBg} />

            <div style={{ ...S.card, animation: "fadeUp .5s ease" }} className="reg-card">
              {/* brand */}
              <div style={S.brand}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "8px 14px", borderRadius: 10, background: "#ff8c32", border: "1px solid #ff8c32" }}>
                  <img src={logo} alt="SwanCore" style={{ width: 32, height: 32, borderRadius: 4, objectFit: "contain", background: "#0b0e11", padding: 2 }} />
                  <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.1 }}>
                  <span style={{ color: "#ffffff", fontSize: 18, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", fontFamily: "'Inter', 'SF Pro Display', -apple-system, sans-serif" }}>SwanCore</span>
                  <span style={{ color: "#0a0a0a", fontSize: 10 }}>Simplified Trading</span>
                </div>
                </div>
              </div>

              <h2 style={S.heading}>Hi Trader 👋</h2>
              <p style={S.subHeading}>Create your SwanCore account</p>

              {/* step pills */}
              <div style={S.stepRow}>
                {(["1. Email", "2. Verify", "3. Password"] as const).map((label, i) => (
                  <div key={label} style={S.stepPill(step === i + 1)}>
                    {label}
                  </div>
                ))}
              </div>

              {/* ─── STEP 1: EMAIL ─── */}
              {step === 1 && (
                <div style={{ position: "relative" }}>
                  {loading && (
                    <div style={S.loadingOverlay}>
                      <FaSpinner style={{ animation: "spin 1s linear infinite", fontSize: 22, color: "#ff8c32" }} />
                      Sending verification code…
                    </div>
                  )}
                  <form onSubmit={handleEmailSubmit}>
                    <div style={S.formGroup}>
                      <label style={S.label}>Email Address</label>
                      <input
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={loading}
                        required
                        className="reg-input"
                        style={S.input}
                      />
                    </div>

                    <div style={S.agreement}>
                      <input type="checkbox" required defaultChecked style={{ marginTop: 2, accentColor: "#ff8c32" }} />
                      <span>
                        I agree to SwanCore's{" "}
                        <span style={S.link} className="reg-link" onClick={() => navigate("/privacy")}>Privacy Notice</span>
                        {" "}and{" "}
                        <span style={S.link} className="reg-link" onClick={() => navigate("/terms")}>Terms of Service</span>
                      </span>
                    </div>

                    <button type="submit" disabled={loading} className="reg-btn-main" style={S.btn(loading)}>
                      {loading ? <><FaSpinner style={{ animation: "spin 1s linear infinite", marginRight: 8 }} />Sending…</> : "Continue →"}
                    </button>

                    <div style={S.divider}>
                      <div style={S.divLine} /><span>or</span><div style={S.divLine} />
                    </div>

                    <button type="button" disabled={loading} className="reg-social" style={S.secondaryBtn}>
                      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg" alt="Google" style={{ width: 18 }} />
                      Continue with Google
                    </button>

                    <button type="button" disabled={loading} className="reg-social" style={{ ...S.secondaryBtn, filter: "invert(1)" }}>
                      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apple/apple-original.svg" alt="Apple" style={{ width: 18, filter: "invert(1)" }} />
                      Continue with Apple
                    </button>

                    <div style={S.bottomNav}>
                      <span style={{ color: "var(--text-secondary)" }}>Already have an account?</span>
                      <span style={{ ...S.link }} className="reg-link" onClick={() => navigate("/login")}>Sign in</span>
                    </div>
                  </form>
                </div>
              )}

              {/* ─── STEP 2: OTP ─── */}
              {step === 2 && (
                <div style={{ position: "relative" }}>
                  {loading && (
                    <div style={S.loadingOverlay}>
                      <FaSpinner style={{ animation: "spin 1s linear infinite", fontSize: 22, color: "#ff8c32" }} />
                      Verifying your code…
                    </div>
                  )}
                  <form onSubmit={handleOTPSubmit}>
                    <div style={S.stepInfo}>
                      Code sent to{" "}
                      <span style={S.stepInfoAccent}>{email}</span>
                    </div>

                    <div style={{ ...S.formGroup, textAlign: "center" }}>
                      <label style={S.label}>Verification Code</label>
                      <input
                        type="text"
                        placeholder="000000"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 8))}
                        disabled={loading}
                        maxLength={8}
                        required
                        className="reg-input"
                        style={S.otpInput}
                      />
                      <small style={S.otpHint}>Enter the 6–8 digit code from your email</small>
                    </div>

                    <button
                      type="submit"
                      disabled={loading || otp.length < 6}
                      className="reg-btn-main"
                      style={S.btn(loading || otp.length < 6)}
                    >
                      {loading ? <><FaSpinner style={{ animation: "spin 1s linear infinite", marginRight: 8 }} />Verifying…</> : "Verify Code →"}
                    </button>

                    <button
                      type="button"
                      onClick={handleResendOTP}
                      disabled={resendCountdown > 0 || loading}
                      className="reg-ghost"
                      style={{ ...S.ghostBtn, color: resendCountdown > 0 ? "var(--text-secondary)" : "rgba(255,140,50,.7)" }}
                    >
                      {resendCountdown > 0 ? `Resend in ${resendCountdown}s` : "Resend Code"}
                    </button>

                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      disabled={loading}
                      className="reg-ghost"
                      style={S.ghostBtn}
                    >
                      ← Change Email
                    </button>
                  </form>
                </div>
              )}

              {/* ─── STEP 3: PASSWORD ─── */}
              {step === 3 && (
                <form onSubmit={handlePasswordSubmit}>
                  <div style={S.stepInfo}>
                    Almost there — create your <span style={S.stepInfoAccent}>secure password</span>
                  </div>

                  <div style={S.formGroup}>
                    <label style={S.label}>Password</label>
                    <div style={S.passwordWrap}>
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          setStrength(checkStrength(e.target.value));
                        }}
                        disabled={loading}
                        required
                        className="reg-input"
                        style={{ ...S.input, paddingRight: 44 }}
                      />
                      <button
                        type="button"
                        style={S.eyeBtn}
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>

                  {password && (
                    <div style={S.strengthWrap}>
                      <div style={S.strengthTrack}>
                        <div style={S.strengthFill(strengthPct, strengthColor)} />
                      </div>
                      <span style={S.strengthText}>
                        Strength:{" "}
                        <strong style={{ color: strengthColor }}>{strength}</strong>
                      </span>
                    </div>
                  )}

                  <ul style={S.reqList} className="reg-req-grid">
                    {reqCheck(password.length >= 8, "8+ characters")}
                    {reqCheck(/[A-Z]/.test(password), "Uppercase (A–Z)")}
                    {reqCheck(/[a-z]/.test(password), "Lowercase (a–z)")}
                    {reqCheck(/[0-9]/.test(password), "Number (0–9)")}
                    {reqCheck(/[!@#$%^&*]/.test(password), "Special char")}
                  </ul>

                  <button
                    type="submit"
                    disabled={loading || strength !== "Strong"}
                    className="reg-btn-main"
                    style={S.btn(loading || strength !== "Strong")}
                  >
                    {loading
                      ? <><FaSpinner style={{ animation: "spin 1s linear infinite", marginRight: 8 }} />Creating Account…</>
                      : "Create Account →"}
                  </button>

                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    disabled={loading}
                    className="reg-ghost"
                    style={S.ghostBtn}
                  >
                    ← Back to Verification
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* ── FOOTER ── */}
          <div style={S.footer} className="reg-footer">
            <span
              style={{ cursor: "pointer", color: "var(--text-secondary)" }}
              onClick={() => setShowLang(!showLang)}
            >
              🌐 {languages[currentLang] || "English"}
            </span>
            <div style={S.footerLinks}>
              {["Cookies", "Terms", "Privacy"].map((t) => (
                <span
                  key={t}
                  className="reg-footer-link"
                  style={{ color: "var(--text-secondary)" }}
                  onClick={() => navigate(`/${t.toLowerCase()}`)}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* ── LANGUAGE PANEL ── */}
          {showLang && (
            <>
              <div style={S.langOverlay} onClick={() => setShowLang(false)} />
              <div style={S.langPanel}>
                <div style={S.langHeader}>
                  <span>Select Language</span>
                  <button
                    onClick={() => setShowLang(false)}
                    style={{ background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer", fontSize: 14 }}
                  >
                    ✕
                  </button>
                </div>
                <div style={S.langGrid}>
                  {Object.entries(languages).map(([code, name]) => (
                    <div
                      key={code}
                      className="reg-lang-item"
                      style={S.langItem(code === currentLang)}
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