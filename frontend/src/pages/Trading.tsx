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
  pair?: string;
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

type AssetHolding = {
  asset: string;
  amount: number;
  value: number;
};

type AccountSummary = {
  available: number;
  locked: number;
  holdings: AssetHolding[];
};

type UserOrder = {
  id: string;
  pair: string;
  type: "market" | "limit" | "stop-loss" | "take-profit" | "oco";
  side: "buy" | "sell";
  price: number;
  amount: number;
  status: "open" | "filled" | "cancelled";
  stopLoss?: number;
  takeProfit?: number;
  createdAt: number;
};

type TradeHistoryItem = {
  time: number;
  price: number;
  quantity: number;
  side: "buy" | "sell";
  pair: string;
  type: "market" | "limit";
};

const timeframeOptions = ["1m", "5m", "15m", "1h", "4h", "1d"];
const formatTradingViewSymbol = (pair: string) => {
  const [base, quote] = pair.split("/");
  return `BINANCE:${base}${quote ?? ""}`;
};

const formatTime = (time: number) =>
  new Date(time * 1000).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

const generateSyntheticPairs = (available: string[]) => {
  if (available.length > 1) return available;
  const bases = ["BTC", "ETH", "SOL", "LTC", "ADA", "XRP", "DOGE", "AVAX", "DOT", "LINK", "MATIC"];
  const quotes = ["USDT", "USD", "BTC", "ETH", "EUR"];
  const symbols = new Set<string>(available);

  for (const base of bases) {
    for (const quote of quotes) {
      if (symbols.size >= 120) break;
      if (base === quote) continue;
      symbols.add(`${base}/${quote}`);
    }
    if (symbols.size >= 120) break;
  }

  return Array.from(symbols).sort();
};

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

const calculateEMA = <T extends { time: number }>(items: T[], period: number, accessor: (item: T) => number) => {
  const ema: Array<{ time: number; value: number }> = [];
  const k = 2 / (period + 1);
  let prevEma = items.length ? accessor(items[0]) : 0;

  items.forEach((item, index) => {
    if (index === 0) {
      prevEma = accessor(item);
      ema.push({ time: item.time, value: prevEma });
      return;
    }

    const value = accessor(item);
    prevEma = Number((value * k + prevEma * (1 - k)).toFixed(2));
    if (index + 1 >= period) {
      ema.push({ time: item.time, value: prevEma });
    }
  });

  return ema;
};

const calculateRSI = (candles: Candle[], period: number) => {
  const changes = candles.map((c, index) => {
    if (index === 0) return 0;
    return c.close - candles[index - 1].close;
  });

  let gains = 0;
  let losses = 0;
  const rsi: Array<{ time: number; value: number }> = [];

  for (let i = 1; i < changes.length; i++) {
    const change = changes[i];
    gains = gains * (period - 1) / period + Math.max(change, 0) / period;
    losses = losses * (period - 1) / period + Math.max(-change, 0) / period;

    if (i >= period) {
      const rs = losses === 0 ? 100 : gains / losses;
      rsi.push({ time: candles[i].time, value: Number((100 - 100 / (1 + rs)).toFixed(2)) });
    }
  }

  return rsi;
};

const calculateBollingerBands = (candles: Candle[], period: number, multiplier: number) => {
  const upper: Array<{ time: number; value: number }> = [];
  const middle: Array<{ time: number; value: number }> = [];
  const lower: Array<{ time: number; value: number }> = [];

  for (let i = 0; i < candles.length; i++) {
    if (i + 1 >= period) {
      const window = candles.slice(i + 1 - period, i + 1);
      const mean = window.reduce((sum, candle) => sum + candle.close, 0) / period;
      const variance = window.reduce((sum, candle) => sum + Math.pow(candle.close - mean, 2), 0) / period;
      const stdev = Math.sqrt(variance);
      middle.push({ time: candles[i].time, value: Number(mean.toFixed(2)) });
      upper.push({ time: candles[i].time, value: Number((mean + multiplier * stdev).toFixed(2)) });
      lower.push({ time: candles[i].time, value: Number((mean - multiplier * stdev).toFixed(2)) });
    }
  }

  return { upper, middle, lower };
};

const calculateMACD = (candles: Candle[], fast = 12, slow = 26, signal = 9) => {
  const fastEMA = calculateEMA(candles, fast, (item) => item.close);
  const slowEMA = calculateEMA(candles, slow, (item) => item.close);
  const macd: Array<{ time: number; value: number }> = [];

  for (const fastPoint of fastEMA) {
    const slowPoint = slowEMA.find((point) => point.time === fastPoint.time);
    if (slowPoint) {
      macd.push({ time: fastPoint.time, value: Number((fastPoint.value - slowPoint.value).toFixed(2)) });
    }
  }

  const signalLine = calculateEMA(macd, signal, (item) => item.value);
  const histogram = macd
    .slice(signalLine.length * -1)
    .map((point, index) => ({
      time: point.time,
      value: Number((point.value - (signalLine[index]?.value ?? point.value)).toFixed(2)),
    }));

  return {
    macd,
    signalLine,
    histogram,
    latest: histogram.length ? histogram[histogram.length - 1] : { time: 0, value: 0 },
  };
};

const buildDepthData = (orderbook: { buy: Order[]; sell: Order[] }) => {
  let cumulativeBid = 0;
  const bids = orderbook.buy
    .slice()
    .sort((a, b) => a.price - b.price)
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

  return {
    bids: bids.sort((a, b) => a.time - b.time),
    asks: asks.sort((a, b) => a.time - b.time),
  };
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

    const interval = 60;

fallbackCandles.push({
  time: Math.floor((now - i * interval) / interval) * interval,
  open: Number(open.toFixed(2)),
  high: Number(high.toFixed(2)),
  low: Number(low.toFixed(2)),
  close: Number(close.toFixed(2)),
  volume: Number((Math.random() * 10 + 1).toFixed(2)),
});
  }

  return fallbackCandles;
};

const createFallbackAccountSummary = (): AccountSummary => ({
  available: 12450.25,
  locked: 520.6,
  holdings: [
    { asset: "BTC", amount: 0.62, value: 23800 },
    { asset: "ETH", amount: 4.1, value: 8800 },
    { asset: "USDT", amount: 5200, value: 5200 },
  ],
});

const createFallbackUserOrders = (): UserOrder[] => [
  {
    id: "o-1",
    pair: "BTC/USDT",
    type: "limit",
    side: "buy",
    price: 29750,
    amount: 0.12,
    status: "open",
    createdAt: Math.floor(Date.now() / 1000) - 4300,
  },
  {
    id: "o-2",
    pair: "BTC/USDT",
    type: "stop-loss",
    side: "sell",
    price: 31200,
    amount: 0.05,
    stopLoss: 30000,
    takeProfit: 32400,
    status: "open",
    createdAt: Math.floor(Date.now() / 1000) - 7800,
  },
];

const createFallbackTradeHistory = (): TradeHistoryItem[] => [
  {
    time: Math.floor(Date.now() / 1000) - 480,
    price: 30080,
    quantity: 0.09,
    side: "buy",
    pair: "BTC/USDT",
    type: "market",
  },
  {
    time: Math.floor(Date.now() / 1000) - 1280,
    price: 30145,
    quantity: 0.03,
    side: "sell",
    pair: "BTC/USDT",
    type: "limit",
  },
];

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
  const [showRSI, setShowRSI] = useState(false);
  const [showBollinger, setShowBollinger] = useState(false);
  const [showMACD, setShowMACD] = useState(false);
  const [showTradingView, setShowTradingView] = useState(false);
  const [orderType, setOrderType] = useState<UserOrder["type"]>("market");
  const [orderSide, setOrderSide] = useState<"buy" | "sell">("buy");
  const [stopLoss, setStopLoss] = useState<string>("");
  const [takeProfit, setTakeProfit] = useState<string>("");
  const [sortBy, setSortBy] = useState<"name" | "change" | "volume">("name");
  const [depthLimit, setDepthLimit] = useState<number>(15);
  const [pricePrecision, setPricePrecision] = useState<number>(2);
  const [accountSummary, setAccountSummary] = useState<AccountSummary>(createFallbackAccountSummary());
  const [userOrders, setUserOrders] = useState<UserOrder[]>(createFallbackUserOrders());
  const [tradeHistory, setTradeHistory] = useState<TradeHistoryItem[]>(createFallbackTradeHistory());
  const [macdSummary, setMacdSummary] = useState({ macd: 0, signal: 0, histogram: 0 });

  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const depthContainerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<any>(null);
  const candleSeriesRef = useRef<any>(null);
  const smaSeriesRef = useRef<any>(null);
  const emaSeriesRef = useRef<any>(null);
  const bbUpperSeriesRef = useRef<any>(null);
  const bbMiddleSeriesRef = useRef<any>(null);
  const bbLowerSeriesRef = useRef<any>(null);
  const depthChartRef = useRef<any>(null);
  const bidsSeriesRef = useRef<any>(null);
  const asksSeriesRef = useRef<any>(null);
  const lastCandleRef = useRef<Candle | null>(null);

  const updateIndicatorLines = (data: Candle[]) => {
    if (!candleSeriesRef.current) return;

    const sma = calculateSMA(data, 20);
    const ema = calculateEMA(data, 50, (item) => item.close);
    const bollinger = calculateBollingerBands(data, 20, 2);
    const rsi = calculateRSI(data, 14);
    const macd = calculateMACD(data, 12, 26, 9);

    smaSeriesRef.current?.setData(showSMA ? sma : []);
    emaSeriesRef.current?.setData(showEMA ? ema : []);

    if (showBollinger) {
      bbUpperSeriesRef.current?.setData(bollinger.upper);
      bbMiddleSeriesRef.current?.setData(bollinger.middle);
      bbLowerSeriesRef.current?.setData(bollinger.lower);
    } else {
      bbUpperSeriesRef.current?.setData([]);
      bbMiddleSeriesRef.current?.setData([]);
      bbLowerSeriesRef.current?.setData([]);
    }

    if (showMACD) {
      setMacdSummary({
        macd: macd.macd.length ? macd.macd[macd.macd.length - 1].value : 0,
        signal: macd.signalLine.length ? macd.signalLine[macd.signalLine.length - 1].value : 0,
        histogram: macd.latest.value,
      });
    }
  };

  const createChartInstances = () => {
    if (!chartContainerRef.current || chartRef.current) return;

    try {
      const containerWidth = chartContainerRef.current.clientWidth;
      const containerHeight = chartContainerRef.current.clientHeight || 420;

      const chart: any = createChart(chartContainerRef.current, {
        width: containerWidth,
        height: Math.max(containerHeight, 380),
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

      smaSeriesRef.current = chart.addLineSeries({ color: "#f8e71c", lineWidth: 2 });
      emaSeriesRef.current = chart.addLineSeries({ color: "#22c55e", lineWidth: 2 });
      bbUpperSeriesRef.current = chart.addLineSeries({ color: "#60a5fa", lineWidth: 1, lineStyle: 2 });
      bbMiddleSeriesRef.current = chart.addLineSeries({ color: "#c084fc", lineWidth: 1, lineStyle: 2 });
      bbLowerSeriesRef.current = chart.addLineSeries({ color: "#60a5fa", lineWidth: 1, lineStyle: 2 });

      chartRef.current = chart;
    } catch (error) {
      console.error("Failed to create chart:", error);
    }
  };

  const createDepthChart = () => {
    if (!depthContainerRef.current || depthChartRef.current) return;

    try {
      const containerWidth = depthContainerRef.current.clientWidth || 300;
      const containerHeight = depthContainerRef.current.clientHeight || 300;

      const chart: any = createChart(depthContainerRef.current, {
        width: containerWidth,
        height: Math.max(containerHeight, 280),
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
        topColor: "rgba(16,185,129,0.4)",
        bottomColor: "rgba(16,185,129,0.08)",
        lineColor: "#10b981",
      });

      asksSeriesRef.current = chart.addAreaSeries({
        topColor: "rgba(239,68,68,0.4)",
        bottomColor: "rgba(239,68,68,0.08)",
        lineColor: "#ef4444",
      });

      depthChartRef.current = chart;
    } catch (error) {
      console.error("Failed to create depth chart:", error);
    }
  };

  const resizeCharts = () => {
    try {
      const chartWidth = chartContainerRef.current?.clientWidth ?? 0;
      const chartHeight = chartContainerRef.current?.clientHeight ?? 420;
      if (chartRef.current && chartWidth) {
        chartRef.current.applyOptions({ 
          width: chartWidth,
          height: Math.max(chartHeight, 380)
        });
      }

      const depthWidth = depthContainerRef.current?.clientWidth ?? 0;
      const depthHeight = depthContainerRef.current?.clientHeight ?? 300;
      if (depthChartRef.current && depthWidth) {
        depthChartRef.current.applyOptions({ 
          width: depthWidth,
          height: Math.max(depthHeight, 280)
        });
      }
    } catch (error) {
      console.error("Failed to resize charts:", error);
    }
  };

  const fetchSymbols = async () => {
    try {
      const api = await getAxios();
      const res = await api.get("/api/market/symbols");
      const available = generateSyntheticPairs(res.data.symbols || ["BTC/USDT"]);
      setSymbols(available);
      setFilteredSymbols(available);
      setMarketMovers(
        available.map((pair: string) => ({
          pair,
          change: Number(((Math.random() - 0.5) * 12).toFixed(2)),
          volume: Number((Math.random() * 150 + 10).toFixed(2)),
        }))
      );
      setSymbol((prev) => (available.includes(prev) ? prev : available[0]));
    } catch (error) {
      console.error("Unable to load symbols:", error);
      const available = generateSyntheticPairs(["BTC/USDT"]);
      setSymbols(available);
      setFilteredSymbols(available);
      setMarketMovers(
        available.slice(0, 20).map((pair) => ({
          pair,
          change: Number(((Math.random() - 0.5) * 12).toFixed(2)),
          volume: Number((Math.random() * 150 + 10).toFixed(2)),
        }))
      );
    }
  };

  const fetchOrderBook = async (selectedSymbol: string) => {
    try {
      const api = await getAxios();
      const bookRes = await api.get(`/api/market/orderbook/${encodeURIComponent(selectedSymbol)}`);
      const book: { buy: Order[]; sell: Order[] } = bookRes.data;
      let sellTotal = 0;
      const sell = book.sell.map((o: Order) => {
        sellTotal += o.amount;
        return { ...o, total: sellTotal };
      });
      let buyTotal = 0;
      const buy = book.buy.map((o: Order) => {
        buyTotal += o.amount;
        return { ...o, total: buyTotal };
      });
      setOrderbook({ buy, sell });
      const { bids, asks } = buildDepthData({ buy, sell });
      try {
        bidsSeriesRef.current?.setData(bids);
        asksSeriesRef.current?.setData(asks);
        depthChartRef.current?.timeScale().fitContent();
      } catch (err) {
        console.error("Error updating depth chart:", err);
      }
    } catch (error) {
      console.error("Order book fetch failed:", error);
      setOrderbook({ buy: [], sell: [] });
    }
  };

  const fetchMarketData = async (selectedSymbol: string, selectedTimeframe: string) => {
    try {
      const api = await getAxios();
      const [candlesRes, tradesRes] = await Promise.all([
        api.get(`/api/market/candles/${encodeURIComponent(selectedSymbol)}?timeframe=${selectedTimeframe}`),
        api.get(`/api/market/trades/${encodeURIComponent(selectedSymbol)}`),
      ]);

      const candleData: Candle[] = candlesRes.data;
      const liveTradeData: Trade[] = tradesRes.data || [];

      const cleanCandles = candleData
        .map((c) => ({ ...c, time: Math.floor(Number(c.time)) }))
        .sort((a, b) => a.time - b.time);

      const fallbackCandles = cleanCandles.length ? cleanCandles : createFallbackCandles();
      setCandles(fallbackCandles);
      setTrades(liveTradeData.slice().sort((a, b) => b.time - a.time).slice(0, 40));
      setTradeHistory(
        liveTradeData
          .slice()
          .sort((a, b) => b.time - a.time)
          .slice(0, 40)
          .map((trade) => ({
            time: trade.time,
            price: trade.price,
            quantity: trade.amount,
            side: trade.side,
            pair: selectedSymbol,
            type: "market",
          }))
      );

      if (!candleSeriesRef.current) return;

     const cleaned = fallbackCandles
  .map(c => ({
    time: Math.floor(Number(c.time)), // force integer timestamps
    open: Number(c.open),
    high: Number(c.high),
    low: Number(c.low),
    close: Number(c.close),
  }))
  .filter(c => !isNaN(c.time))
  .sort((a, b) => a.time - b.time)
  .reduce((acc: any[], curr) => {
    if (!acc.length) {
      acc.push(curr);
    } else {
      const prev = acc[acc.length - 1];

      // skip duplicates
      if (curr.time === prev.time) return acc;

      // fix backward time (force forward)
      if (curr.time < prev.time) {
        curr.time = prev.time + 1;
      }

      acc.push(curr);
    }
    return acc;
  }, [])
  .sort((a, b) => a.time - b.time); // ensure ascending order

try {
  candleSeriesRef.current.setData(
    cleaned.map((candle) => ({
      time: candle.time,
      open: candle.open,
      high: candle.high,
      low: candle.low,
      close: candle.close,
    }))
  );

  updateIndicatorLines(cleaned);
  chartRef.current?.timeScale().fitContent();
} catch (err) {
  console.error("Error setting chart data:", err);
}

     

      const lastCandle = fallbackCandles[fallbackCandles.length - 1];
      if (lastCandle) {
        setLastPrice(lastCandle.close);
        setPriceInput(lastCandle.close.toFixed(2));
        setChange24h(Number((lastCandle.close - fallbackCandles[0].open).toFixed(2)));
        lastCandleRef.current = lastCandle;
      }
    } catch (error) {
      console.error("Market data load failed:", error);
      const fallbackCandles = createFallbackCandles();
      setCandles(fallbackCandles);
      setTrades([]);
      setTradeHistory(createFallbackTradeHistory());
      setLastPrice(fallbackCandles[fallbackCandles.length - 1]?.close || 30000);
      setPriceInput("30000.00");
      setChange24h(0);
      lastCandleRef.current = fallbackCandles[fallbackCandles.length - 1];

      if (!candleSeriesRef.current) return;

      const sorted = [...fallbackCandles].sort((a, b) => a.time - b.time);
      try {
        candleSeriesRef.current?.setData(
          sorted.map((candle) => ({
            time: candle.time,
            open: candle.open,
            high: candle.high,
            low: candle.low,
            close: candle.close,
          }))
        );
        updateIndicatorLines(sorted);
        chartRef.current?.timeScale().fitContent();
      } catch (err) {
        console.error("Error setting fallback chart data:", err);
      }
    }
  };

  useEffect(() => {
    // Create charts with a slight delay to ensure DOM is ready
    const initTimer = setTimeout(() => {
      try {
        createChartInstances();
        createDepthChart();
        resizeCharts();
      } catch (error) {
        console.error("Chart initialization failed:", error);
      }
    }, 150);

    fetchSymbols();
    
    const resizeHandler = () => {
      resizeCharts();
    };
    window.addEventListener("resize", resizeHandler);

    return () => {
      clearTimeout(initTimer);
      window.removeEventListener("resize", resizeHandler);
      try {
        chartRef.current?.remove();
        depthChartRef.current?.remove();
      } catch (e) {
        console.error("Error cleaning up charts:", e);
      }
    };
  }, []);

  useEffect(() => {
    if (!symbol) return;
    fetchMarketData(symbol, timeframe);
  }, [symbol, timeframe]);

  useEffect(() => {
    if (!symbol) return;
    fetchOrderBook(symbol);
    const interval = setInterval(() => {
      fetchOrderBook(symbol);
    }, 500); // poll every 500ms for millisecond-like updates
    return () => clearInterval(interval);
  }, [symbol]);

  useEffect(() => {
    setFilteredSymbols(
      symbols
        .filter((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))
        .sort((a, b) => {
          if (sortBy === "change") {
            const aMover = marketMovers.find((m) => m.pair === a)?.change || 0;
            const bMover = marketMovers.find((m) => m.pair === b)?.change || 0;
            return Math.abs(bMover) - Math.abs(aMover);
          }
          if (sortBy === "volume") {
            const aMover = marketMovers.find((m) => m.pair === a)?.volume || 0;
            const bMover = marketMovers.find((m) => m.pair === b)?.volume || 0;
            return bMover - aMover;
          }
          return a.localeCompare(b);
        })
    );
  }, [searchQuery, symbols, sortBy, marketMovers]);

  useEffect(() => {
    updateIndicatorLines(candles);
  }, [showSMA, showEMA, showBollinger, showMACD, showRSI]);

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
        const interval = tfMap[timeframe] || 60;
        const tradeTime = Math.floor(Date.now() / 1000 / interval) * interval;
        const tradeVolume = Number(trade.amount);
        const side = trade.side === "sell" ? "sell" : "buy";

        setTrades((prev) => [
          { time: trade.time || tradeTime, price: tradePrice, amount: tradeVolume, side },
          ...prev.slice(0, 39),
        ]);

        setTradeHistory((prev) => [
          {
            time: trade.time || tradeTime,
            price: tradePrice,
            quantity: tradeVolume,
            side,
            pair: symbol,
            type: "market",
          },
          ...prev.slice(0, 39),
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
          try {
            candleSeriesRef.current?.update(nextCandle);
          } catch (err) {
            console.error("Error updating candle:", err);
          }
        } else {
          existing.high = Math.max(existing.high, tradePrice);
          existing.low = Math.min(existing.low, tradePrice);
          existing.close = tradePrice;
          existing.volume += tradeVolume;
          try {
            candleSeriesRef.current?.update(existing);
          } catch (err) {
            console.error("Error updating existing candle:", err);
          }
        }

        setLastPrice(tradePrice);
      });

      socket.on("priceUpdate", (update: any) => {
        if (update.pair !== symbol) return;
        const price = Number(update.price);
        if (Number.isNaN(price)) return;
        setLastPrice(price);
        setChange24h(Number((price - (candles[0]?.open || price)).toFixed(2)));
      });

      socket.on("orderbook", (data: any) => {
        if (data.pair !== symbol) return;

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
        try {
          bidsSeriesRef.current?.setData(bids);
          asksSeriesRef.current?.setData(asks);
        } catch (err) {
          console.error("Error updating orderbook in socket:", err);
        }
      });
    };

    initSocket();

    return () => {
      socket?.off("trade");
      socket?.off("orderbook");
      socket?.off("priceUpdate");
      socket?.disconnect();
    };
  }, [symbol, timeframe]);

  const placeOrder = async (side: "buy" | "sell") => {
    if (!priceInput || !amountInput) return;
    const price = Number(priceInput);
    const amount = Number(amountInput);
    if (Number.isNaN(price) || Number.isNaN(amount) || amount <= 0) return;

    const newOrder: UserOrder = {
      id: `u-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      pair: symbol,
      type: orderType,
      side,
      price,
      amount,
      status: orderType === "market" ? "filled" : "open",
      stopLoss: stopLoss ? Number(stopLoss) : undefined,
      takeProfit: takeProfit ? Number(takeProfit) : undefined,
      createdAt: Math.floor(Date.now() / 1000),
    };

    setUserOrders((prev) => [newOrder, ...prev.slice(0, 29)]);
    setTradeHistory((prev) => [
      {
        time: Math.floor(Date.now() / 1000),
        price,
        quantity: amount,
        side,
        pair: symbol,
        type: orderType === "market" ? "market" : "limit",
      },
      ...prev.slice(0, 39),
    ]);

    if (orderType === "market") {
      setLastPrice(price);
      setChange24h(Number((price - (candles[0]?.open || price)).toFixed(2)));
    }

    try {
      const api = await getAxios();
      await api.post("/api/trade/place", {
        pair: symbol,
        amount,
        side,
        price,
        type: orderType,
        stopLoss: stopLoss ? Number(stopLoss) : undefined,
        takeProfit: takeProfit ? Number(takeProfit) : undefined,
      });
    } catch (error) {
      console.error("Order failed:", error);
    }

    setAmountInput("");
  };

  const cancelOrder = (orderId: string) => {
    setUserOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: "cancelled" } : order
      )
    );
  };

  const activeOrders = userOrders.filter((order) => order.status === "open");
  const recentHistory = tradeHistory.slice(0, 8);
  const sortedPairs = filteredSymbols.slice(0, 30);

  const buyOrders = orderbook.buy
    .slice()
    .sort((a, b) => b.price - a.price)
    .slice(0, depthLimit)
    .map((order) => ({ ...order, total: Number((order.price * order.amount).toFixed(2)) }));

  const sellOrders = orderbook.sell
    .slice()
    .sort((a, b) => a.price - b.price)
    .slice(0, depthLimit)
    .map((order) => ({ ...order, total: Number((order.price * order.amount).toFixed(2)) }));

  let buyCumulative = 0;
  const buyDisplay = buyOrders.map((order) => {
    buyCumulative += order.total || 0;
    return { ...order, cumulative: buyCumulative };
  });

  let sellCumulative = 0;
  const sellDisplay = sellOrders.map((order) => {
    sellCumulative += order.total || 0;
    return { ...order, cumulative: sellCumulative };
  });

  const renderPriceBlock = () => {
    const totalBuy = orderbook.buy.reduce((sum, item) => sum + item.amount, 0);
    const totalSell = orderbook.sell.reduce((sum, item) => sum + item.amount, 0);
    const pressure = totalBuy + totalSell ? ((totalBuy - totalSell) / (totalBuy + totalSell)) * 100 : 0;
    const pressureText = pressure >= 0 ? `Buy pressure +${pressure.toFixed(1)}%` : `Sell pressure ${pressure.toFixed(1)}%`;

    return (
      <div className="liquidity-summary">
        <span>{pressureText}</span>
        <strong>{totalBuy.toFixed(2)} / {totalSell.toFixed(2)}</strong>
      </div>
    );
  };

  return (
    <div className="trading-page">
      <div className="trading-sidebar trading-panel">
        <div className="section-title">
          <span>Account</span>
          <strong>Portfolio</strong>
        </div>

        <div className="account-summary card-panel">
          <div className="balance-row">
            <div>
              <span>Available</span>
              <strong>${accountSummary.available.toLocaleString()}</strong>
            </div>
            <div>
              <span>Locked</span>
              <strong>${accountSummary.locked.toLocaleString()}</strong>
            </div>
          </div>
          <div className="holdings-list">
            {accountSummary.holdings.map((holding) => (
              <div key={holding.asset} className="holding-row">
                <span>{holding.asset}</span>
                <strong>{holding.amount.toFixed(4)}</strong>
                <span>${holding.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="section-title">
          <span>Open Orders</span>
          <strong>Live Ticket</strong>
        </div>
        <div className="orders-summary card-panel">
          {activeOrders.length ? (
            activeOrders.map((order) => (
              <div key={order.id} className={`order-card ${order.side}`}>
                <div>
                  <strong>{order.pair}</strong>
                  <span>{order.type} • {order.side.toUpperCase()}</span>
                </div>
                <div>
                  <span>{order.amount} @ {order.price.toFixed(2)}</span>
                  <button onClick={() => cancelOrder(order.id)}>Cancel</button>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">No active orders. Place market, limit, stop, take-profit or OCO orders below.</div>
          )}
        </div>

        <div className="section-title">
          <span>Order Book</span>
          <strong>Market Depth</strong>
        </div>
        <div className="sidebar-orderbook card-panel">
          <div className="sidebar-orderbook-header">
            <span>Ask / Bid</span>
            <span>Levels 17 / 17</span>
          </div>
          <div className="sidebar-orderbook-list">
            {[...Array(17).keys()].map((index) => {
              const ask = orderbook.sell.slice().sort((a, b) => b.price - a.price)[index];
              return (
                <div
                  key={`sidebar-ask-${index}`}
                  className={`sidebar-orderbook-row sell ${ask ? "has-order" : "empty"}`}
                  onClick={() => ask && setPriceInput(ask.price.toFixed(2))}
                >
                  <span>{ask ? ask.price.toFixed(2) : "-"}</span>
                  <span>{ask ? ask.amount.toFixed(3) : "-"}</span>
                </div>
              );
            })}
          </div>
          <div className="sidebar-orderbook-divider" />
          <div className="sidebar-orderbook-list">
            {[...Array(17).keys()].map((index) => {
              const bid = orderbook.buy.slice().sort((a, b) => b.price - a.price)[index];
              return (
                <div
                  key={`sidebar-bid-${index}`}
                  className={`sidebar-orderbook-row buy ${bid ? "has-order" : "empty"}`}
                  onClick={() => bid && setPriceInput(bid.price.toFixed(2))}
                >
                  <span>{bid ? bid.price.toFixed(2) : "-"}</span>
                  <span>{bid ? bid.amount.toFixed(3) : "-"}</span>
                </div>
              );
            })}
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
                <input type="checkbox" checked={showSMA} onChange={() => setShowSMA((prev) => !prev)} />
                SMA 20
              </label>
              <label>
                <input type="checkbox" checked={showEMA} onChange={() => setShowEMA((prev) => !prev)} />
                EMA 50
              </label>
              <label>
                <input type="checkbox" checked={showBollinger} onChange={() => setShowBollinger((prev) => !prev)} />
                Bollinger
              </label>
            </div>
            <div className="indicator-controls">
              <button className={`timeframe-btn ${showTradingView ? "active" : ""}`} onClick={() => setShowTradingView((prev) => !prev)}>
                {showTradingView ? "Chart" : "TradingView"}
              </button>
            </div>
          </div>
        </div>

        <div className="chart-and-depth-container">
          {showTradingView ? (
            <div className="tradingview-wrapper">
              <iframe
                title="TradingView"
                src={`https://s.tradingview.com/widgetembed/?symbol=${formatTradingViewSymbol(symbol)}&theme=dark&interval=${timeframe}&hidetoptoolbar=1&timezone=Etc/UTC`}
                frameBorder="0"
                className="tradingview-iframe"
              />
            </div>
          ) : (
            <div className="chart-wrapper" ref={chartContainerRef} />
          )}
          
          <div className="depth-panel integrated-depth">
            <div className="section-title compact">
              <span>Depth</span>
              <strong>Chart</strong>
            </div>
            {renderPriceBlock()}
            <div className="depth-chart-wrapper" ref={depthContainerRef} />
          </div>
        </div>

        <div className="central-orderbook card-panel">
          <div className="central-orderbook-top">
            <div className="central-orderbook-title">
              <span>Order Book</span>
              <strong>{symbol}</strong>
            </div>
            <div className="central-orderbook-controls">
              <label>
                Depth
                <select value={depthLimit} onChange={(e) => setDepthLimit(Number(e.target.value))}>
                  {[10, 15, 20, 25].map((value) => (
                    <option key={value} value={value}>{value}</option>
                  ))}
                </select>
              </label>
              <label>
                Group
                <select value={pricePrecision} onChange={(e) => setPricePrecision(Number(e.target.value))}>
                  {[1, 2, 3, 4].map((value) => (
                    <option key={value} value={value}>{value} decimals</option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          <div className="central-orderbook-grid">
            <div className="orderbook-side">
              <div className="orderbook-side-header buy">
                <span>Buy Order</span>
              </div>
              <div className="orderbook-column-header">
                <span>Price (USDT)</span>
                <span>Amount</span>
                <span>Total</span>
                <span>Sum</span>
              </div>
              {buyDisplay.map((order, index) => (
                <div
                  key={`buy-${index}`}
                  className={`orderbook-table-row buy ${order ? "has-order" : "empty"}`}
                  onClick={() => order && setPriceInput(order.price.toFixed(pricePrecision))}
                >
                  <span>{order ? order.price.toFixed(pricePrecision) : "-"}</span>
                  <span>{order ? order.amount.toFixed(4) : "-"}</span>
                  <span>{order ? order.total.toFixed(2) : "-"}</span>
                  <span>{order ? order.cumulative.toFixed(2) : "-"}</span>
                </div>
              ))}
            </div>
            <div className="orderbook-side">
              <div className="orderbook-side-header sell">
                <span>Sell Order</span>
              </div>
              <div className="orderbook-column-header">
                <span>Price (USDT)</span>
                <span>Amount</span>
                <span>Total</span>
                <span>Sum</span>
              </div>
              {sellDisplay.map((order, index) => (
                <div
                  key={`sell-${index}`}
                  className={`orderbook-table-row sell ${order ? "has-order" : "empty"}`}
                  onClick={() => order && setPriceInput(order.price.toFixed(pricePrecision))}
                >
                  <span>{order ? order.price.toFixed(pricePrecision) : "-"}</span>
                  <span>{order ? order.amount.toFixed(4) : "-"}</span>
                  <span>{order ? order.total.toFixed(2) : "-"}</span>
                  <span>{order ? order.cumulative.toFixed(2) : "-"}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="section-title order-form-title">
          <span>Order Ticket</span>
          <strong>Market + Advanced</strong>
        </div>
        <div className="order-form">
          <div className="input-row split">
            <div className="order-field">
              <label>Side</label>
              <select value={orderSide} onChange={(e) => setOrderSide(e.target.value as "buy" | "sell")}> 
                <option value="buy">Buy</option>
                <option value="sell">Sell</option>
              </select>
            </div>
            <div className="order-field">
              <label>Type</label>
              <select value={orderType} onChange={(e) => setOrderType(e.target.value as UserOrder["type"])}>
                <option value="market">Market</option>
                <option value="limit">Limit</option>
                <option value="stop-loss">Stop-Loss</option>
                <option value="take-profit">Take-Profit</option>
                <option value="oco">OCO</option>
              </select>
            </div>
          </div>

          <div className="input-row split">
            <div className="order-field">
              <label>Price</label>
              <input placeholder="Price" value={priceInput} onChange={(e) => setPriceInput(e.target.value)} />
            </div>
            <div className="order-field">
              <label>Amount</label>
              <input placeholder="Amount" value={amountInput} onChange={(e) => setAmountInput(e.target.value)} />
            </div>
          </div>

          {(orderType === "stop-loss" || orderType === "oco") && (
            <div className="input-row split">
              <div className="order-field">
                <label>Stop Loss</label>
                <input placeholder="Stop Loss" value={stopLoss} onChange={(e) => setStopLoss(e.target.value)} />
              </div>
              <div className="order-field">
                <label>Take Profit</label>
                <input placeholder="Take Profit" value={takeProfit} onChange={(e) => setTakeProfit(e.target.value)} />
              </div>
            </div>
          )}

          <div className="trade-actions">
            <button className="action-btn buy" onClick={() => placeOrder("buy")}>Buy</button>
            <button className="action-btn sell" onClick={() => placeOrder("sell")}>Sell</button>
          </div>
          <button className="secondary-btn" onClick={() => {
            setPriceInput("");
            setAmountInput("");
            setStopLoss("");
            setTakeProfit("");
          }}>
            Clear
          </button>
        </div>

        <div className="indicator-summary-grid">
          <div className="indicator-summary-card">
            <span>RSI 14</span>
            <strong>{showRSI ? `${calculateRSI(candles, 14).slice(-1)[0]?.value ?? 0}` : "—"}</strong>
          </div>
          <div className="indicator-summary-card">
            <span>MACD</span>
            <strong>{showMACD ? `${macdSummary.macd.toFixed(2)} / ${macdSummary.signal.toFixed(2)}` : "—"}</strong>
          </div>
          <div className="indicator-summary-card">
            <span>Bollinger Band</span>
            <strong>{showBollinger ? `${calculateBollingerBands(candles, 20, 2).upper.slice(-1)[0]?.value ?? 0}` : "—"}</strong>
          </div>
        </div>
      </div>

      <div className="market-sidebar trading-panel">
        <div className="section-title">
          <span>Market Pairs</span>
          <strong>Search & Sort</strong>
        </div>
        <div className="market-search-row">
          <input type="text" placeholder="Search pair" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>
        <div className="sort-buttons">
          <button className={sortBy === "name" ? "sort-active" : ""} onClick={() => setSortBy("name")}>Name</button>
          <button className={sortBy === "change" ? "sort-active" : ""} onClick={() => setSortBy("change")}>Move</button>
          <button className={sortBy === "volume" ? "sort-active" : ""} onClick={() => setSortBy("volume")}>Volume</button>
        </div>

        <div className="pair-list">
          {sortedPairs.map((pair) => (
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
          {trades.slice(0, 20).map((trade, index) => (
            <div className={`trade-row ${trade.side === "sell" ? "price-down" : "price-up"}`} key={`trade-${index}`}>
              <strong>${trade.price.toFixed(2)}</strong>
              <span>{trade.amount.toFixed(4)}</span>
              <span>{formatTime(trade.time)}</span>
            </div>
          ))}
        </div>

        <div className="section-title">
          <span>Recent History</span>
          <strong>My Trades</strong>
        </div>
        <div className="trade-history-list scrollable">
          {tradeHistory.slice(0, 7).map((item) => (
            <div key={`${item.pair}-${item.time}`} className="history-row">
              <div>
                <strong>{item.pair}</strong>
                <span>{item.type}</span>
              </div>
              <div>
                <span>{item.quantity.toFixed(4)}</span>
                <strong className={item.side === "sell" ? "price-down" : "price-up"}>${item.price.toFixed(2)}</strong>
              </div>
            </div>
          ))}
        </div>

        <div className="section-title">
          <span>Top Movers</span>
          <strong>24h</strong>
        </div>
        <div className="top-movers">
          {marketMovers
            .slice()
            .sort((a, b) => Math.abs(b.change) - Math.abs(a.change))
            .slice(0, 5)
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
