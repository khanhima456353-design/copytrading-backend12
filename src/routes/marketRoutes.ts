import { Router, Request, Response } from "express";
import { symbols, buildOrderBook, buildTrades, buildCandles } from "../services/marketData";

const router = Router();

router.get("/symbols", (req: Request, res: Response) => {
  res.json({ symbols });
});

router.get("/orderbook/:pair", (req: Request, res: Response) => {
  const { pair } = req.params;
  const book = buildOrderBook(pair);
  res.json(book);
});

router.get("/trades/:pair", (req: Request, res: Response) => {
  const { pair } = req.params;
  const trades = buildTrades(pair);
  res.json(trades);
});

router.get("/candles/:pair", (req: Request, res: Response) => {
  const { pair } = req.params;
  const timeframe = String(req.query.timeframe || "1m");
  const candles = buildCandles(pair, timeframe, 80);
  res.json(candles);
});

export default router;
