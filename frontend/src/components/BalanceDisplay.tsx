import React from "react";
import {
  formatCurrency,
  BalanceData
} from "../services/walletService";

interface BalanceDisplayProps {
  data: BalanceData | null;
  loading: boolean;
  compact?: boolean;
}

/**
 * Reusable Balance Display Component
 * Shows total portfolio value
 */
export function BalanceDisplay({
  data,
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

  return (
    <div style={styles.container(compact)}>
      <div style={styles.portfolioSummary}>
        <div style={styles.balanceHeader}>
          <div>
            <div style={styles.balanceLabel}>Total portfolio value</div>
            <div style={styles.balanceValue}>{formatCurrency(data.totalPortfolioValue)}</div>
          </div>
        </div>
      </div>

      {!compact && (
        <div style={styles.portfolioTotal}>
          <span>Total portfolio value</span>
          <span style={styles.portfolioValue}>{formatCurrency(data.totalPortfolioValue)}</span>
        </div>
      )}
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

  balanceHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
    flexWrap: "wrap" as const,
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
