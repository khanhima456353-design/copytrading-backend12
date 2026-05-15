const mongoose = require("mongoose");

const tradingPermissionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    enabled: { type: Boolean, default: true },
    allowedPairs: { type: [String], default: [] },
    blockedPairs: { type: [String], default: [] },
    maxSpotLeverage: { type: Number, default: 1 },
    maxCrossLeverage: { type: Number, default: 5 },
    maxIsolatedLeverage: { type: Number, default: 5 },
    orderTypesEnabled: { type: [String], default: ["limit", "market", "stop-loss"] },
    isCrossMarginAllowed: { type: Boolean, default: false },
    isIsolatedMarginAllowed: { type: Boolean, default: false }
  },
  { timestamps: true }
);

tradingPermissionSchema.index({ userId: 1 }, { unique: true });

module.exports = mongoose.model("TradingPermission", tradingPermissionSchema);
