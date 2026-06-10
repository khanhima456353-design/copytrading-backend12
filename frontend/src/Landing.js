
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "./components/theme/ThemeContext";
import "./landing.css";

import logo from "./assets/logo.jpg";
import {
  ShieldCheck,
  TrendingUp,
  TrendingDown,
  Smartphone,
  Download,
  CheckCircle2,
  ArrowRight,
  PlayCircle,
  Globe,
  ChevronDown,
  Menu,
  X,
  Zap,
  BarChart3,
  Users,
  ArrowUpRight,
  Mail,
  Moon,
  Sun,
  Lock,
  ExternalLink
} from "lucide-react";

/* ============================================================
   API CONFIGURATION
   ============================================================ */
const BASE_URL = process.env.REACT_APP_BASE_URL || "https://api.swancore.com";

/* Structured API Helper */
const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" }
});

/* =========================
   REUSABLE TICKER ITEMS
========================= */
const TickerItems = () => (
  <>
    <div className="ticker-item">
      <div className="ticker-icon"><ShieldCheck className="w-5 h-5" /></div>
      <span>Forbes' Most Trusted Exchange 2025</span>
    </div>
    <div className="ticker-item border-l">
      <div className="ticker-icon"><Zap className="w-5 h-5" /></div>
      <span>#1 FinTech Innovator - Fortune Asia</span>
    </div>
    <div className="ticker-item border-l">
      <div className="ticker-icon"><BarChart3 className="w-5 h-5" /></div>
      <span>CNBC Top FinTech Companies 2025</span>
    </div>
  </>
);

export default function Landing() {
  const navigate = useNavigate();
  const signupFormRef = useRef(null);
  const { theme, toggleTheme } = useTheme();

  /* State */
  const [coins, setCoins] = useState([]);
  const [loadingCoins, setLoadingCoins] = useState(true);
  const [displayUsers, setDisplayUsers] = useState(315735436);
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [activeFAQ, setActiveFAQ] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const faqs = [
    {
      q: "Why is SwanCore the best exchange for crypto traders?",
      a: "SwanCore combines deep global liquidity with competitive fees, Spot, Futures, Earn, and P2P markets in one seamless ecosystem. We prioritize security with $1B SAFU protection and SOC2 compliance."
    },
    {
      q: "What digital assets are supported?",
      a: "We support over 500+ digital assets including Bitcoin, Ethereum, Solana, and the latest emerging altcoins with high liquidity."
    },
    {
      q: "How secure is my data and funds?",
      a: "We employ multi-signature cold storage, biometric authentication, and regular third-party audits. Our SAFU fund provides an extra layer of protection."
    },
    {
      q: "Are there tools for professional traders?",
      a: "Yes. Our pro dashboard includes advanced order types, algorithmic trading APIs, and sub-millisecond execution speeds."
    }
  ];

  /* =========================
     EFFECTS
  ========================= */
  useEffect(() => {
    loadCoins();
  }, []);
  const loadCoins = async () => {
    setLoadingCoins(true);
    try {
      // Requirements: GET /api/market/coins (Proxy or Direct)
      const res = await api.get("/api/market/coins");
      setCoins(res.data || []);
    } catch (err) {
      console.error("Coins error:", err.message);
      // Fallback for demo
      setCoins([]);
    } finally {
      setLoadingCoins(false);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const increment = Math.floor(Math.random() * 7) + 2;
      setDisplayUsers(prev => prev + increment);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const redirectToRegister = () => {
    navigate("/register");
  };

  const scrollToSignup = () => {
    signupFormRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <div className="landing-root">
      <header className="navbar">
        <div className="container nav-content">
          <div className="nav-left">
            <Link to="/" className="logo">
              <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 14px", borderRadius: 10, background: "#ff8c32", border: "1px solid #ff8c32" }}>
                <img src={logo} alt="SwanCore" style={{ width: 32, height: 32, borderRadius: 4, objectFit: "contain", background: "#0b0e11", padding: 2 }} />
                <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.1 }}>
                  <span style={{ color: "#ffffff", fontSize: 18, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", fontFamily: "'Inter', 'SF Pro Display', -apple-system, sans-serif" }}>SwanCore</span>
                  <span style={{ color: "#0a0a0a", fontSize: 10 }}>Simplified Trading</span>
                </div>
              </div>
            </Link>

            <nav className="nav-links">
              <Link to="/trade" className="nav-dropdown">
                Trade <ChevronDown className="w-4 h-4" />
              </Link>
              <Link to="/markets">Markets</Link>
              <Link to="/earn">Earn</Link>
              <Link to="/research">Research</Link>
            </nav>
          </div>

          <div className="nav-right">
            <button onClick={toggleTheme} className="theme-toggle">
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <div className="nav-auth">
              <button onClick={() => navigate("/login")} className="btn-ghost">Log in</button>
              <button onClick={redirectToRegister} className="btn-primary">Sign Up</button>
            </div>
            <button className="mobile-menu" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {mobileMenuOpen && (
        <div className="lm-overlay" onClick={() => setMobileMenuOpen(false)}>
          <div className="lm-drawer" onClick={e => e.stopPropagation()}>
            <div className="lm-drawer-body">
              <nav className="lm-nav-links">
                <Link to="/trade" className="lm-nav-item" onClick={() => setMobileMenuOpen(false)}>
                  <ChevronDown className="w-4 h-4" /> Trade
                </Link>
                <Link to="/markets" className="lm-nav-item" onClick={() => setMobileMenuOpen(false)}>Markets</Link>
                <Link to="/earn" className="lm-nav-item" onClick={() => setMobileMenuOpen(false)}>Earn</Link>
                <Link to="/research" className="lm-nav-item" onClick={() => setMobileMenuOpen(false)}>Research</Link>
              </nav>
              <div className="lm-nav-auth">
                <button onClick={() => { navigate("/login"); setMobileMenuOpen(false); }} className="lm-btn-ghost">Log in</button>
                <button onClick={() => { redirectToRegister(); setMobileMenuOpen(false); }} className="lm-btn-primary">Sign Up</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <main>
        {/* HERO SECTION */}
        <section className="hero">
          <div className="container hero-container">
            <div className="hero-badge">
              <span className="pulse"></span>
              Global Trust Benchmark 2025
            </div>

            <h1 className="hero-title">
              The world trades here <br />
              <span className="accent-text italic">{displayUsers.toLocaleString()}</span>
            </h1>

            <p className="hero-subtitle">
              SwanCore is the institutional-grade gateway to digital assets. Deep liquidity, 
              multi-layer security, and professional execution for everyone.
            </p>

            <div className="hero-actions">
              <button onClick={redirectToRegister} className="btn-hero-primary">
                Start Trading <ArrowRight className="w-6 h-6" />
              </button>
              <button onClick={() => navigate("/pro")} className="btn-hero-outline">
                <PlayCircle className="w-6 h-6" /> Experience Pro
              </button>
            </div>

            <div className="hero-social">
              <div className="trader-avatars">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <img key={i} src={`https://picsum.photos/seed/trader${i}/100/100`} alt="user" />
                ))}
                <div className="avatar-plus">+300M</div>
              </div>
              <div className="partner-logos">
                <span>FORBES</span>
                <span>FORTUNE</span>
                <span>CNBC</span>
                <span>BLOOMBERG</span>
              </div>
            </div>
          </div>
        </section>

        {/* LOGO MARQUEE */}
        <div className="ticker">
          <div className="ticker-track">
            <TickerItems />
            <TickerItems />
            <TickerItems />
          </div>
        </div>

        {/* MARKET DATA SECTION */}
        <section className="markets-section">
          <div className="container">
            <div className="section-header">
              <div className="header-left">
                <span className="badge-small">Live Markets</span>
                <h2>Real-time Intelligence</h2>
                <p>Monitor the heartbeat of the global crypto economy.</p>
              </div>
              <Link to="/markets" className="link-arrow">
                View Full Markets <ArrowUpRight className="w-5 h-5" />
              </Link>
            </div>

            <div className="market-grid">
              {loadingCoins ? (
                Array(5).fill(0).map((_, i) => (
                  <div key={i} className="market-card loading" />
                ))
              ) : coins.length > 0 ? (
                coins.map(coin => (
                  <div key={coin.id} className="market-card">
                    <div className="card-top">
                      <img src={coin.image} alt={coin.name} className="coin-icon" />
                      <div className="coin-info">
                        <span className="coin-symbol">{coin.symbol.toUpperCase()}</span>
                        <span className="coin-name">{coin.name}</span>
                      </div>
                    </div>
                    <div className="card-price">${coin.current_price.toLocaleString()}</div>
                    <div className={`card-change ${coin.price_change_percentage_24h > 0 ? "up" : "down"}`}>
                      {coin.price_change_percentage_24h > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                      {coin.price_change_percentage_24h.toFixed(2)}%
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-data">Connect to see live markets.</div>
              )}
            </div>
          </div>
        </section>

        {/* FEATURES GRID */}
        <section className="features-section">
          <div className="container">
            <div className="features-intro">
              <span className="accent-label">Engineered for Excellence</span>
              <h2>The complete stack for digital finance</h2>
            </div>

            <div className="features-grid">
              {[
                { title: "Institutional Spot", desc: "Trade 500+ assets with the world's deepest liquidity pools.", icon: <Globe /> },
                { title: "Derivatives Pro", desc: "Up to 125x leverage with institutional risk management.", icon: <BarChart3 /> },
                { title: "Wealth Optimizer", desc: "Automated staking and yield generation on autopilot.", icon: <Zap /> },
                { title: "$1B SAFU Reserve", desc: "Your assets are protected by our multi-layered SAFU fund.", icon: <ShieldCheck /> },
                { title: "Direct P2P", desc: "Global marketplace for local currency crypto trading.", icon: <Users /> },
                { title: "Mobile Terminal", desc: "Desktop power in your pocket. Optimized for iOS/Android.", icon: <Smartphone /> },
              ].map((item, idx) => (
                <div key={idx} className="feature-card">
                  <div className="feature-icon">{item.icon}</div>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SAFU / SECURITY SECTION */}
        <section className="safu-section">
          <div className="container safu-container">
            <div className="safu-text">
              <h2 className="safu-title">FUNDS ARE <br /><span>SAFU</span></h2>
              <p>
                The Security Asset Fund for Users (SAFU) is an emergency insurance fund established 
                to protect user interests. Your security is our standard.
              </p>
              <div className="safu-stats">
                <div className="stat">
                  <h4>15,000 BTC</h4>
                  <span>Active Reserve</span>
                </div>
                <div className="stat">
                  <h4>7.4M+</h4>
                  <span>Users Protected</span>
                </div>
              </div>
            </div>
            <div className="safu-visual">
              <div className="security-card">
                <Lock className="w-12 h-12 text-indigo-500 mb-6" />
                <h3>Enterprise Grade Security</h3>
                <p>SOC2 Type II Compliant Infrastructure</p>
                <div className="wallet-address">
                  <span>Audit Proof:</span>
                  <code>1BAuq7Vho2CEKvKJxbfU26LhwQWbCmWQkD</code>
                </div>
                <button className="btn-safu">Verify Reserves</button>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ SECTION */}
        <section className="faq-section">
          <div className="container">
            <div className="faq-header">
              <span className="badge-small">Support</span>
              <h2>Common Inquiries</h2>
            </div>
            <div className="faq-list">
              {faqs.map((item, i) => (
                <div key={i} className={`faq-item ${activeFAQ === i ? "active" : ""}`}>
                  <button onClick={() => setActiveFAQ(activeFAQ === i ? null : i)} className="faq-trigger">
                    <span>{item.q}</span>
                    <ChevronDown className="w-5 h-5 icon-rot" />
                  </button>
                  <div className="faq-answer">
                    <p>{item.a}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA / LEAD CAPTURE */}
        <section className="cta-section" ref={signupFormRef}>
          <div className="container cta-container">
            <div className="cta-text">
              <h2>Your wealth, <br /><span className="italic accent-text">elevated.</span></h2>
              <p>Join the elite circle of 315M+ global users. Performance is our promise.</p>
              <div className="cta-trust-items">
                <div><strong>$100B+</strong><span>Daily Volume</span></div>
                <div><strong>180+</strong><span>Nations</span></div>
              </div>
            </div>

            <div className="lead-form-box">
              <h3>Join the Alpha</h3>
              <p>Priority access and zero-fee onboarding.</p>
              <form onSubmit={(e) => { e.preventDefault(); redirectToRegister(); }}>
                <div className="input-group">
                  <label>Business Email</label>
                  <input 
                    type="email" 
                    placeholder="ceo@enterprise.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                  />
                </div>
                <div className="input-group">
                  <label>Entity Name</label>
                  <input 
                    type="text" 
                    placeholder="Asset Management Inc." 
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    required 
                  />
                </div>
                <button type="submit" className="btn-lead">
                  Register Access <ArrowRight className="w-6 h-6" />
                </button>
              </form>
              <div className="form-footer">
                <ShieldCheck className="w-4 h-4" /> SAFU Secure Infrastructure
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="footer">
        <div className="container footer-content">
          <div className="footer-brand">
            <Link to="/" className="logo">
              <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 14px", borderRadius: 10, background: "#ff8c32", border: "1px solid #ff8c32" }}>
                <img src={logo} alt="SwanCore" style={{ width: 32, height: 32, borderRadius: 4, objectFit: "contain", background: "#0b0e11", padding: 2 }} />
                <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.1 }}>
                  <span style={{ color: "#ffffff", fontSize: 18, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", fontFamily: "'Inter', 'SF Pro Display', -apple-system, sans-serif" }}>SwanCore</span>
                  <span style={{ color: "#0a0a0a", fontSize: 10 }}>Simplified Trading</span>
                </div>
              </div>
            </Link>
            <p>Pioneering the next generation of global financial sovereignty.</p>
            <div className="footer-socials">
              <Link to="#"><span className="social-icon">X</span></Link>
              <Link to="#"><span className="social-icon">G</span></Link>
              <Link to="#"><span className="social-icon">IN</span></Link>
              <Link to="#"><Mail className="w-5 h-5" /></Link>
            </div>
          </div>

          <div className="footer-links">
            <div className="footer-col">
              <h4>Company</h4>
              <Link to="/about">About</Link>
              <Link to="/careers">Careers</Link>
              <Link to="/press">Press</Link>
            </div>
            <div className="footer-col">
              <h4>Products</h4>
              <Link to="/exchange">Exchange</Link>
              <Link to="/earn">Earn</Link>
              <Link to="/pay">SwanPay</Link>
            </div>
            <div className="footer-col">
              <h4>Support</h4>
              <Link to="/help">Help Center</Link>
              <Link to="/fees">Fees</Link>
              <Link to="/api">Market API</Link>
            </div>
          </div>
        </div>
        <div className="container footer-bottom">
          <p>© {new Date().getFullYear()} SWANCORE GLOBAL LTD. ALL SYSTEMS NOMINAL.</p>
          <div className="footer-meta">
            <span className="network-status"><span className="pulse"></span> Network Active</span>
            <div className="lang-selector"><Globe className="w-4 h-4" /> English / Global</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
