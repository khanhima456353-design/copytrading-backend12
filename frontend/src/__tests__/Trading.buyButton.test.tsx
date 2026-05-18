import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

// Shared mock API
const mockApi: any = {
  get: jest.fn((path: string) => {
    // defaults overridden per-test via jest.spyOn
    return Promise.resolve({ data: {} });
  }),
  post: jest.fn((path: string) => Promise.resolve({ data: {} })),
};

jest.mock('../api', () => ({ getAxios: async () => mockApi }));
jest.mock('../services/marketState', () => ({
  subscribeConnectionStatus: (cb: any) => { cb('live'); return () => {}; },
  subscribeMarketState: () => () => {},
  isValidPrice: () => true,
  MarketState: {}
}));

import Trading from '../pages/Trading';

const setup = async (available = 100, openOrders: any[] = []) => {
  mockApi.get.mockImplementation((path: string) => {
    if (path === '/api/account/summary') return Promise.resolve({ data: { available, locked: 0, holdings: [] } });
    if (path === '/api/account/open-orders') return Promise.resolve({ data: openOrders.map(o => ({ ...o })) });
    if (path === '/api/trade/history') return Promise.resolve({ data: [] });
    return Promise.resolve({ data: {} });
  });
  render(<Trading />);
  await waitFor(() => expect(mockApi.get).toHaveBeenCalled());
};

describe('Buy button state - edge cases', () => {
  beforeEach(() => jest.clearAllMocks());

  test('Free to Trade > order total => Enabled', async () => {
    await setup(100, []); // free=100
    const totalInput = screen.getByPlaceholderText(/Minimum 5 USDT/i) as HTMLInputElement;
    fireEvent.change(totalInput, { target: { value: '50' } });
    const buyButton = screen.getByRole('button', { name: /Buy \/ Long/i });
    await waitFor(() => expect(buyButton).toBeEnabled());
  });

  test('Free to Trade < order total => Disabled', async () => {
    // one open buy order that reserves 60 (price 10 * amount 6)
    const openOrders = [{ orderId: 'o1', pair: 'BTC/USDT', type: 'limit', side: 'buy', price: 10, amount: 5, status: 'open', createdAt: new Date().toISOString() }];
    await setup(100, openOrders); // reserved=50 -> free=50
    const totalInput = screen.getByPlaceholderText(/Minimum 5 USDT/i) as HTMLInputElement;
    fireEvent.change(totalInput, { target: { value: '60' } });
    const buyButton = screen.getByRole('button', { name: /Buy \/ Long/i });
    await waitFor(() => expect(buyButton).toBeDisabled());
  });

  test('Free to Trade = order total (exact) => Enabled', async () => {
    const openOrders = [{ orderId: 'o1', pair: 'BTC/USDT', type: 'limit', side: 'buy', price: 10, amount: 5, status: 'open', createdAt: new Date().toISOString() }];
    await setup(100, openOrders); // reserved=50 free=50
    const totalInput = screen.getByPlaceholderText(/Minimum 5 USDT/i) as HTMLInputElement;
    fireEvent.change(totalInput, { target: { value: '50' } });
    const buyButton = screen.getByRole('button', { name: /Buy \/ Long/i });
    await waitFor(() => expect(buyButton).toBeEnabled());
  });

  test('Amount field is 0 or empty => Disabled', async () => {
    await setup(100, []);
    // ensure amount is empty/0
    const amountInputs = screen.getAllByPlaceholderText(/0.0000|0.00000000/); // multiple formats
    if (amountInputs.length) fireEvent.change(amountInputs[0], { target: { value: '0' } });
    const buyButton = screen.getByRole('button', { name: /Buy \/ Long/i });
    await waitFor(() => expect(buyButton).toBeDisabled());
  });

  test('Price field is 0 or empty => Disabled', async () => {
    await setup(100, []);
    // price input placeholder is "0.00" for limit orders
    const priceInput = screen.getByPlaceholderText(/0.00/);
    fireEvent.change(priceInput, { target: { value: '' } });
    // set amount > 0 so amount is valid
    const amountInputs = screen.getAllByPlaceholderText(/0.0000|0.00000000/);
    if (amountInputs.length) fireEvent.change(amountInputs[0], { target: { value: '1' } });
    const buyButton = screen.getByRole('button', { name: /Buy \/ Long/i });
    await waitFor(() => expect(buyButton).toBeDisabled());
  });

  test('Order is being submitted => Disabled + spinner shown', async () => {
    // Keep API post pending so spinner is visible
    mockApi.post.mockImplementation((path: string) => new Promise(resolve => setTimeout(() => resolve({ data: {} }), 150)));
    await setup(100, []);
    // Set a total less than free
    const totalInput = screen.getByPlaceholderText(/Minimum 5 USDT/i) as HTMLInputElement;
    fireEvent.change(totalInput, { target: { value: '10' } });
    // Click Buy to open confirm modal
    const buyButton = screen.getByRole('button', { name: /Buy \/ Long/i });
    fireEvent.click(buyButton);
    // Confirm modal should open - find Confirm Buy button
    const confirmButton = await screen.findByRole('button', { name: /Confirm Buy|Confirm buy/i });
    fireEvent.click(confirmButton);
    // While API pending, the confirm button should show "Placing..."
    await waitFor(() => expect(screen.getByText(/Placing\.\.\.|Placing.../i)).toBeInTheDocument());
    expect(confirmButton).toBeDisabled();
  });

  test('No USDT balance at all => Disabled', async () => {
    await setup(0, []);
    const totalInput = screen.getByPlaceholderText(/Minimum 5 USDT/i) as HTMLInputElement;
    fireEvent.change(totalInput, { target: { value: '1' } });
    const buyButton = screen.getByRole('button', { name: /Buy \/ Long/i });
    await waitFor(() => expect(buyButton).toBeDisabled());
  });
});
