import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useBalance } from "../context/BalanceContext";
import { BalanceDisplay } from "./BalanceDisplay";

/**
 * Full Balance Card for Trading Page Header
 * Shows detailed balance information for the current trading mode
 * Reads mode from location state (passed from home page) and applies it
 */
export function TradingBalanceCard() {
  const { balances, loading, selectedMode, setSelectedMode, refreshBalances } = useBalance();
  const location = useLocation();

  // Apply mode from location state when navigating from home page
  useEffect(() => {
    const state = location.state as { mode?: "portfolio" | "spot" | "cross" | "isolated" } | undefined;
    if (state?.mode && state.mode !== selectedMode) {
      setSelectedMode(state.mode);
    }
  }, [location.state, selectedMode, setSelectedMode]);

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <h2 style={styles.title}>Wallet</h2>
        <button
          onClick={refreshBalances}
          style={styles.refreshButton}
          disabled={loading}
        >
          {loading ? "..." : "↻"}
        </button>
      </div>

      <BalanceDisplay
        data={balances}
        selectedMode={selectedMode}
        onModeChange={setSelectedMode}
        loading={loading}
        compact={false}
      />
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = {
  card: {
    background: "var(--clr-panel)",
    border: "1px solid var(--clr-border)",
    borderRadius: "12px",
    padding: "16px",
    color: "var(--clr-text-bright)",
    marginBottom: "16px"
  } as React.CSSProperties,

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px"
  } as React.CSSProperties,

  title: {
    margin: "0",
    fontSize: "16px",
    fontWeight: "700",
    color: "var(--clr-text-bright)"
  } as React.CSSProperties,

  refreshButton: {
    width: "32px",
    height: "32px",
    borderRadius: "6px",
    border: "1px solid var(--clr-border)",
    background: "transparent",
    color: "var(--clr-text)",
    cursor: "pointer",
    fontSize: "16px",
    transition: "all 0.2s",
    ":hover": {
      background: "var(--clr-hover)",
      color: "var(--clr-text-bright)"
    },
    ":disabled": {
      opacity: "0.5",
      cursor: "not-allowed"
    }
  } as React.CSSProperties
};
