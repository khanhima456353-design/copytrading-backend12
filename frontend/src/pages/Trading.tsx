import React, { useEffect, useRef, useState } from "react";
// @ts-ignore
import { getSocket, getAxios } from "../api";
import { createChart } from "lightweight-charts";
import "./Trading.css";

type Trade = {
  time: number;
  price: number;
  amount: number;
  side: "buy" | "sell";
};

type Candle = {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

type Order = {
  price: number;
  amount: number;
  total?: number;
};

const timeframeOptions = ["1m", "5m", "15m", "1h", "4h", "1d"];

const calculateSMA = (candles: Candle[], period: number) => {
  const sma: Array<{ time: number; value: number }> = [];
  for (let i = 0; i < candles.length; i++) {
    if (i + 1 >= period) {
      const slice = candles.slice(i + 1 - period, i + 1);
      const sum = slice.reduce((total, candle) => total + candle.close, 0);
      sma.push({ time: candles[i].time, value: Number((sum / period).toFixed(2)) });
    }
  }
  return sma;
};

const calculateEMA = (candles: Candle[], period: number) => {
  const ema: Array<{ time: number; value: number }> = [];
  const k = 2 / (period + 1);
  let prevEma = candles.length ? candles[0].close : 0;

  candles.forEach((candle, index) => {
    if (index === 0) {
      prevEma = candle.close;
      ema.push({ time: candle.time, value: prevEma });
      return;
    }

    prevEma = Number((candle.close * k + prevEma * (1 - k)).toFixed(2));
    if (index + 1 >= period) {
      ema.push({ time: candle.time, value: prevEma });
    }
  });

  return ema;
};

const buildDepthData = (orderbook: { buy: Order[]; sell: Order[] }) => {
  let cumulativeBid = 0;
  const bids = orderbook.buy
    .slice()
    .sort((a, b) => b.price - a.price)
    .map((order) => {
      cumulativeBid += order.amount;
      return { time: order.price, value: cumulativeBid };
    });

  let cumulativeAsk = 0;
  const asks = orderbook.sell
    .slice()
    .sort((a, b) => a.price - b.price)
    .map((order) => {
      cumulativeAsk += order.amount;
      return { time: order.price, value: cumulativeAsk };
    });

  return { bids, asks };
};

const createFallbackCandles = (count = 80, startPrice = 30000): Candle[] => {
  const now = Math.floor(Date.now() / 1000);
  const fallbackCandles: Candle[] = [];
  let price = startPrice;

  for (let i = count - 1; i >= 0; i--) {
    const change = (Math.random() - 0.5) * 200;
    price += change;
    const open = price;
    const close = price + (Math.random() - 0.5) * 100;
    const high = Math.max(open, close) + Math.random() * 50;
    const low = Math.min(open, close) - Math.random() * 50;

    fallbackCandles.push({
      time: now - i * 60,
      open: Number(open.toFixed(2)),
      high: Number(high.toFixed(2)),
      low: Number(low.toFixed(2)),
      close: Number(close.toFixed(2)),
      volume: Number((Math.random() * 10 + 1).toFixed(2)),
    });
  }

  return fallbackCandles;
};

export default function Trading() {
  const [symbols, setSymbols] = useState<string[]>([]);
  const [symbol, setSymbol] = useState("BTC/USDT");
  const [timeframe, setTimeframe] = useState("1m");
  const [orderbook, setOrderbook] = useState<{ buy: Order[]; sell: Order[] }>({ buy: [], sell: [] });
  const [trades, setTrades] = useState<Trade[]>([]);
  const [candles, setCandles] = useState<Candle[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredSymbols, setFilteredSymbols] = useState<string[]>([]);
  const [marketMovers, setMarketMovers] = useState<{ pair: string; change: number; volume: number }[]>([]);
  const [priceInput, setPriceInput] = useState<string>("");
  const [amountInput, setAmountInput] = useState<string>("");
  const [lastPrice, setLastPrice] = useState<number>(0);
  const [change24h, setChange24h] = useState<number>(0);
  const [showSMA, setShowSMA] = useState(true);
  const [showEMA, setShowEMA] = useState(true);

  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const depthContainerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<any>(null);
  const candleSeriesRef = useRef<any>(null);
  const smaSeriesRef = useRef<any>(null);
  const emaSeriesRef = useRef<any>(null);
  const depthChartRef = useRef<any>(null);
  const bidsSeriesRef = useRef<any>(null);
  const asksSeriesRef = useRef<any>(null);
  const lastCandleRef = useRef<Candle | null>(null);

  const updateIndicatorLines = (data: Candle[]) => {
    if (!smaSeriesRef.current || !emaSeriesRef.current) return;
    const sma = calculateSMA(data, 20);
    const ema = calculateEMA(data, 50);
    smaSeriesRef.current.setData(showSMA ? sma : []);
    emaSeriesRef.current.setData(showEMA ? ema : []);
  };

  const createChartInstances = () => {
    if (!chartContainerRef.current || chartRef.current) return;

    const chart: any = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 420,
      layout: {
        background: { color: "#07101f" },
        textColor: "#cbd5e1",
      },
      grid: {
        vertLines: { color: "#1b2738" },
        horzLines: { color: "#1b2738" },
      },
      rightPriceScale: { borderColor: "#1f2a3d" },
      timeScale: {
        borderColor: "#1f2a3d",
        timeVisible: true,
      },
      crosshair: { mode: 1 },
    });

    candleSeriesRef.current = chart.addCandlestickSeries({
      upColor: "#10b981",
      downColor: "#ef4444",
      wickVisible: true,
      borderVisible: false,
    });

    smaSeriesRef.current = chart.addLineSeries({
      color: "#f8e71c",
      lineWidth: 2,
    });

    emaSeriesRef.current = chart.addLineSeries({
      color: "#22c55e",
      lineWidth: 2,
    });

    chartRef.current = chart;
  };

  const createDepthChart = () => {
    if (!depthContainerRef.current || depthChartRef.current) return;

    const chart: any = createChart(depthContainerRef.current, {
      width: depthContainerRef.current ? depthContainerRef.current.clientWidth || 600 : 600,
      height: 240,
      layout: {
        background: { color: "#07101f" },
        textColor: "#cbd5e1",
      },
      grid: {
        vertLines: { visible: false },
        horzLines: { visible: false },
      },
      rightPriceScale: { visible: false },
      timeScale: { visible: false },
    });

    bidsSeriesRef.current = chart.addAreaSeries({
      topColor: "rgba(16,185,129,0.3)",
      bottomColor: "rgba(16,185,129,0.05)",
      lineColor: "#10b981",
    });

    asksSeriesRef.current = chart.addAreaSeries({
      topColor: "rgba(239,68,68,0.3)",
      bottomColor: "rgba(239,68,68,0.05)",
      lineColor: "#ef4444",
    });

    depthChartRef.current = chart;
  };

  

  const resizeCharts = () => {
    const chartWidth = chartContainerRef.current?.clientWidth ?? 0;
    if (chartRef.current && chartWidth) chartRef.current.applyOptions({ width: chartWidth });

    const depthWidth = depthContainerRef.current?.clientWidth ?? 0;
    if (depthChartRef.current && depthWidth) depthChartRef.current.applyOptions({ width: depthWidth });
  };

  const fetchSymbols = async () => {
    try {
      const api = await getAxios();
      const res = await api.get("/api/market/symbols");
      const available = res.data.symbols || ["BTC/USDT"];
      setSymbols(available);
      setFilteredSymbols(available);
      setMarketMovers(
        available.map((pair: string) => ({
          pair,
          change: Number(((Math.random() - 0.5) * 10).toFixed(2)),
          volume: Number((Math.random() * 120 + 20).toFixed(2)),
        }))
      );
      setSymbol((prev) => (available.includes(prev) ? prev : available[0]));
    } catch (error) {
      console.error("Unable to load symbols:", error);
      setSymbols(["BTC/USDT"]);
      setFilteredSymbols(["BTC/USDT"]);
      setMarketMovers([{ pair: "BTC/USDT", change: 0.12, volume: 76.5 }]);
    }
  };

  const fetchMarketData = async (selectedSymbol: string, selectedTimeframe: string) => {
    try {
      const api = await getAxios();
const [bookRes, candlesRes] = await Promise.all([
  api.get(`/api/market/orderbook/${encodeURIComponent(selectedSymbol)}`),
  api.get(`/api/market/candles/${encodeURIComponent(selectedSymbol)}?timeframe=${selectedTimeframe}`)
]);

       const book: { buy: Order[]; sell: Order[] } = bookRes.data;

      
  let sellTotal = 0;
book.sell = book.sell.map((o: Order) => {
  sellTotal += o.amount;
  return { ...o, total: sellTotal };
});


let buyTotal = 0;
book.buy = book.buy.map((o: Order) => {
  buyTotal += o.amount;
  return { ...o, total: buyTotal };
});
  
      
      const candleData: Candle[] = candlesRes.data;

      if (!candleData || candleData.length === 0) {
        const fallbackCandles = createFallbackCandles();
        setCandles(fallbackCandles);
        setOrderbook({ buy: [], sell: [] });
        setTrades([]);
        setLastPrice(fallbackCandles[fallbackCandles.length - 1]?.close || 30000);
        setPriceInput("30000.00");
        setChange24h(0);
        lastCandleRef.current = fallbackCandles[fallbackCandles.length - 1];

        if (!candleSeriesRef.current) return;

      const sortedFallback = fallbackCandles
  .slice()
  .sort((a, b) => a.time - b.time);

candleSeriesRef.current?.setData(
  sortedFallback.map((candle) => ({
    time: candle.time,
    open: candle.open,
    high: candle.high,
    low: candle.low,
    close: candle.close,
  }))
);

updateIndicatorLines(sortedFallback);
chartRef.current?.timeScale().fitContent();
depthChartRef.current?.timeScale().fitContent();
return;
      }

      setOrderbook(book);
setCandles(candleData);

const clean = candleData
  .map(c => ({
    ...c,
    time: Math.floor(Number(c.time)),
  }))
  .sort((a, b) => a.time - b.time);

if (!candleSeriesRef.current) return;

candleSeriesRef.current.setData(
  clean.map((c) => ({
    time: c.time,
    open: c.open,
    high: c.high,
    low: c.low,
    close: c.close,
  }))
);

updateIndicatorLines(clean);
chartRef.current?.timeScale().fitContent();

    const lastCandle = clean[clean.length - 1];
if (lastCandle) {
  setLastPrice(lastCandle.close);
  setPriceInput(lastCandle.close.toFixed(2));
  setChange24h(lastCandle.close - clean[0].open);
  lastCandleRef.current = lastCandle;
}

const { bids, asks } = buildDepthData(book);
bidsSeriesRef.current?.setData(bids);
asksSeriesRef.current?.setData(asks);

depthChartRef.current?.timeScale().fitContent();
    } catch (error) {
      console.error("Market data load failed:", error);
      // Fallback data for demo
      const fallbackCandles: Candle[] = [];
      const now = Math.floor(Date.now() / 1000);
      let price = 30000;
      for (let i = 79; i >= 0; i--) {
        const change = (Math.random() - 0.5) * 200;
        price += change;
        const open = price;
        const close = price + (Math.random() - 0.5) * 100;
        const high = Math.max(open, close) + Math.random() * 50;
        const low = Math.min(open, close) - Math.random() * 50;
        fallbackCandles.push({
          time: now - i * 60,
          open: Number(open.toFixed(2)),
          high: Number(high.toFixed(2)),
          low: Number(low.toFixed(2)),
          close: Number(close.toFixed(2)),
          volume: Number((Math.random() * 10 + 1).toFixed(2)),
        });
      }
      setCandles(fallbackCandles);
      setOrderbook({ buy: [], sell: [] });
      setTrades([]);
      setLastPrice(fallbackCandles[fallbackCandles.length - 1]?.close || 30000);
      setPriceInput("30000.00");
      setChange24h(0);
      if (!candleSeriesRef.current) return;

const sorted = [...fallbackCandles].sort((a, b) => a.time - b.time);

candleSeriesRef.current?.setData(
  sorted.map((candle) => ({
    time: candle.time,
    open: candle.open,
    high: candle.high,
    low: candle.low,
    close: candle.close,
  }))
);
      updateIndicatorLines(fallbackCandles);
      chartRef.current?.timeScale().fitContent();
    }
  };

  useEffect(() => {
  setTimeout(() => {
    createChartInstances();
    createDepthChart();
    resizeCharts();
  }, 100);

  fetchSymbols();
  window.addEventListener("resize", resizeCharts);

  return () => {
    window.removeEventListener("resize", resizeCharts);
    chartRef.current?.remove();
    depthChartRef.current?.remove();
  };
}, []);

  useEffect(() => {
    if (!symbol) return;
    fetchMarketData(symbol, timeframe);
  }, [symbol, timeframe]);

  useEffect(() => {
    setFilteredSymbols(
      symbols.filter((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [searchQuery, symbols]);

  useEffect(() => {
    updateIndicatorLines(candles);
  }, [showSMA, showEMA]);

  useEffect(() => {
  let socket: any;

  const initSocket = async () => {
    socket = await getSocket();

    socket.on("trade", (trade: any) => {
      if (trade.pair !== symbol) return;

      const tradePrice = Number(trade.price);

      const tfMap: any = {
        "1m": 60,
        "5m": 300,
        "15m": 900,
        "1h": 3600,
        "4h": 14400,
        "1d": 86400,
      };
      const formatOrderbook = (data: any) => {
  let sellTotal = 0;
  const sell = data.sell.map((o: any) => {
    sellTotal += o.amount;
    return { ...o, total: sellTotal };
  });

  let buyTotal = 0;
  const buy = data.buy.map((o: any) => {
    buyTotal += o.amount;
    return { ...o, total: buyTotal };
  });

  return { buy, sell };
};
      const interval = tfMap[timeframe] || 60;
      const tradeTime = Math.floor(Date.now() / 1000 / interval) * interval;

      const tradeVolume = Number(trade.amount);
      const side = trade.side === "sell" ? "sell" : "buy";

      setTrades((prev) => [
        { time: tradeTime, price: tradePrice, amount: tradeVolume, side },
        ...prev.slice(0, 29),
      ]);

      const existing = lastCandleRef.current;

      if (!existing || existing.time !== tradeTime) {
        const nextCandle = {
          time: tradeTime,
          open: tradePrice,
          high: tradePrice,
          low: tradePrice,
          close: tradePrice,
          volume: tradeVolume,
        };

        lastCandleRef.current = nextCandle;
        candleSeriesRef.current?.update(nextCandle);
      } else {
        existing.high = Math.max(existing.high, tradePrice);
        existing.low = Math.min(existing.low, tradePrice);
        existing.close = tradePrice;
        existing.volume += tradeVolume;
        candleSeriesRef.current?.update(existing);
      }

      setLastPrice(tradePrice);
    });

    socket.on("orderbook", (data: any) => {
      if (data.pair !== symbol) return;

      // ✅ THIS is the logic you removed → must stay here
      let sellTotal = 0;
      const sell = data.sell.map((o: any) => {
        sellTotal += o.amount;
        return { ...o, total: sellTotal };
      });

      let buyTotal = 0;
      const buy = data.buy.map((o: any) => {
        buyTotal += o.amount;
        return { ...o, total: buyTotal };
      });

      setOrderbook({ buy, sell });

      const { bids, asks } = buildDepthData({ buy, sell });
      bidsSeriesRef.current?.setData(bids);
      asksSeriesRef.current?.setData(asks);
    });
  };

  initSocket();

  return () => {
    socket?.off("trade");
    socket?.off("orderbook");
    socket?.disconnect();
  };
}, [symbol, timeframe]);

  const placeOrder = async (side: "buy" | "sell") => {
    try {
      const api = await getAxios();
      await api.post("/api/trade/place", {
        pair: symbol,
        amount: Number(amountInput),
        side,
      });
      setAmountInput("");
    } catch (error) {
      console.error("Order failed:", error);
    }
  };

  
  
  return (
    <div className="trading-page">
     <div className="trading-sidebar trading-panel">
  <div className="section-title">
    <span>Market</span>
    <strong>Professional</strong>
  </div>

  <div className="market-select-row">
    <label htmlFor="symbol-select">Symbol</label>
    <select
      id="symbol-select"
      value={symbol}
      onChange={(e) => setSymbol(e.target.value)}
    >
      {symbols.map((symbolOption) => (
        <option key={symbolOption} value={symbolOption}>
          {symbolOption}
        </option>
      ))}
    </select>
  </div>

  <div className="orderbook-panel">
    <div className="section-title">
      <span>Order Book</span>
      <strong>{symbol}</strong>
    </div>

    <div className="orderbook-table">
      <div className="orderbook-row orderbook-header">
        <span>Price</span>
        <span>Amount</span>
          <span>Total</span>

      </div>

      {orderbook.sell.map((order, index) => (
  <div
    className="orderbook-row sell"
    key={`sell-${index}`}
    onClick={() => setPriceInput(order.price.toFixed(2))}
    style={{
      background: `linear-gradient(to left, rgba(239,68,68,0.2) ${Math.min(
        (order.total! / (orderbook.sell[orderbook.sell.length - 1]?.total || 1)) * 100,
        100
      )}%, transparent 0%)`
    }}
  >
    <span>{order.price.toFixed(2)}</span>
    <span>{order.amount.toFixed(3)}</span>
    <span>{order.total?.toFixed(3)}</span>
        </div>
      ))}

      <div className="orderbook-middle">
        <strong className={change24h >= 0 ? "price-up" : "price-down"}>
          {lastPrice.toFixed(2)}
        </strong>
        <span>${lastPrice.toFixed(2)}</span>
      </div>

      {orderbook.buy.map((order, index) => (
  <div
    className="orderbook-row buy"
    key={`buy-${index}`}
    onClick={() => setPriceInput(order.price.toFixed(2))}
    style={{
      background: `linear-gradient(to right, rgba(16,185,129,0.2) ${Math.min(
        (order.total! / (orderbook.buy[orderbook.buy.length - 1]?.total || 1)) * 100,
        100
      )}%, transparent 0%)`
    }}
  >
    <span>{order.price.toFixed(2)}</span>
    <span>{order.amount.toFixed(3)}</span>
    <span>{order.total?.toFixed(3)}</span>
        </div>
      ))}
    </div>
  </div>
</div>

      <div className="chart-panel trading-panel">
        <div className="chart-toolbar">
          <div className="chart-title">
            <strong>{symbol}</strong>
            <div className="chart-meta">
              ${lastPrice.toFixed(2)} • 24h {change24h >= 0 ? "+" : ""}{change24h.toFixed(2)}
            </div>
          </div>
          <div className="chart-actions">
            <div className="timeframe-tabs">
              {timeframeOptions.map((frame) => (
                <button
                  key={frame}
                  className={`timeframe-btn ${timeframe === frame ? "active" : ""}`}
                  onClick={() => setTimeframe(frame)}
                >
                  {frame}
                </button>
              ))}
            </div>
            <div className="indicator-controls">
              <label>
                <input
                  type="checkbox"
                  checked={showSMA}
                  onChange={() => setShowSMA((prev) => !prev)}
                />
                SMA 20
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={showEMA}
                  onChange={() => setShowEMA((prev) => !prev)}
                />
                EMA 50
              </label>
            </div>
          </div>
        </div>

        <div className="chart-wrapper" ref={chartContainerRef} />
        <div className="depth-panel">
          <div className="section-title">
            <span>Depth Chart</span>
            <strong>Bid / Ask Liquidity</strong>
          </div>
          <div className="depth-chart-wrapper" ref={depthContainerRef} />
        </div>

        <div className="section-title order-form-title">
          <span>Place Order</span>
          <strong>Quick Entry</strong>
        </div>
        <div className="order-form">
          <div className="input-row">
            <label>Price</label>
            <input
              placeholder="Price"
              value={priceInput}
              onChange={(e) => setPriceInput(e.target.value)}
            />
          </div>
          <div className="input-row">
            <label>Amount</label>
            <input
              placeholder="Amount"
              value={amountInput}
              onChange={(e) => setAmountInput(e.target.value)}
            />
          </div>
          <div className="trade-actions">
            <button className="action-btn buy" onClick={() => placeOrder("buy")}>Buy</button>
            <button className="action-btn sell" onClick={() => placeOrder("sell")}>Sell</button>
          </div>
          <button className="secondary-btn" onClick={() => {
            setPriceInput("");
            setAmountInput("");
          }}>
            Clear
          </button>
        </div>
      </div>

      <div className="market-sidebar trading-panel">
        <div className="section-title">
          <span>Market Pairs</span>
          <strong>Spot Watchlist</strong>
        </div>
        <div className="market-search-row">
          <input
            type="text"
            placeholder="Search pair"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="pair-list">
          {filteredSymbols.map((pair) => (
            <button
              key={pair}
              className={`pair-list-item ${pair === symbol ? "active" : ""}`}
              onClick={() => setSymbol(pair)}
            >
              <span>{pair}</span>
              <strong>{pair === symbol ? "Selected" : "View"}</strong>
            </button>
          ))}
        </div>

        <div className="section-title">
          <span>Market Trades</span>
          <strong>Live Feed</strong>
        </div>
        <div className="trades-list market-trades">
          {trades.map((trade, index) => (
            <div
              className={`trade-row ${trade.side === "sell" ? "price-down" : "price-up"}`}
              key={`trade-${index}`}
            >
              <strong>${trade.price.toFixed(2)}</strong>
              <span>{trade.amount.toFixed(4)}</span>
            </div>
          ))}
        </div>

        <div className="section-title">
          <span>Top Movers</span>
          <strong>24h Change</strong>
        </div>
        <div className="top-movers">
          {marketMovers
            .slice()
            .sort((a, b) => Math.abs(b.change) - Math.abs(a.change))
            .slice(0, 4)
            .map((mover) => (
              <div className="mover-row" key={mover.pair}>
                <span>{mover.pair}</span>
                <strong className={mover.change >= 0 ? "price-up" : "price-down"}>
                  {mover.change >= 0 ? "+" : ""}{mover.change}%
                </strong>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
