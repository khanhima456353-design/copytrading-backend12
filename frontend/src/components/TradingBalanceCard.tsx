import React from "react";
import { useBalance } from "../context/BalanceContext";
import { BalanceDisplay } from "./BalanceDisplay";

export function TradingBalanceCard() {
  const { balances, loading, refreshBalances } = useBalance();

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
