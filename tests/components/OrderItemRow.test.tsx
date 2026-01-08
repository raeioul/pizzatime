import { render, screen, fireEvent } from '@testing-library/react';
import OrderItemRow from '../../src/components/Order/OrderItemRow';
import { OrderProvider } from '../../src/context/OrderProvider';

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
            <OrderProvider>
                <OrderItemRow {...mockItem} />
            </OrderProvider>
        );

        expect(screen.getByText(/Margherita/i)).toBeInTheDocument();
        expect(screen.getAllByText(/\$5.00/).length).toBeGreaterThan(0);
    });

    it('calls removeItem when clicking remove', () => {
        render(
            <OrderProvider>
                <OrderItemRow {...mockItem} />
            </OrderProvider>
        );

        fireEvent.click(screen.getByText(/Remove/i));
    });
});