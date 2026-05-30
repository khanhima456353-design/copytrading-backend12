import React, { useState, useEffect, useRef } from 'react';
import { createChart } from 'lightweight-charts';
import { binanceDataService } from '../services/binanceDataService';
import { simulationEngine } from '../services/swanCoreSimulationEngine';
import AdminSimPanel from './AdminSimPanel';

// ─── Color Palette ────────────────────────────────────────────────────────

const COLORS = {
  bg:           '#0A0E1A',
  bgPanel:      '#0D1220',
  bgAlt:        '#111827',
  border:       '#1E2B3E',
  text:         '#94A3B8',
  textBright:   '#E2E8F0',
  green:        '#10B981',
  red:          '#EF4444',
  amber:        '#F59E0B',
  grid:         'rgba(30,43,62,0.5)',
  crosshair:    'rgba(148,163,184,0.4)',
};

// ─── Utility ──────────────────────────────────────────────────────────────

function formatPrice(price) {
  if (!price || isNaN(price)) return '—';
  const p = Math.abs(price);
  if (p >= 10000) return price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  if (p >= 100)   return price.toFixed(2);
  if (p >= 1)     return price.toFixed(4);
  return price.toFixed(6);
}

// ─── Sub-components ───────────────────────────────────────────────────────

const LoadingSkeleton = () => (
  <div style={{
    position: 'absolute', inset: 0, zIndex: 50,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: COLORS.bg, color: COLORS.text,
  }}>
    <style>{`
      @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
      @keyframes bar     { 0%{transform:translateX(-100%)} 100%{transform:translateX(500%)} }
    `}</style>
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 12, marginBottom: 8 }}>Loading Binance data…</div>
      <div style={{ width: 200, height: 4, background: COLORS.border, borderRadius: 2, overflow: 'hidden' }}>
        <div style={{ width: '40%', height: '100%', background: COLORS.amber, animation: 'bar 1s infinite' }} />
      </div>
    </div>
  </div>
);

const ConnectionIndicator = ({ status }) => {
  const color = { connected: COLORS.green, connecting: COLORS.amber, disconnected: COLORS.red, error: COLORS.red }[status] ?? COLORS.text;
  const label = { connected: 'LIVE', connecting: 'RECONNECTING…', disconnected: 'OFFLINE', error: 'ERROR' }[status] ?? 'IDLE';
  return (
    <div style={{
      position: 'absolute', top: 8, left: 8, zIndex: 100,
      display: 'flex', alignItems: 'center', gap: 6,
      background: COLORS.bgPanel, border: `1px solid ${COLORS.border}`,
      borderRadius: 4, padding: '4px 8px', fontSize: 11, fontWeight: 600, color,
    }}>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }`}</style>
      <div style={{
        width: 6, height: 6, borderRadius: '50%', background: color,
        animation: status === 'connecting' ? 'pulse 1s infinite' : 'none',
      }} />
      {label}
    </div>
  );
};

const OhlcBar = ({ ohlc }) => {
  if (!ohlc) return null;
  const isUp   = ohlc.close >= ohlc.open;
  const color  = isUp ? COLORS.green : COLORS.red;
  const pct    = ((ohlc.close - ohlc.open) / ohlc.open * 100).toFixed(2);
  return (
    <div style={{
      position: 'absolute', top: 40, left: 8, zIndex: 100,
      display: 'flex', gap: 16, fontSize: 11, fontFamily: 'monospace',
      background: 'rgba(10,14,26,0.75)', padding: '2px 8px', borderRadius: 3,
      color: COLORS.text,
    }}>
      <span>O: <span style={{ color: COLORS.textBright }}>{formatPrice(ohlc.open)}</span></span>
      <span>H: <span style={{ color: COLORS.green }}>{formatPrice(ohlc.high)}</span></span>
      <span>L: <span style={{ color: COLORS.red }}>{formatPrice(ohlc.low)}</span></span>
      <span>C: <span style={{ color }}>{formatPrice(ohlc.close)}</span></span>
      <span style={{ color }}>{isUp ? '+' : ''}{pct}%</span>
    </div>
  );
};

const TIMEFRAMES = ['1s', '1m', '3m', '5m', '15m', '30m', '1h', '2h', '4h', '6h', '8h', '12h', '1d', '1w', '1M'];

const TimeFrameSelector = ({ current, onChange, loading }) => (
  <div style={{
    position: 'absolute', top: 8, right: 8, zIndex: 100,
    display: 'flex', gap: 4,
    background: COLORS.bgPanel, border: `1px solid ${COLORS.border}`,
    borderRadius: 4, padding: 4,
  }}>
    {TIMEFRAMES.map(tf => (
      <button
        key={tf}
        onClick={() => onChange(tf)}
        disabled={loading}
        style={{
          padding: '4px 8px', borderRadius: 2, fontSize: 11, fontFamily: 'monospace',
          cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1,
          fontWeight: current === tf ? 600 : 400,
          background: current === tf ? COLORS.amber : COLORS.bgAlt,
          border: `1px solid ${current === tf ? COLORS.amber : COLORS.border}`,
          color: current === tf ? '#000' : COLORS.text,
        }}
      >
        {tf}
      </button>
    ))}
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────

const EnhancedTradingChart = ({ pair = 'BTCUSDT', initialTf = '4h' }) => {
  const containerRef    = useRef(null);
  const chartRef        = useRef(null);
  const seriesRef       = useRef(null);

  // Track *active* subscription keys so cleanup always targets the right stream
  const activePairRef   = useRef(null);
  const activeTfRef     = useRef(null);

  // Refs for live-stream teardown callbacks
  const unsubCandlesRef = useRef(null);
  const unsubEngineRef  = useRef(null);
  const unsubStatusRef  = useRef(null);
  const retryRef        = useRef(null);

  // Buffer WS candles that arrive before history has loaded
  const wsBufferRef     = useRef([]);
  const historyReadyRef = useRef(false);

  const [tf,               setTf]               = useState(initialTf);
  const [loading,          setLoading]           = useState(false);
  const [error,            setError]             = useState(null);
  const [connectionStatus, setConnectionStatus]  = useState('idle');
  const [ohlcDisplay,      setOhlcDisplay]       = useState(null);
  const [adminVisible,     setAdminVisible]      = useState(false);

  // ─── Connection-status subscription (mount/unmount only) ─────────────
  useEffect(() => {
    unsubStatusRef.current = binanceDataService.subscribeToStatus(setConnectionStatus);
    return () => {
      unsubStatusRef.current?.();
      unsubStatusRef.current = null;
    };
  }, []);

  // ─── Admin hotkey ─────────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      if (e.ctrlKey && e.shiftKey && e.code === 'KeyA') {
        e.preventDefault();
        setAdminVisible(v => !v);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // ─── Chart lifecycle: re-run only when `tf` changes ──────────────────
  useEffect(() => {
    // ── 1. Tear down previous streams FIRST ──────────────────────────
    // Always unsubscribe using the refs that recorded what was actually subscribed.
    // This prevents the "old BTC candles bleeding into 1INCH chart" bug.
    if (unsubCandlesRef.current) {
      binanceDataService.unsubscribeFromCandles(activePairRef.current, activeTfRef.current);
      unsubCandlesRef.current = null;
    }
    if (unsubEngineRef.current) {
      unsubEngineRef.current();
      unsubEngineRef.current = null;
    }

    // ── 2. Reset state ────────────────────────────────────────────────
    wsBufferRef.current   = [];
    historyReadyRef.current = false;

    // ── 3. Destroy previous chart instance ───────────────────────────
    if (chartRef.current) {
      chartRef.current.remove();
      chartRef.current = null;
      seriesRef.current = null;
    }

    simulationEngine.setPair(pair);
    simulationEngine.setTimeframe(tf);

    // ── 4. Guard: wait for container to have real dimensions ──────────
    const tryInit = () => {
      const el = containerRef.current;
      if (!el || el.clientWidth === 0 || el.clientHeight === 0) {
        retryRef.current = setTimeout(tryInit, 200);
        return;
      }
      init(el);
    };

    const cleanSymbol = pair.replace('/', '').toUpperCase();

    // ── 5. Core init ──────────────────────────────────────────────────
    const init = (el) => {
      setLoading(true);
      setError(null);

      // Create chart
      const chart = createChart(el, {
        width:  el.clientWidth,
        height: el.clientHeight,
        layout: {
          background:  { color: COLORS.bg },
          textColor:   COLORS.text,
          fontFamily:  "'JetBrains Mono', monospace",
        },
        timeScale: {
          timeVisible:    true,
          secondsVisible: false,
          rightOffset:    5,
          fixLeftEdge:    false,
          fixRightEdge:   false,
        },
        rightPriceScale: { autoScale: true },
        crosshair: {
          mode:     1,
          vertLine: { color: COLORS.crosshair, width: 1, style: 3 },
          horzLine: { color: COLORS.crosshair, width: 1, style: 3 },
        },
        grid: {
          horzLines: { color: COLORS.grid },
          vertLines: { color: COLORS.grid },
        },
      });

      const series = chart.addCandlestickSeries({
        upColor:        COLORS.green,
        downColor:      COLORS.red,
        borderUpColor:  COLORS.green,
        borderDownColor:COLORS.red,
        wickUpColor:    COLORS.green,
        wickDownColor:  COLORS.red,
      });

      chartRef.current  = chart;
      seriesRef.current = series;

      // Resize handler
      const onResize = () => {
        if (chartRef.current && containerRef.current) {
          chartRef.current.applyOptions({
            width:  containerRef.current.clientWidth,
            height: containerRef.current.clientHeight,
          });
        }
      };
      window.addEventListener('resize', onResize);

      // ── 6. Subscribe to live candle stream BEFORE loading history ────
      // This ensures no candles are dropped during the async REST fetch.
      // Candles received before history loads are buffered and flushed after.
      activePairRef.current = pair;
      activeTfRef.current   = tf;

      binanceDataService.connectToLiveStream(pair, tf);

      unsubCandlesRef.current = binanceDataService.subscribeToCandles(
        pair,
        tf,
        (candle) => {
          // Drop candles from the simulation engine's drift if it's active
          const engineState = simulationEngine.getState();
          if (engineState.driftActive && engineState.currentPair === cleanSymbol) return;

          const formatted = {
            time:  candle.time,
            open:  parseFloat(candle.open),
            high:  parseFloat(candle.high),
            low:   parseFloat(candle.low),
            close: parseFloat(candle.close),
          };

          if (!historyReadyRef.current) {
            // Buffer until history is loaded
            wsBufferRef.current.push(formatted);
            return;
          }

          seriesRef.current?.update(formatted);
          setOhlcDisplay(formatted);
        }
      );

      // ── 7. Subscribe to simulation engine ────────────────────────────
      unsubEngineRef.current = simulationEngine.subscribePriceUpdate(
        ({ pair: driftPair, candle, driftActive }) => {
          if (!driftActive || !seriesRef.current || !candle) return;
          if (!driftPair || driftPair !== cleanSymbol) return;
          seriesRef.current.update(candle);
          setOhlcDisplay(candle);
        }
      );

      // ── 8. Load historical candles ────────────────────────────────────
      binanceDataService
        .fetchHistoricalCandles(pair, tf, 100)
        .then((candles) => {
          if (!candles?.length) throw new Error('No candles returned from Binance API');
          if (!seriesRef.current) return; // chart was destroyed mid-fetch

          const formatted = candles
            .map(c => ({
              time:  c.time,
              open:  parseFloat(c.open),
              high:  parseFloat(c.high),
              low:   parseFloat(c.low),
              close: parseFloat(c.close),
            }))
            .filter(c => !isNaN(c.time))
            .sort((a, b) => a.time - b.time);

          series.setData(formatted);
          historyReadyRef.current = true;

          // Flush buffered WS candles (deduplicated by time)
          const lastHistoryTime = formatted[formatted.length - 1]?.time ?? 0;
          wsBufferRef.current
            .filter(c => c.time >= lastHistoryTime)
            .forEach(c => series.update(c));
          wsBufferRef.current = [];

          // Fit view then scroll to live edge
          chart.timeScale().fitContent();
          chart.timeScale().scrollToRealTime();

          const lastCandle = formatted[formatted.length - 1];
          setOhlcDisplay(lastCandle);

          // Crosshair OHLC display
          chart.subscribeCrosshairMove((param) => {
            if (!param.seriesData?.size) {
              setOhlcDisplay(lastCandle);
              return;
            }
            const c = param.seriesData.get(series);
            if (c) setOhlcDisplay(c);
          });

          setLoading(false);
        })
        .catch((err) => {
          console.error('[Chart] fetchHistoricalCandles error:', err);
          setError(err.message || 'Failed to load candles from Binance');
          setLoading(false);
        });

      // Return inner cleanup so the useEffect cleanup can call it
      return () => {
        window.removeEventListener('resize', onResize);
      };
    };

    // Kick off
    let innerCleanup = null;
    const wrappedInit = (el) => { innerCleanup = init(el); };

    const tryInitWrapped = () => {
      const el = containerRef.current;
      if (!el || el.clientWidth === 0 || el.clientHeight === 0) {
        retryRef.current = setTimeout(tryInitWrapped, 200);
        return;
      }
      wrappedInit(el);
    };

    tryInitWrapped();

    // ── Cleanup ───────────────────────────────────────────────────────
    return () => {
      clearTimeout(retryRef.current);
      retryRef.current = null;

      // Unsubscribe streams using the refs that recorded what was subscribed
      if (unsubCandlesRef.current) {
        binanceDataService.unsubscribeFromCandles(activePairRef.current, activeTfRef.current);
        unsubCandlesRef.current = null;
      }
      if (unsubEngineRef.current) {
        unsubEngineRef.current();
        unsubEngineRef.current = null;
      }

      binanceDataService.disconnect();
      innerCleanup?.();

      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current  = null;
        seriesRef.current = null;
      }

      historyReadyRef.current = false;
      wsBufferRef.current     = [];
    };
  }, [pair, tf]); // re-run when pair OR timeframe changes

  // ─── Render ───────────────────────────────────────────────────────────
  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        background: COLORS.bg,
        overflow: 'hidden',
        minWidth: 400,
        minHeight: 300,
      }}
    >
      {loading && <LoadingSkeleton />}

      {error && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 50,
          background: 'rgba(0,0,0,0.85)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: COLORS.red, fontSize: 12, textAlign: 'center', padding: 16,
        }}>
          <div>
            <div style={{ marginBottom: 8 }}>Error loading chart</div>
            <div style={{ fontSize: 11, color: COLORS.text }}>{error}</div>
            <button
              onClick={() => { setError(null); setTf(t => t); }}
              style={{
                marginTop: 12, padding: '6px 16px',
                background: COLORS.amber, color: '#000',
                border: 'none', borderRadius: 4,
                cursor: 'pointer', fontSize: 11, fontWeight: 600,
              }}
            >
              Retry
            </button>
          </div>
        </div>
      )}

      <ConnectionIndicator status={connectionStatus} />
      <OhlcBar ohlc={ohlcDisplay} />
      <TimeFrameSelector current={tf} onChange={setTf} loading={loading} />
      <AdminSimPanel visible={adminVisible} onClose={() => setAdminVisible(false)} />
    </div>
  );
};

export default EnhancedTradingChart;