import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./landing.css";
import logo from "./assets/logo.jpg";
import phone from "./assets/phone.png";
import forbes from "./assets/logos/forbes.png";
import fortune from "./assets/logos/fortune.png";
import cnbc from "./assets/logos/cnbc.png";
import { Link } from "react-router-dom";
import { getAPI } from "./api";



/* ✅ REUSABLE TICKER ITEMS */
const TickerItems = () => (
  <>
    <div className="ticker-item">
      <img src={forbes} alt="forbes" />
      <span>Recognized as Forbes' Most Trusted Crypto Exchanges 2025</span>
    </div>

    <div className="ticker-item">
      <img src={fortune} alt="fortune" />
      <span>Listed #1 in Fortune's FinTech Innovators Asia 2024</span>
    </div>

    <div className="ticker-item">
      <img src={cnbc} alt="cnbc" />
      <span>Named CNBC’s Top FinTech Companies 2025</span>
    </div>
  </>
);

export default function Landing() {
  const navigate = useNavigate();
  const [coins, setCoins] = useState([]);
  const [news, setNews] = useState([]);

  const [users, setUsers] = useState(315735436);
  const [displayUsers, setDisplayUsers] = useState(315735436);
/* FAQ STATE */
  const [activeFAQ, setActiveFAQ] = useState(null);

  const faqs = [
    {
      q: "Why is Swancore the best exchange for crypto traders?",
      a: `Swancore stands out as a premier cryptocurrency exchange by combining deep global liquidity with competitive fees, helping traders execute efficiently across market conditions. The platform brings together Spot, Futures, Earn, and P2P markets in one seamless ecosystem, so users can diversify strategies without switching tools. Real-time price tracking, curated insights on top gainers and losers, and discovery of emerging assets make it easier to spot opportunities as they develop.

Beyond trading, Swancore offers early participation in promising projects through MegaDrop and access to innovative pre-listing opportunities via Alpha—giving users a potential edge before broader market exposure. Backed by strong security infrastructure and an intuitive interface, Swancore delivers both performance and confidence, making it an attractive choice for traders looking to grow and manage their crypto portfolios effectively.`
    },
    {
      q: "What products does Swancore provide?",
      a: `Swancore supports <span class="highlight">Spot</span>, <span class="highlight">Futures</span>, <span class="highlight">Earn</span>, and <span class="highlight">P2P</span>.`
    },
    {
      q: "How to buy crypto?",
      a: `Sign up, verify, deposit funds, and start trading instantly.`
    },
    {
      q: "How to track prices?",
      a: `Use real-time dashboard for <span class="highlight">live market tracking</span>.`
    },
    {
      q: "How to trade?",
      a: `Choose market → place order → manage positions.`
    },
    {
      q: "How to earn?",
      a: `Earn via <span class="highlight">staking</span> and savings.`
    }
  ];

  useEffect(() => {
    loadCoins();
    loadNews();
  }, []);

  const loadCoins = async () => {
    try {
      const baseURL = await getAPI();
      const res = await axios.get(
        `${baseURL}/api/coins`,
        {
          params: {
            vs_currency: "usd",
            order: "market_cap_desc",
            per_page: 5,
            page: 1
          }
        }
      );
      setCoins(res.data || []);
    } catch (err) {
      console.log("Coins error:", err.message);
      setCoins([]);
    }
  };

  const loadNews = async () => {
    try {
      const baseURL = await getAPI();
      const res = await axios.get(`${baseURL}/api/news`);

      setNews(Array.isArray(res.data) ? res.data.slice(0, 5) : []);
    } catch (err) {
      console.log("News error:", err.message);
      setNews([]);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const increment = Math.floor(Math.random() * 7) + 2;

      setUsers(prev => {
        const next = prev + increment;
        animateNumber(prev, next);
        return next;
      });
    }, Math.floor(Math.random() * 2000) + 4000);

    return () => clearInterval(interval);
  }, []);

  const animateNumber = (start, end) => {
    const duration = 800;
    const steps = 30;
    const stepTime = duration / steps;
    let current = 0;
    const diff = end - start;

    const timer = setInterval(() => {
      current++;
      const progress = current / steps;
      const value = Math.floor(start + diff * progress);

      setDisplayUsers(value);

      if (current === steps) {
        clearInterval(timer);
        setDisplayUsers(end);
      }
    }, stepTime);
  };

  return (
    <div className="landing">

      

      {/* HERO */}
      <div className="hero">
        <div className="hero-left slide-left">
          <h1 className="big-number">{displayUsers.toLocaleString()}</h1>

          <h2 className="trust-text">
            USERS <br /> TRUST US
          </h2>

          <p className="tagline">
            The World’s Leading Cryptocurrency Exchange
          </p>

          <div className="badges">
            <div className="badge">
              <div className="badge-top">
                <img src="https://cdn-icons-png.flaticon.com/512/616/616490.png" className="laurel-img" alt="" />
                <div className="badge-title">No.1</div>
                <img src="https://cdn-icons-png.flaticon.com/512/616/616490.png" className="laurel-img" alt="" />
              </div>
              <div className="badge-sub">Customer Assets</div>
            </div>

            <div className="badge">
              <div className="badge-top">
                <img src="https://cdn-icons-png.flaticon.com/512/616/616490.png" className="laurel-img" alt="" />
                <div className="badge-title">No.1</div>
                <img src="https://cdn-icons-png.flaticon.com/512/616/616490.png" className="laurel-img" alt="" />
              </div>
              <div className="badge-sub">Trading Volume</div>
            </div>
          </div>

          <div className="cta">
            <button className="btn-outline">Up to $100 Bonus</button>
            <button className="btn-main" onClick={() => navigate("/login")}>
              Sign Up
            </button>
          </div>
          <div className="socials">
  <button className="social-box google">
    <img
      src="https://www.svgrepo.com/show/475656/google-color.svg"
      alt="Google"
    />
  </button>

  <button className="social-box apple">
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="white"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M16.365 1.43c0 1.14-.47 2.28-1.23 3.12-.8.9-2.1 1.6-3.18 1.5-.13-1.1.5-2.3 1.2-3.08.8-.9 2.2-1.57 3.21-1.54zM20.5 17.5c-.9 2.1-1.9 4.2-3.7 4.24-1.2.02-1.6-.7-3-.7-1.4 0-1.9.68-3.05.72-1.8.06-3.1-2.2-4-4.3-1.8-4.1-.5-10.2 3.4-10.3 1.3-.03 2.5.9 3.3.9.8 0 2.2-1.1 3.7-.94 1.1.04 4.1.45 4.8 4.2-.1.06-2.8 1.7-2.7 5.2.1 4.2 3.7 5.6 3.7 5.6z"/>
    </svg>
  </button>
</div>
          
        </div>

        <div className="hero-right">
          <div className="card slide-right right-top">
            <div className="card-header">
              <span>Popular</span>
              <span className="link">View More</span>
            </div>

            {coins.map((c) => (
              <div className="coin" key={c.id}>
                <div className="coin-name">
                  <img src={c.image} alt="" />
                  {c.symbol.toUpperCase()}
                </div>
                <div>${c.current_price}</div>
                <div className={c.price_change_percentage_24h > 0 ? "green" : "red"}>
                  {c.price_change_percentage_24h?.toFixed(2)}%
                </div>
              </div>
            ))}
          </div>

          <div className="card slide-right right-bottom">
            <div className="card-header">
              <span>News</span>
              <span className="link" onClick={() => navigate("/news")}>
                View All
              </span>
            </div>

            {news.length === 0 ? (
              <div style={{ opacity: 0.6 }}>Loading news...</div>
            ) : (
              news.map((n, i) => (
                <div key={i} className="news-item">
                  {n.title}
                </div>
              ))
            )}
          </div>

        </div>
      </div>

      {/* TICKER */}
      <div className="ticker">
        <div className="ticker-track">
          <div className="ticker-content"><TickerItems /></div>
          <div className="ticker-content"><TickerItems /></div>
        </div>
      </div>

      {/* SAFU */}
      <div className="safu-section">
        <div className="safu-left">
          <h2>FUNDS ARE <br /><span>SAFU</span></h2>
          <p>
            The Security of User Assets Fund (SAFU) was established in 2018 to protect
            your funds in rare emergencies. Your security is our priority.
          </p>
        </div>

        <div className="safu-right">
          <p className="safu-top">
            As of February 2026, the SAFU fund wallet comprises a reserve of
          </p>
          <h3>15,000 BTC</h3>
          <p className="wallet">
            SAFU Wallet: 1BAuq7Vho2CEKvKJxbfU26LhwQjbCmWQkD
          </p>

          <div className="safu-stats">
            <div>
              <h2>7,488,223</h2>
              <span>Users helped</span>
            </div>
            <div>
              <h2>$229,433,449</h2>
              <span>Funds recovered</span>
            </div>
          </div>
        </div>
      </div>

      {/* APP DOWNLOAD */}
      <div className="app-section">
        <div className="app-container">

          <div className="app-phone">
            <img src={phone} alt="app" className="phone-img" />

            <div className="app-tabs">
              <span>Desktop</span>
              <span>Lite</span>
              <span className="active">Pro</span>
            </div>
          </div>

          <div className="app-content">
            <h2>
              Trade on the go. Anywhere,<br /> anytime.
            </h2>

            <div className="qr-row">
              <div className="qr-box">
                <img
                  src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=https://yourapp.com"
                  alt="qr"
                />
              </div>

              <div className="qr-text">
                <p className="scan-text">Scan to Download App</p>
                <p className="platform-text">iOS and Android</p>
              </div>
            </div>

            <div className="platforms">
              <div><span></span><p>MacOS</p></div>
              <div><span>🪟</span><p>Windows</p></div>
              <div><span>🐧</span><p>Linux</p></div>
            </div>
          </div>

        </div>
      </div>

      {/* FAQ */}
<div className="faq-section">
  <div className="faq-container">

    <h2 className="faq-title">Frequently Asked Questions</h2>

    {faqs.map((item, i) => (
      <div key={i}>

        {/* QUESTION ROW */}
        <div
          className={`faq-item ${activeFAQ === i ? "active" : ""}`}
          onClick={() => setActiveFAQ(activeFAQ === i ? null : i)}
        >
          <div className="faq-left">
            <div className="faq-number">{i + 1}</div>
            <div className="faq-question">{item.q}</div>
          </div>

          <div className="faq-icon">
            {activeFAQ === i ? "−" : "+"}
          </div>
        </div>

        {/* ANSWER */}
        {activeFAQ === i && (
          <div className="faq-answer">
            <div dangerouslySetInnerHTML={{ __html: item.a }} />
          </div>
        )}

      </div>
    ))}

  </div>
</div>
             

    {/* CTA BANNER */}
    <div className="cta-banner">
      <div className="cta-content">
        <h2>Secure, Low-Fee Trading on SwanCore</h2>

        <button
          className="cta-btn"
          onClick={() => navigate("/login")}
        >
          Sign Up Now
        </button>
      </div>
    </div>

    {/* ✅ FOOTER */}
    <div className="footer">
  <div className="footer-container">

    {/* COLUMN 1 */}
    <div className="footer-col">
      <h4>About Us</h4>
      <span onClick={() => {
  console.log("clicked about");
  navigate("/about");
}}>
  About
</span>
      <Link to="/careers" className="footer-link">
  Careers
</Link>
      <span>News</span>
      <Link to="/imformation" className="imformation-link">
  Imformation
</Link>
      <Link to="/building-trust" className="footer-link">
  Building Trust
</Link>
<Link to="/legal/privacy">Privacy Notice</Link>

      <span>Privacy</span>
      <span>Building Trust</span>
      <span>Blog</span>
      <span>Community</span>
      <span>Risk Warning</span>
      <span>Notices</span>
      <span>Downloads</span>
      <span>Desktop Application</span>
      <span>Secure Internal Communication Channel</span>
    </div>

    {/* COLUMN 2 */}
    <div className="footer-col">
      <h4>Products</h4>
      <span>Exchange</span>
      <span>Buy Crypto</span>
      <span>Pay</span>
      <span>Crypto Payments</span>
      <span>Binance Junior</span>
      <span>Academy</span>
      <span>Gift Card</span>
      <span>Launchpool</span>
      <span>Auto-Invest</span>
      <span>ETH Staking</span>
      <span>NFT</span>
      <span>BABT</span>
      <span>Research</span>
      <span>Charity</span>
    </div>

    {/* COLUMN 3 */}
    <div className="footer-col">
      <h4>Business</h4>
      <span>P2P Merchant Application</span>
      <span>P2Pro Merchant Application</span>
      <span>Listing Application</span>
      <span>Institutional & VIP Services</span>
      <span>Labs</span>
      <span>Binance Connect</span>

      <h4 className="footer-sub">Learn</h4>
      <span>Learn & Earn</span>
      <span>Browse Crypto Prices</span>
      <span>Bitcoin Price</span>
      <span>Ethereum Price</span>
      <span>Browse Crypto Price Predictions</span>
      <span>Bitcoin Price Prediction</span>
      <span>Ethereum Price Prediction</span>
      <span>Ethereum Upgrade (Pectra)</span>
      <span>Buy Bitcoin</span>
      <span>Buy BNB</span>
      <span>Buy XRP</span>
      <span>Buy Dogecoin</span>
      <span>Buy Ethereum</span>
      <span>Buy Tradable Altcoins</span>
    </div>

    {/* COLUMN 4 */}
    <div className="footer-col">
      <h4>Service</h4>
      <span>Affiliate</span>
      <span>Referral</span>
      <span>BNB</span>
      <span>OTC & Execution Services</span>
      <span>Historical Market Data</span>
      <span>Trading Insight</span>
      <span>Proof of Reserves</span>

      <h4 className="footer-sub">Support</h4>
      <span>24/7 Chat Support</span>
      <span>Support Center</span>
      <span>Product Feedback & Suggestions</span>
      <span>Fees</span>
      <span>APIs</span>
      <span>Binance Verify</span>
      <span>Trading Parameters</span>
      <span>Binance Airdrop Portal</span>
      <span>Law Enforcement Requests</span>
      <span>How to Raise a Complaint</span>
    </div>

      </div>
    </div>

  </div> 
);
}