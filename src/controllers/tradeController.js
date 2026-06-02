/**
 * tradeController.js  —  CRASH-PROOF edition
 *
 * UPGRADES:
 *  - placeTrade     : atomic $inc balance deduction via findOneAndUpdate
 *                     (eliminates TOCTOU race when two requests arrive simultaneously)
 *  - processPendingTrade : atomically "claims" a trade by flipping status to
 *                     "processing" before doing any work — prevents double-execution
 *  - processPendingTrades : binary semaphore prevents overlapping cron ticks
 *  - updateTradeResult   : atomic User balance delta with findOneAndUpdate
 */

"use strict";

const User        = require("../../models/User");
const Transaction = require("../../models/Transaction");
const Setting     = require("../../models/Setting");

// Helpers kept: simple settings lookup and socket emitter
const getSettingValue = async (key, defaultValue) => {
  const setting = await Setting.findOne({ key });
  return setting ? setting.value : defaultValue;
};

const emitSocket = (event, payload) => {
  if (global.io) global.io.emit(event, payload);
};

// Trade-related models and functions were removed because those models were deleted.

module.exports = {};
