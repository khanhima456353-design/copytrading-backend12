/**
 * Binance Data Service
 * ────────────────────────────────────────────────────────────────────────────
 * Real-time and historical OHLCV data from Binance official API.
 *
 * Fixes applied:
 *  1. fetchHistoricalCandles — added endTime anchor so data is always recent
 *  2. subscribeToCandles     — now accepts (pair, tf, callback) to match chart usage
 *  3. unsubscribeFromCandles — added (was completely missing)
 *  4. Per-stream subscriber map — each pair+tf stream has its own subscriber set;
 *     no cross-pair bleed
 *  5. Intentional disconnect guard — _scheduleReconnect will not fire after an
 *     explicit disconnect() / destroy() call
 */

import axios from 'axios';

// ─── Types ────────────────────────────────────────────────────────────────

export interface BinanceCandle {
  time:   number;   // unix seconds
  open:   number;
  high:   number;
  low:    number;
  close:  number;
  volume: number;
}

export type TimeFrame =
  | '1s' | '1m' | '3m' | '5m' | '15m' | '30m'
  | '1h' | '2h' | '4h' | '6h' | '8h' | '12h'
  | '1d' | '1w' | '1M';

export type ConnectionStatus =
  | 'idle' | 'connecting' | 'connected' | 'disconnected' | 'error';

interface BinanceKlineResponse {
  k: {
    t: number;   // open time ms
    o: string;
    h: string;
    l: string;
    c: string;
    v: string;
    x: boolean;  // is kline closed?
  };
}

// ─── Constants ────────────────────────────────────────────────────────────

const BINANCE_REST_BASE  = 'https://api.binance.com/api/v3';
const BINANCE_WS_BASE    = 'wss://stream.binance.com:9443/ws';
const REST_TIMEOUT_MS    = 10_000;
const MAX_CANDLES        = 500;
const MAX_WS_RECONNECTS  = 3; // Stop retrying after 3 failures (e.g. blocked region)

const INTERVAL_MAP: Record<TimeFrame, string> = {
  '1s':  '1m', // UI '1s' maps to Binance '1m' (Binance doesn't support 1s interval)
  '1m':  '1m',
  '3m':  '3m',
  '5m':  '5m',
  '15m': '15m',
  '30m': '30m',
  '1h':  '1h',
  '2h':  '2h',
  '4h':  '4h',
  '6h':  '6h',
  '8h':  '8h',
  '12h': '12h',
  '1d':  '1d',
  '1w':  '1w',
  '1M':  '1M',
};

// ─── Service ──────────────────────────────────────────────────────────────

class BinanceDataService {

  // WebSocket state
  private ws:                WebSocket | null = null;
  private wsUrl:             string           = '';
  private connectionStatus:  ConnectionStatus = 'idle';
  private reconnectAttempts: number           = 0;
  private reconnectDelay:    number           = 1_000;
  private reconnectTimeout:  ReturnType<typeof setTimeout> | null = null;
  private heartbeatInterval: ReturnType<typeof setInterval> | null = null;

  // FIX #5 — explicit flag so _scheduleReconnect never fires after disconnect()
  private intentionalDisconnect: boolean = false;

  // Current stream identifiers
  private currentPair:      string    = 'BTCUSDT';
  private currentTimeFrame: TimeFrame = '4h';

  // FIX #4 — per-stream subscriber map: streamKey → Set<callback>
  // streamKey = "BTCUSDT:4h"
  private candleSubscribers: Map<string, Set<(c: BinanceCandle) => void>> = new Map();

  // Global status subscribers
  private statusSubscribers: Set<(s: ConnectionStatus) => void> = new Set();

  // ── Helpers ─────────────────────────────────────────────────────────────

  private streamKey(pair: string, tf: TimeFrame | string): string {
    return `${pair.replace('/', '').toUpperCase()}:${tf}`;
  }

  private normalisePair(pair: string): string {
    return pair.replace('/', '').toUpperCase();
  }

  // ── REST — fetchHistoricalCandles ────────────────────────────────────────

  /**
   * Fetch the most-recent `limit` candles for a pair/timeframe.
   *
   * FIX #1: endTime is always anchored to Date.now() so on wide timeframes
   * (e.g. 1W with limit=100) Binance returns the 100 most-recent weekly
   * candles ending *now*, not starting from 2 years ago.
   */
  async fetchHistoricalCandles(
    pair:      string,
    timeFrame: TimeFrame,
    limit:     number = MAX_CANDLES,
  ): Promise<BinanceCandle[]> {
    try {
      const interval = INTERVAL_MAP[timeFrame];
      if (!interval) {
        console.error(`[BinanceDataService] Unknown timeframe: ${timeFrame}`);
        return [];
      }

      const params: Record<string, string | number> = {
        symbol:  this.normalisePair(pair),
        interval,
        limit:   Math.min(limit, MAX_CANDLES),
        endTime: Date.now(),          // ← FIX #1: anchor to now
      };

      const response = await axios.get(`${BINANCE_REST_BASE}/klines`, {
        params,
        timeout: REST_TIMEOUT_MS,
      });

      if (!Array.isArray(response.data)) {
        console.error('[BinanceDataService] Unexpected REST response shape');
        return [];
      }

      const candles: BinanceCandle[] = response.data.map((k: any[]) => ({
        time:   Math.floor(k[0] / 1000),
        open:   parseFloat(k[1]),
        high:   parseFloat(k[2]),
        low:    parseFloat(k[3]),
        close:  parseFloat(k[4]),
        volume: parseFloat(k[5]),
      }));

      const valid = this.validateCandles(candles).sort((a, b) => a.time - b.time);

      if (valid.length === 0) {
        console.warn('[BinanceDataService] All candles failed validation');
        return [];
      }

      if (valid.length < 50) {
        console.warn(`[BinanceDataService] Only ${valid.length} valid candles — expected 50+`);
      }

      console.log(
        `[BinanceDataService] Fetched ${valid.length} candles — ` +
        `${pair} ${timeFrame} ending ${new Date(valid[valid.length - 1].time * 1000).toISOString()}`
      );

      return valid;

    } catch (err: any) {
      if (err.response?.status === 429) {
        const retryAfter = err.response.headers['retry-after'] ?? '?';
        console.warn(`[BinanceDataService] Rate-limited. Retry after ${retryAfter}s`);
      } else {
        console.error('[BinanceDataService] fetchHistoricalCandles error:', err.message);
      }
      return [];
    }
  }

  // ── WebSocket ────────────────────────────────────────────────────────────

  /**
   * Open (or reuse) a WebSocket stream for the given pair + timeframe.
   * Closes any existing stream that targets a different pair/tf.
   */
  connectToLiveStream(pair: string, timeFrame: TimeFrame): void {
    const normPair  = this.normalisePair(pair);
    const interval  = INTERVAL_MAP[timeFrame];
    const targetUrl = `${BINANCE_WS_BASE}/${normPair.toLowerCase()}@kline_${interval}`;

    // Already connected to this exact stream — nothing to do
    if (this.wsUrl === targetUrl && this.ws?.readyState === WebSocket.OPEN) {
      console.log('[BinanceDataService] Already connected to this stream');
      return;
    }

    // Different stream — close the old one cleanly before opening a new one
    if (this.ws) {
      this.intentionalDisconnect = true;
      this.disconnect();
    }

    if (!interval) {
      console.error(`[BinanceDataService] Unknown timeframe: ${timeFrame}`);
      return;
    }

    this.currentPair      = normPair;
    this.currentTimeFrame = timeFrame;
    this.wsUrl            = targetUrl;
    this.intentionalDisconnect = false;

    this.setStatus('connecting');
    this._connect();
  }

  private _connect(): void {
    try {
      this.ws = new WebSocket(this.wsUrl);
      const ws = this.ws;

      ws.onopen = () => {
        console.log(`[BinanceDataService] WS open → ${this.wsUrl}`);
        this.reconnectAttempts = 0;
        this.reconnectDelay    = 1_000;
        this.setStatus('connected');
        this._startHeartbeat();
      };

      ws.onmessage = (event: MessageEvent) => {
        try {
          const msg: BinanceKlineResponse = JSON.parse(event.data);
          const candle = this._parseKline(msg);
          if (candle) this._notify(candle);
        } catch (e) {
          console.error('[BinanceDataService] WS message parse error:', e);
        }
      };

      ws.onerror = (e: Event) => {
        console.error('[BinanceDataService] WS error:', e);
        this.setStatus('error');
      };

      ws.onclose = () => {
        console.log('[BinanceDataService] WS closed');
        this.setStatus('disconnected');
        this._stopHeartbeat();
        // FIX #5 — only reconnect if this was NOT an intentional disconnect
        if (!this.intentionalDisconnect) {
          this._scheduleReconnect();
        }
      };

    } catch (e) {
      console.error('[BinanceDataService] Failed to create WebSocket:', e);
      this.setStatus('error');
      if (!this.intentionalDisconnect && this.reconnectAttempts < MAX_WS_RECONNECTS) {
        this._scheduleReconnect();
      }
    }
  }

  private _scheduleReconnect(): void {
    if (this.reconnectTimeout) clearTimeout(this.reconnectTimeout);

    if (this.reconnectAttempts >= MAX_WS_RECONNECTS) {
      console.error(`[BinanceDataService] Max reconnect attempts (${MAX_WS_RECONNECTS}) reached — giving up`);
      this.setStatus('error');
      return;
    }

    const delay = Math.min(this.reconnectDelay, 30_000);
    this.reconnectAttempts++;

    console.log(
      `[BinanceDataService] Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`
    );

    this.reconnectTimeout = setTimeout(() => {
      // Double-check we haven't been intentionally stopped since scheduling
      if (!this.intentionalDisconnect && this.connectionStatus !== 'connected') {
        this.reconnectDelay = Math.min(delay * 2, 30_000);
        this._connect();
      }
    }, delay);
  }

  private _startHeartbeat(): void {
    this._stopHeartbeat();
    this.heartbeatInterval = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        console.debug('[BinanceDataService] Heartbeat — connection alive');
      }
    }, 30_000);
  }

  private _stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  // ── Parse & validate ─────────────────────────────────────────────────────

  private _parseKline(msg: BinanceKlineResponse): BinanceCandle | null {
    try {
      const k = msg.k;
      const candle: BinanceCandle = {
        time:   Math.floor(k.t / 1000),
        open:   parseFloat(k.o),
        high:   parseFloat(k.h),
        low:    parseFloat(k.l),
        close:  parseFloat(k.c),
        volume: parseFloat(k.v),
      };
      return this._isValidCandle(candle) ? candle : null;
    } catch {
      return null;
    }
  }

  private _isValidCandle(c: BinanceCandle): boolean {
    return (
      Number.isFinite(c.time)   && c.time   > 0 &&
      Number.isFinite(c.open)   && c.open   > 0 &&
      Number.isFinite(c.high)   && c.high   > 0 &&
      Number.isFinite(c.low)    && c.low    > 0 &&
      Number.isFinite(c.close)  && c.close  > 0 &&
      Number.isFinite(c.volume) && c.volume >= 0
    );
  }

  private validateCandles(candles: BinanceCandle[]): BinanceCandle[] {
    return candles.filter(c => {
      if (!this._isValidCandle(c)) {
        console.warn('[BinanceDataService] Dropping invalid candle:', c);
        return false;
      }
      return !isNaN(new Date(c.time * 1000).getTime());
    });
  }

  // ── Notify ───────────────────────────────────────────────────────────────

  /**
   * Broadcast to subscribers registered for the current stream only.
   * FIX #4 — no cross-pair bleed.
   */
  private _notify(candle: BinanceCandle): void {
    const key = this.streamKey(this.currentPair, this.currentTimeFrame);
    const subs = this.candleSubscribers.get(key);
    if (!subs) return;
    subs.forEach(cb => {
      try { cb(candle); } catch (e) {
        console.error('[BinanceDataService] Subscriber error:', e);
      }
    });
  }

  // ── Public subscription API ───────────────────────────────────────────────

  /**
   * FIX #2 — signature now matches chart usage: subscribeToCandles(pair, tf, callback)
   * Returns an unsubscribe function.
   */
  subscribeToCandles(
    pair:     string,
    tf:       TimeFrame | string,
    callback: (c: BinanceCandle) => void,
  ): () => void {
    const key = this.streamKey(pair, tf);
    if (!this.candleSubscribers.has(key)) {
      this.candleSubscribers.set(key, new Set());
    }
    this.candleSubscribers.get(key)!.add(callback);

    return () => this.unsubscribeFromCandles(pair, tf, callback);
  }

  /**
   * FIX #3 — was completely missing from original service.
   * Removes a specific callback (or all callbacks) for a pair+tf stream.
   */
  unsubscribeFromCandles(
    pair:      string,
    tf:        TimeFrame | string,
    callback?: (c: BinanceCandle) => void,
  ): void {
    const key  = this.streamKey(pair, tf);
    const subs = this.candleSubscribers.get(key);
    if (!subs) return;

    if (callback) {
      subs.delete(callback);
      if (subs.size === 0) this.candleSubscribers.delete(key);
    } else {
      // No specific callback — clear all for this stream
      this.candleSubscribers.delete(key);
    }
  }

  /**
   * Subscribe to connection status changes.
   * Immediately calls back with current status.
   */
  subscribeToStatus(callback: (s: ConnectionStatus) => void): () => void {
    this.statusSubscribers.add(callback);
    callback(this.connectionStatus);
    return () => { this.statusSubscribers.delete(callback); };
  }

  getStatus(): ConnectionStatus {
    return this.connectionStatus;
  }

  // ── Lifecycle ────────────────────────────────────────────────────────────

  /**
   * Cleanly close the WebSocket and cancel pending reconnects.
   * Will NOT trigger automatic reconnection (FIX #5).
   */
  disconnect(): void {
    this.intentionalDisconnect = true;
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    this._stopHeartbeat();
    if (this.ws) {
      this.ws.onclose = null; // prevent reconnect logic from onclose
      this.ws.close();
      this.ws = null;
    }
    this.wsUrl = '';
    this.setStatus('idle');
  }

  /**
   * Full teardown — disconnect and clear all subscribers.
   */
  destroy(): void {
    this.disconnect();
    this.candleSubscribers.clear();
    this.statusSubscribers.clear();
  }

  // ── Internal ─────────────────────────────────────────────────────────────

  private setStatus(status: ConnectionStatus): void {
    if (this.connectionStatus === status) return;
    this.connectionStatus = status;
    this.statusSubscribers.forEach(cb => {
      try { cb(status); } catch (e) {
        console.error('[BinanceDataService] Status subscriber error:', e);
      }
    });
  }
}

// ─── Singleton Export ─────────────────────────────────────────────────────

export const binanceDataService = new BinanceDataService();
export default binanceDataService;