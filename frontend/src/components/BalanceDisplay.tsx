import React from "react";
import {
  formatBalance,
  formatCurrency,
  getMarginStatusColor,
  getMarginStatusLabel,
  BalanceData
} from "../services/walletService";

interface BalanceDisplayProps {
  data: BalanceData | null;
  selectedMode: "portfolio" | "spot" | "cross" | "isolated";
  onModeChange: (mode: "portfolio" | "spot" | "cross" | "isolated") => void;
  loading: boolean;
  compact?: boolean; // For home page compact view
}

/**
 * Reusable Balance Display Component
 * Shows Spot / Cross / Isolated balances with mode switching
 */
export function BalanceDisplay({
  data,
  selectedMode,
  onModeChange,
  loading,
  compact = false
}: BalanceDisplayProps) {
  if (loading && !data) {
    return (
      <div style={styles.container(compact)}>
        <div style={styles.skeleton} />
      </div>
    );
  }

  if (!data) {
    return (
      <div style={styles.container(compact)}>
        <div style={styles.errorBox}>Failed to load balances</div>
      </div>
    );
  }

  const isPortfolioMode = selectedMode === "portfolio";
  const hasSelectedModeData =
    isPortfolioMode ||
    (selectedMode === "spot" && data.spot) ||
    (selectedMode === "cross" && data.cross) ||
    (selectedMode === "isolated" && data.isolated);

  return (
    <div style={styles.container(compact)}>
      {!compact && (
        <div style={styles.modeSelector}>
          {( ["portfolio", "spot", "cross", "isolated"] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => onModeChange(mode)}
              style={styles.modeButton(selectedMode === mode)}
              disabled={
                mode !== "portfolio" &&
                ((mode === "spot" && !data.spot) ||
                  (mode === "cross" && !data.cross) ||
                  (mode === "isolated" && !data.isolated))
              }
            >
              {mode === "portfolio"
                ? "Portfolio"
                : mode.charAt(0).toUpperCase() + mode.slice(1)}
            </button>
          ))}
        </div>
      )}

      {selectedMode === "portfolio" && (
        <div style={styles.portfolioSummary}>
          <div style={styles.balanceHeader}>
            <div>
              <div style={styles.balanceLabel}>Total portfolio value</div>
              <div style={styles.balanceValue}>{formatCurrency(data.totalPortfolioValue)}</div>
            </div>
          </div>
          <div style={styles.miniNote}>
            View spot, cross, or isolated balances by clicking the corresponding tab.
          </div>
        </div>
      )}

      {selectedMode === "spot" && data.spot && (
        <SpotBalanceView wallet={data.spot} compact={compact} />
      )}

      {selectedMode === "cross" && data.cross && (
        <CrossMarginView wallet={data.cross} compact={compact} />
      )}

      {selectedMode === "isolated" && data.isolated && (
        <IsolatedMarginView positions={data.isolated} compact={compact} />
      )}

      {!hasSelectedModeData && !isPortfolioMode && (
        <div style={styles.emptyState}>
          <p>No balance data available for {selectedMode}.</p>
        </div>
      )}

      {!compact && (
        <div style={styles.portfolioTotal}>
          <span>Total portfolio value</span>
          <span style={styles.portfolioValue}>{formatCurrency(data.totalPortfolioValue)}</span>
        </div>
      )}
    </div>
  );
}

function SpotBalanceView({
  wallet,
  compact
}: {
  wallet: any;
  compact: boolean;
}) {
  const total = wallet.availableBalance + wallet.lockedBalance;

  if (compact) {
    return (
      <div style={styles.compactView}>
        <div style={styles.balanceHeader}>
          <div>
            <div style={styles.balanceLabel}>Spot balance</div>
            <div style={styles.balanceValue}>{formatCurrency(total)}</div>
          </div>
          <div style={styles.statusBadge}>Spot wallet</div>
        </div>

        <div style={styles.smallGrid}>
          <div style={styles.metricCard}>
            <span style={styles.metricLabel}>Available</span>
            <strong style={{ color: "var(--clr-green)" }}>{formatCurrency(wallet.availableBalance)}</strong>
          </div>
          <div style={styles.metricCard}>
            <span style={styles.metricLabel}>Locked</span>
            <strong style={{ color: "var(--clr-amber)" }}>{formatCurrency(wallet.lockedBalance)}</strong>
          </div>
        </div>

        <div style={styles.miniNote}>Spot funds can be used instantly for market buys or transfers.</div>
      </div>
    );
  }

  return (
    <div style={styles.balanceGrid}>
      <div style={{ ...styles.balanceCard, background: "rgba(56, 179, 124, 0.08)" }}>
        <div style={styles.balanceLabel}>Total Balance</div>
        <div style={styles.balanceValue}>{formatCurrency(total)}</div>
      </div>
      <div style={{ ...styles.balanceCard, background: "rgba(14, 203, 129, 0.08)" }}>
        <div style={styles.balanceLabel}>Available</div>
        <div style={{ ...styles.balanceValue, color: "var(--clr-green)" }}>{formatCurrency(wallet.availableBalance)}</div>
      </div>
      <div style={{ ...styles.balanceCard, background: "rgba(240, 185, 11, 0.08)" }}>
        <div style={styles.balanceLabel}>Locked</div>
        <div style={{ ...styles.balanceValue, color: "var(--clr-amber)" }}>{formatCurrency(wallet.lockedBalance)}</div>
      </div>
    </div>
  );
}

function CrossMarginView({
  wallet,
  compact
}: {
  wallet: any;
  compact: boolean;
}) {
  const statusColor = getMarginStatusColor(wallet.marginRatio);
  const statusLabel = getMarginStatusLabel(wallet.marginRatio);

  if (compact) {
    return (
      <div style={styles.compactView}>
        <div style={styles.balanceHeader}>
          <div>
            <div style={styles.balanceLabel}>Cross margin equity</div>
            <div style={styles.balanceValue}>{formatCurrency(wallet.totalBalance)}</div>
          </div>
          <div style={{ ...styles.statusBadge, backgroundColor: `${statusColor}20`, color: statusColor }}>
            {statusLabel}
          </div>
        </div>

        <div style={styles.smallGrid}>
          <div style={styles.metricCard}>
            <span style={styles.metricLabel}>Free collateral</span>
            <strong style={{ color: statusColor }}>{formatCurrency(wallet.freeCollateral)}</strong>
          </div>
          <div style={styles.metricCard}>
            <span style={styles.metricLabel}>Margin ratio</span>
            <strong style={{ color: statusColor }}>{wallet.marginRatio.toFixed(2)}%</strong>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.balanceGrid}>
      <div style={styles.balanceCard}>
        <div style={styles.balanceLabel}>Equity</div>
        <div style={styles.balanceValue}>{formatCurrency(wallet.totalBalance)}</div>
      </div>
      <div style={styles.balanceCard}>
        <div style={styles.balanceLabel}>Used Margin</div>
        <div style={{ ...styles.balanceValue, color: "var(--clr-red)" }}>{formatCurrency(wallet.usedMargin)}</div>
      </div>
      <div style={styles.balanceCard}>
        <div style={styles.balanceLabel}>Free Collateral</div>
        <div style={{ ...styles.balanceValue, color: statusColor }}>{formatCurrency(wallet.freeCollateral)}</div>
      </div>
      <div style={styles.balanceCard}>
        <div style={styles.balanceLabel}>Margin Ratio</div>
        <div style={{ ...styles.balanceValue, color: statusColor }}>{wallet.marginRatio.toFixed(2)}%</div>
        <div style={{ ...styles.statusBadge, backgroundColor: `${statusColor}20` }}>{statusLabel}</div>
      </div>
      {wallet.liquidationPrice && (
        <div style={styles.balanceCard}>
          <div style={styles.balanceLabel}>Liquidation Price</div>
          <div style={styles.balanceValue}>{formatBalance(wallet.liquidationPrice, 4)}</div>
        </div>
      )}
    </div>
  );
}

function IsolatedMarginView({
  positions,
  compact
}: {
  positions: any[];
  compact: boolean;
}) {
  if (!positions || positions.length === 0) {
    return (
      <div style={styles.emptyState}>
        <p>No isolated margin positions</p>
      </div>
    );
  }

  if (compact) {
    const totalCollateral = positions.reduce(
      (sum, pos) => sum + (pos.availableBalance || 0) + (pos.lockedBalance || 0),
      0
    );

    return (
      <div style={styles.compactView}>
        <div style={styles.balanceHeader}>
          <div>
            <div style={styles.balanceLabel}>Isolated positions</div>
            <div style={styles.balanceValue}>{positions.length} open</div>
          </div>
          <div style={styles.statusBadge}>{positions.length === 1 ? "Single" : "Multiple"}</div>
        </div>

        <div style={styles.smallGrid}>
          <div style={styles.metricCard}>
            <span style={styles.metricLabel}>Total collateral</span>
            <strong>{formatCurrency(totalCollateral)}</strong>
          </div>
          <div style={styles.metricCard}>
            <span style={styles.metricLabel}>Top pair</span>
            <strong>{positions[0]?.pair || "—"}</strong>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.positionsTable}>
      <div style={styles.tableHeader}>
        <div>Pair</div>
        <div>Balance</div>
        <div>Leverage</div>
        <div>Margin Ratio</div>
      </div>
      {positions.map((pos, idx) => (
        <div key={idx} style={styles.tableRow}>
          <div>{pos.pair}</div>
          <div>{formatCurrency(pos.availableBalance)}</div>
          <div>{pos.leverage}x</div>
          <div style={{ color: getMarginStatusColor(pos.marginRatio) }}>{pos.marginRatio.toFixed(2)}%</div>
        </div>
      ))}
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = {
  container: (compact: boolean) => ({
    background: "var(--clr-surface-overlay-alt)",
    border: "1px solid var(--clr-border-overlay)",
    borderRadius: "18px",
    padding: compact ? "14px" : "20px",
    color: "var(--clr-text-bright)",
    fontSize: "14px",
    minWidth: 0,
  }),

  modeSelector: {
    display: "flex",
    gap: "8px",
    marginBottom: "16px",
    borderBottom: "1px solid var(--clr-border)",
    paddingBottom: "12px"
  },

  modeButton: (active: boolean) => ({
    padding: "6px 14px",
    border: "none",
    borderRadius: "6px",
    background: active ? "var(--clr-blue)" : "transparent",
    color: active ? "#ffffff" : "var(--clr-text)",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "600",
    transition: "all 0.2s",
  } as React.CSSProperties),

  balanceGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    gap: "12px",
    marginBottom: "16px"
  },

  balanceCard: {
    background: "var(--clr-surface-overlay)",
    border: "1px solid var(--clr-border-overlay)",
    borderRadius: "16px",
    padding: "14px",
    textAlign: "center" as const,
    minHeight: "110px",
  },

  balanceLabel: {
    fontSize: "12px",
    color: "var(--clr-text)",
    marginBottom: "6px"
  },

  balanceValue: {
    fontSize: "16px",
    fontWeight: "700",
    color: "var(--clr-green)"
  },

  statusBadge: {
    display: "inline-block",
    padding: "3px 8px",
    borderRadius: "4px",
    fontSize: "11px",
    fontWeight: "600",
    marginTop: "6px"
  },

  balanceHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
    flexWrap: "wrap" as const,
  } as React.CSSProperties,

  smallGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
    gap: "10px",
  } as React.CSSProperties,

  metricCard: {
    background: "var(--clr-surface-overlay)",
    border: "1px solid var(--clr-border-overlay)",
    borderRadius: "14px",
    padding: "12px",
  } as React.CSSProperties,

  metricLabel: {
    display: "block",
    fontSize: "11px",
    color: "var(--clr-text-muted)",
    marginBottom: "6px",
  } as React.CSSProperties,

  miniNote: {
    color: "var(--clr-text-muted)",
    fontSize: "12px",
    lineHeight: 1.5,
    marginTop: "6px",
  } as React.CSSProperties,

  portfolioSummary: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "10px",
    padding: "14px",
    background: "var(--clr-surface-overlay)",
    borderRadius: "14px",
    border: "1px solid var(--clr-border-overlay)",
  } as React.CSSProperties,

  compactView: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "10px"
  },

  balanceRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "13px",
    color: "var(--clr-text-bright)",
  },

  portfolioTotal: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "16px",
    paddingTop: "16px",
    borderTop: "1px solid var(--clr-border)",
    fontSize: "12px",
    color: "var(--clr-text)"
  },

  portfolioValue: {
    fontSize: "16px",
    fontWeight: "700",
    color: "var(--clr-green)"
  },

  positionsTable: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "1px"
  },

  tableHeader: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr 1fr",
    padding: "10px 12px",
    background: "var(--clr-panel)",
    border: "1px solid var(--clr-border)",
    borderRadius: "6px 6px 0 0",
    fontSize: "12px",
    fontWeight: "600",
    color: "var(--clr-text)"
  },

  tableRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr 1fr",
    padding: "10px 12px",
    background: "var(--clr-panel)",
    borderLeft: "1px solid var(--clr-border)",
    borderRight: "1px solid var(--clr-border)",
    borderBottom: "1px solid var(--clr-border)",
    fontSize: "13px"
  },

  positionCount: {
    fontSize: "13px",
    color: "var(--clr-text)"
  },

  emptyState: {
    textAlign: "center" as const,
    padding: "24px",
    color: "var(--clr-text)"
  },

  errorBox: {
    padding: "12px",
    background: "var(--clr-red-dim)",
    border: "1px solid var(--clr-red)",
    borderRadius: "6px",
    color: "var(--clr-red)",
    fontSize: "13px"
  },

  skeleton: {
    height: "100px",
    background: "linear-gradient(90deg, var(--clr-panel) 25%, var(--clr-hover) 50%, var(--clr-panel) 75%)",
    backgroundSize: "200% 100%",
    animation: "loading 1.5s infinite",
    borderRadius: "6px"
  }
};
