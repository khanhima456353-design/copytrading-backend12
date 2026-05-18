import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock getAxios to control API responses used by Trading.tsx
const mockApi: any = {
  get: jest.fn((path: string) => {
    if (path === '/api/account/summary') return Promise.resolve({ data: { available: 100, locked: 0, holdings: [] } });
    if (path === '/api/account/open-orders') return Promise.resolve({ data: [ { orderId: 'o-1', pair: 'BTC/USDT', type: 'limit', side: 'buy', price: 10, amount: 5, status: 'open', createdAt: new Date().toISOString() } ] });
    if (path === '/api/account/balances') return Promise.resolve({ data: {} });
    if (path === '/api/trade/history') return Promise.resolve({ data: [] });
    return Promise.resolve({ data: {} });
  }),
  post: jest.fn((path: string) => {
    if (path === '/api/trade/cancel') return Promise.resolve({ data: { success: true } });
    return Promise.resolve({ data: {} });
  })
};

jest.mock('../api', () => ({ getAxios: async () => mockApi }));

// Minimal mocks for marketState imports used in Trading
jest.mock('../services/marketState', () => ({
  subscribeConnectionStatus: () => () => {},
  subscribeMarketState: () => () => {},
  isValidPrice: () => true,
  MarketState: {}
}));

// Render the component
import Trading from '../pages/Trading';

describe('Trading balance display', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Shows Reserved and Free to Trade correctly and updates after cancel', async () => {
    render(<Trading />);

    // Wait for initial API fetch to complete and UI to render values
    await waitFor(() => expect(mockApi.get).toHaveBeenCalled());

    // Reserved should reflect open order (price 10 * amount 5 = 50)
    expect(screen.getByText(/Reserved\s+50.00\s+USDT|Reserved 50.00 USDT/)).toBeInTheDocument();

    // Free to trade should be available(100) - reserved(50) = 50
    expect(screen.getByText(/Free to trade\s+50.00\s+USDT|Free to trade 50.00 USDT/)).toBeInTheDocument();

    // Find the Total input and set a total greater than freeToTrade to disable buy
    const totalInput = screen.getByPlaceholderText(/Minimum 5 USDT/i) as HTMLInputElement;
    fireEvent.change(totalInput, { target: { value: '60' } });

    // Buy button should be disabled
    const buyButton = screen.getByRole('button', { name: /Buy \/ Long/i });
    expect(buyButton).toBeDisabled();

    // Click the Cancel button on the open order
    const cancelButtons = screen.getAllByText('Cancel');
    expect(cancelButtons.length).toBeGreaterThan(0);
    fireEvent.click(cancelButtons[0]);

    // After cancel, reserved should drop to 0 and freeToTrade become 100
    await waitFor(() => expect(screen.getByText(/Reserved\s+0.00\s+USDT|Reserved 0.00 USDT/)).toBeInTheDocument());
    expect(screen.getByText(/Free to trade\s+100.00\s+USDT|Free to trade 100.00 USDT/)).toBeInTheDocument();

    // With freeToTrade 100, buy button should be enabled for total 60
    expect(buyButton).not.toBeDisabled();
  });
});
