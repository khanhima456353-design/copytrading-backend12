import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { BalanceData, fetchWalletBalances } from "../services/walletService";

interface BalanceContextType {
  balances: BalanceData | null;
  loading: boolean;
  error: string | null;
  selectedMode: "portfolio" | "spot" | "cross" | "isolated";
  setSelectedMode: (mode: "portfolio" | "spot" | "cross" | "isolated") => void;
  refreshBalances: () => Promise<void>;
}

const BalanceContext = createContext<BalanceContextType | undefined>(undefined);

/**
 * Balance Provider Component
 * Manages wallet balance state and provides it to all child components
 */
export function BalanceProvider({ children }: { children: React.ReactNode }) {
  const [balances, setBalances] = useState<BalanceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMode, setSelectedMode] = useState<"portfolio" | "spot" | "cross" | "isolated">("portfolio");

  /**
   * Fetch balances on mount and set up refresh interval
   */
  useEffect(() => {
    const loadBalances = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchWalletBalances();
        setBalances(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load balances");
      } finally {
        setLoading(false);
      }
    };

    loadBalances();

    // Refresh every 5 seconds
    const interval = setInterval(loadBalances, 5000);
    return () => clearInterval(interval);
  }, []);

  /**
   * Manual refresh function
   */
  const refreshBalances = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchWalletBalances();
      setBalances(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to refresh balances");
    } finally {
      setLoading(false);
    }
  }, []);

  const value: BalanceContextType = {
    balances,
    loading,
    error,
    selectedMode,
    setSelectedMode,
    refreshBalances
  };

  return (
    <BalanceContext.Provider value={value}>
      {children}
    </BalanceContext.Provider>
  );
}

/**
 * Hook to use balance context
 */
export function useBalance() {
  const context = useContext(BalanceContext);
  if (context === undefined) {
    throw new Error("useBalance must be used within BalanceProvider");
  }
  return context;
}
