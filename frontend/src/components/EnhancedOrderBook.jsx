import React, { useState, useEffect } from 'react';
import { calculateSpread, formatPrice } from '../services/tradingUtils';

/**
 * Enhanced Order Book Component
 * ────────────────────────────────────────────────────────────────────────────
 * Displays bid/ask levels with:
 * - Best bid/ask highlighting
 * - Spread display (USDT and %)
 * - Cumulative size visualization
 */

const COLORS = {
  bg: '#0A0E1A',
  bgPanel: '#0D1220',
  bgAlt: '#111827',
  border: '#1E2B3E',
  text: '#94A3B8',
  textBright: '#E2E8F0',
  textMuted: '#475569',
  green: '#10B981',
  greenDim: 'rgba(16,185,129,0.15)',
  red: '#EF4444',
  redDim: 'rgba(239,68,68,0.15)',
};

const EnhancedOrderBook = ({ pair, lastPrice, orderbook = { bids: [], asks: [] } }) => {
  const [book, setBook] = useState({ bids: [], asks: [] });
  const [spread, setSpread] = useState({ spread: 0, spreadPercent: 0, midPrice: 0 });

  useEffect(() => {
    const basePrice =
      Number.isFinite(lastPrice) && lastPrice > 0 ? lastPrice : null;

    const generate = () => {
      if (!basePrice) {
        setBook({ bids: [], asks: [] });
        return;
      }

      const bids = Array.from({ length: 14 }, (_, i) => {
        const p = basePrice * (1 - (i + 1) * 0.0003 - Math.random() * 0.0002);
        const s = +(Math.random() * 3 + 0.1).toFixed(4);
        return {
          price: +p.toFixed(6),
          size: s,
          total: +(p * s).toFixed(2),
          isBest: i === 0
        };
      });

      const asks = Array.from({ length: 14 }, (_, i) => {
        const p = basePrice * (1 + (i + 1) * 0.0003 + Math.random() * 0.0002);
        const s = +(Math.random() * 3 + 0.1).toFixed(4);
        return {
          price: +p.toFixed(6),
          size: s,
          total: +(p * s).toFixed(2),
          isBest: i === 0
        };
      });

      setBook({ bids, asks });

      // Calculate spread
      if (bids.length > 0 && asks.length > 0) {
        const spreadData = calculateSpread(bids[0].price, asks[0].price);
        setSpread(spreadData);
      }
    };

    generate();
    const iv = setInterval(generate, 800);
    return () => clearInterval(iv);
  }, [pair, lastPrice]);

  const maxBidTotal = Math.max(...book.bids.map(b => b.total), 1);
  const maxAskTotal = Math.max(...book.asks.map(a => a.total), 1);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
        background: COLORS.bg,
        color: COLORS.text,
        fontFamily: "'JetBrains Mono', monospace"
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          padding: '8px 12px',
          fontSize: 10,
          color: COLORS.textMuted,
          borderBottom: `1px solid ${COLORS.border}`,
          background: COLORS.bgPanel,
          fontWeight: 600,
          textTransform: 'uppercase'
        }}
      >
        <span>Price</span>
        <span style={{ textAlign: 'center' }}>Size</span>
        <span style={{ textAlign: 'right' }}>Total</span>
      </div>

      {/* Main book */}
      <div
        style={{
          flex: 1,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Asks (selling, reversed) */}
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
          {[...book.asks]
            .reverse()
            .map((a, i) => (
              <div
                key={`ask-${i}`}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr',
                  padding: '2px 12px',
                  fontSize: 11,
                  fontFamily: 'monospace',
                  position: 'relative',
                  overflow: 'hidden',
                  background: a.isBest ? COLORS.redDim : 'transparent',
                  borderLeft: a.isBest ? `3px solid ${COLORS.red}` : 'none'
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: 0,
                    bottom: 0,
                    width: `${(a.total / maxAskTotal) * 100}%`,
                    background: a.isBest ? 'rgba(239,68,68,0.25)' : 'rgba(239,68,68,0.07)',
                    zIndex: 0
                  }}
                />
                <span style={{ color: COLORS.red, zIndex: 1, position: 'relative', fontWeight: a.isBest ? 700 : 400 }}>
                  {formatPrice(a.price)}
                </span>
                <span style={{ textAlign: 'center', color: COLORS.text, zIndex: 1, position: 'relative' }}>
                  {a.size.toFixed(4)}
                </span>
                <span
                  style={{
                    textAlign: 'right',
                    color: COLORS.textMuted,
                    zIndex: 1,
                    position: 'relative',
                    fontSize: 10
                  }}
                >
                  {a.total.toFixed(0)}
                </span>
              </div>
            ))}
        </div>

        {/* Spread divider */}
        <div
          style={{
            padding: '6px 12px',
            background: COLORS.bgAlt,
            fontSize: 11,
            fontFamily: 'monospace',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: `1px solid ${COLORS.border}`,
            borderBottom: `1px solid ${COLORS.border}`,
            color: COLORS.textBright,
            fontWeight: 600
          }}
        >
          <span style={{ color: COLORS.textBright }}>
            {formatPrice(lastPrice)}
          </span>
          <span style={{ fontSize: 9, color: COLORS.textMuted }}>
            Spread: <span style={{ color: COLORS.amber }}>{formatPrice(spread.spread)}</span>
            {' '}
            ({spread.spreadPercent.toFixed(4)}%)
          </span>
        </div>

        {/* Bids (buying) */}
        <div style={{ flex: 1, overflow: 'hidden' }}>
          {book.bids.map((b, i) => (
            <div
              key={`bid-${i}`}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                padding: '2px 12px',
                fontSize: 11,
                fontFamily: 'monospace',
                position: 'relative',
                overflow: 'hidden',
                background: b.isBest ? COLORS.greenDim : 'transparent',
                borderLeft: b.isBest ? `3px solid ${COLORS.green}` : 'none'
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  right: 0,
                  top: 0,
                  bottom: 0,
                  width: `${(b.total / maxBidTotal) * 100}%`,
                  background: b.isBest ? 'rgba(16,185,129,0.25)' : 'rgba(16,185,129,0.07)',
                  zIndex: 0
                }}
              />
              <span
                style={{
                  color: COLORS.green,
                  zIndex: 1,
                  position: 'relative',
                  fontWeight: b.isBest ? 700 : 400
                }}
              >
                {formatPrice(b.price)}
              </span>
              <span style={{ textAlign: 'center', color: COLORS.text, zIndex: 1, position: 'relative' }}>
                {b.size.toFixed(4)}
              </span>
              <span
                style={{
                  textAlign: 'right',
                  color: COLORS.textMuted,
                  zIndex: 1,
                  position: 'relative',
                  fontSize: 10
                }}
              >
                {b.total.toFixed(0)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EnhancedOrderBook;
