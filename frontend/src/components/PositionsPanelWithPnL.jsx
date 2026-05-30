import { simulationEngine } from '../services/swanCoreSimulationEngine';
import React, { useState, useEffect } from 'react';
import { calculateUnrealizedPnL, formatPnL } from '../services/tradingUtils';

/**
 * Positions Panel with Real-Time Unrealized PnL
 * ────────────────────────────────────────────────────────────────────────────
 * Displays open positions with:
 * - Real-time PnL calculations
 * - Win rate and total equity
 * - Quick close/modify actions
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

const PositionsPanelWithPnL = ({ positions = [], marketPrices = {}, onClose = () => {} }) => {
  const [displayPositions, setDisplayPositions] = useState([]);
  const [portfolioBalance, setPortfolioBalance] = useState(simulationEngine.getState().portfolio.availableUSDT + simulationEngine.getState().portfolio.lockedUSDT);

  useEffect(() => {
    const unsub = simulationEngine.subscribe((state) => {
      const bal = state.portfolio.availableUSDT + state.portfolio.lockedUSDT;
      setPortfolioBalance(bal);
    });
    return () => unsub();
  }, []);
  const [summary, setSummary] = useState({
    totalBalance: 0,
    totalEquity: 0,
    unrealizedPnL: 0,
    realizedPnL: 0,
    winRate: 0
  });

  useEffect(() => {
    if (!positions || positions.length === 0) {
      setDisplayPositions([]);
      return;
    }

    // Calculate PnL for each position
    const withPnL = positions.map(pos => {
      const currentPrice = marketPrices[pos.pair] || pos.entryPrice;
      const pnl = calculateUnrealizedPnL(pos, currentPrice);
      return {
        ...pos,
        currentPrice,
        ...pnl
      };
    });

    setDisplayPositions(withPnL);

    // Calculate summary
    const totalUnrealizedPnL = withPnL.reduce((sum, p) => sum + (p.pnl || 0), 0);
    const profitablePositions = withPnL.filter(p => p.isProfit).length;
    const totalPositions = withPnL.length || 1;
    const winRate = (profitablePositions / totalPositions) * 100;

    setSummary({
      totalBalance: portfolioBalance,
      totalEquity: portfolioBalance + totalUnrealizedPnL,
      unrealizedPnL: totalUnrealizedPnL,
      realizedPnL: 0,
      winRate: Number(winRate.toFixed(2))
    });
  }, [positions, marketPrices]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: COLORS.bg,
        color: COLORS.text,
        fontFamily: "'JetBrains Mono', monospace"
      }}
    >
      {/* Summary */}
      <div
        style={{
          padding: '12px',
          borderBottom: `1px solid ${COLORS.border}`,
          background: COLORS.bgPanel
        }}
      >
        <div style={{ marginBottom: 8 }}>
          <div style={{ fontSize: 10, color: COLORS.textMuted, marginBottom: 2 }}>TOTAL EQUITY</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: COLORS.textBright }}>
            ${summary.totalEquity.toFixed(2)}
          </div>
          <div style={{ fontSize: 11, color: COLORS.text, marginTop: 2 }}>
            Balance: ${summary.totalBalance.toFixed(2)} | Unrealized PnL:{' '}
            <span style={{ color: summary.unrealizedPnL >= 0 ? COLORS.green : COLORS.red }}>
              {summary.unrealizedPnL >= 0 ? '+' : ''}{summary.unrealizedPnL.toFixed(2)}
            </span>
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 8,
            fontSize: 10
          }}
        >
          <div style={{ background: COLORS.bgAlt, padding: '6px 8px', borderRadius: 4 }}>
            <div style={{ color: COLORS.textMuted, marginBottom: 2 }}>Win Rate</div>
            <div style={{ fontWeight: 700, color: COLORS.textBright }}>{summary.winRate.toFixed(1)}%</div>
          </div>
          <div style={{ background: COLORS.bgAlt, padding: '6px 8px', borderRadius: 4 }}>
            <div style={{ color: COLORS.textMuted, marginBottom: 2 }}>Open Positions</div>
            <div style={{ fontWeight: 700, color: COLORS.textBright }}>{displayPositions.length}</div>
          </div>
        </div>
      </div>

      {/* Positions List */}
      <div style={{ flex: 1, overflow: 'auto', padding: '8px 0' }}>
        {displayPositions.length === 0 ? (
          <div
            style={{
              padding: '20px',
              textAlign: 'center',
              color: COLORS.textMuted,
              fontSize: 12
            }}
          >
            No open positions
          </div>
        ) : (
          displayPositions.map((pos, idx) => (
            <div
              key={idx}
              style={{
                padding: '8px 12px',
                borderBottom: `1px solid ${COLORS.border}`,
                background: pos.isProfit ? COLORS.greenDim : COLORS.redDim
              }}
            >
              {/* Header */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 6
                }}
              >
                <span style={{ fontWeight: 700, fontSize: 12, color: COLORS.textBright }}>
                  {pos.pair}
                </span>
                <span
                  style={{
                    fontSize: 11,
                    color: pos.isProfit ? COLORS.green : COLORS.red,
                    fontWeight: 700
                  }}
                >
                  {pos.isProfit ? '+' : ''}{pos.pnl.toFixed(2)} USDT ({pos.pnlPercent.toFixed(2)}%)
                </span>
              </div>

              {/* Details */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr 1fr',
                  gap: 8,
                  fontSize: 9,
                  marginBottom: 6,
                  color: COLORS.text
                }}
              >
                <div>
                  <div style={{ color: COLORS.textMuted, marginBottom: 2 }}>Side</div>
                  <div style={{ fontWeight: 600 }}>{(pos.side || 'BUY').toUpperCase()}</div>
                </div>
                <div>
                  <div style={{ color: COLORS.textMuted, marginBottom: 2 }}>Entry</div>
                  <div style={{ fontWeight: 600 }}>${pos.entryPrice.toFixed(6)}</div>
                </div>
                <div>
                  <div style={{ color: COLORS.textMuted, marginBottom: 2 }}>Current</div>
                  <div style={{ fontWeight: 600 }}>${pos.currentPrice.toFixed(6)}</div>
                </div>
                <div>
                  <div style={{ color: COLORS.textMuted, marginBottom: 2 }}>Qty</div>
                  <div style={{ fontWeight: 600 }}>{pos.quantity}</div>
                </div>
              </div>

              {/* Actions */}
              <div
                style={{
                  display: 'flex',
                  gap: 4
                }}
              >
                <button
                  onClick={() => onClose(pos)}
                  style={{
                    flex: 1,
                    padding: '4px 8px',
                    background: COLORS.red,
                    border: 'none',
                    color: '#fff',
                    fontSize: 9,
                    fontWeight: 600,
                    borderRadius: 3,
                    cursor: 'pointer',
                    fontFamily: 'inherit'
                  }}
                >
                  Close
                </button>
                <button
                  style={{
                    flex: 1,
                    padding: '4px 8px',
                    background: COLORS.bgAlt,
                    border: `1px solid ${COLORS.border}`,
                    color: COLORS.text,
                    fontSize: 9,
                    fontWeight: 600,
                    borderRadius: 3,
                    cursor: 'pointer',
                    fontFamily: 'inherit'
                  }}
                >
                  Edit SL/TP
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PositionsPanelWithPnL;
