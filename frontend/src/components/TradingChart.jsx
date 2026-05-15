import { useState, useEffect, useRef, useCallback, useMemo } from "react";

// ─── Synthetic data generators ───────────────────────────────────────────────

const PAIRS = [
  "BTC/USDT","ETH/USDT","SOL/USDT","BNB/USDT","XRP/USDT",
  "ADA/USDT","AVAX/USDT","DOT/USDT","MATIC/USDT","LINK/USDT",
  "DOGE/USDT","LTC/USDT","ATOM/USDT","UNI/USDT","NEAR/USDT",
  "OP/USDT","ARB/USDT","APT/USDT","FIL/USDT","INJ/USDT",
];

const BASE_PRICES = {
  "BTC/USDT":67420,"ETH/USDT":3540,"SOL/USDT":178,"BNB/USDT":612,
  "XRP/USDT":0.618,"ADA/USDT":0.452,"AVAX/USDT":38.2,"DOT/USDT":7.8,
  "MATIC/USDT":0.71,"LINK/USDT":18.4,"DOGE/USDT":0.162,"LTC/USDT":84.2,
  "ATOM/USDT":9.1,"UNI/USDT":10.8,"NEAR/USDT":7.4,"OP/USDT":2.64,
  "ARB/USDT":1.18,"APT/USDT":10.2,"FIL/USDT":5.8,"INJ/USDT":28.6,
};

const TF_SECONDS = { "1m":60,"5m":300,"15m":900,"1h":3600,"4h":14400,"1d":86400 };

function generateCandles(pair, tf, count = 1000) {
  const interval = TF_SECONDS[tf] || 60;
  const now = Math.floor(Date.now() / 1000);
  const start = Math.floor((now - count * interval) / interval) * interval;
  let price = BASE_PRICES[pair] || 100;
  const vol = price * 0.012;
  const candles = [];

  for (let i = 0; i < count; i++) {
    const time = start + i * interval;
    const drift = (Math.random() - 0.495) * vol;
    const open = price;
    const close = Math.max(open + drift, 0.0001);
    const high = Math.max(open, close) * (1 + Math.random() * 0.005);
    const low  = Math.min(open, close) * (1 - Math.random() * 0.005);
    const volume = (Math.random() * 2 + 0.2) * price * 0.001;
    candles.push({ time, open: +open.toFixed(6), high: +high.toFixed(6), low: +low.toFixed(6), close: +close.toFixed(6), volume: +volume.toFixed(4) });
    price = close;
  }
  return candles;
}

// ─── Technical Indicators ────────────────────────────────────────────────────

function calcSMA(candles, period) {
  return candles.map((c, i) => {
    if (i < period - 1) return null;
    const sum = candles.slice(i - period + 1, i + 1).reduce((s, x) => s + x.close, 0);
    return { time: c.time, value: +(sum / period).toFixed(6) };
  }).filter(Boolean);
}

function calcEMA(candles, period) {
  const k = 2 / (period + 1);
  let ema = candles[0]?.close || 0;
  return candles.map((c, i) => {
    ema = i === 0 ? c.close : c.close * k + ema * (1 - k);
    if (i < period - 1) return null;
    return { time: c.time, value: +ema.toFixed(6) };
  }).filter(Boolean);
}

function calcBB(candles, period = 20, mult = 2) {
  return candles.map((c, i) => {
    if (i < period - 1) return null;
    const slice = candles.slice(i - period + 1, i + 1);
    const mean = slice.reduce((s, x) => s + x.close, 0) / period;
    const std = Math.sqrt(slice.reduce((s, x) => s + (x.close - mean) ** 2, 0) / period);
    return { time: c.time, upper: +(mean + mult * std).toFixed(6), middle: +mean.toFixed(6), lower: +(mean - mult * std).toFixed(6) };
  }).filter(Boolean);
}

function calcRSI(candles, period = 14) {
  let avgGain = 0, avgLoss = 0;
  const result = [];
  for (let i = 1; i < candles.length; i++) {
    const delta = candles[i].close - candles[i - 1].close;
    const gain = Math.max(delta, 0), loss = Math.max(-delta, 0);
    if (i <= period) {
      avgGain += gain / period;
      avgLoss += loss / period;
      if (i === period) result.push({ time: candles[i].time, value: +(100 - 100 / (1 + avgGain / (avgLoss || 0.0001))).toFixed(2) });
    } else {
      avgGain = (avgGain * (period - 1) + gain) / period;
      avgLoss = (avgLoss * (period - 1) + loss) / period;
      result.push({ time: candles[i].time, value: +(100 - 100 / (1 + avgGain / (avgLoss || 0.0001))).toFixed(2) });
    }
  }
  return result;
}

function calcMACD(candles, fast = 12, slow = 26, signal = 9) {
  const emaFast = calcEMA(candles, fast);
  const emaSlow = calcEMA(candles, slow);
  const fastMap = Object.fromEntries(emaFast.map(p => [p.time, p.value]));
  const slowMap = Object.fromEntries(emaSlow.map(p => [p.time, p.value]));
  const macdLine = emaSlow.map(p => ({ time: p.time, value: +(fastMap[p.time] - p.value).toFixed(6) })).filter(p => fastMap[p.time] !== undefined);
  const k = 2 / (signal + 1);
  let sig = macdLine[0]?.value || 0;
  const sigLine = macdLine.map((p, i) => {
    sig = i === 0 ? p.value : p.value * k + sig * (1 - k);
    return { time: p.time, value: +sig.toFixed(6) };
  });
  const histogram = macdLine.map((p, i) => ({ time: p.time, value: +(p.value - (sigLine[i]?.value || 0)).toFixed(6) }));
  return { macdLine, sigLine, histogram };
}

function calcVWAP(candles) {
  let cumVol = 0, cumTPV = 0;
  return candles.map(c => {
    const tp = (c.high + c.low + c.close) / 3;
    cumVol += c.volume;
    cumTPV += tp * c.volume;
    return { time: c.time, value: cumVol > 0 ? +(cumTPV / cumVol).toFixed(6) : c.close };
  });
}

// ─── Canvas Chart Engine ──────────────────────────────────────────────────────

const COLORS = {
  bg: "#0A0E1A",
  bgPanel: "#0D1220",
  bgAlt: "#111827",
  border: "#1E2B3E",
  borderLight: "#1A2535",
  text: "#94A3B8",
  textBright: "#E2E8F0",
  textMuted: "#475569",
  green: "#10B981",
  greenDim: "rgba(16,185,129,0.15)",
  red: "#EF4444",
  redDim: "rgba(239,68,68,0.15)",
  blue: "#3B82F6",
  purple: "#8B5CF6",
  amber: "#F59E0B",
  cyan: "#06B6D4",
  pink: "#EC4899",
  sma: "#F59E0B",
  ema: "#10B981",
  bbUpper: "#3B82F6",
  bbMid: "#8B5CF6",
  bbLow: "#06B6D4",
  vwap: "#EC4899",
  grid: "rgba(30,43,62,0.5)",
  crosshair: "rgba(148,163,184,0.4)",
};

function formatPrice(price, pair = "") {
  if (!price || isNaN(price)) return "—";
  const p = Math.abs(price);
  if (p >= 10000) return price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  if (p >= 100) return price.toFixed(2);
  if (p >= 1) return price.toFixed(4);
  return price.toFixed(6);
}

function formatVol(v) {
  if (v >= 1e9) return (v / 1e9).toFixed(2) + "B";
  if (v >= 1e6) return (v / 1e6).toFixed(2) + "M";
  if (v >= 1e3) return (v / 1e3).toFixed(2) + "K";
  return v.toFixed(2);
}

function formatTime(ts, tf) {
  const d = new Date(ts * 1000);
  if (tf === "1d") return d.toLocaleDateString([], { month: "short", day: "numeric" });
  if (tf === "4h" || tf === "1h") return d.toLocaleDateString([], { month: "short", day: "numeric" }) + " " + d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

// ─── Main Chart Canvas ────────────────────────────────────────────────────────

function CandleChart({ candles, indicators, chartType, tf, pair, rsiData, macdData, showRSI, showMACD }) {
  const canvasRef = useRef(null);
  const stateRef = useRef({ offset: 0, zoom: 1.0, dragging: false, dragStart: 0, dragOffset: 0, mouseX: -1, mouseY: -1, pinchDist: 0 });
  const rafRef = useRef(null);
  const [crosshair, setCrosshair] = useState(null);

  const CHART_WEIGHT = showRSI && showMACD ? 0.55 : (showRSI || showMACD) ? 0.68 : 0.78;
  const VOL_WEIGHT = 0.10;
  const SUB_WEIGHT = 1 - CHART_WEIGHT - VOL_WEIGHT;

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !candles.length) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width, H = canvas.height;
    const dpr = window.devicePixelRatio || 1;

    const mainH = Math.floor(H * CHART_WEIGHT);
    const volH  = Math.floor(H * VOL_WEIGHT);
    const rsiH  = (showRSI && !showMACD) ? Math.floor(H * SUB_WEIGHT) : showRSI ? Math.floor(H * SUB_WEIGHT * 0.5) : 0;
    const macdH = (showMACD && !showRSI) ? Math.floor(H * SUB_WEIGHT) : showMACD ? Math.floor(H * SUB_WEIGHT * 0.5) : 0;

    const PRICE_AXIS_W = 90;
    const TIME_AXIS_H  = 28;
    const plotW = W - PRICE_AXIS_W;

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = COLORS.bg;
    ctx.fillRect(0, 0, W, H);

    const st = stateRef.current;
    const visibleCount = Math.max(10, Math.floor(plotW / (8 * st.zoom)));
    const totalCandles = candles.length;
    const maxOffset = Math.max(0, totalCandles - visibleCount);
    st.offset = Math.max(0, Math.min(st.offset, maxOffset));

    const startIdx = Math.max(0, totalCandles - visibleCount - st.offset);
    const endIdx   = Math.max(0, totalCandles - st.offset);
    const visible  = candles.slice(startIdx, endIdx);
    if (!visible.length) return;

    const candleW = plotW / visible.length;
    const bodyW   = Math.max(1, candleW * 0.6);

    // ── Price range ──
    let pMin = Infinity, pMax = -Infinity;
    visible.forEach(c => { if (c.low < pMin) pMin = c.low; if (c.high > pMax) pMax = c.high; });
    const bbArr = indicators.bb;
    if (bbArr?.length) {
      const visibleBB = bbArr.filter(b => b.time >= visible[0].time && b.time <= visible[visible.length-1].time);
      visibleBB.forEach(b => { if (b.upper > pMax) pMax = b.upper; if (b.lower < pMin) pMin = b.lower; });
    }
    const pPad = (pMax - pMin) * 0.06;
    pMin -= pPad; pMax += pPad;
    if (pMin === pMax) { pMin -= 1; pMax += 1; }

    const toY = (p, top, h) => top + h - ((p - pMin) / (pMax - pMin)) * h;
    const toX = (i) => i * candleW + candleW / 2;

    // ── Grid lines ──
    const gridCount = 6;
    ctx.strokeStyle = COLORS.grid;
    ctx.lineWidth = 0.5;
    for (let g = 0; g <= gridCount; g++) {
      const y = Math.floor(mainH * g / gridCount) + 0.5;
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }
    for (let g = 0; g < visible.length; g += Math.max(1, Math.floor(visible.length / 8))) {
      const x = Math.floor(toX(g)) + 0.5;
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, mainH); ctx.stroke();
    }

    // ── Price axis labels ──
    ctx.fillStyle = COLORS.text;
    ctx.font = `11px 'JetBrains Mono', 'Fira Code', monospace`;
    ctx.textAlign = "right";
    for (let g = 0; g <= gridCount; g++) {
      const p = pMin + (pMax - pMin) * (1 - g / gridCount);
      const y = Math.floor(mainH * g / gridCount);
      ctx.fillText(formatPrice(p), W - 4, y + 4);
    }

    // ── Bollinger Bands ──
    if (indicators.bb?.length) {
      const visibleBB = bbArr.filter(b => b.time >= visible[0].time && b.time <= visible[visible.length-1].time);
      const drawBBLine = (key, color) => {
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        visibleBB.forEach((b, i) => {
          const ci = visible.findIndex(c => c.time === b.time);
          if (ci < 0) return;
          const x = toX(ci), y = toY(b[key], 0, mainH);
          i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        });
        ctx.stroke();
      };
      // Fill band
      ctx.beginPath();
      visibleBB.forEach((b, i) => {
        const ci = visible.findIndex(c => c.time === b.time);
        if (ci < 0) return;
        i === 0 ? ctx.moveTo(toX(ci), toY(b.upper, 0, mainH)) : ctx.lineTo(toX(ci), toY(b.upper, 0, mainH));
      });
      [...visibleBB].reverse().forEach(b => {
        const ci = visible.findIndex(c => c.time === b.time);
        if (ci < 0) return;
        ctx.lineTo(toX(ci), toY(b.lower, 0, mainH));
      });
      ctx.fillStyle = "rgba(59,130,246,0.04)";
      ctx.fill();
      drawBBLine("upper", COLORS.bbUpper);
      drawBBLine("middle", COLORS.bbMid);
      drawBBLine("lower", COLORS.bbLow);
    }

    // ── SMA ──
    if (indicators.sma?.length) {
      const visSMA = indicators.sma.filter(p => p.time >= visible[0].time && p.time <= visible[visible.length-1].time);
      ctx.beginPath();
      ctx.strokeStyle = COLORS.sma;
      ctx.lineWidth = 1.5;
      visSMA.forEach((p, i) => {
        const ci = visible.findIndex(c => c.time === p.time);
        if (ci < 0) return;
        i === 0 ? ctx.moveTo(toX(ci), toY(p.value, 0, mainH)) : ctx.lineTo(toX(ci), toY(p.value, 0, mainH));
      });
      ctx.stroke();
    }

    // ── EMA ──
    if (indicators.ema?.length) {
      const visEMA = indicators.ema.filter(p => p.time >= visible[0].time && p.time <= visible[visible.length-1].time);
      ctx.beginPath();
      ctx.strokeStyle = COLORS.ema;
      ctx.lineWidth = 1.5;
      visEMA.forEach((p, i) => {
        const ci = visible.findIndex(c => c.time === p.time);
        if (ci < 0) return;
        i === 0 ? ctx.moveTo(toX(ci), toY(p.value, 0, mainH)) : ctx.lineTo(toX(ci), toY(p.value, 0, mainH));
      });
      ctx.stroke();
    }

    // ── VWAP ──
    if (indicators.vwap?.length) {
      const visVWAP = indicators.vwap.filter(p => p.time >= visible[0].time && p.time <= visible[visible.length-1].time);
      ctx.beginPath();
      ctx.strokeStyle = COLORS.vwap;
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      visVWAP.forEach((p, i) => {
        const ci = visible.findIndex(c => c.time === p.time);
        if (ci < 0) return;
        i === 0 ? ctx.moveTo(toX(ci), toY(p.value, 0, mainH)) : ctx.lineTo(toX(ci), toY(p.value, 0, mainH));
      });
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // ── Candles / Line / Area ──
    if (chartType === "line" || chartType === "area") {
      if (chartType === "area") {
        ctx.beginPath();
        visible.forEach((c, i) => {
          const x = toX(i), y = toY(c.close, 0, mainH);
          i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        });
        ctx.lineTo(toX(visible.length - 1), mainH);
        ctx.lineTo(toX(0), mainH);
        ctx.closePath();
        const grad = ctx.createLinearGradient(0, 0, 0, mainH);
        grad.addColorStop(0, "rgba(59,130,246,0.3)");
        grad.addColorStop(1, "rgba(59,130,246,0.01)");
        ctx.fillStyle = grad;
        ctx.fill();
      }
      ctx.beginPath();
      ctx.strokeStyle = COLORS.blue;
      ctx.lineWidth = 2;
      visible.forEach((c, i) => {
        const x = toX(i), y = toY(c.close, 0, mainH);
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      });
      ctx.stroke();
    } else {
      visible.forEach((c, i) => {
        const isGreen = c.close >= c.open;
        const col = isGreen ? COLORS.green : COLORS.red;
        const x = toX(i);
        const openY  = toY(c.open, 0, mainH);
        const closeY = toY(c.close, 0, mainH);
        const highY  = toY(c.high, 0, mainH);
        const lowY   = toY(c.low, 0, mainH);

        if (chartType === "bar") {
          ctx.strokeStyle = col;
          ctx.lineWidth = Math.max(1, bodyW * 0.5);
          ctx.beginPath();
          ctx.moveTo(x, highY);
          ctx.lineTo(x, lowY);
          ctx.stroke();
          ctx.lineWidth = Math.max(1, bodyW * 0.4);
          ctx.beginPath();
          ctx.moveTo(x - bodyW * 0.5, openY);
          ctx.lineTo(x, openY);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(x, closeY);
          ctx.lineTo(x + bodyW * 0.5, closeY);
          ctx.stroke();
        } else {
          const bTop = Math.min(openY, closeY);
          const bH   = Math.max(1, Math.abs(openY - closeY));
          const hw   = bodyW / 2;
          // Wick
          ctx.strokeStyle = col;
          ctx.lineWidth = Math.max(1, Math.min(1.5, candleW * 0.08));
          ctx.beginPath(); ctx.moveTo(x, highY); ctx.lineTo(x, bTop); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(x, bTop + bH); ctx.lineTo(x, lowY); ctx.stroke();
          // Body
          if (isGreen) {
            ctx.fillStyle = candleW > 4 ? COLORS.green : col;
            ctx.strokeStyle = COLORS.green;
          } else {
            ctx.fillStyle = candleW > 4 ? COLORS.red : col;
            ctx.strokeStyle = COLORS.red;
          }
          ctx.lineWidth = 1;
          if (candleW > 3) {
            ctx.fillRect(x - hw, bTop, bodyW, bH);
          } else {
            ctx.fillRect(x - 0.5, bTop, 1, bH);
          }
        }
      });
    }

    // ── Volume ──
    const volTop = mainH;
    const volBottom = mainH + volH;
    const volPlotH = volH - TIME_AXIS_H;

    ctx.fillStyle = COLORS.border;
    ctx.fillRect(0, volTop, plotW, 0.5);

    let vMax = 0;
    visible.forEach(c => { if (c.volume > vMax) vMax = c.volume; });
    if (vMax === 0) vMax = 1;

    visible.forEach((c, i) => {
      const isGreen = c.close >= c.open;
      const barH = Math.max(1, (c.volume / vMax) * volPlotH);
      const x = toX(i);
      const hw = Math.max(0.5, bodyW / 2);
      ctx.fillStyle = isGreen ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.3)";
      ctx.fillRect(x - hw, volTop + volPlotH - barH, bodyW, barH);
    });

    // Volume axis label
    ctx.fillStyle = COLORS.textMuted;
    ctx.font = "10px monospace";
    ctx.textAlign = "right";
    ctx.fillText(formatVol(vMax), W - 4, volTop + 12);

    // ── Time axis ──
    ctx.fillStyle = COLORS.text;
    ctx.font = "10px monospace";
    ctx.textAlign = "center";
    const timeStep = Math.max(1, Math.floor(visible.length / 8));
    for (let i = 0; i < visible.length; i += timeStep) {
      const x = toX(i);
      if (x > plotW - 20) continue;
      ctx.fillText(formatTime(visible[i].time, tf), x, volBottom - 6);
    }

    // ── RSI panel ──
    if (showRSI && rsiData?.length) {
      const rsiTop = mainH + volH;
      const rsiBottom = rsiTop + rsiH;
      const rsiPlotH = rsiH - TIME_AXIS_H;

      ctx.fillStyle = COLORS.border;
      ctx.fillRect(0, rsiTop, plotW, 0.5);

      // Background
      ctx.fillStyle = "rgba(13,18,32,0.5)";
      ctx.fillRect(0, rsiTop, plotW, rsiH);

      // Label
      ctx.fillStyle = COLORS.textMuted;
      ctx.font = "10px monospace";
      ctx.textAlign = "left";
      ctx.fillText("RSI(14)", 6, rsiTop + 13);

      const visRSI = rsiData.filter(p => p.time >= visible[0].time && p.time <= visible[visible.length-1].time);
      const rsiToY = (v) => rsiTop + rsiPlotH - ((v - 0) / 100) * rsiPlotH;

      // OB/OS zones
      ctx.fillStyle = "rgba(239,68,68,0.07)";
      ctx.fillRect(0, rsiTop, plotW, rsiToY(70) - rsiTop);
      ctx.fillStyle = "rgba(16,185,129,0.07)";
      ctx.fillRect(0, rsiToY(30), plotW, rsiPlotH - (rsiToY(30) - rsiTop));

      // Lines
      [70, 50, 30].forEach(level => {
        ctx.strokeStyle = level === 50 ? COLORS.border : (level === 70 ? "rgba(239,68,68,0.3)" : "rgba(16,185,129,0.3)");
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        const y = rsiToY(level);
        ctx.moveTo(0, y); ctx.lineTo(plotW, y); ctx.stroke();
        ctx.fillStyle = COLORS.textMuted;
        ctx.font = "9px monospace";
        ctx.textAlign = "right";
        ctx.fillText(level, W - 4, y + 3);
      });

      // RSI line
      ctx.beginPath();
      ctx.strokeStyle = COLORS.amber;
      ctx.lineWidth = 1.5;
      visRSI.forEach((p, i) => {
        const ci = visible.findIndex(c => c.time === p.time);
        if (ci < 0) return;
        const x = toX(ci), y = rsiToY(p.value);
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      });
      ctx.stroke();

      if (visRSI.length) {
        const last = visRSI[visRSI.length - 1];
        const col = last.value > 70 ? COLORS.red : last.value < 30 ? COLORS.green : COLORS.amber;
        ctx.fillStyle = col;
        ctx.font = "bold 10px monospace";
        ctx.textAlign = "left";
        ctx.fillText(last.value.toFixed(1), 50, rsiTop + 13);
      }
    }

    // ── MACD panel ──
    if (showMACD && macdData) {
      const macdTop = mainH + volH + (showRSI ? rsiH : 0);
      const macdBottom = macdTop + macdH;
      const macdPlotH = macdH - TIME_AXIS_H;

      ctx.fillStyle = COLORS.border;
      ctx.fillRect(0, macdTop, plotW, 0.5);

      ctx.fillStyle = "rgba(13,18,32,0.5)";
      ctx.fillRect(0, macdTop, plotW, macdH);

      ctx.fillStyle = COLORS.textMuted;
      ctx.font = "10px monospace";
      ctx.textAlign = "left";
      ctx.fillText("MACD(12,26,9)", 6, macdTop + 13);

      const visMACD = (macdData.histogram || []).filter(p => p.time >= visible[0].time && p.time <= visible[visible.length-1].time);
      const visMACDLine = (macdData.macdLine || []).filter(p => p.time >= visible[0].time && p.time <= visible[visible.length-1].time);
      const visSigLine = (macdData.sigLine || []).filter(p => p.time >= visible[0].time && p.time <= visible[visible.length-1].time);

      let mMin = Infinity, mMax = -Infinity;
      visMACD.forEach(p => { if (p.value < mMin) mMin = p.value; if (p.value > mMax) mMax = p.value; });
      const mAbs = Math.max(Math.abs(mMin), Math.abs(mMax)) || 1;
      const mToY = (v) => macdTop + macdPlotH / 2 - (v / mAbs) * (macdPlotH / 2);

      // Zero line
      ctx.strokeStyle = COLORS.border;
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(0, macdTop + macdPlotH / 2);
      ctx.lineTo(plotW, macdTop + macdPlotH / 2);
      ctx.stroke();

      // Histogram
      visMACD.forEach(p => {
        const ci = visible.findIndex(c => c.time === p.time);
        if (ci < 0) return;
        const x = toX(ci);
        const hw = Math.max(0.5, bodyW / 2);
        const zeroY = macdTop + macdPlotH / 2;
        const barTop = Math.min(mToY(p.value), zeroY);
        const barH = Math.abs(mToY(p.value) - zeroY);
        ctx.fillStyle = p.value >= 0 ? "rgba(16,185,129,0.5)" : "rgba(239,68,68,0.5)";
        ctx.fillRect(x - hw, barTop, bodyW, Math.max(1, barH));
      });

      // MACD line
      const drawLine = (data, color) => {
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5;
        data.forEach((p, i) => {
          const ci = visible.findIndex(c => c.time === p.time);
          if (ci < 0) return;
          i === 0 ? ctx.moveTo(toX(ci), mToY(p.value)) : ctx.lineTo(toX(ci), mToY(p.value));
        });
        ctx.stroke();
      };
      drawLine(visMACDLine, COLORS.blue);
      drawLine(visSigLine, COLORS.red);
    }

    // ── Crosshair & tooltip ──
    const mx = stateRef.current.mouseX;
    const my = stateRef.current.mouseY;

    if (mx >= 0 && mx <= plotW && my >= 0 && my <= H) {
      ctx.strokeStyle = COLORS.crosshair;
      ctx.lineWidth = 0.5;
      ctx.setLineDash([4, 4]);
      ctx.beginPath(); ctx.moveTo(mx, 0); ctx.lineTo(mx, mainH); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, my); ctx.lineTo(plotW, my); ctx.stroke();
      ctx.setLineDash([]);

      // Hover candle index
      const ci = Math.floor(mx / candleW);
      if (ci >= 0 && ci < visible.length) {
        const c = visible[ci];
        const isGreen = c.close >= c.open;
        const chg = ((c.close - c.open) / c.open * 100).toFixed(2);

        // Tooltip box
        const ttW = 190, ttH = showRSI || showMACD ? 160 : 130;
        let ttX = mx + 12, ttY = 12;
        if (ttX + ttW > W) ttX = mx - ttW - 12;
        if (ttY + ttH > mainH) ttY = mainH - ttH - 4;

        ctx.fillStyle = "rgba(13,18,32,0.95)";
        ctx.strokeStyle = COLORS.border;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(ttX, ttY, ttW, ttH, 6);
        ctx.fill();
        ctx.stroke();

        ctx.font = "bold 11px monospace";
        ctx.textAlign = "left";
        ctx.fillStyle = COLORS.textBright;
        ctx.fillText(formatTime(c.time, tf), ttX + 10, ttY + 18);

        const rows = [
          { label: "O", value: formatPrice(c.open), color: COLORS.text },
          { label: "H", value: formatPrice(c.high), color: COLORS.green },
          { label: "L", value: formatPrice(c.low), color: COLORS.red },
          { label: "C", value: formatPrice(c.close), color: isGreen ? COLORS.green : COLORS.red },
          { label: "V", value: formatVol(c.volume), color: COLORS.text },
          { label: "Chg", value: `${chg >= 0 ? "+" : ""}${chg}%`, color: isGreen ? COLORS.green : COLORS.red },
        ];

        rows.forEach((row, i) => {
          ctx.font = "10px monospace";
          ctx.fillStyle = COLORS.textMuted;
          ctx.fillText(row.label, ttX + 10, ttY + 36 + i * 18);
          ctx.fillStyle = row.color;
          ctx.textAlign = "right";
          ctx.fillText(row.value, ttX + ttW - 10, ttY + 36 + i * 18);
          ctx.textAlign = "left";
        });

        // Price tag on axis
        const priceY = Math.max(6, Math.min(mainH - 4, my));
        const priceAtY = pMin + (pMax - pMin) * (1 - (my) / mainH);
        ctx.fillStyle = COLORS.blue;
        ctx.fillRect(plotW, priceY - 9, PRICE_AXIS_W, 18);
        ctx.fillStyle = "#fff";
        ctx.font = "bold 10px monospace";
        ctx.textAlign = "center";
        ctx.fillText(formatPrice(priceAtY), plotW + PRICE_AXIS_W / 2, priceY + 4);
        ctx.textAlign = "left";
      }
    }

    // ── Last price line ──
    const lastC = visible[visible.length - 1];
    if (lastC) {
      const lastY = Math.max(2, Math.min(mainH - 2, toY(lastC.close, 0, mainH)));
      const isGreen = lastC.close >= lastC.open;
      ctx.strokeStyle = isGreen ? COLORS.green : COLORS.red;
      ctx.lineWidth = 0.75;
      ctx.setLineDash([3, 5]);
      ctx.beginPath(); ctx.moveTo(0, lastY); ctx.lineTo(plotW, lastY); ctx.stroke();
      ctx.setLineDash([]);
      // Price badge
      ctx.fillStyle = isGreen ? COLORS.green : COLORS.red;
      ctx.fillRect(plotW, lastY - 9, PRICE_AXIS_W, 18);
      ctx.fillStyle = "#fff";
      ctx.font = "bold 10px monospace";
      ctx.textAlign = "center";
      ctx.fillText(formatPrice(lastC.close), plotW + PRICE_AXIS_W / 2, lastY + 4);
      ctx.textAlign = "left";
    }

  }, [candles, indicators, chartType, tf, pair, rsiData, macdData, showRSI, showMACD, CHART_WEIGHT, VOL_WEIGHT, SUB_WEIGHT]);

  // RAF loop
  useEffect(() => {
    let alive = true;
    const loop = () => {
      if (!alive) return;
      draw();
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => { alive = false; cancelAnimationFrame(rafRef.current); };
  }, [draw]);

  // Resize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let frameId = null;
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const parent = canvas.parentElement;
      if (!parent) return;
      const w = parent.clientWidth || 800;
      const h = parent.clientHeight || 500;
      const newWidth = w * dpr;
      const newHeight = h * dpr;
      if (canvas.width === newWidth && canvas.height === newHeight && canvas.style.width === `${w}px` && canvas.style.height === `${h}px`) {
        return;
      }
      canvas.width = newWidth;
      canvas.height = newHeight;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const scheduleResize = () => {
      if (frameId !== null) cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(resize);
    };
    scheduleResize();
    const ro = new ResizeObserver(() => scheduleResize());
    if (canvas.parentElement) ro.observe(canvas.parentElement);
    return () => {
      ro.disconnect();
      if (frameId !== null) cancelAnimationFrame(frameId);
    };
  }, []);

  // Mouse events
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const st = stateRef.current;

    const getPos = (e) => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      return { x: (e.clientX - rect.left), y: (e.clientY - rect.top) };
    };

    const onMove = (e) => {
      const { x, y } = getPos(e);
      st.mouseX = x; st.mouseY = y;
      if (st.dragging) {
        const delta = x - st.dragStart;
        const candleW = (canvas.width / window.devicePixelRatio - 90) / Math.max(10, Math.floor((canvas.width / window.devicePixelRatio - 90) / (8 * st.zoom)));
        st.offset = Math.max(0, st.dragOffset - Math.round(delta / candleW));
      }
    };

    const onDown = (e) => {
      st.dragging = true;
      st.dragStart = getPos(e).x;
      st.dragOffset = st.offset;
      canvas.style.cursor = "grabbing";
    };

    const onUp = () => { st.dragging = false; canvas.style.cursor = "crosshair"; };

    const onWheel = (e) => {
      e.preventDefault();
      const oldZoom = st.zoom;
      st.zoom = Math.max(0.3, Math.min(5, st.zoom * (e.deltaY > 0 ? 0.9 : 1.1)));
    };

    const onLeave = () => { st.mouseX = -1; st.mouseY = -1; };

    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("mousedown", onDown);
    canvas.addEventListener("mouseup", onUp);
    canvas.addEventListener("mouseleave", onLeave);
    canvas.addEventListener("wheel", onWheel, { passive: false });
    document.addEventListener("mouseup", onUp);

    return () => {
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mousedown", onDown);
      canvas.removeEventListener("mouseup", onUp);
      canvas.removeEventListener("mouseleave", onLeave);
      canvas.removeEventListener("wheel", onWheel);
      document.removeEventListener("mouseup", onUp);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ display: "block", cursor: "crosshair", width: "100%", height: "100%" }}
    />
  );
}

// ─── Order Book Component ─────────────────────────────────────────────────────

function OrderBook({ pair, lastPrice }) {
  const [book, setBook] = useState({ bids: [], asks: [] });

  useEffect(() => {
    const basePrice = lastPrice || BASE_PRICES[pair] || 100;
    const generate = () => {
      const bids = Array.from({ length: 14 }, (_, i) => {
        const p = basePrice * (1 - (i + 1) * 0.0003 - Math.random() * 0.0002);
        const s = +(Math.random() * 3 + 0.1).toFixed(4);
        return { price: +p.toFixed(6), size: s, total: +(p * s).toFixed(2) };
      });
      const asks = Array.from({ length: 14 }, (_, i) => {
        const p = basePrice * (1 + (i + 1) * 0.0003 + Math.random() * 0.0002);
        const s = +(Math.random() * 3 + 0.1).toFixed(4);
        return { price: +p.toFixed(6), size: s, total: +(p * s).toFixed(2) };
      });
      setBook({ bids, asks });
    };
    generate();
    const iv = setInterval(generate, 800);
    return () => clearInterval(iv);
  }, [pair, lastPrice]);

  const maxBidTotal = Math.max(...book.bids.map(b => b.total), 1);
  const maxAskTotal = Math.max(...book.asks.map(a => a.total), 1);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", padding: "4px 8px", fontSize: 10, color: COLORS.textMuted, borderBottom: `1px solid ${COLORS.border}` }}>
        <span>Price</span><span style={{ textAlign: "center" }}>Size</span><span style={{ textAlign: "right" }}>Total</span>
      </div>
      <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        {/* Asks reversed */}
        <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
          {[...book.asks].reverse().map((a, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", padding: "1px 8px", fontSize: 11, fontFamily: "monospace", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: `${(a.total / maxAskTotal) * 100}%`, background: "rgba(239,68,68,0.07)" }} />
              <span style={{ color: COLORS.red, zIndex: 1 }}>{formatPrice(a.price)}</span>
              <span style={{ textAlign: "center", color: COLORS.text, zIndex: 1 }}>{a.size.toFixed(4)}</span>
              <span style={{ textAlign: "right", color: COLORS.textMuted, zIndex: 1 }}>{a.total.toFixed(0)}</span>
            </div>
          ))}
        </div>
        {/* Spread */}
        <div style={{ padding: "4px 8px", background: COLORS.bgAlt, fontSize: 11, fontFamily: "monospace", display: "flex", justifyContent: "space-between", borderTop: `1px solid ${COLORS.border}`, borderBottom: `1px solid ${COLORS.border}` }}>
          <span style={{ color: COLORS.green, fontWeight: 700 }}>{formatPrice(lastPrice)}</span>
          <span style={{ color: COLORS.textMuted }}>Spread: {book.asks[0] && book.bids[0] ? formatPrice(book.asks[0].price - book.bids[0].price) : "—"}</span>
        </div>
        {/* Bids */}
        <div style={{ flex: 1, overflow: "hidden" }}>
          {book.bids.map((b, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", padding: "1px 8px", fontSize: 11, fontFamily: "monospace", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: `${(b.total / maxBidTotal) * 100}%`, background: "rgba(16,185,129,0.07)" }} />
              <span style={{ color: COLORS.green, zIndex: 1 }}>{formatPrice(b.price)}</span>
              <span style={{ textAlign: "center", color: COLORS.text, zIndex: 1 }}>{b.size.toFixed(4)}</span>
              <span style={{ textAlign: "right", color: COLORS.textMuted, zIndex: 1 }}>{b.total.toFixed(0)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Trades Feed ──────────────────────────────────────────────────────────────

function TradesFeed({ pair, lastPrice }) {
  const [trades, setTrades] = useState([]);

  useEffect(() => {
    const base = lastPrice || BASE_PRICES[pair] || 100;
    const generate = () => {
      const side = Math.random() > 0.5 ? "buy" : "sell";
      const price = base * (1 + (Math.random() - 0.5) * 0.001);
      const size = +(Math.random() * 2 + 0.01).toFixed(5);
      setTrades(prev => [{ price: +price.toFixed(6), size, side, time: Date.now() }, ...prev.slice(0, 39)]);
    };
    const iv = setInterval(generate, 400 + Math.random() * 600);
    return () => clearInterval(iv);
  }, [pair, lastPrice]);

  return (
    <div style={{ height: "100%", overflow: "hidden" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", padding: "4px 8px", fontSize: 10, color: COLORS.textMuted, borderBottom: `1px solid ${COLORS.border}` }}>
        <span>Price</span><span style={{ textAlign: "center" }}>Size</span><span style={{ textAlign: "right" }}>Time</span>
      </div>
      <div style={{ overflow: "hidden", height: "calc(100% - 25px)" }}>
        {trades.map((t, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", padding: "1px 8px", fontSize: 11, fontFamily: "monospace" }}>
            <span style={{ color: t.side === "buy" ? COLORS.green : COLORS.red }}>{formatPrice(t.price)}</span>
            <span style={{ textAlign: "center", color: COLORS.text }}>{t.size.toFixed(4)}</span>
            <span style={{ textAlign: "right", color: COLORS.textMuted }}>{new Date(t.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Order Form ───────────────────────────────────────────────────────────────

function OrderForm({ pair, lastPrice }) {
  const [side, setSide] = useState("buy");
  const [type, setType] = useState("limit");
  const [price, setPrice] = useState("");
  const [qty, setQty] = useState("");
  const [sl, setSl] = useState("");
  const [tp, setTp] = useState("");
  const [orders, setOrders] = useState([]);
  const [pct, setPct] = useState(0);

  useEffect(() => {
    setPrice((lastPrice || BASE_PRICES[pair] || 100).toFixed(6));
  }, [pair, lastPrice]);

  const balance = 12450.25;
  const total = (parseFloat(price) || 0) * (parseFloat(qty) || 0);

  const submit = () => {
    if (!qty || !price) return;
    setOrders(prev => [{
      id: Math.random().toString(36).slice(2, 8).toUpperCase(),
      pair, side, type,
      price: parseFloat(price),
      qty: parseFloat(qty),
      status: type === "market" ? "filled" : "open",
      time: Date.now(),
    }, ...prev.slice(0, 9)]);
    setQty("");
    setPct(0);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: "8px 10px", height: "100%", overflow: "auto" }}>
      {/* Side */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}>
        <button onClick={() => setSide("buy")} style={{ padding: "7px 0", borderRadius: 4, border: `1px solid ${side==="buy" ? COLORS.green : COLORS.border}`, background: side==="buy" ? "rgba(16,185,129,0.15)" : "transparent", color: side==="buy" ? COLORS.green : COLORS.text, cursor: "pointer", fontWeight: 700, fontSize: 12 }}>BUY</button>
        <button onClick={() => setSide("sell")} style={{ padding: "7px 0", borderRadius: 4, border: `1px solid ${side==="sell" ? COLORS.red : COLORS.border}`, background: side==="sell" ? "rgba(239,68,68,0.15)" : "transparent", color: side==="sell" ? COLORS.red : COLORS.text, cursor: "pointer", fontWeight: 700, fontSize: 12 }}>SELL</button>
      </div>

      {/* Type */}
      <div style={{ display: "flex", gap: 4 }}>
        {["market","limit","stop"].map(t => (
          <button key={t} onClick={() => setType(t)} style={{ flex: 1, padding: "4px 0", borderRadius: 4, border: `1px solid ${type===t ? COLORS.blue : COLORS.border}`, background: type===t ? "rgba(59,130,246,0.15)" : "transparent", color: type===t ? COLORS.blue : COLORS.textMuted, cursor: "pointer", fontSize: 10, fontWeight: 600 }}>{t.toUpperCase()}</button>
        ))}
      </div>

      {type !== "market" && (
        <div>
          <div style={{ fontSize: 10, color: COLORS.textMuted, marginBottom: 3 }}>Price (USDT)</div>
          <input value={price} onChange={e => setPrice(e.target.value)} style={{ width: "100%", background: COLORS.bgAlt, border: `1px solid ${COLORS.border}`, color: COLORS.textBright, padding: "5px 8px", borderRadius: 4, fontSize: 12, fontFamily: "monospace", boxSizing: "border-box" }} />
        </div>
      )}

      <div>
        <div style={{ fontSize: 10, color: COLORS.textMuted, marginBottom: 3 }}>Amount ({pair.split("/")[0]})</div>
        <input value={qty} onChange={e => setQty(e.target.value)} placeholder="0.00" style={{ width: "100%", background: COLORS.bgAlt, border: `1px solid ${COLORS.border}`, color: COLORS.textBright, padding: "5px 8px", borderRadius: 4, fontSize: 12, fontFamily: "monospace", boxSizing: "border-box" }} />
      </div>

      {/* Percent buttons */}
      <div style={{ display: "flex", gap: 4 }}>
        {[25,50,75,100].map(p => (
          <button key={p} onClick={() => { setPct(p); const maxQty = (balance * p / 100) / (parseFloat(price)||1); setQty(maxQty.toFixed(4)); }} style={{ flex: 1, padding: "3px 0", borderRadius: 4, border: `1px solid ${pct===p ? COLORS.blue : COLORS.border}`, background: pct===p ? "rgba(59,130,246,0.15)" : "transparent", color: pct===p ? COLORS.blue : COLORS.textMuted, cursor: "pointer", fontSize: 10 }}>{p}%</button>
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10 }}>
        <span style={{ color: COLORS.textMuted }}>Total</span>
        <span style={{ color: COLORS.textBright, fontFamily: "monospace" }}>${total.toFixed(2)}</span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10 }}>
        <span style={{ color: COLORS.textMuted }}>Available</span>
        <span style={{ color: COLORS.textBright, fontFamily: "monospace" }}>${balance.toLocaleString()}</span>
      </div>

      <button onClick={submit} style={{ padding: "8px 0", borderRadius: 4, border: "none", background: side==="buy" ? COLORS.green : COLORS.red, color: "#fff", cursor: "pointer", fontWeight: 700, fontSize: 13, marginTop: 2 }}>
        {side === "buy" ? "BUY" : "SELL"} {pair.split("/")[0]}
      </button>

      {/* Recent orders */}
      {orders.length > 0 && (
        <div style={{ borderTop: `1px solid ${COLORS.border}`, paddingTop: 6, marginTop: 2 }}>
          <div style={{ fontSize: 10, color: COLORS.textMuted, marginBottom: 4 }}>RECENT ORDERS</div>
          {orders.slice(0, 4).map(o => (
            <div key={o.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 10, fontFamily: "monospace", padding: "2px 0", borderBottom: `1px solid ${COLORS.borderLight}` }}>
              <span style={{ color: o.side==="buy" ? COLORS.green : COLORS.red }}>{o.id}</span>
              <span style={{ color: COLORS.text }}>{o.qty.toFixed(4)}</span>
              <span style={{ color: o.status==="filled" ? COLORS.textMuted : COLORS.amber }}>{o.status}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Pair Selector ────────────────────────────────────────────────────────────

function PairSelector({ selected, onSelect }) {
  const [search, setSearch] = useState("");
  const [changes] = useState(() => Object.fromEntries(PAIRS.map(p => [p, +((Math.random()-0.48)*8).toFixed(2)])));

  const filtered = PAIRS.filter(p => p.includes(search.toUpperCase()));

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "6px 8px" }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search pair..." style={{ width: "100%", background: COLORS.bgAlt, border: `1px solid ${COLORS.border}`, color: COLORS.textBright, padding: "5px 8px", borderRadius: 4, fontSize: 11, boxSizing: "border-box" }} />
      </div>
      <div style={{ flex: 1, overflow: "auto" }}>
        {filtered.map(p => {
          const chg = changes[p] || 0;
          const price = BASE_PRICES[p] || 0;
          return (
            <div key={p} onClick={() => onSelect(p)} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "5px 10px", cursor: "pointer", background: p === selected ? "rgba(59,130,246,0.1)" : "transparent", borderLeft: p === selected ? `2px solid ${COLORS.blue}` : "2px solid transparent", transition: "background 0.1s" }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: p === selected ? COLORS.blue : COLORS.textBright }}>{p}</div>
                <div style={{ fontSize: 10, fontFamily: "monospace", color: COLORS.textMuted }}>{formatPrice(price)}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 11, fontFamily: "monospace", color: chg >= 0 ? COLORS.green : COLORS.red, fontWeight: 600 }}>{chg >= 0 ? "+" : ""}{chg}%</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────

export default function TradingTerminal() {
  const [pair, setPair] = useState("BTC/USDT");
  const [tf, setTf] = useState("1m");
  const [chartType, setChartType] = useState("candlestick");
  const [showSMA, setShowSMA] = useState(false);
  const [showEMA, setShowEMA] = useState(false);
  const [showBB, setShowBB] = useState(false);
  const [showRSI, setShowRSI] = useState(false);
  const [showMACD, setShowMACD] = useState(false);
  const [showVWAP, setShowVWAP] = useState(false);
  const [rightPanel, setRightPanel] = useState("orderbook");
  const [candles, setCandles] = useState([]);
  const [livePrice, setLivePrice] = useState(0);
  const [change24h, setChange24h] = useState({ abs: 0, pct: 0 });

  // Generate/reload candles on pair/tf change — 1000 candles
  useEffect(() => {
    const data = generateCandles(pair, tf, 1000);
    setCandles(data);
    const last = data[data.length - 1];
    const first = data[0];
    if (last && first) {
      setLivePrice(last.close);
      setChange24h({ abs: +(last.close - first.open).toFixed(6), pct: +((last.close - first.open) / first.open * 100).toFixed(2) });
    }
  }, [pair, tf]);

  // Simulate live price updates by mutating last candle
  useEffect(() => {
    if (!candles.length) return;
    const interval = TF_SECONDS[tf] || 60;
    const iv = setInterval(() => {
      setCandles(prev => {
        if (!prev.length) return prev;
        const now = Math.floor(Date.now() / 1000);
        const candleTime = Math.floor(now / interval) * interval;
        const last = prev[prev.length - 1];
        const price = last.close * (1 + (Math.random() - 0.499) * 0.0015);
        const vol = +(Math.random() * 0.05 + 0.01).toFixed(5);

        if (last.time === candleTime) {
          const updated = { ...last, high: Math.max(last.high, price), low: Math.min(last.low, price), close: +price.toFixed(6), volume: +(last.volume + vol).toFixed(5) };
          const next = [...prev.slice(0, -1), updated];
          setLivePrice(updated.close);
          return next;
        } else {
          const newCandle = { time: candleTime, open: last.close, high: +price.toFixed(6), low: +price.toFixed(6), close: +price.toFixed(6), volume: vol };
          const next = [...prev.slice(1), newCandle]; // keep total at 1000
          setLivePrice(newCandle.close);
          return next;
        }
      });
    }, 500);
    return () => clearInterval(iv);
  }, [candles.length > 0, tf]);

  const indicators = useMemo(() => ({
    sma: showSMA ? calcSMA(candles, 20) : [],
    ema: showEMA ? calcEMA(candles, 50) : [],
    bb:  showBB  ? calcBB(candles, 20, 2) : [],
    vwap: showVWAP ? calcVWAP(candles) : [],
  }), [candles, showSMA, showEMA, showBB, showVWAP]);

  const rsiData = useMemo(() => showRSI ? calcRSI(candles, 14) : [], [candles, showRSI]);
  const macdData = useMemo(() => showMACD ? calcMACD(candles, 12, 26, 9) : null, [candles, showMACD]);

  const isUp = change24h.pct >= 0;

  const S = {
    root: { display: "flex", flexDirection: "column", height: "100vh", background: COLORS.bg, color: COLORS.text, fontFamily: "'Inter','SF Pro Display',system-ui,sans-serif", fontSize: 13, userSelect: "none" },
    topbar: { display: "flex", alignItems: "center", gap: 12, padding: "0 12px", height: 44, borderBottom: `1px solid ${COLORS.border}`, background: COLORS.bgPanel, flexShrink: 0 },
    main: { display: "flex", flex: 1, overflow: "hidden" },
    leftSidebar: { width: 160, borderRight: `1px solid ${COLORS.border}`, display: "flex", flexDirection: "column", flexShrink: 0, background: COLORS.bgPanel },
    chartArea: { flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" },
    chartToolbar: { display: "flex", alignItems: "center", gap: 6, padding: "4px 8px", borderBottom: `1px solid ${COLORS.border}`, background: COLORS.bgPanel, flexShrink: 0, flexWrap: "wrap" },
    chartContainer: { flex: 1, overflow: "hidden" },
    rightSidebar: { width: 220, borderLeft: `1px solid ${COLORS.border}`, display: "flex", flexDirection: "column", flexShrink: 0, background: COLORS.bgPanel },
  };

  const TbBtn = ({ label, active, onClick, color }) => (
    <button onClick={onClick} style={{ padding: "3px 8px", borderRadius: 3, border: `1px solid ${active ? (color || COLORS.blue) : COLORS.border}`, background: active ? `rgba(${color === COLORS.amber ? "245,158,11" : color === COLORS.green ? "16,185,129" : color === COLORS.purple ? "139,92,246" : "59,130,246"},0.15)` : "transparent", color: active ? (color || COLORS.blue) : COLORS.textMuted, cursor: "pointer", fontSize: 11, fontWeight: active ? 700 : 400, whiteSpace: "nowrap" }}>{label}</button>
  );

  return (
    <div style={S.root}>
      {/* Top bar */}
      <div style={S.topbar}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginRight: 8 }}>
          <div style={{ width: 20, height: 20, borderRadius: 3, background: "linear-gradient(135deg,#3B82F6,#8B5CF6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 900, color: "#fff" }}>T</div>
          <span style={{ fontWeight: 800, fontSize: 13, color: COLORS.textBright, letterSpacing: "-0.3px" }}>TradeOS</span>
        </div>

        <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
          <span style={{ fontSize: 15, fontWeight: 800, color: COLORS.textBright, fontFamily: "monospace" }}>{pair}</span>
          <span style={{ fontSize: 16, fontWeight: 700, color: isUp ? COLORS.green : COLORS.red, fontFamily: "monospace" }}>{formatPrice(livePrice)}</span>
          <span style={{ fontSize: 12, fontWeight: 600, color: isUp ? COLORS.green : COLORS.red }}>{isUp ? "▲" : "▼"} {Math.abs(change24h.pct).toFixed(2)}%</span>
          <span style={{ fontSize: 11, color: COLORS.textMuted }}>{isUp ? "+" : ""}{formatPrice(change24h.abs)} 24h</span>
        </div>

        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: COLORS.green, boxShadow: `0 0 6px ${COLORS.green}`, animation: "pulse 2s infinite" }} />
          <span style={{ fontSize: 10, color: COLORS.green, fontFamily: "monospace" }}>LIVE</span>
        </div>
      </div>

      <div style={S.main}>
        {/* Left: Pairs */}
        <div style={S.leftSidebar}>
          <div style={{ padding: "6px 8px", borderBottom: `1px solid ${COLORS.border}`, fontSize: 10, color: COLORS.textMuted, fontWeight: 700, letterSpacing: "0.5px" }}>PAIRS</div>
          <div style={{ flex: 1, overflow: "hidden" }}>
            <PairSelector selected={pair} onSelect={setPair} />
          </div>
        </div>

        {/* Center: Chart */}
        <div style={S.chartArea}>
          {/* Chart toolbar */}
          <div style={S.chartToolbar}>
            {/* Timeframes */}
            <div style={{ display: "flex", gap: 2 }}>
              {["1m","5m","15m","1h","4h","1d"].map(t => (
                <TbBtn key={t} label={t} active={tf===t} onClick={() => setTf(t)} />
              ))}
            </div>

            <div style={{ width: 1, height: 16, background: COLORS.border, margin: "0 2px" }} />

            {/* Chart types */}
            <div style={{ display: "flex", gap: 2 }}>
              {[["☵","candlestick"],["∿","line"],["◬","area"],["⊟","bar"]].map(([icon, ct]) => (
                <TbBtn key={ct} label={icon} active={chartType===ct} onClick={() => setChartType(ct)} />
              ))}
            </div>

            <div style={{ width: 1, height: 16, background: COLORS.border, margin: "0 2px" }} />

            {/* Indicators */}
            <TbBtn label="SMA 20" active={showSMA} onClick={() => setShowSMA(p=>!p)} color={COLORS.amber} />
            <TbBtn label="EMA 50" active={showEMA} onClick={() => setShowEMA(p=>!p)} color={COLORS.green} />
            <TbBtn label="BB" active={showBB} onClick={() => setShowBB(p=>!p)} color={COLORS.blue} />
            <TbBtn label="VWAP" active={showVWAP} onClick={() => setShowVWAP(p=>!p)} color={COLORS.purple} />
            <TbBtn label="RSI" active={showRSI} onClick={() => setShowRSI(p=>!p)} color={COLORS.amber} />
            <TbBtn label="MACD" active={showMACD} onClick={() => setShowMACD(p=>!p)} color={COLORS.purple} />
          </div>

          {/* Chart canvas */}
          <div style={{ ...S.chartContainer, position: "relative" }}>
            <CandleChart
              candles={candles}
              indicators={indicators}
              chartType={chartType}
              tf={tf}
              pair={pair}
              rsiData={rsiData}
              macdData={macdData}
              showRSI={showRSI}
              showMACD={showMACD}
            />
          </div>
        </div>

        {/* Right sidebar */}
        <div style={S.rightSidebar}>
          {/* Panel switcher */}
          <div style={{ display: "flex", borderBottom: `1px solid ${COLORS.border}` }}>
            {[["orderbook","Book"],["trades","Trades"],["order","Order"]].map(([key, label]) => (
              <button key={key} onClick={() => setRightPanel(key)} style={{ flex: 1, padding: "7px 0", background: rightPanel===key ? COLORS.bgAlt : "transparent", color: rightPanel===key ? COLORS.textBright : COLORS.textMuted, border: "none", borderBottom: rightPanel===key ? `2px solid ${COLORS.blue}` : "2px solid transparent", cursor: "pointer", fontSize: 11, fontWeight: rightPanel===key ? 700 : 400 }}>{label}</button>
            ))}
          </div>

          <div style={{ flex: 1, overflow: "hidden" }}>
            {rightPanel === "orderbook" && <OrderBook pair={pair} lastPrice={livePrice} />}
            {rightPanel === "trades" && <TradesFeed pair={pair} lastPrice={livePrice} />}
            {rightPanel === "order" && <OrderForm pair={pair} lastPrice={livePrice} />}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        input { outline: none; }
        input:focus { border-color: #3B82F6 !important; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #1E2B3E; border-radius: 2px; }
        * { box-sizing: border-box; }
      `}</style>
    </div>
  );
}
