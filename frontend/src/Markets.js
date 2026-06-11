import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { House, BriefcaseBusiness, Store, ShieldUser } from "lucide-react";
import "./markets.css";
import { subscribeAllTickers } from "./services/marketState";

const fmtPrice = (v, sym) => {
  if (v == null || !Number.isFinite(Number(v))) return "-";
  const p = Number(v);
  if (p >= 1000) return p.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  if (p >= 1) return p.toFixed(4);
  return p.toFixed(6);
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
  return (n >= 0 ? "+" : "") + n.toFixed(2) + "%";
};

const QUOTE_ASSETS = ["USDT", "USD", "BTC", "ETH", "BNB"];

const COIN_IMAGES = {
  BTC: "https://assets.coingecko.com/coins/images/1/small/bitcoin.png",
  ETH: "https://assets.coingecko.com/coins/images/279/small/ethereum.png",
  BNB: "https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png",
  SOL: "https://assets.coingecko.com/coins/images/4128/small/solana.png",
  XRP: "https://assets.coingecko.com/coins/images/44/small/xrp-symbol-white-128.png",
  ADA: "https://assets.coingecko.com/coins/images/975/small/cardano.png",
  AVAX: "https://assets.coingecko.com/coins/images/12559/small/Avalanche_Circle_RedWhite_Trans.png",
  DOT: "https://assets.coingecko.com/coins/images/12171/small/polkadot.png",
  DOGE: "https://assets.coingecko.com/coins/images/5/small/dogecoin.png",
  LINK: "https://assets.coingecko.com/coins/images/877/small/chainlink-new-logo.png",
  MATIC: "https://assets.coingecko.com/coins/images/4713/small/polygon.png",
  UNI: "https://assets.coingecko.com/coins/images/12504/small/uniswap-logo.png",
  ATOM: "https://assets.coingecko.com/coins/images/1481/small/cosmos_hub.png",
  LTC: "https://assets.coingecko.com/coins/images/2/small/litecoin.png",
  BCH: "https://assets.coingecko.com/coins/images/780/small/bitcoin-cash-circle.png",
  TRX: "https://assets.coingecko.com/coins/images/1094/small/tron-logo.png",
  APT: "https://assets.coingecko.com/coins/images/26455/small/aptos_round.png",
  SUI: "https://assets.coingecko.com/coins/images/26375/small/sui_asset.png",
  OP: "https://assets.coingecko.com/coins/images/25244/small/Optimism.png",
  ARB: "https://assets.coingecko.com/coins/images/16547/small/photo_2023-03-29_21.47.00.jpeg",
  NEAR: "https://assets.coingecko.com/coins/images/10365/small/near.jpg",
  FIL: "https://assets.coingecko.com/coins/images/12817/small/filecoin.png",
  ALGO: "https://assets.coingecko.com/coins/images/7598/small/algorand.png",
  FTM: "https://assets.coingecko.com/coins/images/10090/small/Opera_Symbol_Circle_Black_Transparent.png",
  STX: "https://assets.coingecko.com/coins/images/2062/small/Stacks_Logo_png.png",
  VET: "https://assets.coingecko.com/coins/images/1167/small/VeChain-Logo-768x768.png",
  HBAR: "https://assets.coingecko.com/coins/5/360px-Hedera_Hashgraph_logo.png",
  ICP: "https://assets.coingecko.com/coins/images/14490/small/Internet_Computer_logo.png",
  AAVE: "https://assets.coingecko.com/coins/images/12645/small/AAVE.png",
  EGLD: "https://assets.coingecko.com/coins/images/12133/small/elrond.png",
  SAND: "https://assets.coingecko.com/coins/images/12141/small/sandbox_logo.jpg",
  AXS: "https://assets.coingecko.com/coins/images/25952/small/photo_2023-09-14_22.28.39.jpeg",
  MANA: "https://assets.coingecko.com/coins/images/12813/small/manana_round.png",
  THETA: "https://assets.coingecko.com/coins/images/25783/small/theta-token-logo.png",
  EOS: "https://assets.coingecko.com/coins/images/738/small/eos-logo.png",
  XTZ: "https://assets.coingecko.com/coins/images/976/small/tezos-logo.png",
  CRV: "https://assets.coingecko.com/coins/images/12124/small/Curve.png",
  SNX: "https://assets.coingecko.com/coins/images/2589/small/SNX.png",
  ENJ: "https://assets.coingecko.com/coins/images/1102/small/enjin-coin-logo.png",
  CHZ: "https://assets.coingecko.com/coins/images/11784/small/chz.png",
  KSM: "https://assets.coingecko.com/coins/images/12171/small/polkadot.png",
  RNDR: "https://assets.coingecko.com/coins/images/11636/small/rndr.png",
  FET: "https://assets.coingecko.com/coins/images/5681/small/Fetch.jpg",
  GALA: "https://assets.coingecko.com/coins/images/12493/small/GALA_token_icon.png",
  IMX: "https://assets.coingecko.com/coins/images/17233/small/ImmutableX_round_2.png",
  MKR: "https://assets.coingecko.com/coins/images/1364/small/Maker_logo.png",
  COMP: "https://assets.coingecko.com/coins/images/10775/small/COMP.png",
  YFI: "https://assets.coingecko.com/coins/images/11849/small/yfi-192x192.png",
  ZIL: "https://assets.coingecko.com/coins/images/2687/small/Zilliqa-logo.png",
  BAT: "https://assets.coingecko.com/coins/images/677/small/basic-attention-token.png",
  ZRX: "https://assets.coingecko.com/coins/images/863/small/0x.png",
  RVN: "https://assets.coingecko.com/coins/images/1012/small/Ravencoin.png",
  IOTA: "https://assets.coingecko.com/coins/images/692/small/IOTA_White_logo.png",
  ANKR: "https://assets.coingecko.com/coins/images/10717/small/ANKR.png",
  HOT: "https://assets.coingecko.com/coins/images/2708/small/hot.png",
  OMG: "https://assets.coingecko.com/coins/images/776/small/OMG_Network.png",
  SC: "https://assets.coingecko.com/coins/images/1342/small/Sia.png",
};

const coinImgUrl = (asset) => COIN_IMAGES[asset] || `/api/coin-icon/${asset}`;

const BLOCKED_SYMBOLS = new Set([
  "0GUSDT","1000CATUSDT","1000CHEEMSUSDT","1000SATSUSDT","AUSDT","ACMUSDT","ACTUSDT","ACXUSDT",
  "AIGENSYNUSDT","AIXBTUSDT","ALLOUSDT","ASTERUSDT","ATUSDT","AVNTUSDT","AWEUSDT",
  "AXLUSDT","BABYUSDT","BANANAS31USDT","BARDUSDT","BANKUSDT","BNSOLUSDT","BOMEUSDT","BREVUSDT",
  "BROCCOLI714USDT","CETUSUSDT","CFGUSDT","CGPTUSDT","CHIPUSDT","COOKIEUSDT","COWUSDT",
  "DUSDT","DOLOUSDT","DYMUSDT","EDENUSDT","ENSOUSDT","EPICUSDT","ERAUSDT","ESPUSDT","EULUSDT",
  "FUSDT","FFUSDT","FOGOUSDT","FORMUSDT","FRAXUSDT","GUSDT","GENIUSUSDT","GIGGLEUSDT","GNOUSDT",
  "GPSUSDT","HAEDALUSDT","HEIUSDT","HEMIUSDT","HOLOUSDT","HOMEUSDT","HYPERUSDT",
  "JTOUSDT","JUPUSDT","KAIAUSDT","KAITOUSDT","KATUSDT","KGSTUSDT","KMNOUSDT",
  "LAUSDT","LAYERUSDT","LINEAUSDT","LUMIAUSDT","MEUSDT","MEGAUSDT","METUSDT","METISUSDT",
  "MIRAUSDT","MITOUSDT","MMTUSDT","MORPHOUSDT","MOVEUSDT","MUBARAKUSDT",
  "NEWTUSDT","NIGHTUSDT","NOMUSDT","NXPCUSDT","ONDOUSDT","OPENUSDT","OPGUSDT","ORCAUSDT",
  "PARTIUSDT","PLUMEUSDT","PNUTUSDT","PROVEUSDT","PUMPUSDT","PYTHUSDT",
  "RENDERUSDT","RESOLVUSDT","RLUSDUSDT","ROBOUSDT","SUSDT","SAHARAUSDT","SAPIENUSDT",
  "SENTUSDT","SHELLUSDT","SIGNUSDT","SOMIUSDT","SOPHUSDT","SPKUSDT","STOUSDT","STRKUSDT",
  "SYRUPUSDT","TNSRUSDT","TOWNSUSDT","TREEUSDT","TRUMPUSDT","TSTUSDT","TURBOUSDT",
  "TURTLEUSDT","TUTUSDT","USDEUSDT","VANRYUSDT","VELODROMEUSDT","VICUSDT","VIRTUALUSDT",
  "WUSDT","WIFUSDT","WLFIUSDT","XAUTUSDT","XPLUSDT","XUSDUSDT",
  "ZAMAUSDT","ZBTUSDT","ZKUSDT","ZKCUSDT","ZKPUSDT","ZROUSDT",
]);

const parseAsset = (sym) => {
  for (const q of QUOTE_ASSETS) {
    if (sym.endsWith(q)) return sym.slice(0, -q.length);
  }
  return sym;
};

export default function Markets() {
  const navigate = useNavigate();
  const location = useLocation();
  const embedded = location.state?.embed;
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
        const asset = parseAsset(sym);
        if (asset && asset.length <= 10 && !BLOCKED_SYMBOLS.has(sym)) {
          map[sym] = t;
        }
      }
      setTickers((prev) => Object.keys(map).length > 0 ? { ...prev, ...map } : prev);
      setInitialLoading(false);
    });
    return unsub;
  }, []);

  const pairs = useMemo(() => {
    const base = Object.entries(tickers).map(([sym, t]) => {
      const asset = parseAsset(sym);
      const vol = Number(t.quoteVol) || Number(t.volume24h) || 0;
      return {
        sym,
        asset,
        name: asset,
        price: Number(t.price) || 0,
        change24h: Number(t.change24h) || 0,
        changePct: Number(t.changePct) || 0,
        high24h: Number(t.high24h) || 0,
        low24h: Number(t.low24h) || 0,
        volume24h: vol,
        img: coinImgUrl(asset),
      };
    });

    const q = search.toLowerCase().trim();
    let filtered = q
      ? base.filter((p) => p.asset.toLowerCase().includes(q) || p.sym.toLowerCase().includes(q))
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
      setSortDir(key === "asset" ? "asc" : "desc");
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
    <div className={`mk-container${embedded ? " mk-embedded" : ""}`}>
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
                    <div className="mk-icon-wrap">
                      <img className="mk-coin-icon" src={p.img} alt={p.asset} loading="lazy" onError={function(e){var t=e.target;if(!t.dataset.retried){t.dataset.retried="1";t.src="/api/coin-icon/"+p.asset}else{t.style.display="none";var n=t.nextElementSibling;if(n)n.classList.remove("mk-icon-fallback-hidden")}}} />
                      <div className="mk-coin-icon mk-icon-fallback mk-icon-fallback-hidden">{p.asset[0]}</div>
                    </div>
                    <div className="mk-name-wrap">
                      <span className="mk-sym">{p.asset}/USDT</span>
                      <span className="mk-name-text">{p.sym}</span>
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

      {embedded && (
        <nav className="mk-bottom-nav">
          <button className="mk-bottom-nav-item" onClick={() => navigate("/", { state: { targetScreen: "home" } })}>
            <span><House size={18} /></span>
            <span>Home</span>
          </button>
          <button className="mk-bottom-nav-item" onClick={() => navigate("/", { state: { targetScreen: "portfolio" } })}>
            <span><BriefcaseBusiness size={18} /></span>
            <span>Portfolio</span>
          </button>
          <button className="mk-bottom-nav-item active">
            <span><Store size={18} /></span>
            <span>Markets</span>
          </button>
          <button className="mk-bottom-nav-item" onClick={() => navigate("/", { state: { targetScreen: "account" } })}>
            <span><ShieldUser size={18} /></span>
            <span>Account</span>
          </button>
        </nav>
      )}
    </div>
  );
}
