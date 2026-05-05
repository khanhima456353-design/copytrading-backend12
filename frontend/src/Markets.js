import React, { useEffect, useState } from "react";
import axios from "axios";
import "./markets.css";
import { getAPI, LOCAL_URL, CLOUD_URL, setSavedAPI } from "./api"; // ✅ FIXED IMPORT

export default function Markets() {
  const [coins, setCoins] = useState([]);
  const [hot, setHot] = useState([]);
  const [gainers, setGainers] = useState([]);
  const [volume, setVolume] = useState([]);
  const [newCoins, setNewCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [apiURL, setApiURL] = useState(null); // ✅ store working API

  const formatCurrency = (value) => {
    if (value == null || Number.isNaN(Number(value))) return "-";
    return Number(value).toLocaleString(undefined, {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    });
  };

  const formatPercent = (value) => {
    if (value == null || Number.isNaN(Number(value))) return "-";
    const num = Number(value);
    const precision = Math.abs(num) < 0.1 ? 4 : 2;
    return `${num.toFixed(precision)}%`;
  };

  const formatNumber = (value) => {
    if (value == null || Number.isNaN(Number(value))) return "-";
    return Number(value).toLocaleString(undefined, {
      maximumFractionDigits: 0,
    });
  };

  const formatCompactCurrency = (value) => {
    if (value == null || Number.isNaN(Number(value))) return "-";
    return Number(value).toLocaleString(undefined, {
      style: "currency",
      currency: "USD",
      notation: "compact",
      maximumFractionDigits: 2,
    });
  };

  const trendClass = (value) => {
    if (value == null || Number.isNaN(Number(value))) return "";
    return Number(value) > 0 ? "green" : Number(value) < 0 ? "red" : "";
  };

  const trendSign = (value) => {
    if (value == null || Number.isNaN(Number(value))) return "";
    return Number(value) > 0 ? "+" : "";
  };

  const normalizeCoin = (coin) => ({
    ...coin,
    current_price: Number(coin?.current_price),
    price_change_24h: Number(coin?.price_change_24h),
    price_change_percentage_24h: Number(coin?.price_change_percentage_24h),
    total_volume: Number(coin?.total_volume),
    market_cap: Number(coin?.market_cap),
  });

  const loadData = async () => {
    try {
      if (!apiURL) return; // wait until API is ready

      setError("");

      // Try current API first, then fallback to the other
      const urls = [apiURL, apiURL === LOCAL_URL ? CLOUD_URL : LOCAL_URL];
      let data = null;
      let workingUrl = null;

      for (const url of urls) {
        try {
          const res = await axios.get(`${url}/api/coins`);
          data = res.data;
          workingUrl = url;
          break; // success, stop trying
        } catch {
          // try next URL
        }
      }

      if (!data) {
        throw new Error("Both local and cloud sources are unreachable");
      }

      // Update cached API if fallback worked
      if (workingUrl !== apiURL) {
        setApiURL(workingUrl);
        setSavedAPI(workingUrl);
      }

      if (!Array.isArray(data)) {
        setError("Invalid data from server");
        setLoading(false);
        return;
      }

      const normalized = data.map(normalizeCoin);

      setCoins(normalized);
      setHot(normalized.slice(0, 3));

      const sortedGainers = [...normalized]
        .filter(c => c?.price_change_percentage_24h != null)
        .sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h);
      setGainers(sortedGainers.slice(0, 3));

      const sortedVolume = [...normalized]
        .filter(c => c?.total_volume != null)
        .sort((a, b) => b.total_volume - a.total_volume);
      setVolume(sortedVolume.slice(0, 3));

      const shuffled = [...normalized].sort(() => 0.5 - Math.random());
      setNewCoins(shuffled.slice(0, 3));

      setLoading(false);
    } catch (err) {
      console.log("Market error:", err.message);
      if (coins.length === 0) {
        setError("Backend not reachable");
      } else {
        setError("Unable to refresh market data");
      }
      setLoading(false);
    }
  };

  // ✅ get working API once
  useEffect(() => {
    const initAPI = async () => {
      const url = await getAPI();
      setApiURL(url);
    };
    initAPI();
  }, []);

  // ✅ load data when API is ready + refresh every 60s
  useEffect(() => {
    if (!apiURL) return;

    loadData();
    const interval = setInterval(loadData, 10000); // ✅ faster refresh (10s instead of 60s)
    return () => clearInterval(interval);
  }, [apiURL]);

  return (
    <div className="markets-container">

      {/* HEADER */}
      <div className="markets-header">
        <h1>📊 Markets</h1>
      </div>

      {error && (
        <div style={{ color: "#f6465d", padding: "10px" }}>
          ⚠️ {error}
        </div>
      )}

      {/* ================= TOP CARDS ================= */}
      <div className="top-cards">

        <div className="card">
          <div className="card-title">Hot</div>
          {loading ? "Loading..." : hot.map(c => (
            <div key={c.id} className="mini-row">
              <span>{c?.symbol?.toUpperCase()}</span>
              <span>{formatCurrency(c?.current_price)}</span>
              <span className={trendClass(c?.price_change_percentage_24h)}>
                {formatPercent(c?.price_change_percentage_24h)}
              </span>
            </div>
          ))}
        </div>

        <div className="card">
          <div className="card-title">New</div>
          {loading ? "Loading..." : newCoins.map(c => (
            <div key={c.id} className="mini-row">
              <span>{c?.symbol?.toUpperCase()}</span>
              <span>{formatCurrency(c?.current_price)}</span>
              <span className={trendClass(c?.price_change_percentage_24h)}>
                {formatPercent(c?.price_change_percentage_24h)}
              </span>
            </div>
          ))}
        </div>

        <div className="card">
          <div className="card-title">Top Gainer</div>
          {loading ? "Loading..." : gainers.map(c => (
            <div key={c.id} className="mini-row">
              <span>{c?.symbol?.toUpperCase()}</span>
              <span>{formatCurrency(c?.current_price)}</span>
              <span className={trendClass(c?.price_change_percentage_24h)}>
                {trendSign(c?.price_change_percentage_24h)}{formatPercent(c?.price_change_percentage_24h)}
              </span>
            </div>
          ))}
        </div>

        <div className="card">
          <div className="card-title">Top Volume</div>
          {loading ? "Loading..." : volume.map(c => (
            <div key={c.id} className="mini-row">
              <span>{c?.symbol?.toUpperCase()}</span>
              <span>{formatCurrency(c?.current_price)}</span>
              <span>{formatCompactCurrency(c?.total_volume)}</span>
            </div>
          ))}
        </div>

      </div>

      {/* ================= TABLE HEADER ================= */}
      <div className="table-header">
        <div className="cell">Name</div>
        <div className="cell right">Price</div>
        <div className="cell right">24h %</div>
        <div className="cell right">Volume</div>
        <div className="cell right">Market Cap</div>
      </div>

      {/* ================= TABLE ================= */}
      {loading ? (
        <div style={{ padding: "20px" }}>Loading market data...</div>
      ) : (
        coins.map((coin) => (
          <div className="row" key={coin.id}>

            <div className="cell name">
              <img src={coin?.image} alt={coin?.name} />
              <div>
                <div className="symbol">{coin?.symbol?.toUpperCase()}</div>
                <div className="fullname">{coin?.name}</div>
              </div>
            </div>

            <div className="cell right price">
              {formatCurrency(coin?.current_price)}
            </div>

            <div className={`cell right ${trendClass(coin?.price_change_percentage_24h)}`}>
              {formatPercent(coin?.price_change_percentage_24h)}
            </div>

            <div className="cell right volume">
              {formatNumber(coin?.total_volume)}
            </div>

            <div className="cell right marketcap">
              {formatNumber(coin?.market_cap)}
            </div>

          </div>
        ))
      )}

    </div>
  );
}