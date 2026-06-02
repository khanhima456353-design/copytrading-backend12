import { getAxios } from "../api";

export interface WalletBalance {
  userId: string;
  type: "spot" | "cross" | "isolated";
  availableBalance: number;
  lockedBalance: number;
  borrowedBalance: number;
  totalBalance: number;
  equity?: number;
}

export interface MarginMetrics {
  usedMargin: number;
  freeCollateral: number;
  marginRatio: number; // percentage
  liquidationPrice?: number;
}

export interface IsolatedPosition {
  pair: string;
  baseAsset: string;
  quoteAsset: string;
  availableBalance: number;
  lockedBalance: number;
  borrowedBalance: number;
  leverage: number;
  marginRatio: number;
  liquidationPrice?: number;
}

export interface BalanceData {
  spot: WalletBalance | null;
  cross: WalletBalance & MarginMetrics | null;
  isolated: IsolatedPosition[] | null;
  totalPortfolioValue: number;
  lastUpdated: number;
}

// Note: `getAxios()` returns a Promise that resolves to the axios instance.
// Do not call it at module top-level to avoid using a Promise directly.

/**
 * Fetch all wallet balances for the authenticated user
 */
export async function fetchWalletBalances(): Promise<BalanceData> {
  try {
    const api = await getAxios();
    const response = await api.get("/api/wallet", {
      timeout: 5000
    });

    const payload = response.data?.data ?? response.data ?? {};
    const wallets: Record<string, any>[] = Array.isArray(payload.wallets) ? payload.wallets : [];

    const computeWalletTotal = (wallet: Record<string, any>): number => {
      const available = Number(wallet.availableBalance ?? wallet.available ?? 0);
      const locked = Number(wallet.lockedBalance ?? wallet.locked ?? 0);
      const total = Number(wallet.totalBalance ?? wallet.total ?? available + locked);
      return Number.isFinite(total) ? total : available + locked;
    };

    let totalPortfolioValue = 0;
    if (wallets.length > 0) {
      totalPortfolioValue = wallets.reduce((sum: number, wallet: Record<string, any>) => sum + computeWalletTotal(wallet), 0);
    } else {
      const available = Number(payload.availableBalance ?? payload.available ?? 0);
      const locked = Number(payload.lockedBalance ?? payload.locked ?? 0);
      const total = Number(payload.totalPortfolioValue ?? payload.totalBalance ?? payload.total ?? available + locked);
      totalPortfolioValue = Number.isFinite(total) ? total : available + locked;
    }

    const balanceData: BalanceData = {
      spot: null,
      cross: null,
      isolated: null,
      totalPortfolioValue,
      lastUpdated: Date.now()
    };

    if (wallets.length > 0) {
      for (const wallet of wallets) {
        if (wallet.type === "spot") {
          balanceData.spot = {
            userId: wallet.userId || "",
            type: "spot",
            availableBalance: wallet.availableBalance || 0,
            lockedBalance: wallet.lockedBalance || 0,
            borrowedBalance: 0,
            totalBalance: wallet.totalBalance || 0
          };
        } else if (wallet.type === "cross") {
          const marginMetrics = calculateCrossMarginMetrics(wallet);
          balanceData.cross = {
            userId: wallet.userId || "",
            type: "cross",
            availableBalance: wallet.availableBalance || 0,
            lockedBalance: wallet.lockedBalance || 0,
            borrowedBalance: wallet.borrowedBalance || 0,
            totalBalance: wallet.totalBalance || 0,
            ...marginMetrics
          };
        } else if (wallet.type === "isolated") {
          balanceData.isolated = wallet.positions || [];
        }
      }
    } else if (payload && (payload.availableBalance !== undefined || payload.lockedBalance !== undefined)) {
      balanceData.spot = {
        userId: payload.userId || "",
        type: "spot",
        availableBalance: payload.availableBalance || 0,
        lockedBalance: payload.lockedBalance || 0,
        borrowedBalance: 0,
        totalBalance: payload.totalBalance || totalPortfolioValue
      };
    }

    return balanceData;
  } catch (error) {
    console.error("Error fetching wallet balances:", error);
    return {
      spot: null,
      cross: null,
      isolated: null,
      totalPortfolioValue: 0,
      lastUpdated: Date.now()
    };
  }
}

/**
 * Calculate cross margin metrics from wallet data
 */
function calculateCrossMarginMetrics(wallet: any): MarginMetrics {
  const totalCollateral = wallet.availableBalance + wallet.lockedBalance;
  const usedMargin = wallet.borrowedBalance * (wallet.leverage || 1);
  const freeCollateral = totalCollateral - usedMargin;
  const marginRatio = totalCollateral > 0 ? (usedMargin / totalCollateral) * 100 : 0;

  return {
    usedMargin,
    freeCollateral: Math.max(0, freeCollateral),
    marginRatio: Math.min(100, marginRatio),
    liquidationPrice: wallet.liquidationPrice
  };
}

/**
 * Calculate isolated margin metrics for a specific pair
 */
export function calculateIsolatedMetrics(position: IsolatedPosition): MarginMetrics {
  const totalCollateral = position.availableBalance + position.lockedBalance;
  const usedMargin = position.borrowedBalance * position.leverage;
  const freeCollateral = totalCollateral - usedMargin;
  const marginRatio = totalCollateral > 0 ? (usedMargin / totalCollateral) * 100 : 0;

  return {
    usedMargin,
    freeCollateral: Math.max(0, freeCollateral),
    marginRatio: Math.min(100, marginRatio),
    liquidationPrice: position.liquidationPrice
  };
}

/**
 * Format balance for display (2-4 decimal places)
 */
export function formatBalance(balance: number, decimals = 2): string {
  if (!balance || balance === 0) return "0.00";
  if (balance < 0.01) return balance.toExponential(2);
  return balance.toFixed(decimals);
}

/**
 * Format currency with locale
 */
export function formatCurrency(amount: number, currency = "USDT"): string {
  const formatted = amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  return `${formatted} ${currency}`;
}

/**
 * Get margin status color based on ratio
 * Green: < 50%, Yellow: 50-80%, Red: > 80%
 */
export function getMarginStatusColor(marginRatio: number): string {
  if (marginRatio < 50) return "#0ecb81"; // green
  if (marginRatio < 80) return "#f0b90b"; // yellow
  return "#f6465d"; // red
}

/**
 * Get margin status label
 */
export function getMarginStatusLabel(marginRatio: number): string {
  if (marginRatio < 50) return "Safe";
  if (marginRatio < 80) return "Warning";
  return "Danger";
}
