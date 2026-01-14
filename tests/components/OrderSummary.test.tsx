import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import OrderSummary from '../../src/components/Order/OrderSummary';
import orderReducer, { addToOrder } from '../../src/redux/orderSlice';
import type { Pizza } from '../../src/types';
import { vi } from 'vitest';

const mockPizza: Pizza = {
    id: 'margherita',
    name: 'Margherita',
    price: 10,
    ingredients: ['cheese', 'tomato'],
    category: 'classic',
};

const createTestStore = () =>
    configureStore({
        reducer: {
            order: orderReducer,
        },
    });

const renderWithProviders = () => {
    const store = createTestStore();
    return {
        store,
        ...render(
            <Provider store={store}>
                <OrderSummary />
            </Provider>
        ),
    };
};

describe('OrderSummary', () => {
    it('shows empty message when no items', () => {
        renderWithProviders();
        expect(screen.getByText('No items yet.')).toBeInTheDocument();
    });

    it('renders Order Summary heading', () => {
        renderWithProviders();
        expect(screen.getByRole('heading', { name: /order summary/i })).toBeInTheDocument();
    });

    it('shows items when added to cart', () => {
        const { store } = renderWithProviders();
        store.dispatch(addToOrder({ pizza: mockPizza, quantity: 2 }));

        // Re-render to reflect state change
        const { rerender } = render(
            <Provider store={store}>
                <OrderSummary />
            </Provider>
        );

        expect(screen.getByText('Margherita')).toBeInTheDocument();
    });

    it('shows subtotal, discount, and total', () => {
        const store = createTestStore();
        store.dispatch(addToOrder({ pizza: mockPizza, quantity: 3 })); // 3 items = 10% discount

        render(
            <Provider store={store}>
                <OrderSummary />
            </Provider>
        );

        expect(screen.getByText(/Subtotal:/)).toBeInTheDocument();
        expect(screen.getByText(/Discount:/)).toBeInTheDocument();
        expect(screen.getByText(/Total:/)).toBeInTheDocument();
    });

    it('shows Confirm Order button when cart has items', () => {
        const store = createTestStore();
        store.dispatch(addToOrder({ pizza: mockPizza, quantity: 1 }));

        render(
            <Provider store={store}>
                <OrderSummary />
            </Provider>
        );

        expect(screen.getByRole('button', { name: /confirm order/i })).toBeInTheDocument();
    });

    it('does not show Confirm Order button when cart is empty', () => {
        renderWithProviders();
        expect(screen.queryByRole('button', { name: /confirm order/i })).not.toBeInTheDocument();
    });

    it('shows alert when confirming order', () => {
        const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => { });
        const store = createTestStore();
        store.dispatch(addToOrder({ pizza: mockPizza, quantity: 2 }));

        render(
            <Provider store={store}>
                <OrderSummary />
            </Provider>
        );

        fireEvent.click(screen.getByRole('button', { name: /confirm order/i }));
        expect(alertSpy).toHaveBeenCalled();
        alertSpy.mockRestore();
    });

    it('clears cart after confirming order', () => {
        vi.spyOn(window, 'alert').mockImplementation(() => { });
        const store = createTestStore();
        store.dispatch(addToOrder({ pizza: mockPizza, quantity: 2 }));

        render(
            <Provider store={store}>
                <OrderSummary />
            </Provider>
        );

        fireEvent.click(screen.getByRole('button', { name: /confirm order/i }));
        expect(store.getState().order.items).toHaveLength(0);
        vi.restoreAllMocks();
    });
});
