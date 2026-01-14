import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import OrderItemRow from '../../src/components/Order/OrderItemRow';
import orderReducer from '../../src/redux/orderSlice';

const createTestStore = () =>
    configureStore({
        reducer: {
            order: orderReducer,
        },
    });

const mockItem = {
    pizzaId: 'margherita',
    name: 'Margherita',
    unitPrice: 5,
    quantity: 1,
    lineSubtotal: 5,
    lineDiscount: 0,
    lineTotal: 5,
};

describe('OrderItemRow', () => {
    it('renders item details', () => {
        render(
            <Provider store={createTestStore()}>
                <OrderItemRow {...mockItem} />
            </Provider>
        );

        expect(screen.getByText(/Margherita/i)).toBeInTheDocument();
        expect(screen.getAllByText(/\$5.00/).length).toBeGreaterThan(0);
    });

    it('calls removeItem when clicking remove', () => {
        render(
            <Provider store={createTestStore()}>
                <OrderItemRow {...mockItem} />
            </Provider>
        );

        fireEvent.click(screen.getByText(/Remove/i));
    });
});