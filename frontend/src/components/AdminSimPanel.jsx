import React, { useState, useEffect } from 'react';
import { subscribeServerMarketUpdate } from '../services/marketState';
import { calculateUnrealizedPnL } from '../services/tradingUtils';
import { getSocket } from '../api';
import { simulationEngine } from '../services/swanCoreSimulationEngine';
import {
  getAdminUsers,
  getAdminUserById,
  getAdminUserOpenPositions,
  getAdminUserOpenOrders,
  updateAdminTrade,
  startAdminDrift,
  stopAdminDrift,
} from '../services/adminService';

const OUTCOME_PRESETS = {
  profit: [5, 10, 15, 20, 25],
  loss: [-5, -10, -15, -20, -25],
};
const SPEED_OPTIONS = ['slow', 'normal', 'fast', 'instant'];
const VOLATILITY_OPTIONS = ['low', 'medium', 'high'];



const AdminSimPanel = ({ visible, onClose, onCandle = () => {}, inline = false }) => {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedTrade, setSelectedTrade] = useState(null);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [isLoadingOpenTrade, setIsLoadingOpenTrade] = useState(false);
  const [openTradeError, setOpenTradeError] = useState('');
  const [outcomeType, setOutcomeType] = useState('profit');
  const [outcomePercent, setOutcomePercent] = useState(10);
  const [speed, setSpeed] = useState('normal');
  const [volatility, setVolatility] = useState('low');
  const [balance, setBalance] = useState(10000);
  const [bidAskSkew, setBidAskSkew] = useState(0);
  const [driftActive, setDriftActive] = useState(false);
  const [saveSlots, setSaveSlots] = useState({});
  const [scenarioName, setScenarioName] = useState('');
  const [marketPrice, setMarketPrice] = useState(null); // authoritative live market price
  const [driftState, setDriftState] = useState({ active: false, progress: 0 });
  const [serverPositions, setServerPositions] = useState([]);
  const [serverUnrealizedPnl, setServerUnrealizedPnl] = useState(null);
  const [serverEquity, setServerEquity] = useState(null);
  const [orderBook, setOrderBook] = useState({ bids: [], asks: [] });
  const [liquidationNotice, setLiquidationNotice] = useState('');

  useEffect(() => {
    return () => {
      setDriftActive(false);
    };
  }, []);

  useEffect(() => {
    const unsubscribe = simulationEngine.subscribe((state) => {
      setOrderBook(state.orderBook);
      setLiquidationNotice(state.liquidationNotice || '');
    });

    return () => unsubscribe();
  }, []);

  const addToTradeHistory = (trade) => {
    // handled server-side
  };

  const normalizeTradeData = (trade) => {
    if (!trade) return null;
    const rawSide = String(trade.side || '').toLowerCase();
    const normalizedSide = rawSide === 'sell' || rawSide === 'short' ? 'short' : 'long';
    const entryPrice = Number(trade.entryPrice ?? trade.price ?? 0);
    const quantityFromExplicit = Number(trade.quantity ?? trade.size ?? 0);
    const quantityFromNotional = Number(trade.amount || 0);
    const positionId = trade.positionId || trade._id || trade.id;

    return {
      ...trade,
      positionId,
      entryPrice: Number.isFinite(entryPrice) && entryPrice > 0 ? entryPrice : 0,
      quantity: Number.isFinite(quantityFromExplicit) && quantityFromExplicit >= 0.0001
        ? quantityFromExplicit
        : Number.isFinite(quantityFromNotional) && quantityFromNotional > 0
          ? quantityFromNotional
          : 0,
      side: normalizedSide,
    };
  };

  const initializeSimulationPosition = (trade) => {
    if (!trade) return null;

    const normalized = normalizeTradeData(trade);
    const lockedMargin = Number(trade.lockedMargin ?? trade.margin ?? (normalized.quantity * normalized.entryPrice) ?? 0);
    const quantity = normalized.quantity > 0
      ? Number(normalized.quantity.toFixed(8))
      : Number((lockedMargin > 0 && normalized.entryPrice > 0 ? lockedMargin / normalized.entryPrice : 0).toFixed(8));

    return {
      id: normalized.positionId || `${normalized.pair}-${Date.now()}`,
      pair: normalized.pair,
      entryPrice: normalized.entryPrice,
      side: normalized.side,
      quantity,
      lockedMargin: Number(lockedMargin.toFixed(4)),
      currentPrice: normalized.entryPrice,
      currentPnL: 0,
      currentPnLPercent: 0,
      takeProfit: null,
      stopLoss: null,
      openTime: normalized.openTime || Date.now(),
    };
  };

  useEffect(() => {
    let cleanupMarketUpdate = null;
    let socket = null;
    let userRoom = selectedUserId;

    const initializeSubscription = async () => {
      if (!userRoom) return;
      try {
        socket = await getSocket();
        if (socket?.emit) {
          const adminToken = localStorage.getItem("adminToken");
          if (adminToken) socket.emit("authenticate", { token: adminToken });
          socket.emit("subscribeUser", userRoom);
        }
      } catch (err) {
        console.error("AdminSimPanel socket subscribeUser failed:", err);
      }
    };

    cleanupMarketUpdate = subscribeServerMarketUpdate((update) => {
      if (!update || update.userId !== userRoom) return;
      if (update.currentPrice != null) {
        setMarketPrice(update.currentPrice);
        setDriftActive(Boolean(update.driftState?.active));
      }
      if (update.balance != null) setBalance(update.balance);
      if (update.unrealizedPnl != null) setServerUnrealizedPnl(update.unrealizedPnl);
      if (update.equity != null) setServerEquity(update.equity);
      if (update.driftState != null) setDriftState(update.driftState);
      if (Array.isArray(update.positions)) setServerPositions(update.positions);
    });

    initializeSubscription();

    return () => {
      if (socket?.emit && userRoom) {
        socket.emit("unsubscribeUser", userRoom);
      }
      if (cleanupMarketUpdate) cleanupMarketUpdate();
      setMarketPrice(null);
      setDriftState({ active: false });
      setServerPositions([]);
      setServerUnrealizedPnl(null);
      setServerEquity(null);
      setDriftActive(false);
    };
  }, [selectedUserId]);

  const removeFromOpenOrders = (orderId) => {
    if (selectedTrade?.id === orderId) setSelectedTrade(null);
  };

  const loadUsers = async () => {
    setIsLoadingUsers(true);
    try {
      const response = await getAdminUsers('', '', 1, 200);
      setUsers(response.users || []);
    } catch (error) {
      console.error('Failed to load admin users', error);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const loadUserDetails = async (userId) => {
    try {
      const response = await getAdminUserById(userId);
      setSelectedUser(response.user || null);
    } catch (error) {
      console.error('Failed to load user details', error);
      setSelectedUser(null);
    }
  };

  const loadUserOpenTrade = async (userId) => {
    setIsLoadingOpenTrade(true);
    setOpenTradeError('');
    try {
      let trade = null;

      const positionResponse = await getAdminUserOpenPositions(userId);
      if (Array.isArray(positionResponse.positions) && positionResponse.positions.length > 0) {
        setServerPositions(positionResponse.positions);
        trade = positionResponse.positions[0];
      } else {
        setServerPositions([]);
      }

      if (!trade) {
        const orderResponse = await getAdminUserOpenOrders(userId);
        trade = Array.isArray(orderResponse.orders) && orderResponse.orders.length > 0
          ? orderResponse.orders[0]
          : null;
      }

      if (trade) {
        trade = normalizeTradeData(trade);
      }

      setSelectedTrade(trade);
      if (!trade) setOpenTradeError('No open trade found for this user');
    } catch (error) {
      console.error('Failed to load user open trade', error);
      setSelectedTrade(null);
      setOpenTradeError('Unable to fetch open trade');
    } finally {
      setIsLoadingOpenTrade(false);
    }
  };

  useEffect(() => { loadUsers(); }, []);

  useEffect(() => {
    if (!selectedUserId) {
      setSelectedUser(null);
      setSelectedTrade(null);
      setOpenTradeError('');
      return;
    }
    loadUserDetails(selectedUserId);
    loadUserOpenTrade(selectedUserId);
  }, [selectedUserId]);

  // Auto-set balance from real user balance when user is selected
  useEffect(() => {
    if (selectedUser && selectedUser.balance != null) {
      setBalance(Number(selectedUser.balance) || 0);
    }
  }, [selectedUser]);

  useEffect(() => {
    if (!selectedTrade) return;
    const position = initializeSimulationPosition(selectedTrade);
    if (!position) return;

    simulationEngine.setOpenPositions([position]);
    simulationEngine.setPortfolio({
      availableUSDT: Number(balance),
      lockedUSDT: position.lockedMargin,
    });
  }, [selectedTrade]);

  const updatePortfolioBalance = (amount) => setBalance(prev => prev + amount);

  const showToast = (message) => {
    if (typeof window !== 'undefined' && window.toast) window.toast(message);
    else console.log('AdminSimPanel toast:', message);
  };

  /**
   * Called when the drift timer completes.
   *
   * FIX: now also calls the backend via updateAdminTrade() so the order in
   * MongoDB is closed and the user's balance is updated server-side.
   * Previously this only updated local component state (console.log + setState).
   */
  async function handleDriftComplete({ finalPrice, direction, outcomePercent }) {
    if (!selectedTrade) return;

    const positionId = selectedTrade.positionId || selectedTrade._id || selectedTrade.id;
    simulationEngine.closePosition(positionId, finalPrice, 'drift-complete');

    const trade = normalizeTradeData(selectedTrade);
    const pnlData = calculateUnrealizedPnL(trade, finalPrice);
    const pnlUsdt = pnlData.pnl;

    const closedTrade = {
      pair: trade.pair,
      side: trade.side,
      entryPrice: trade.entryPrice,
      exitPrice: finalPrice,
      pnlPercent: direction === 'profit' ? outcomePercent : -outcomePercent,
      pnlUsdt,
      openTime: trade.openTime,
      closeTime: Date.now(),
      status: 'closed'
    };

    // ── 1. Optimistic local updates (same as before) ──────────────────────
    // Keep the trade open after drift completes. Do not remove it from the
    // open orders list, and do not realize P&L locally, because the user
    // closes the trade manually later.
    // addToTradeHistory(closedTrade);
    // removeFromOpenOrders(selectedTrade.id);
    // updatePortfolioBalance(closedTrade.pnlUsdt);

    // ── 2. Persist to the database via the admin API ──────────────────────
    // Calls POST /api/admin/trade/update (or whatever your endpoint is).
    // Adjust the payload shape to match what your backend route expects.
    try {
      await updateAdminTrade(
        selectedTrade._id || selectedTrade.id,
        direction === 'profit' ? 'profit' : 'loss',
        Math.abs(pnlUsdt),
        `Admin sim: ${direction} ${outcomePercent}% on ${selectedTrade.pair}`
      );
    } catch (err) {
      // Don't block the UI — just log. The admin can retry or fix manually.
      console.error('AdminSimPanel: failed to persist closed trade to DB', err);
      showToast('⚠️ Trade closed locally but DB update failed — check console');
    }

    // ── 3. UI cleanup ─────────────────────────────────────────────────────
    showToast(
      direction === 'profit'
        ? `Trade closed — +${outcomePercent}% profit`
        : `Trade closed — -${outcomePercent}% loss`
    );
    setDriftActive(false);
    setDriftState({ active: false });
  }

  const handleExecuteDrift = async () => {
    if (!selectedTrade || !selectedUserId) {
      alert('Please select a user and a trade first');
      return;
    }

    const trade = normalizeTradeData(selectedTrade);
    const entry = marketPrice ?? trade.entryPrice;
    const position = initializeSimulationPosition(selectedTrade);
    if (!position) {
      showToast('Unable to initialize simulation position');
      return;
    }

    const driftRequest = {
      userId: selectedUserId,
      pair: trade.pair,
      positionId: position.id,
      positionSide,
      entryPrice: trade.entryPrice,
      outcomePercent: Number(outcomePercent),
      direction: outcomeType,
      speed,
      volatility,
    };

    const shouldInitialize = !driftActive;
    if (shouldInitialize) {
      simulationEngine.setPair(trade.pair);
      simulationEngine.setOpenPositions([position]);
      simulationEngine.setPortfolio({
        availableUSDT: Number(balance),
        lockedUSDT: position.lockedMargin,
      });
    }

    try {
      await startAdminDrift(driftRequest);
      await loadUserOpenTrade(selectedUserId);
      setDriftActive(true);
      setDriftState((prev) => ({ ...prev, active: true }));
      showToast(driftActive ? `Updated simulated drift for ${trade.pair}` : `Enabled simulated drift for ${trade.pair}`);
    } catch (error) {
      console.error('AdminSimPanel: failed to start simulation drift', error);
      showToast('Unable to enable drift. Check console for details.');
    }
  };

  const handleStop = async () => {
    setDriftActive(false);
    setDriftState({ active: false, progress: 0 });
    if (selectedUserId && selectedTrade) {
      try {
        await stopAdminDrift(
          selectedUserId,
          selectedTrade.pair,
          selectedTrade._id || selectedTrade.id
        );
      } catch (e) {
        console.warn('AdminSimPanel: failed to stop backend drift', e);
      }
    }
    showToast('Disabled simulated drift');
  };

  const handleSaveScenario = () => {
    if (!scenarioName) { alert('Enter scenario name'); return; }
    setSaveSlots(prev => ({
      ...prev,
      [scenarioName]: {
        selectedUserId, selectedUser, selectedTrade,
        outcomeType, outcomePercent, speed, volatility,
        balance, bidAskSkew, timestamp: Date.now()
      }
    }));
    alert(`Scenario "${scenarioName}" saved`);
    setScenarioName('');
  };

  const handleLoadScenario = (name) => {
    const s = saveSlots[name];
    if (!s) return;
    setSelectedTrade(s.selectedTrade);
    setSelectedUserId(s.selectedUserId || '');
    setSelectedUser(s.selectedUser || null);
    setOutcomeType(s.outcomeType);
    setOutcomePercent(s.outcomePercent);
    setSpeed(s.speed);
    setVolatility(s.volatility);
    setBalance(s.balance);
    setBidAskSkew(s.bidAskSkew);
  };

  const handleDeleteScenario = (name) => {
    setSaveSlots(prev => { const next = { ...prev }; delete next[name]; return next; });
  };

  // ── Derived display values ────────────────────────────────────────────────
  // Use the server-provided market price from the selected user's market_update stream.
  // Admin must render backend price state only.
  const currentPrice = marketPrice;

  const hasOpenTrade = Boolean(selectedTrade);
  const normalizedTrade = selectedTrade ? normalizeTradeData(selectedTrade) : null;
  const tradeEntryPrice = normalizedTrade?.entryPrice ?? 0;
  const positionSide = normalizedTrade?.side === 'short' ? 'short' : 'long';
  const basePriceForPreview = Number(tradeEntryPrice) > 0 ? Number(tradeEntryPrice) : (marketPrice ?? tradeEntryPrice);
  let multiplierPreview = 1;
  if (positionSide === 'long') {
    multiplierPreview = outcomeType === 'profit' ? 1 + outcomePercent / 100 : 1 - outcomePercent / 100;
  } else {
    multiplierPreview = outcomeType === 'profit' ? 1 - outcomePercent / 100 : 1 + outcomePercent / 100;
  }
  const targetPrice = hasOpenTrade ? basePriceForPreview * multiplierPreview : 0;
  const estimatedPnlImpact = hasOpenTrade && normalizedTrade?.quantity
    ? calculateUnrealizedPnL(normalizedTrade, targetPrice).rawPnl
    : 0;
  const serverPosition = normalizedTrade && serverPositions.find((pos) => {
    const serverId = pos.positionId || pos._id || pos.id;
    const tradeId = normalizedTrade.positionId || normalizedTrade._id || normalizedTrade.id;
    if (serverId != null && tradeId != null && serverId.toString() === tradeId.toString()) {
      return true;
    }

    return (
      pos.pair === normalizedTrade.pair &&
      String(pos.side || '').toLowerCase() === String(normalizedTrade.side || '').toLowerCase() &&
      Number(pos.entryPrice) === Number(normalizedTrade.entryPrice) &&
      Math.abs(Number(pos.size ?? pos.quantity ?? 0)) === Number(normalizedTrade.quantity ?? 0)
    );
  });

  const totalServerPnlFallback = serverPositions.length === 1 && serverUnrealizedPnl != null
    ? Number(serverUnrealizedPnl)
    : null;

  const currentPnlCandidate = [
    serverPosition?.unrealizedPnl,
    serverPosition?.unrealizedPnL,
    normalizedTrade?.unrealizedPnl,
    normalizedTrade?.unrealizedPnL,
    totalServerPnlFallback,
  ].map((value) => Number(value)).find((value) => Number.isFinite(value));

  const currentPnl = currentPnlCandidate ?? null;
  const displayUnrealizedPnl = serverUnrealizedPnl != null
    ? Number(serverUnrealizedPnl)
    : currentPnl;

  if (!visible) return null;

  const containerStyle = inline
    ? {
        width: '100%',
        background: '#0D1220',
        border: '1px solid #1E2B3E',
        borderRadius: 8,
        display: 'flex',
        flexDirection: 'column',
        fontFamily: "'JetBrains Mono', monospace",
        color: '#E2E8F0',
        marginTop: 16,
      }
    : {
        position: 'fixed',
        right: 0,
        top: 0,
        bottom: 0,
        width: 420,
        background: '#0D1220',
        border: '1px solid #1E2B3E',
        zIndex: 10000,
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: "'JetBrains Mono', monospace",
        color: '#E2E8F0'
      };

  return (
    <div style={containerStyle}>
      {/* ── Header ── */}
      <div style={{ padding: '12px 16px', borderBottom: '1px solid #1E2B3E', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#0A0E1A' }}>
        <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>⚙️ Trade Simulator</h3>
        {!inline && (
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#94A3B8', fontSize: 18, cursor: 'pointer', padding: 0 }}>✕</button>
        )}
      </div>

      {/* ── Content ── */}
      <div style={{ flex: 1, overflow: inline ? 'visible' : 'auto', padding: '12px 0' }}>

        {/* Section 1: User + Open Trade */}
        <div style={{ padding: '0 12px 12px 12px', borderBottom: '1px solid #1E2B3E' }}>
          <label style={{ fontSize: 11, color: '#94A3B8', display: 'block', marginBottom: 6 }}>USER</label>
          <select
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
            style={{ width: '100%', padding: '6px 8px', background: '#111827', border: '1px solid #1A2535', color: '#E2E8F0', fontSize: 11, borderRadius: 4, fontFamily: 'inherit' }}
          >
            <option value="">-- Select user --</option>
            {users.map((user) => (
              <option key={user._id || user.id} value={user._id || user.id}>
                {user.email} {user.balance != null ? `($${Number(user.balance).toFixed(2)})` : ''}
              </option>
            ))}
          </select>

          {selectedUser && (
            <div style={{ marginTop: 12, padding: 12, background: '#0F172A', border: '1px solid #1E2B3E', borderRadius: 6 }}>
              <div style={{ fontSize: 12, color: '#94A3B8', marginBottom: 8 }}>Selected user</div>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>{selectedUser.email}</div>
              <div style={{ fontSize: 11, color: '#CBD5E1' }}>Balance: ${Number(selectedUser.balance || 0).toFixed(2)}</div>
              <div style={{ fontSize: 11, color: '#CBD5E1' }}>Status: {selectedUser.isBanned ? 'Banned' : 'Active'}</div>
              <div style={{ fontSize: 11, color: '#CBD5E1' }}>KYC: {selectedUser.kycVerified ? 'Verified' : (selectedUser.kycStatus || 'Pending')}</div>
            </div>
          )}

          <div style={{ marginTop: 12, padding: 12, background: '#0F172A', border: '1px solid #1E2B3E', borderRadius: 6 }}>
            <div style={{ fontSize: 12, color: '#94A3B8', marginBottom: 8 }}>Open trade</div>
            {isLoadingOpenTrade ? (
              <div style={{ fontSize: 11, color: '#CBD5E1' }}>Loading open trade...</div>
            ) : selectedTrade ? (
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>{selectedTrade.pair}</div>
                <div style={{ fontSize: 11, color: '#CBD5E1' }}>Position: {selectedTrade.side}</div>
                <div style={{ fontSize: 11, color: '#CBD5E1' }}>Entry price: ${selectedTrade.entryPrice?.toFixed(2)}</div>
                <div style={{ fontSize: 11, color: '#CBD5E1' }}>Quantity: {selectedTrade.quantity}</div>
                <div style={{ fontSize: 11, color: currentPnl >= 0 ? '#10B981' : '#EF4444' }}>
                  Current P&amp;L: {currentPnl != null
                    ? `${currentPnl >= 0 ? '+' : '-'}$${Math.abs(currentPnl).toFixed(2)}`
                    : 'N/A'}
                </div>
              </div>
            ) : (
              <div style={{ fontSize: 11, color: '#CBD5E1' }}>{openTradeError || 'Select a user to fetch current open trades.'}</div>
            )}
          </div>

          {/* Confirmation summary */}
          {selectedUser && selectedTrade && (
            <div style={{ marginTop: 12, padding: 12, background: '#0A1A2E', border: '1px solid #1a7fd4', borderRadius: 6 }}>
              <div style={{ fontSize: 12, color: '#94A3B8', marginBottom: 8 }}>Confirmation summary</div>
              <div style={{ display: 'grid', gap: 4 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
                  <span style={{ color: '#94A3B8' }}>Direction</span>
                  <span style={{ color: outcomeType === 'profit' ? '#10B981' : '#EF4444', fontWeight: 700 }}>
                    {outcomeType === 'profit' ? `+${outcomePercent}% PROFIT` : `-${outcomePercent}% LOSS`}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
                  <span style={{ color: '#94A3B8' }}>Target price</span>
                  <span style={{ color: '#E2E8F0' }}>${targetPrice.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
                  <span style={{ color: '#94A3B8' }}>Est. P&amp;L impact</span>
                  <span style={{ color: estimatedPnlImpact >= 0 ? '#10B981' : '#EF4444' }}>
                    {estimatedPnlImpact >= 0 ? '+' : '-'}${Math.abs(estimatedPnlImpact).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Section 2: Outcome */}
        <div style={{ padding: '12px', borderBottom: '1px solid #1E2B3E' }}>
          <label style={{ fontSize: 11, color: '#94A3B8', display: 'block', marginBottom: 6 }}>OUTCOME</label>
          <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            <button onClick={() => setOutcomeType('profit')} style={{ flex: 1, padding: '6px', background: outcomeType === 'profit' ? '#10B981' : '#111827', border: '1px solid ' + (outcomeType === 'profit' ? '#10B981' : '#1A2535'), color: outcomeType === 'profit' ? '#0A0E1A' : '#E2E8F0', fontSize: 11, fontWeight: outcomeType === 'profit' ? 700 : 400, cursor: 'pointer', borderRadius: 4, fontFamily: 'inherit' }}>✓ PROFIT</button>
            <button onClick={() => setOutcomeType('loss')} style={{ flex: 1, padding: '6px', background: outcomeType === 'loss' ? '#EF4444' : '#111827', border: '1px solid ' + (outcomeType === 'loss' ? '#EF4444' : '#1A2535'), color: outcomeType === 'loss' ? '#0A0E1A' : '#E2E8F0', fontSize: 11, fontWeight: outcomeType === 'loss' ? 700 : 400, cursor: 'pointer', borderRadius: 4, fontFamily: 'inherit' }}>✗ LOSS</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 4, marginBottom: 8 }}>
            {(outcomeType === 'profit' ? OUTCOME_PRESETS.profit : OUTCOME_PRESETS.loss).map(pct => (
              <button key={pct} onClick={() => setOutcomePercent(Math.abs(pct))} style={{ padding: '4px', background: Math.abs(outcomePercent) === Math.abs(pct) ? '#3B82F6' : '#111827', border: '1px solid #1A2535', color: '#E2E8F0', fontSize: 10, cursor: 'pointer', borderRadius: 3, fontFamily: 'inherit' }}>
                {Math.abs(pct)}%
              </button>
            ))}
          </div>
          <input type="number" value={outcomePercent} onChange={(e) => setOutcomePercent(Math.abs(Number(e.target.value)) || 0)} min="0" max="100" style={{ width: '100%', padding: '6px 8px', background: '#111827', border: '1px solid #1A2535', color: '#E2E8F0', fontSize: 11, borderRadius: 4, boxSizing: 'border-box', fontFamily: 'inherit' }} placeholder="Custom %" />
        </div>

        {/* Section 3: Speed */}
        <div style={{ padding: '12px', borderBottom: '1px solid #1E2B3E' }}>
          <label style={{ fontSize: 11, color: '#94A3B8', display: 'block', marginBottom: 6 }}>SPEED</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 4 }}>
            {SPEED_OPTIONS.map(opt => (
              <button key={opt} onClick={() => setSpeed(opt)} style={{ padding: '6px', background: speed === opt ? '#8B5CF6' : '#111827', border: '1px solid ' + (speed === opt ? '#8B5CF6' : '#1A2535'), color: '#E2E8F0', fontSize: 10, fontWeight: speed === opt ? 700 : 400, cursor: 'pointer', borderRadius: 3, textTransform: 'capitalize', fontFamily: 'inherit' }}>{opt}</button>
            ))}
          </div>
        </div>

        {/* Section 4: Volatility */}
        <div style={{ padding: '12px', borderBottom: '1px solid #1E2B3E' }}>
          <label style={{ fontSize: 11, color: '#94A3B8', display: 'block', marginBottom: 6 }}>VOLATILITY</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 4 }}>
            {VOLATILITY_OPTIONS.map(opt => (
              <button key={opt} onClick={() => setVolatility(opt)} style={{ padding: '6px', background: volatility === opt ? '#F59E0B' : '#111827', border: '1px solid ' + (volatility === opt ? '#F59E0B' : '#1A2535'), color: volatility === opt ? '#0A0E1A' : '#E2E8F0', fontSize: 10, fontWeight: volatility === opt ? 700 : 400, cursor: 'pointer', borderRadius: 3, textTransform: 'capitalize', fontFamily: 'inherit' }}>{opt}</button>
            ))}
          </div>
        </div>

        {/* Section 4.5: Portfolio & Orderbook */}
        <div style={{ padding: '12px', borderBottom: '1px solid #1E2B3E' }}>
          <label style={{ fontSize: 11, color: '#94A3B8', display: 'block', marginBottom: 6 }}>SIMULATION SUMMARY</label>
          <div style={{ display: 'grid', gap: 6, gridTemplateColumns: '1fr 1fr' }}>
            <div style={{ padding: 10, background: '#0F172A', borderRadius: 6, border: '1px solid #1A2535' }}>
              <div style={{ fontSize: 11, color: '#94A3B8', marginBottom: 5 }}>PORTFOLIO</div>
              <div style={{ fontSize: 12 }}>Equity: <strong>${serverEquity != null ? serverEquity.toFixed(2) : '0.00'}</strong></div>
              <div style={{ fontSize: 12 }}>Available: <strong>${balance.toFixed(2)}</strong></div>
              <div style={{ fontSize: 12 }}>Locked: <strong>${serverPositions.reduce((sum, pos) => sum + Number(pos.lockedMargin || 0), 0).toFixed(2)}</strong></div>
              <div style={{ fontSize: 12, color: (displayUnrealizedPnl ?? 0) >= 0 ? '#10B981' : '#EF4444' }}>Unrealized P&L: <strong>{displayUnrealizedPnl != null ? `${displayUnrealizedPnl >= 0 ? '+' : '-'}$${Math.abs(displayUnrealizedPnl).toFixed(2)}` : 'N/A'}</strong></div>
            </div>
            <div style={{ padding: 10, background: '#0F172A', borderRadius: 6, border: '1px solid #1A2535' }}>
              <div style={{ fontSize: 11, color: '#94A3B8', marginBottom: 5 }}>ORDER BOOK PREVIEW</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 10, color: '#94A3B8', marginBottom: 4 }}>BIDS</div>
                  {orderBook.bids.slice(0, 3).map((bid, index) => (
                    <div key={`bid-${index}`} style={{ fontSize: 11, color: '#10B981' }}>${bid.price} @ {bid.amount}</div>
                  ))}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 10, color: '#94A3B8', marginBottom: 4 }}>ASKS</div>
                  {orderBook.asks.slice(0, 3).map((ask, index) => (
                    <div key={`ask-${index}`} style={{ fontSize: 11, color: '#EF4444' }}>${ask.price} @ {ask.amount}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          {liquidationNotice && (
            <div style={{ marginTop: 10, padding: 10, background: '#331A1A', border: '1px solid #EF4444', borderRadius: 6, color: '#EF4444', fontSize: 11 }}>
              {liquidationNotice}
            </div>
          )}
        </div>

        {/* Section 5: Controls */}
        <div style={{ padding: '12px', borderBottom: '1px solid #1E2B3E' }}>
          <label style={{ fontSize: 11, color: '#94A3B8', display: 'block', marginBottom: 6 }}>CONTROLS</label>
          <div style={{ marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11 }}>
              <span style={{ color: '#94A3B8' }}>Drift progress</span>
              {/* Compute progress: prefer explicit progress, else step/totalSteps, default totalSteps=600 (10 minutes) */}
              {(() => {
                const explicit = typeof driftState.progress === 'number' ? driftState.progress : null;
                const step = typeof driftState.step === 'number' ? driftState.step : (driftState.drift && typeof driftState.drift.step === 'number' ? driftState.drift.step : null);
                const total = typeof driftState.totalSteps === 'number' ? driftState.totalSteps : (driftState.drift && typeof driftState.drift.totalSteps === 'number' ? driftState.drift.totalSteps : 600);
                const progress = explicit !== null ? explicit : (step !== null ? Math.min(1, Math.max(0, step / total)) : 0);
                const pct = Math.round(progress * 100);
                return (
                  <>
                    <span style={{ color: '#E2E8F0', fontWeight: 700 }}>{pct}%</span>
                    <div style={{ flex: 1 }} />
                    <span style={{ color: '#94A3B8', fontSize: 10 }}>{`${Math.min(step || 0, total)}/${total}s`}</span>
                  </>
                );
              })()}
            </div>
            <div style={{ height: 8, background: '#111827', borderRadius: 4, overflow: 'hidden', marginTop: 6 }}>
              {(() => {
                const explicit = typeof driftState.progress === 'number' ? driftState.progress : null;
                const step = typeof driftState.step === 'number' ? driftState.step : (driftState.drift && typeof driftState.drift.step === 'number' ? driftState.drift.step : null);
                const total = typeof driftState.totalSteps === 'number' ? driftState.totalSteps : (driftState.drift && typeof driftState.drift.totalSteps === 'number' ? driftState.drift.totalSteps : 600);
                const progress = explicit !== null ? explicit : (step !== null ? Math.min(1, Math.max(0, step / total)) : 0);
                const pct = Math.round(progress * 100);
                return <div style={{ width: `${pct}%`, height: '100%', background: '#3B82F6' }} />;
              })()}
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: driftActive ? '1fr 1fr' : '1fr', gap: 4 }}>
            {!driftActive ? (
              <button onClick={handleExecuteDrift} disabled={!selectedTrade} style={{ gridColumn: '1 / -1', padding: '10px', background: selectedTrade ? (outcomeType === 'profit' ? '#10B981' : '#EF4444') : '#475569', border: 'none', color: selectedTrade ? '#0A0E1A' : '#E2E8F0', fontSize: 12, fontWeight: 700, cursor: selectedTrade ? 'pointer' : 'not-allowed', borderRadius: 4, fontFamily: 'inherit' }}>
                {selectedUser && selectedTrade
                  ? `▶ ENABLE DRIFT — ${outcomeType === 'profit' ? '+' : '-'}${outcomePercent}% ${outcomeType.toUpperCase()} for this user`
                  : '▶ ENABLE DRIFT'}
              </button>
            ) : (
              <>
                <button onClick={handleExecuteDrift} disabled={!selectedTrade} style={{ padding: '10px', background: '#3B82F6', border: 'none', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer', borderRadius: 4, fontFamily: 'inherit' }}>
                  ▶ UPDATE DRIFT
                </button>
                <button onClick={handleStop} style={{ padding: '10px', background: '#EF4444', border: 'none', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer', borderRadius: 4, fontFamily: 'inherit' }}>
                  ⏹ DISABLE DRIFT
                </button>
              </>
            )}
          </div>
        </div>

        {/* Section 6: Balance Override */}
        <div style={{ padding: '12px', borderBottom: '1px solid #1E2B3E' }}>
          <label style={{ fontSize: 11, color: '#94A3B8', display: 'block', marginBottom: 6 }}>
            BALANCE OVERRIDE
            {selectedUser && <span style={{ color: '#10B981', marginLeft: 8 }}>✓ Auto-synced from user</span>}
          </label>
          <input type="number" value={balance} onChange={(e) => {
            const next = Number(e.target.value);
            setBalance(next);
            simulationEngine.overrideBalance(next);
          }} style={{ width: '100%', padding: '6px 8px', background: '#111827', border: '1px solid ' + (selectedUser ? '#10B981' : '#1A2535'), color: '#E2E8F0', fontSize: 11, borderRadius: 4, boxSizing: 'border-box', marginBottom: 8, fontFamily: 'inherit' }} />
          <label style={{ fontSize: 10, color: '#94A3B8', display: 'block', marginBottom: 6 }}>BID/ASK SKEW: {bidAskSkew.toFixed(2)}%</label>
          <input type="range" min="-5" max="5" step="0.1" value={bidAskSkew} onChange={(e) => {
            const nextSkew = Number(e.target.value);
            setBidAskSkew(nextSkew);
            simulationEngine.setBidAskSkew(nextSkew);
          }} style={{ width: '100%' }} />
        </div>

        {/* Section 7: Scenario Manager */}
        <div style={{ padding: '12px' }}>
          <label style={{ fontSize: 11, color: '#94A3B8', display: 'block', marginBottom: 6 }}>SCENARIO MANAGER</label>
          <div style={{ display: 'flex', gap: 4, marginBottom: 8 }}>
            <input type="text" value={scenarioName} onChange={(e) => setScenarioName(e.target.value)} placeholder="Name..." style={{ flex: 1, padding: '6px 8px', background: '#111827', border: '1px solid #1A2535', color: '#E2E8F0', fontSize: 10, borderRadius: 4, fontFamily: 'inherit' }} />
            <button onClick={handleSaveScenario} style={{ padding: '6px 10px', background: '#3B82F6', border: 'none', color: '#fff', fontSize: 10, fontWeight: 700, cursor: 'pointer', borderRadius: 4, fontFamily: 'inherit' }}>💾 SAVE</button>
          </div>
          {Object.keys(saveSlots).length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {Object.keys(saveSlots).map(name => (
                <div key={name} style={{ display: 'flex', gap: 4, padding: '6px 8px', background: '#111827', borderRadius: 3, alignItems: 'center' }}>
                  <button onClick={() => handleLoadScenario(name)} style={{ flex: 1, padding: '4px 8px', background: '#06B6D4', border: 'none', color: '#0A0E1A', fontSize: 10, fontWeight: 600, cursor: 'pointer', borderRadius: 2, fontFamily: 'inherit' }}>📂 {name}</button>
                  <button onClick={() => handleDeleteScenario(name)} style={{ padding: '4px 8px', background: '#EF4444', border: 'none', color: '#fff', fontSize: 9, cursor: 'pointer', borderRadius: 2, fontFamily: 'inherit' }}>✕</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSimPanel;
