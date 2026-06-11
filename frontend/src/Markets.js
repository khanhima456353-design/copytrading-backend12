import React, { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./markets.css";
import { subscribeAllTickers } from "./services/marketState";

const TOP_PAIRS = [
  "BTCUSDT","ETHUSDT","BNBUSDT","SOLUSDT","XRPUSDT","ADAUSDT",
  "AVAXUSDT","DOTUSDT","DOGEUSDT","LINKUSDT","MATICUSDT","UNIUSDT",
  "ATOMUSDT","LTCUSDT","BCHUSDT","TRXUSDT","APTUSDT","SUIUSDT",
  "OPUSDT","ARBUSDT","NEARUSDT","FILUSDT","ALGOUSDT","FTMUSDT",
  "STXUSDT","VETUSDT","HBARUSDT","ICPUSDT","AAVEUSDT","EGLDUSDT",
  "SANDUSDT","AXSUSDT","MANAUSDT","THETAUSDT","EOSUSDT","XTZUSDT",
  "CRVUSDT","SNXUSDT","ENJUSDT","CHZUSDT","ONEUSDT","KSMUSDT",
  "RNDRUSDT","FETUSDT","AGIXUSDT","GALAUSDT","IMXUSDT","MKRUSDT",
  "COMPUSDT","YFIUSDT","ZILUSDT","BATUSDT","ZRXUSDT","RVNUSDT",
  "IOTAUSDT","ANKRUSDT","HOTUSDT","DENTUSDT","OMGUSDT","SCUSDT",
];

const ASSET_NAMES = {
  BTC:"Bitcoin",ETH:"Ethereum",BNB:"BNB",SOL:"Solana",XRP:"XRP",
  ADA:"Cardano",AVAX:"Avalanche",DOT:"Polkadot",DOGE:"Dogecoin",
  LINK:"Chainlink",MATIC:"Polygon",UNI:"Uniswap",ATOM:"Cosmos",
  LTC:"Litecoin",BCH:"Bitcoin Cash",TRX:"TRON",APT:"Aptos",
  SUI:"Sui",OP:"Optimism",ARB:"Arbitrum",NEAR:"NEAR Protocol",
  FIL:"Filecoin",ALGO:"Algorand",FTM:"Fantom",STX:"Stacks",
  VET:"VeChain",HBAR:"Hedera",ICP:"Internet Computer",
  AAVE:"Aave",EGLD:"Elrond",SAND:"The Sandbox",AXS:"Axie Infinity",
  MANA:"Decentraland",THETA:"Theta Network",EOS:"EOS",XTZ:"Tezos",
  CRV:"Curve DAO",SNX:"Synthetix",ENJ:"Enjin Coin",CHZ:"Chiliz",
  ONE:"Harmony",KSM:"Kusama",RNDR:"Render",FET:"Fetch.ai",
  AGIX:"SingularityNET",GALA:"Gala",IMX:"Immutable X",
  MKR:"Maker",COMP:"Compound",YFI:"yearn.finance",ZIL:"Zilliqa",
  BAT:"Basic Attention",ZRX:"0x",RVN:"Ravencoin",IOTA:"IOTA",
  ANKR:"Ankr",HOT:"Holo",DENT:"Dent",OMG:"OMG Network",
  SC:"Siacoin",
};

const COIN_IMG = (asset) => `https://assets.coincap.io/assets/icons/${asset.toLowerCase()}@2x.png`;

const TOTAL_VOL_QUOTE = "USDT";

const fmtPrice = (v, sym) => {
  if (v == null || !Number.isFinite(Number(v))) return "-";
  const p = Number(v);
  const isBTC = sym?.startsWith("BTC");
  return p.toLocaleString(undefined, {
    minimumFractionDigits: isBTC ? 1 : 2,
    maximumFractionDigits: isBTC ? 1 : 2,
  });
};

const fmtCompact = (v) => {
  if (v == null || !Number.isFinite(Number(v))) return "-";
  const n = Number(v);
  if (n >= 1e12) return (n / 1e12).toFixed(2) + "T";
  if (n >= 1e9) return (n / 1e9).toFixed(2) + "B";
  if (n >= 1e6) return (n / 1e6).toFixed(2) + "M";
  if (n >= 1e3) return (n / 1e3).toFixed(2) + "K";
  return n.toFixed(2);
};

const fmtPct = (v) => {
  if (v == null || !Number.isFinite(Number(v))) return "-";
  const n = Number(v);
  const sign = n >= 0 ? "+" : "";
  return sign + n.toFixed(2) + "%";
};

export default function Markets() {
  const navigate = useNavigate();
  const [tickers, setTickers] = useState({});
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState("volume24h");
  const [sortDir, setSortDir] = useState("desc");
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const unsub = subscribeAllTickers((data) => {
      const map = {};
      for (const t of data) {
        const sym = t.symbol;
        if (TOP_PAIRS.includes(sym)) {
          map[sym] = t;
        }
      }
      setTickers((prev) => Object.keys(map).length > 0 ? { ...prev, ...map } : prev);
      setInitialLoading(false);
    });
    return unsub;
  }, []);

  const pairs = useMemo(() => {
    const base = TOP_PAIRS.map((sym) => {
      const asset = sym.replace("USDT", "");
      const t = tickers[sym];
      const vol = t ? Number(t.quoteVol) || Number(t.volume24h) || 0 : 0;
      return {
        sym,
        asset,
        name: ASSET_NAMES[asset] || asset,
        price: t ? Number(t.price) : 0,
        change24h: t ? Number(t.change24h) : 0,
        changePct: t ? Number(t.changePct) : 0,
        high24h: t ? Number(t.high24h) : 0,
        low24h: t ? Number(t.low24h) : 0,
        volume24h: vol,
        img: COIN_IMG(asset),
      };
    });

    const q = search.toLowerCase().trim();
    const filtered = q
      ? base.filter((p) => p.asset.toLowerCase().includes(q) || p.name.toLowerCase().includes(q) || p.sym.toLowerCase().includes(q))
      : base;

    filtered.sort((a, b) => {
      const aV = a[sortKey] ?? 0;
      const bV = b[sortKey] ?? 0;
      if (typeof aV === "string") return sortDir === "asc" ? aV.localeCompare(bV) : bV.localeCompare(aV);
      return sortDir === "asc" ? aV - bV : bV - aV;
    });

    return filtered;
  }, [tickers, search, sortKey, sortDir]);

  const handleSort = useCallback((key) => {
    setSortKey((prev) => {
      if (prev === key) { setSortDir((d) => (d === "asc" ? "desc" : "asc")); return prev; }
      setSortDir(key === "asset" || key === "name" ? "asc" : "desc");
      return key;
    });
  }, []);

  const sortArrow = (key) => sortKey === key ? (sortDir === "asc" ? " ▲" : " ▼") : "";

  const totalQuoteVol = useMemo(() => pairs.reduce((s, p) => s + p.volume24h, 0), [pairs]);

  const totalVolStr = totalQuoteVol >= 1e9
    ? "$" + (totalQuoteVol / 1e9).toFixed(2) + "B"
    : "$" + (totalQuoteVol / 1e6).toFixed(2) + "M";

  const gainers = pairs.filter(p => p.changePct > 0).length;
  const losers = pairs.filter(p => p.changePct < 0).length;

  const columns = [
    { key: "asset", label: "Name", align: "left", sortable: true },
    { key: "price", label: "Last Price", align: "right", sortable: true },
    { key: "changePct", label: "24h Change", align: "right", sortable: true },
    { key: "high24h", label: "24h High", align: "right", sortable: true, hideMobile: true },
    { key: "low24h", label: "24h Low", align: "right", sortable: true, hideMobile: true },
    { key: "volume24h", label: "Volume", align: "right", sortable: true },
  ];

  return (
    <div className="mk-container">
      <div className="mk-inner">

        <div className="mk-top-bar">
          <div className="mk-title-area">
            <h1 className="mk-title">Markets</h1>
            <span className="mk-subtitle">{pairs.length} pairs</span>
          </div>
          <div className="mk-search-wrap">
            <span className="mk-search-icon">🔍</span>
            <input
              className="mk-search-input"
              type="text"
              placeholder="Search pairs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="mk-stats-bar">
          <div className="mk-stat">
            <span className="mk-stat-label">24h Volume</span>
            <span className="mk-stat-val">{totalVolStr}</span>
          </div>
          <div className="mk-stat">
            <span className="mk-stat-label">Gainers</span>
            <span className="mk-stat-val mk-stat-green">{gainers}</span>
          </div>
          <div className="mk-stat">
            <span className="mk-stat-label">Losers</span>
            <span className="mk-stat-val mk-stat-red">{losers}</span>
          </div>
          <div className="mk-stat">
            <span className="mk-stat-label">Live</span>
            <span className="mk-stat-live"><span className="mk-live-dot" /> Real-time</span>
          </div>
        </div>

        <div className="mk-table-wrap">
          <div className="mk-table-header">
            {columns.map((col) => (
              <div
                key={col.key}
                className={`mk-th mk-th-${col.align}${col.hideMobile ? " mk-hide-mobile" : ""}${col.sortable ? " mk-sortable" : ""}`}
                onClick={() => col.sortable && handleSort(col.key)}
              >
                {col.label}
                {col.sortable && <span className="mk-sort-arrow">{sortArrow(col.key)}</span>}
              </div>
            ))}
          </div>

          <div className="mk-table-body">
            {initialLoading ? (
              <div className="mk-loading">Loading market data...</div>
            ) : pairs.length === 0 ? (
              <div className="mk-loading">No pairs found</div>
            ) : (
              pairs.map((p, i) => (
                <div
                  key={p.sym}
                  className="mk-row"
                  onClick={() => navigate(`/trade?pair=${p.asset}USDT`)}
                >
                  <div className="mk-cell mk-cell-left mk-cell-name">
                    <div className="mk-idx">{i + 1}</div>
                    {p.img ? (
                      <img className="mk-coin-icon" src={p.img} alt={p.asset} loading="lazy" />
                    ) : (
                      <div className="mk-coin-icon mk-coin-fallback">{p.asset[0]}</div>
                    )}
                    <div className="mk-name-wrap">
                      <span className="mk-sym">{p.asset}/USDT</span>
                      <span className="mk-name-text">{p.name}</span>
                    </div>
                  </div>

                  <div className="mk-cell mk-cell-right mk-cell-price">
                    ${fmtPrice(p.price, p.sym)}
                  </div>

                  <div className="mk-cell mk-cell-right mk-cell-chg">
                    <span className={p.changePct >= 0 ? "mk-green" : "mk-red"}>
                      {fmtPct(p.changePct)}
                    </span>
                  </div>

                  <div className="mk-cell mk-cell-right mk-hide-mobile">
                    ${fmtPrice(p.high24h)}
                  </div>

                  <div className="mk-cell mk-cell-right mk-hide-mobile">
                    ${fmtPrice(p.low24h)}
                  </div>

                  <div className="mk-cell mk-cell-right mk-cell-vol">
                    ${fmtCompact(p.volume24h)}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
