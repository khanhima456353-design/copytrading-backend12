# Binance WebSocket Price Feed Integration

## Overview

The server now features a **robust Binance WebSocket price feed** with automatic reconnection, heartbeat monitoring, and graceful fallback to CoinGecko. This ensures the price label on the chart **never stops updating**, even when network connections drop or WebSocket streams go silent.

## Key Features

### 1. **Auto-Reconnect with Exponential Backoff**
- Connection drops are detected automatically
- Exponential backoff: 1s → 2s → 4s → 8s → 16s → 32s (max)
- Resets to 1s on successful connection

### 2. **Heartbeat Monitoring (30-second timeout)**
- Detects silent connection drops (no data for 30 seconds)
- Automatically triggers reconnection when timeout occurs
- Logs heartbeat timeout events for debugging

### 3. **Real-Time Price Updates**
- Subscribes to Binance 24hr mini ticker streams (`@ticker`)
- Emits price updates as they arrive (typically 1-2 updates per second per pair)
- Directly updates `cachedMarketPrices` for immediate frontend delivery

### 4. **Hybrid Architecture**
- **Primary**: Binance WebSocket (live, fast, reliable)
- **Fallback**: CoinGecko HTTP polling (every 30s, secondary only)
- Only uses CoinGecko if Binance price is missing

### 5. **Graceful Shutdown**
- Closes WebSocket and Redis connections on `SIGTERM` / `SIGINT`
- Prevents port conflicts and zombie processes
- 10-second force-exit safety timeout

---

## Architecture

### Components

#### 1. `src/services/binanceWebSocket.js` (NEW)
**BinanceWebSocketManager** class:
- Manages WebSocket lifecycle (connect, disconnect, reconnect)
- Handles Binance subscription/unsubscription
- Monitors heartbeat and triggers reconnects
- Exposes price cache and connection status

**Key Methods:**
```javascript
manager.connect()                 // Start connection
manager.disconnect()              // Clean shutdown
manager.getPrice(pair)            // Get cached price
manager.getAllPrices()            // Get all prices
manager.updatePairs(newPairs)     // Dynamic subscription
manager.getStatus()               // Get connection stats
```

**Emitted Events:**
```javascript
manager.on('price', ({pair, price, timestamp}) => {})      // Price update
manager.on('heartbeat-timeout', () => {})                  // Timeout detected
```

#### 2. `server.js` (MODIFIED)
- Initializes `BinanceWebSocketManager` with tracked pairs
- Listens to `'price'` events and updates `cachedMarketPrices`
- Broadcasts prices to frontend via Socket.io every 1 second
- Falls back to CoinGecko every 30 seconds if needed
- Graceful shutdown handlers for signals

#### 3. Endpoint: `GET /api/status/price-feed`
Monitor the price feed status:
```json
{
  "binanceWebSocket": {
    "connected": true,
    "connecting": false,
    "reconnectDelay": 1000,
    "pricesCached": 5,
    "trackedPairs": 5
  },
  "cachedPrices": {
    "BTC/USDT": 42500.25,
    "ETH/USDT": 2300.50,
    ...
  },
  "trackedPairs": 5
}
```

---

## Configuration

### Tracked Pairs (in `server.js`)

Currently tracked pairs and their Binance symbols:
```javascript
const trackedPairs = ["BTC/USDT", "ETH/USDT", "SOL/USDT", "LTC/USDT", "ADA/USDT"];
const binancePairs = ["BTCUSDT", "ETHUSDT", "SOLUSDT", "LTCUSDT", "ADAUSDT"];
```

To add more pairs, update both arrays:
```javascript
// 1. Add to trackedPairs
const trackedPairs = ["BTC/USDT", ..., "XRP/USDT"];

// 2. Add Binance symbol to binancePairs
const binancePairs = ["BTCUSDT", ..., "XRPUSDT"];

// 3. Add to coinGeckoIds (optional, for fallback)
const coinGeckoIds = { ..., "XRP/USDT": "ripple" };

// 4. Pass to WebSocket manager
const binanceWS = new BinanceWebSocketManager(binancePairs);
```

### Timeout & Backoff Settings

Edit `src/services/binanceWebSocket.js`:
```javascript
const HEARTBEAT_TIMEOUT = 30_000;        // 30s: consider connection dead if no data
const MAX_RECONNECT_DELAY = 32_000;      // Max backoff: 32 seconds
const INITIAL_RECONNECT_DELAY = 1_000;   // Start at: 1 second
```

---

## How It Works

### Connection Lifecycle

```
┌─────────────┐
│   Start     │
└──────┬──────┘
       │ connect()
       ▼
┌─────────────────────┐     Error/Timeout
│ Connecting to WS    │ ──────────────┐
│ 🔌 wss://...        │               │
└──────┬──────────────┘               │
       │                              │
       │ onOpen()                     │
       ▼                              │
┌──────────────────────┐              │
│ Connected ✅         │              │
│ - Subscribe streams  │              │
│ - Start heartbeat    │◄─────────────┤
└──────┬───────────────┘              │
       │                              │
       │ onMessage(price)             │
       │ ─ Reset heartbeat            │
       │ ─ Update cache               │
       │ ─ Emit 'price' event         │
       │                              │
       │ 30s timeout                  │
       │ (no message)                 │
       │ ─ Trigger reconnect ──────┐  │
       │                           │  │
       │ onError() or onClose()    │  │
       └──────────────┬────────────┘  │
                      │               │
                      └───────┬───────┘
                              │
                      ┌───────▼──────────┐
                      │ Calculate delay: │
                      │ 1s → 2s → 4s ... │
                      └───────┬──────────┘
                              │
                      ┌───────▼──────────┐
                      │ Wait & retry     │
                      │ connect()        │
                      └──────────────────┘
```

### Price Update Flow

```
Binance WSS
    │
    ▼
BinanceWebSocketManager.onMessage()
    │ Parse ticker update
    │ Extract price (msg.c)
    ▼
priceCache[pair] = price
    │ Emit 'price' event
    ▼
server.js listens to 'price'
    │ cachedMarketPrices[pair] = price
    ▼
setInterval (1s) broadcasts
    │ io.emit('priceUpdate', {pair, price, time})
    ▼
Frontend receives via Socket.io
    │ Updates chart price label
    ▼
🎯 Chart shows live price!
```

---

## Installation & Setup

### 1. Install Dependencies
```bash
npm install ws
```

### 2. Start the Server
```bash
node server.js
```

**Expected output:**
```
🚀 Starting Binance WebSocket price feed...
🔌 Connecting to Binance WebSocket...
✅ Binance WebSocket connected
📡 Subscribed to 5 streams
```

### 3. Verify Price Feed
```bash
# Check connection status
curl http://localhost:5000/api/status/price-feed

# Expected response:
{
  "binanceWebSocket": {
    "connected": true,
    "connecting": false,
    "reconnectDelay": 1000,
    "pricesCached": 5,
    "trackedPairs": 5
  },
  "cachedPrices": {
    "BTC/USDT": 42500.25,
    "ETH/USDT": 2300.50,
    ...
  }
}
```

### 4. Monitor Logs
```bash
# Watch WebSocket connection events
node server.js 2>&1 | grep -E "(🔌|✅|❌|⏱|📡|⚠)"

# Example:
# 🔌 Connecting to Binance WebSocket...
# ✅ Binance WebSocket connected
# 📡 Subscribed to 5 streams
# 📈 Binance price: BTC/USDT = $42500.25
```

---

## Troubleshooting

### Price Label Stops Updating

**Symptoms:** Frontend shows last price but doesn't update

**Diagnosis:**
```bash
curl http://localhost:5000/api/status/price-feed
```

Check:
- `binanceWebSocket.connected` → should be `true`
- `cachedPrices` → should have all 5 pairs
- `reconnectDelay` → should be `1000` (not high)

**Solutions:**

1. **Connection lost**: Server auto-reconnects (check logs for 🔌 and ✅)
2. **Network timeout**: Increase `HEARTBEAT_TIMEOUT` if Binance is slow
3. **Firewall/proxy blocking WS**: Enable CoinGecko fallback or use HTTP proxy
4. **Binance rate limit**: Reduce tracked pairs or use fallback

### Reconnecting Repeatedly

**Symptoms:** Logs show frequent "🔌 Connecting..." and "Reconnecting in..."

**Causes:**
1. Firewall blocking WebSocket (wss://stream.binance.com:9443)
2. Invalid Binance symbols (typo in binancePairs array)
3. Network unstable

**Solutions:**
1. Check network connectivity: `curl https://api.binance.com/api/v3/ping`
2. Verify Binance symbols: `BTCUSDT` (not `BTC-USDT` or `BTC_USDT`)
3. Check firewall: Allow `wss://stream.binance.com:9443`
4. Use CoinGecko-only fallback temporarily

### High Memory Usage

**Symptoms:** Process memory grows over time

**Causes:**
- Price cache growing (edge case)
- Multiple reconnections without cleanup

**Solutions:**
1. Ensure graceful shutdown: `kill -SIGTERM <pid>`
2. Restart server: `npm run dev`
3. Monitor: `node --inspect server.js` (use Chrome DevTools)

---

## API Reference

### BinanceWebSocketManager

```javascript
const manager = new BinanceWebSocketManager(pairs);

// Lifecycle
manager.connect()              // Start connection
manager.disconnect()           // Clean shutdown

// Data access
manager.getPrice(pair)         // Get single price
manager.getAllPrices()         // Get all cached prices

// Dynamic updates
manager.updatePairs(newPairs)  // Change tracked pairs

// Status
manager.getStatus()            // Get connection info
  // Returns: { connected, connecting, reconnectDelay, pricesCached, trackedPairs }

// Events
manager.on('price', callback)           // (data) => { pair, price, timestamp }
manager.on('heartbeat-timeout', cb)    // () => { reconnecting... }
manager.off('price', callback)          // Unsubscribe
```

---

## Performance

### Typical Metrics

- **Connection time**: 500ms - 2s
- **Price update latency**: 50-200ms (Binance broadcasts at 1-2 Hz per pair)
- **Memory footprint**: ~5-10 MB (stable)
- **CPU usage**: Negligible (<1% idle, <5% during updates)
- **Network bandwidth**: ~5-10 KB/s (5 pairs)

### Optimization Tips

1. **Reduce tracked pairs**: Fewer pairs = lower bandwidth
2. **Increase heartbeat timeout**: If network is slow
3. **Batch socket.io emissions**: Use `io.emit()` not per-pair updates

---

## Future Enhancements

1. **Per-pair subscription requests** (currently subscribes to all at once)
2. **Depth and trades streams** (currently ticker only)
3. **Binance US fallback** (if global stream unavailable)
4. **Metrics dashboard** (track uptime, reconnects, latency)
5. **Alert system** (notify admin if feed dead >5 min)

---

## References

- **Binance WebSocket API**: https://binance-docs.github.io/apidocs/spot/en/#websocket-market-streams
- **Binance Ticker Streams**: https://binance-docs.github.io/apidocs/spot/en/#individual-symbol-ticker-streams
- **Node.js WebSocket (ws)**: https://github.com/websockets/ws

---

## Support

**Issue:** Server crashes on startup  
**Fix:** Check `package.json` has `"ws": "^8.13.0"` and run `npm install`

**Issue:** Prices stuck at old value  
**Fix:** Check `/api/status/price-feed` endpoint, ensure `connected: true`

**Issue:** Frontend not receiving prices  
**Fix:** Verify Socket.io is working: check browser console for `Socket connected` message
