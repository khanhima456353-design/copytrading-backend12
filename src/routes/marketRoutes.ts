import { Router } from "express";
import type { Request, Response } from "express-serve-static-core";
import { symbols, buildOrderBook, buildTrades, buildCandles } from "../services/marketData";

const router = Router();

router.get("/symbols", (req: Request, res: Response) => {
  res.json({ symbols });
});

router.get("/orderbook/:pair", (req: Request, res: Response) => {
  const { pair } = req.params;
  const cache = (global as any).orderbookCache;
  if (!cache[pair]) {
    return res.status(503).json({ error: "No market data available" });
  }
  res.json(cache[pair]);
});

router.get("/trades/:pair", async (req: Request, res: Response) => {
  try {
    const { pair } = req.params;
    const trades = await buildTrades(pair);
    res.json(trades);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch trades" });
  }
});

router.get("/candles/:pair", async (req: Request, res: Response) => {
  try {
    const { pair } = req.params;
    const timeframe = String(req.query.timeframe || "1m");
    const candles = await buildCandles(pair, timeframe, 80);
    res.json(candles);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch candles" });
  }
});

export default router;
