/**
 * binanceWebSocket.js — Auto-reconnecting Binance WebSocket price feed
 *
 * Features:
 *  - Connects to Binance WebSocket API for real-time mini ticker updates
 *  - Automatic reconnection with exponential backoff (1s → 32s max)
 *  - Heartbeat monitoring: detects silent drops (no data for 30 seconds)
 *  - Per-pair price cache with validation
 *  - Callback-based event emission for integration with server
 */

const WebSocket = require('ws');
const EventEmitter = require('events');

const BINANCE_WSS_URL = 'wss://stream.binance.com:9443/ws';
const HEARTBEAT_TIMEOUT = 30_000; // 30 seconds: if no update, trigger reconnect
const MAX_RECONNECT_DELAY = 32_000; // max backoff: 32 seconds
const INITIAL_RECONNECT_DELAY = 1_000; // start at 1 second

class BinanceWebSocketManager extends EventEmitter {
  constructor(pairs = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'LTCUSDT', 'ADAUSDT']) {
    super();
    this.pairs = pairs;
    this.priceCache = {};
    this.ws = null;
    this.isConnecting = false;
    this.reconnectDelay = INITIAL_RECONNECT_DELAY;
    this.reconnectTimer = null;
    this.heartbeatTimer = null;
    this.subscriptionId = 1;
  }

  /**
   * Start the WebSocket connection and subscribe to streams
   */
  connect() {
    if (this.ws || this.isConnecting) {
      console.warn('⚠ WebSocket already connecting or connected');
      return;
    }

    this.isConnecting = true;
    console.log('🔌 Connecting to Binance WebSocket...');

    try {
      this.ws = new WebSocket(BINANCE_WSS_URL, {
        perMessageDeflate: false,
        handshakeTimeout: 10_000,
      });

      this.ws.on('open', () => this._onOpen());
      this.ws.on('message', (data) => this._onMessage(data));
      this.ws.on('error', (err) => this._onError(err));
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
    this.reconnectDelay = INITIAL_RECONNECT_DELAY; // Reset backoff on successful connect

    // Subscribe to 24hr mini ticker for all pairs
    const streams = this.pairs.map(pair => `${pair.toLowerCase()}@ticker`).join('/');
    const subscribeMsg = {
      method: 'SUBSCRIBE',
      params: streams.split('/'),
      id: this.subscriptionId++,
    };

    try {
      this.ws.send(JSON.stringify(subscribeMsg));
      console.log(`📡 Subscribed to ${this.pairs.length} streams`);
    } catch (err) {
      console.error('❌ Failed to subscribe:', err.message);
      this._attemptClose();
      this._scheduleReconnect();
    }

    // Start heartbeat monitor
    this._resetHeartbeat();
  }

  /**
   * Handle incoming messages
   */
  _onMessage(data) {
    try {
      const msg = JSON.parse(data);

      // Skip subscription confirmations
      if (msg.result === null && msg.id) {
        console.log(`✓ Subscription ${msg.id} confirmed`);
        return;
      }

      // Process price updates: 24hr mini ticker format
      if (msg.e && msg.e === '24hrMiniTicker' && msg.s) {
        const pair = msg.s; // e.g., "BTCUSDT"
        const price = parseFloat(msg.c); // close price

        if (Number.isFinite(price) && price > 0) {
          this.priceCache[pair] = price;
          // Emit price update event
          this.emit('price', { pair, price, timestamp: msg.E || Date.now() });
        }
      }
    } catch (err) {
      console.error('❌ Message parsing error:', err.message);
    }

    // Reset heartbeat on any message
    this._resetHeartbeat();
  }

  /**
   * Handle errors
   */
  _onError(err) {
    console.error('❌ WebSocket error:', err.message);
    // Connection will attempt to close, then reconnect
  }

  /**
   * Handle disconnection
   */
  _onClose() {
    console.log('❌ Binance WebSocket disconnected');
    this.ws = null;
    this.isConnecting = false;
    this._clearHeartbeat();
    this._scheduleReconnect();
  }

  /**
   * Schedule reconnection with exponential backoff
   */
  _scheduleReconnect() {
    if (this.reconnectTimer) return; // Already scheduled

    const delay = Math.min(this.reconnectDelay, MAX_RECONNECT_DELAY);
    console.log(`⏱ Reconnecting in ${delay}ms...`);

    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      this.reconnectDelay = Math.min(this.reconnectDelay * 2, MAX_RECONNECT_DELAY);
      this.connect();
    }, delay);
  }

  /**
   * Heartbeat monitoring: if no message for 30s, assume connection is dead
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

  /**
   * Clear heartbeat timer
   */
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
      try {
        this.ws.close(1000, 'Normal closure');
      } catch (err) {
        console.error('Error closing WebSocket:', err.message);
      }
      this.ws = null;
    }
  }

  /**
   * Get cached price for a pair
   * @param {string} pair - e.g., "BTCUSDT"
   * @returns {number|null} price or null if not available
   */
  getPrice(pair) {
    return this.priceCache[pair] || null;
  }

  /**
   * Get all cached prices
   * @returns {object} price map
   */
  getAllPrices() {
    return { ...this.priceCache };
  }

  /**
   * Update tracked pairs (dynamic subscription)
   * @param {array} newPairs - list of symbol strings, e.g., ["BTCUSDT", "ETHUSDT"]
   */
  updatePairs(newPairs) {
    const newPairSet = new Set(newPairs);
    const oldPairSet = new Set(this.pairs);

    const toAdd = newPairs.filter(p => !oldPairSet.has(p));
    const toRemove = this.pairs.filter(p => !newPairSet.has(p));

    if (toAdd.length > 0 && this.ws && this.ws.readyState === WebSocket.OPEN) {
      const subscribeMsg = {
        method: 'SUBSCRIBE',
        params: toAdd.map(p => `${p.toLowerCase()}@ticker`),
        id: this.subscriptionId++,
      };
      try {
        this.ws.send(JSON.stringify(subscribeMsg));
        console.log(`📡 Added ${toAdd.length} new streams`);
      } catch (err) {
        console.error('❌ Failed to add streams:', err.message);
      }
    }

    if (toRemove.length > 0 && this.ws && this.ws.readyState === WebSocket.OPEN) {
      const unsubscribeMsg = {
        method: 'UNSUBSCRIBE',
        params: toRemove.map(p => `${p.toLowerCase()}@ticker`),
        id: this.subscriptionId++,
      };
      try {
        this.ws.send(JSON.stringify(unsubscribeMsg));
        console.log(`📡 Removed ${toRemove.length} streams`);
      } catch (err) {
        console.error('❌ Failed to remove streams:', err.message);
      }
    }

    this.pairs = newPairs;
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
    console.log('✓ Binance WebSocket shutdown complete');
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
      trackedPairs: this.pairs.length,
    };
  }
}

module.exports = BinanceWebSocketManager;
