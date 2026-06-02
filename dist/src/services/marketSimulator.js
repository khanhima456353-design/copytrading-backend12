"use strict";
/**
 * marketSimulator.js
 *
 * Per-user, per-pair simulated market price engine.
 *
 * MODES:
 *  - natural : real Binance price + gentle random walk, CAPPED at +2% / -25% from entry.
 *              Looks like realistic small fluctuations. Chart stays genuine.
 *  - drift   : admin-controlled smooth move toward a target outcome with noise.
 *              NO cap — admin can push profit or loss to any % they specify.
 *              On completion, returns to natural mode.
 *
 * FIX applied: removed naturalAnchor clamp from startDriftEngine so admin drift
 * is no longer silently limited to +2%/-25%. Admin-set targets now reach their
 * intended value.
 */
const USER_PAIR_STATES = new Map();
let io = null;
let getRealPrice = () => null;
let tickInterval = null;
let onSimulatedCallback = null;
const SPEED_CONFIG = {
    slow: { steps: 20 },
    normal: { steps: 12 },
    fast: { steps: 7 },
    instant: { steps: 3 },
};
const VOLATILITY_SCALE = {
    low: 0.0015,
    medium: 0.004,
    high: 0.009,
};
const DRIFT_VOLATILITY_SCALE = {
    low: 0.00045,
    medium: 0.0008,
    high: 0.0012,
};
// Natural mode bounds — price offset from entry (+2% / -25% PnL for long)
const NATURAL_NOISE_SCALE = 0.008;
const MAX_UP_OFFSET = 0.02; // +2% from entry
const MAX_DOWN_OFFSET = -0.25; // -25% from entry
const MAX_UP_PERCENT = MAX_UP_OFFSET;
const MAX_DOWN_PERCENT = MAX_DOWN_OFFSET;
const NATURAL_TREND_STEPS = 180; // ~3 minutes of natural drift for a trade path
const STALE_MS = 1000 * 60 * 30; // 30 min idle → evict
function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}
const { clampPnL } = require("../../utils/pnlClamp");
function gaussianNoise(scale = 1) {
    const u1 = Math.random() || 1e-6;
    const u2 = Math.random();
    return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2) * scale;
}
function formatPrice(value) {
    return Math.round(value * 100) / 100;
}
function easeInOut(progress) {
    return progress < 0.5
        ? 2 * progress * progress
        : -1 + (4 - 2 * progress) * progress;
}
function getDriftDirection({ direction, positionSide, startPrice, targetPrice }) {
    if (Number.isFinite(startPrice) && Number.isFinite(targetPrice) && targetPrice !== startPrice) {
        return targetPrice > startPrice ? 1 : -1;
    }
    const profitDirection = positionSide === 'short' ? -1 : 1;
    return direction === 'loss' ? -profitDirection : profitDirection;
}
function computeDriftTargetPrice({ startPrice, outcomePercent, direction, positionSide }) {
    const driftPercentValue = Math.abs(Number(outcomePercent) || 0) / 100;
    const driftDirection = getDriftDirection({ direction, positionSide, startPrice });
    return Number((startPrice * (1 + driftDirection * driftPercentValue)).toFixed(8));
}
function getKey(userId, pair, positionId) {
    return `${userId}:${pair}:${positionId}`;
}
function getCurrentPrice(pair) {
    const value = getRealPrice(pair);
    return Number.isFinite(value) && value > 0 ? Number(value) : null;
}
function createNaturalState(userId, pair, positionId) {
    const realPrice = getCurrentPrice(pair) || 0;
    return {
        userId,
        pair,
        positionId,
        mode: 'natural',
        lastPrice: realPrice,
        naturalOffset: 0,
        naturalAnchor: realPrice,
        naturalNoiseScale: NATURAL_NOISE_SCALE,
        naturalTrendActive: false,
        naturalTrendStep: 0,
        naturalTrendSteps: 0,
        velocity: 0,
        activeDrift: null,
        snapBack: null,
        updatedAt: Date.now(),
        createdAt: Date.now(),
    };
}
function startNaturalSimulation({ userId, pair, positionId, entryPrice, positionSide = 'long', volatility = 'medium', durationSteps = NATURAL_TREND_STEPS, isDemo = false }) {
    if (!userId || !pair || !positionId)
        return null;
    if (isDemo)
        return null;
    const state = ensureState(userId, pair, positionId);
    const anchorPrice = Number.isFinite(entryPrice) && entryPrice > 0 ? entryPrice : getCurrentPrice(pair) || state.naturalAnchor || state.lastPrice || 0;
    if (!anchorPrice || anchorPrice <= 0)
        return null;
    state.mode = 'natural';
    state.positionSide = positionSide;
    state.isDemo = Boolean(isDemo);
    state.entryPrice = anchorPrice;
    state.lastPrice = formatPrice(anchorPrice);
    state.naturalAnchor = anchorPrice;
    state.naturalOffset = 0;
    state.naturalNoiseScale = VOLATILITY_SCALE[volatility] || VOLATILITY_SCALE.medium;
    state.naturalTrendActive = false;
    state.naturalTrendStep = 0;
    state.naturalTrendSteps = Math.max(1, durationSteps);
    state.naturalTargetOffset = 0;
    state.velocity = Number(gaussianNoise(0.0006).toFixed(8));
    state.activeDrift = null;
    state.snapBack = null;
    state.updatedAt = Date.now();
    emitSimulatedPrice(state);
    return state;
}
function ensureState(userId, pair, positionId) {
    const key = getKey(userId, pair, positionId);
    if (!USER_PAIR_STATES.has(key)) {
        USER_PAIR_STATES.set(key, createNaturalState(userId, pair, positionId));
    }
    return USER_PAIR_STATES.get(key);
}
// ─── Natural price tick ───────────────────────────────────────────────────────
// Realistic micro-movements capped at +2% / -25% PnL from entry with boundary bounce.
function computeNaturalPrice(state) {
    const anchorPrice = Number.isFinite(state.entryPrice) && state.entryPrice > 0
        ? state.entryPrice
        : getCurrentPrice(state.pair) || state.naturalAnchor || state.lastPrice || 0;
    if (!anchorPrice || anchorPrice <= 0)
        return state.lastPrice || 0;
    state.entryPrice = anchorPrice;
    const noiseScale = state.naturalNoiseScale || NATURAL_NOISE_SCALE;
    let currentOffset = Number(state.naturalOffset || 0);
    const currentPrice = anchorPrice * (1 + currentOffset);
    const positionSide = state.positionSide || 'long';
    const direction = positionSide === 'short' ? -1 : 1;
    const rawPnlPercent = anchorPrice > 0
        ? (((currentPrice - anchorPrice) / anchorPrice) * 100) * direction
        : 0;
    // Gentle boundary rotation — never stick at +2% or -25%
    let boundaryBias = 0;
    if (rawPnlPercent > 1.4) {
        boundaryBias -= (rawPnlPercent - 1.4) * 0.00035;
    }
    else if (rawPnlPercent < -22) {
        boundaryBias += (-22 - rawPnlPercent) * 0.00028;
    }
    const midOffset = (MAX_UP_OFFSET + MAX_DOWN_OFFSET) / 2;
    const meanReversion = (midOffset - currentOffset) * 0.00022;
    const tickNoise = (Math.random() - 0.5) * noiseScale * 0.35;
    state.velocity = (Number(state.velocity) || 0) * 0.86 + gaussianNoise(noiseScale * 0.42) + boundaryBias + meanReversion + tickNoise;
    currentOffset = clamp(currentOffset + state.velocity, MAX_DOWN_OFFSET, MAX_UP_OFFSET);
    state.naturalOffset = currentOffset;
    let nextPrice = anchorPrice * (1 + currentOffset);
    // Sub-tick price noise for wick realism
    nextPrice += (Math.random() - 0.5) * Math.max(nextPrice * 0.00008, 0.01);
    return formatPrice(Math.max(nextPrice, 0.00000001));
}
// ─── Admin drift engine ───────────────────────────────────────────────────────
// Smoothly moves price toward admin-specified target.
// FIX: NO cap applied here — admin drift overrides natural bounds intentionally.
// The display still looks realistic because of easing + gaussian noise.
function startDriftEngine(state) {
    const { activeDrift } = state;
    if (!activeDrift)
        return computeNaturalPrice(state);
    const progress = activeDrift.totalSteps <= 1
        ? 1
        : Math.min(1, activeDrift.step / (activeDrift.totalSteps - 1));
    // Ease-in-out for smooth, realistic-looking movement
    const eased = easeInOut(progress);
    const noiseScale = DRIFT_VOLATILITY_SCALE[activeDrift.volatility] || DRIFT_VOLATILITY_SCALE.low;
    // Interpolate from start → target with realistic noise overlay
    let nextPrice = activeDrift.startPrice +
        (activeDrift.targetPrice - activeDrift.startPrice) * eased;
    nextPrice += activeDrift.startPrice * gaussianNoise(noiseScale);
    nextPrice = formatPrice(Math.max(nextPrice, 0.00000001));
    // Advance step
    activeDrift.step += 1;
    if (activeDrift.step >= activeDrift.totalSteps) {
        // Settle at exact target with tiny final noise
        const finalNoise = activeDrift.targetPrice * gaussianNoise(0.00025);
        nextPrice = formatPrice(activeDrift.targetPrice + finalNoise);
        state.lastPrice = nextPrice;
        state.mode = 'natural';
        state.activeDrift = null;
        // Re-anchor natural mode at the settled price so it continues smoothly
        const realPrice = getCurrentPrice(state.pair);
        if (realPrice > 0) {
            state.naturalOffset = clamp((nextPrice - realPrice) / realPrice, MAX_DOWN_PERCENT, MAX_UP_PERCENT);
        }
    }
    return nextPrice;
}
// ─── Snap-back engine ─────────────────────────────────────────────────────────
// Gradually returns price to real Binance price with natural-looking rises/falls.
// Takes ~2 minutes (120 steps at 1s tick) to reach real Binance price.
// Looks completely natural — user cannot tell it's transitioning.
// Used when: (a) admin stops drift, (b) user closes position.
const SNAPBACK_MIN_STEPS = 8;
const SNAPBACK_MAX_STEPS = 15;
const SNAPBACK_NOISE = 0.004; // realistic noise scale
const SNAPBACK_MOMENTUM_SCALE = 0.0006; // momentum for natural rises/falls
function randomSnapBackSteps() {
    return Math.floor(Math.random() * (SNAPBACK_MAX_STEPS - SNAPBACK_MIN_STEPS + 1)) + SNAPBACK_MIN_STEPS;
}
function computeSnapBackPrice(state) {
    const realPrice = getCurrentPrice(state.pair);
    if (!realPrice || realPrice <= 0)
        return state.lastPrice || 0;
    const { snapBack } = state;
    if (!snapBack)
        return computeNaturalPrice(state);
    const totalSteps = Math.max(1, snapBack.totalSteps || SNAPBACK_MIN_STEPS);
    const gap = realPrice - snapBack.startPrice;
    const stepIndex = Math.min(snapBack.step + 1, totalSteps);
    const progress = stepIndex / totalSteps;
    // Gradual bridge toward Binance with organic noise (8–15 transition steps)
    const linearTarget = snapBack.startPrice + gap * progress;
    const noise = (Math.random() - 0.5) * Math.max(Math.abs(gap) * 0.04, realPrice * 0.00012);
    snapBack.velocity = (Number(snapBack.velocity) || 0) * 0.82 + gaussianNoise(SNAPBACK_MOMENTUM_SCALE);
    let nextPrice = linearTarget + noise + (snapBack.velocity * realPrice);
    // Soft pull toward real price in final third
    if (progress > 0.65) {
        nextPrice += (realPrice - nextPrice) * 0.18;
    }
    nextPrice = formatPrice(Math.max(nextPrice, 0.00000001));
    snapBack.step = stepIndex;
    if (snapBack.step >= totalSteps || Math.abs(nextPrice - realPrice) / realPrice < 0.00015) {
        state.snapBack = null;
        return formatPrice(realPrice);
    }
    return nextPrice;
}
function emitSimulationEnded(state, reason = 'snapback_complete') {
    if (!io || !state?.userId)
        return;
    const realPrice = getCurrentPrice(state.pair);
    const payload = {
        userId: state.userId,
        pair: state.pair,
        positionId: state.positionId,
        price: realPrice,
        reason,
        timestamp: Date.now(),
    };
    io.to(`user:${state.userId}`).emit('simulationEnded', payload);
    io.to(`user:${state.userId}`).emit('driftStopped', payload);
}
function finishSnapBack(state, key) {
    const realPrice = getCurrentPrice(state.pair);
    if (realPrice && realPrice > 0) {
        state.lastPrice = formatPrice(realPrice);
    }
    state.snapBack = null;
    state.activeDrift = null;
    state.mode = 'idle';
    state.naturalOffset = 0;
    state.velocity = 0;
    state.updatedAt = Date.now();
    emitSimulatedPrice(state);
    emitSimulationEnded(state);
    USER_PAIR_STATES.delete(key);
}
function emitSimulatedPrice(state) {
    if (!io || !state?.userId || !state?.pair || !state?.positionId)
        return;
    io.to(`user:${state.userId}`).emit('simulatedPriceUpdate', {
        userId: state.userId,
        pair: state.pair,
        positionId: state.positionId,
        price: state.lastPrice,
        time: state.updatedAt,
        mode: state.mode,
    });
    try {
        if (onSimulatedCallback)
            onSimulatedCallback(state);
    }
    catch (err) {
        console.error('onSimulatedCallback error:', err?.message ?? err);
    }
}
// ─── Tick ─────────────────────────────────────────────────────────────────────
function tickAll() {
    if (!USER_PAIR_STATES.size)
        return;
    for (const [key, state] of USER_PAIR_STATES.entries()) {
        if (Date.now() - state.updatedAt > STALE_MS && state.mode === 'idle') {
            USER_PAIR_STATES.delete(key);
            continue;
        }
        // Drift mode uses its own interval timer
        if (state.mode === 'drift' && state.driftTimer)
            continue;
        const wasSnapBack = Boolean(state.snapBack);
        const nextPrice = state.snapBack
            ? computeSnapBackPrice(state)
            : computeNaturalPrice(state);
        if (!Number.isFinite(nextPrice) || nextPrice <= 0)
            continue;
        state.lastPrice = nextPrice;
        state.updatedAt = Date.now();
        emitSimulatedPrice(state);
        if (wasSnapBack && !state.snapBack) {
            finishSnapBack(state, key);
        }
    }
}
// ─── Public API ───────────────────────────────────────────────────────────────
function initMarketSimulator({ io: socketIo, getRealPrice: provider, onSimulated } = {}) {
    if (socketIo)
        io = socketIo;
    if (typeof provider === 'function')
        getRealPrice = provider;
    if (typeof onSimulated === 'function')
        onSimulatedCallback = onSimulated;
    if (!tickInterval) {
        tickInterval = setInterval(tickAll, 1000);
    }
}
/**
 * Start admin-controlled drift.
 * @param {object} opts
 * @param {string} opts.userId
 * @param {string} opts.pair
 * @param {string} opts.positionId
 * @param {number} opts.entryPrice
 * @param {number} opts.outcomePercent  - e.g. 5 = 5%
 * @param {'profit'|'loss'} opts.direction
 * @param {'long'|'short'} opts.positionSide
 * @param {'slow'|'normal'|'fast'|'instant'} opts.speed
 * @param {'low'|'medium'|'high'} opts.volatility
 */
function startDrift({ userId, pair, positionId, entryPrice, outcomePercent, direction, positionSide, speed = 'normal', volatility = 'low', lossPercent = 0.25 }) {
    if (!userId || !pair || !positionId)
        return null;
    const state = ensureState(userId, pair, positionId);
    // Lock initial price P0
    const currentPrice = (Number.isFinite(state.lastPrice) && state.lastPrice > 0)
        ? state.lastPrice
        : (Number.isFinite(entryPrice) && entryPrice > 0)
            ? entryPrice
            : getCurrentPrice(pair) || 0;
    const P0 = Number(currentPrice) > 0 ? Number(currentPrice) : 0;
    const targetPrice = computeDriftTargetPrice({ startPrice: P0, outcomePercent, direction, positionSide });
    const driftDirection = getDriftDirection({ direction, positionSide, startPrice: P0, targetPrice });
    const driftDistance = Math.max(Math.abs(targetPrice - P0), P0 * 0.0001);
    const adversePullback = driftDistance * 0.18;
    const max_limit = driftDirection > 0
        ? Number((targetPrice + driftDistance * 0.03).toFixed(8))
        : Number((P0 + adversePullback).toFixed(8));
    const min_limit = driftDirection > 0
        ? Number((P0 - adversePullback).toFixed(8))
        : Number((targetPrice - driftDistance * 0.03).toFixed(8));
    // Initialize drift state
    state.mode = 'drift';
    state.activeDrift = {
        startPrice: P0,
        anchorPrice: P0,
        targetPrice,
        driftDirection,
        driftDistance,
        maxLimit: max_limit,
        minLimit: min_limit,
        outcomePercent: Number(outcomePercent) || 0,
        direction,
        positionSide,
        volatility,
        speed,
        step: 0,
        totalSteps: 600, // fixed 10-minute window (600s)
        velocity: 0,
    };
    state.lastPrice = P0;
    state.updatedAt = Date.now();
    // Per-second controlled drift implementation
    if (state.driftTimer) {
        clearInterval(state.driftTimer);
        state.driftTimer = null;
    }
    state.driftTimer = setInterval(() => {
        try {
            // Safety: if state no longer exists, stop
            const key = getKey(userId, pair, positionId);
            if (!USER_PAIR_STATES.has(key)) {
                clearInterval(state.driftTimer);
                state.driftTimer = null;
                return;
            }
            const s = USER_PAIR_STATES.get(key);
            const active = s?.activeDrift;
            if (!active)
                return;
            const P = Number(s.lastPrice) || active.startPrice || P0;
            const totalSteps = Math.max(1, active.totalSteps || 600);
            const progress = totalSteps <= 1 ? 1 : Math.min(1, active.step / (totalSteps - 1));
            const finalPhase = clamp((progress - 0.8) / 0.2, 0, 1);
            const eased = finalPhase > 0
                ? 0.72 + (0.28 * easeInOut(finalPhase))
                : easeInOut(progress);
            const target = Number(active.targetPrice) || targetPrice;
            const start = Number(active.startPrice) || P0;
            const directionSign = active.driftDirection || getDriftDirection({ direction, positionSide, startPrice: start, targetPrice: target });
            const distance = Math.max(Number(active.driftDistance) || Math.abs(target - start), start * 0.0001);
            const trendPrice = start + (target - start) * eased;
            const noiseScale = (DRIFT_VOLATILITY_SCALE[active.volatility] || DRIFT_VOLATILITY_SCALE.low) * (1 - finalPhase * 0.65);
            const pullStrength = 0.16 + finalPhase * 0.34;
            active.velocity = (Number(active.velocity) || 0) * 0.58 + gaussianNoise(noiseScale * 0.45);
            let nextP = P
                + ((trendPrice - P) * pullStrength)
                + (start * active.velocity)
                + (start * gaussianNoise(noiseScale));
            const pullbackRoom = distance * (0.26 - finalPhase * 0.18);
            const overshootRoom = distance * 0.03 * (1 - finalPhase);
            const lowerGuard = directionSign > 0
                ? Math.max(active.minLimit, trendPrice - pullbackRoom)
                : Math.max(active.minLimit, target - overshootRoom);
            const upperGuard = directionSign > 0
                ? Math.min(active.maxLimit, target + overshootRoom)
                : Math.min(active.maxLimit, trendPrice + pullbackRoom);
            nextP = clamp(nextP, lowerGuard, upperGuard);
            // Ensure non-negative
            if (!Number.isFinite(nextP) || nextP <= 0)
                nextP = P || P0;
            // Update state
            s.lastPrice = Number(nextP.toFixed(8));
            s.updatedAt = Date.now();
            active.step = Math.min(active.step + 1, totalSteps);
            emitSimulatedPrice(s);
            // End of fixed window: transition to snapback
            if (active.step >= totalSteps) {
                const finalNoise = target * gaussianNoise(0.00012);
                s.lastPrice = Number(clamp(target + finalNoise, target - distance * 0.01, target + distance * 0.01).toFixed(8));
                clearInterval(s.driftTimer);
                s.driftTimer = null;
                s.mode = 'snapback';
                s.snapBack = { startPrice: s.lastPrice, step: 0, totalSteps: randomSnapBackSteps(), velocity: 0 };
                s.activeDrift = null;
                s.updatedAt = Date.now();
                emitSimulatedPrice(s);
            }
        }
        catch (err) {
            console.error('driftTimer error:', err);
        }
    }, 1000);
    // Emit initial simulated price immediately
    emitSimulatedPrice(state);
    return getDriftStatus(userId, pair, positionId);
}
function stopDrift(userId, pair, positionId) {
    const key = getKey(userId, pair, positionId);
    const state = USER_PAIR_STATES.get(key);
    if (!state)
        return null;
    if (state.driftTimer) {
        clearInterval(state.driftTimer);
        state.driftTimer = null;
    }
    state.mode = 'snapback';
    state.activeDrift = null;
    state.snapBack = {
        startPrice: state.lastPrice,
        step: 0,
        totalSteps: randomSnapBackSteps(),
        velocity: 0,
    };
    state.updatedAt = Date.now();
    emitSimulatedPrice(state);
    return getDriftStatus(userId, pair, positionId);
}
function getDriftStatus(userId, pair, positionId) {
    const key = getKey(userId, pair, positionId);
    const state = USER_PAIR_STATES.get(key);
    if (!state)
        return { active: false, mode: 'natural', pair, userId, positionId };
    return {
        active: Boolean(state.activeDrift),
        mode: state.mode,
        userId: state.userId,
        pair: state.pair,
        positionId: state.positionId,
        price: state.lastPrice,
        updatedAt: state.updatedAt,
        drift: state.activeDrift ? { ...state.activeDrift } : null,
    };
}
function getSimulationStatesForUser(userId) {
    if (!userId)
        return [];
    const activeStates = [];
    for (const state of USER_PAIR_STATES.values()) {
        if (state.userId !== userId)
            continue;
        if (state.mode === 'idle')
            continue;
        activeStates.push({
            userId: state.userId,
            pair: state.pair,
            positionId: state.positionId,
            price: state.lastPrice,
            time: state.updatedAt,
            mode: state.mode,
            drift: state.activeDrift ? { ...state.activeDrift } : null,
        });
    }
    return activeStates;
}
/**
 * Call this when a position is closed.
 * FIX State 5: Instead of instantly deleting state (which causes chart to snap),
 * triggers a gradual snap-back to real Binance price over ~20 seconds.
 * After snap-back completes, state is automatically cleaned up.
 */
function clearSimulation(userId, pair, positionId) {
    const key = getKey(userId, pair, positionId);
    const state = USER_PAIR_STATES.get(key);
    if (!state)
        return;
    if (state.driftTimer) {
        clearInterval(state.driftTimer);
        state.driftTimer = null;
    }
    const realPrice = getCurrentPrice(pair);
    if (!state.lastPrice || !realPrice || Math.abs(state.lastPrice - realPrice) / realPrice < 0.00015) {
        emitSimulationEnded(state, 'position_closed');
        USER_PAIR_STATES.delete(key);
        return;
    }
    state.mode = 'snapback';
    state.activeDrift = null;
    state.snapBack = {
        startPrice: state.lastPrice,
        step: 0,
        totalSteps: randomSnapBackSteps(),
        velocity: 0,
    };
    state.updatedAt = Date.now();
    emitSimulatedPrice(state);
}
function hasActiveSimulation(userId, pair) {
    if (!userId)
        return false;
    for (const state of USER_PAIR_STATES.values()) {
        if (state.userId !== userId)
            continue;
        if (pair && state.pair !== pair)
            continue;
        if (state.snapBack || state.activeDrift || state.mode === 'natural' || state.mode === 'drift') {
            return true;
        }
    }
    return false;
}
function getSimulatedPriceForPair(userId, pair) {
    if (!userId || !pair)
        return null;
    let bestState = null;
    for (const state of USER_PAIR_STATES.values()) {
        if (state.userId !== userId || state.pair !== pair)
            continue;
        if (!state.lastPrice || !Number.isFinite(state.lastPrice) || state.lastPrice <= 0)
            continue;
        if (!state.activeDrift && !state.snapBack && state.mode === 'natural') {
            // natural mode simulation is still a controlled source when a trade is active
            if (bestState === null || state.updatedAt > bestState.updatedAt)
                bestState = state;
            continue;
        }
        if (state.activeDrift || state.snapBack) {
            if (bestState === null || state.updatedAt > bestState.updatedAt)
                bestState = state;
            continue;
        }
    }
    return bestState ? bestState.lastPrice : null;
}
function getSimulationPrice(userId, pair, positionId) {
    if (!positionId)
        return getCurrentPrice(pair);
    const key = getKey(userId, pair, positionId);
    const state = USER_PAIR_STATES.get(key);
    if (state && Number.isFinite(state.lastPrice) && state.lastPrice > 0) {
        return state.lastPrice;
    }
    return getCurrentPrice(pair);
}
function isPairSimulated(pair) {
    if (!pair)
        return false;
    for (const state of USER_PAIR_STATES.values()) {
        if (state.pair === pair) {
            // Consider simulation active if there's a drift, snapBack, or an active position-bound simulation
            if (state.activeDrift || state.snapBack || state.positionId)
                return true;
        }
    }
    return false;
}
module.exports = {
    initMarketSimulator,
    startNaturalSimulation,
    startDrift,
    stopDrift,
    getDriftStatus,
    getSimulationStatesForUser,
    getSimulatedPriceForPair,
    clearSimulation,
    getSimulationPrice,
    ensureState,
    isPairSimulated,
    hasActiveSimulation,
};
