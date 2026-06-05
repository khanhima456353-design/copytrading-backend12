/**
 * binanceWebSocket.js — Auto-reconnecting Binance WebSocket price + depth feed
 *
 * Uses Binance combined stream URL (/stream?streams=...) so every message
 * is wrapped with a "stream" field — no symbol ambiguity.
 *
 * Features:
 *  - Connects to Binance WebSocket API for real-time mini ticker + depth20@100ms
 *  - Automatic reconnection with exponential backoff (1s → 32s max)
 *  - Heartbeat monitoring: detects silent drops (no data for 30 seconds)
 *  - Per-pair price + depth cache with validation
 *  - Emits "price" and "depth" events
 */

const WebSocket = require('ws');
const EventEmitter = require('events');

const BINANCE_BASE_URL = 'wss://stream.binance.com:9443';
const HEARTBEAT_TIMEOUT = 30_000;
const MAX_RECONNECT_DELAY = 32_000;
const INITIAL_RECONNECT_DELAY = 1_000;

class BinanceWebSocketManager extends EventEmitter {
  constructor(pairs = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'LTCUSDT', 'ADAUSDT']) {
    super();
    this.pairs = pairs;
    this.priceCache = {};
    this.depthCache = {};
    this.ws = null;
    this.isConnecting = false;
    this.reconnectDelay = INITIAL_RECONNECT_DELAY;
    this.reconnectTimer = null;
    this.heartbeatTimer = null;
    this.blocked = false;
  }

  /**
   * Build the combined stream URL for all pairs (ticker + depth20@100ms)
   */
  _buildStreamUrl() {
    const streams = [];
    // !ticker@arr sends 24hr ticker for ALL symbols (includes change %, high, low, volume)
    streams.push('!ticker@arr');
    for (const pair of this.pairs) {
      streams.push(`${pair.toLowerCase()}@aggTrade`);
      streams.push(`${pair.toLowerCase()}@depth20@100ms`);
    }
    return `${BINANCE_BASE_URL}/stream?streams=${streams.join('/')}`;
  }

  /**
   * Parse a combined stream name to extract symbol and stream type
   * e.g. "btcusdt@ticker" → { symbol: "BTCUSDT", type: "ticker" }
   */
  _parseStream(streamName) {
    const idx = streamName.indexOf('@');
    if (idx === -1) return null;
    return { symbol: streamName.slice(0, idx).toUpperCase(), type: streamName.slice(idx + 1) };
  }

  /**
   * Start the WebSocket connection
   */
  connect() {
    if (this.ws || this.isConnecting) return;
    if (this.blocked) return;

    this.isConnecting = true;
    console.log('🔌 Connecting to Binance combined stream...');

    try {
      this.ws = new WebSocket(this._buildStreamUrl(), {
        perMessageDeflate: false,
        handshakeTimeout: 10_000,
      });

      this.ws.on('open', () => this._onOpen());
      this.ws.on('message', (data) => this._onMessage(data));
      this.ws.on('error', (err) => this._onError(err));
      this.ws.on('unexpected-response', (req, res) => this._onUnexpectedResponse(req, res));
      this.ws.on('close', () => this._onClose());
    } catch (err) {
      console.error('❌ WebSocket creation failed:', err.message);
      this.isConnecting = false;
      this._scheduleReconnect();
    }
  }

  /**
   * Handle successful connection
   */
  _onOpen() {
    console.log('✅ Binance WebSocket connected');
    this.isConnecting = false;
    this.reconnectDelay = INITIAL_RECONNECT_DELAY; // Reset backoff
    console.log(`📡 Subscribed to ${this.pairs.length * 2} streams (ticker + depth)`);
    this._resetHeartbeat();
  }

  /**
   * Handle incoming messages from combined stream
   */
  _onMessage(data) {
    try {
      const msg = JSON.parse(data);

      // Combined stream wraps each message: { stream: "...", data: { ... } }
      if (!msg.stream || !msg.data) {
        this._resetHeartbeat();
        return;
      }

      // !ticker@arr — array of all symbol tickers
      if (msg.stream === '!ticker@arr' && Array.isArray(msg.data)) {
        const tickers = msg.data
          .filter(t => t && t.s && t.e === '24hrTicker')
          .map(t => ({
            symbol:    t.s.toUpperCase(),
            price:     parseFloat(t.c),
            high24h:   parseFloat(t.h),
            low24h:    parseFloat(t.l),
            volume24h: parseFloat(t.v),
            quoteVol:  parseFloat(t.q),
            change24h: parseFloat(t.p),
            changePct: parseFloat(t.P),
            timestamp: t.E || Date.now(),
          }))
          .filter(t => Number.isFinite(t.price) && t.price > 0);
        if (tickers.length) {
          console.log(`[BinanceWS] allTickers: ${tickers.length} symbols, first: ${tickers[0].symbol}=${tickers[0].price}`);
          this.emit('allTickers', tickers);
        } else {
          console.warn('[BinanceWS] !ticker@arr received but no valid tickers after filter');
        }
        this._resetHeartbeat();
        return;
      }

      const parsed = this._parseStream(msg.stream);
      if (!parsed) { this._resetHeartbeat(); return; }

      const { symbol, type } = parsed;

      if (type === 'aggTrade') {
        const price = parseFloat(msg.data.p);
        const qty   = parseFloat(msg.data.q);
        if (Number.isFinite(price) && price > 0) {
          this.priceCache[symbol] = price;
          this.emit('price', { pair: symbol, price, timestamp: msg.data.E || Date.now() });
          this.emit('trade', { pair: symbol, price, amount: qty, time: msg.data.T || Date.now(), side: msg.data.m ? 'sell' : 'buy' });
        }
      }

      if (type === 'ticker' && msg.data.e === '24hrTicker') {
        const price = parseFloat(msg.data.c);
        if (Number.isFinite(price) && price > 0) {
          this.priceCache[symbol] = price;
          this.emit('price', { pair: symbol, price, timestamp: msg.data.E || Date.now() });
        }
      }

      if (type.startsWith('depth') && msg.data.lastUpdateId) {
        const { bids, asks, lastUpdateId } = msg.data;
        if (Array.isArray(bids) && Array.isArray(asks)) {
          const buy = bids
            .filter(([p, a]) => parseFloat(a) > 0)
            .map(([p, a]) => ({ price: parseFloat(p), amount: parseFloat(a) }));
          const sell = asks
            .filter(([p, a]) => parseFloat(a) > 0)
            .map(([p, a]) => ({ price: parseFloat(p), amount: parseFloat(a) }));
          if (buy.length || sell.length) {
            const depth = { pair: symbol, buy, sell, lastUpdateId };
            this.depthCache[symbol] = depth;
            this.emit('depth', depth);
          }
        }
      }
    } catch (err) {
      console.error('❌ Message parsing error:', err.message);
    }

    this._resetHeartbeat();
  }

  /**
   * Handle errors
   */
  _onError(err) {
    console.error('❌ WebSocket error:', err.message);
  }

  /**
   * Handle unexpected HTTP response during WebSocket upgrade (e.g. HTTP 451)
   */
  _onUnexpectedResponse(req, res) {
    const statusCode = res.statusCode;
    console.error(`❌ Binance WS unexpected response: ${statusCode} ${res.statusMessage}`);
    res.resume();

    if (statusCode === 451) {
      console.error('🚫 Binance WS blocked by region (HTTP 451). Switching to REST fallback permanently.');
      this.blocked = true;
      this.emit('blocked');
    }
  }

  /**
   * Handle disconnection
   */
  _onClose() {
    console.log('❌ Binance WebSocket disconnected');
    this.ws = null;
    this.isConnecting = false;
    this._clearHeartbeat();
    this.emit('close');
    this._scheduleReconnect();
  }

  /**
   * Schedule reconnection with exponential backoff
   */
  _scheduleReconnect() {
    if (this.blocked) return;
    if (this.reconnectTimer) return;

    const delay = Math.min(this.reconnectDelay, MAX_RECONNECT_DELAY);
    console.log(`⏱ Reconnecting in ${delay}ms...`);

    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      this.reconnectDelay = Math.min(this.reconnectDelay * 2, MAX_RECONNECT_DELAY);
      this.connect();
    }, delay);
  }

  /**
   * Heartbeat monitoring
   */
  _resetHeartbeat() {
    this._clearHeartbeat();
    this.heartbeatTimer = setTimeout(() => {
      console.warn('⏱ Heartbeat timeout: no data received in 30s, reconnecting...');
      this.emit('heartbeat-timeout');
      this._attemptClose();
      this._scheduleReconnect();
    }, HEARTBEAT_TIMEOUT);
  }

  _clearHeartbeat() {
    if (this.heartbeatTimer) {
      clearTimeout(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  /**
   * Attempt graceful WebSocket close
   */
  _attemptClose() {
    if (this.ws) {
      try { this.ws.close(1000, 'Normal closure'); } catch (err) {}
      this.ws = null;
    }
  }

  /**
   * Update tracked pairs — reconnects with new stream URL
   */
  updatePairs(newPairs) {
    this.pairs = newPairs;
    this._attemptClose();
    this._clearHeartbeat();
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    this.reconnectDelay = INITIAL_RECONNECT_DELAY;
    this.connect();
  }

  /**
   * Graceful shutdown
   */
  disconnect() {
    console.log('🛑 Shutting down Binance WebSocket...');
    this._clearHeartbeat();
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    this._attemptClose();
    this.isConnecting = false;
  }

  /**
   * Get connection status
   */
  getStatus() {
    return {
      connected: this.ws?.readyState === WebSocket.OPEN,
      connecting: this.isConnecting,
      reconnectDelay: this.reconnectDelay,
      pricesCached: Object.keys(this.priceCache).length,
      depthsCached: Object.keys(this.depthCache).length,
      trackedPairs: this.pairs.length,
      blocked: this.blocked,
    };
  }
}

module.exports = BinanceWebSocketManager;
