import orderReducer, {
    addToOrder,
    updateQuantity,
    removeItem,
    clearOrder,
    selectItems,
    selectTotals,
} from '../../src/redux/orderSlice';
import type { Pizza, OrderItem } from '../../src/types';

const mockPizza: Pizza = {
    id: 'margherita',
    name: 'Margherita',
    price: 10,
    ingredients: ['cheese', 'tomato'],
    category: 'classic',
};

const mockPizza2: Pizza = {
    id: 'pepperoni',
    name: 'Pepperoni',
    price: 12,
    ingredients: ['cheese', 'pepperoni'],
    category: 'meat',
};

describe('orderSlice reducer', () => {
    const initialState = { items: [] };

    it('should handle addToOrder for new item', () => {
        const state = orderReducer(initialState, addToOrder({ pizza: mockPizza, quantity: 2 }));
        expect(state.items).toHaveLength(1);
        expect(state.items[0].pizzaId).toBe('margherita');
        expect(state.items[0].quantity).toBe(2);
        expect(state.items[0].lineSubtotal).toBe(20);
    });

    it('should handle addToOrder for existing item (adds quantity)', () => {
        const stateWithItem = orderReducer(initialState, addToOrder({ pizza: mockPizza, quantity: 1 }));
        const state = orderReducer(stateWithItem, addToOrder({ pizza: mockPizza, quantity: 2 }));
        expect(state.items).toHaveLength(1);
        expect(state.items[0].quantity).toBe(3);
        expect(state.items[0].lineSubtotal).toBe(30);
    });

    it('should ignore addToOrder with quantity <= 0', () => {
        const state = orderReducer(initialState, addToOrder({ pizza: mockPizza, quantity: 0 }));
        expect(state.items).toHaveLength(0);

        const state2 = orderReducer(initialState, addToOrder({ pizza: mockPizza, quantity: -1 }));
        expect(state2.items).toHaveLength(0);
    });

    it('should apply 10% discount when quantity >= 3', () => {
        const state = orderReducer(initialState, addToOrder({ pizza: mockPizza, quantity: 3 }));
        expect(state.items[0].quantity).toBe(3);
        expect(state.items[0].discountRate).toBe(0.1);
        expect(state.items[0].lineSubtotal).toBe(30);
        expect(state.items[0].lineDiscount).toBe(3);
        expect(state.items[0].lineTotal).toBe(27);
    });

    it('should handle updateQuantity', () => {
        const stateWithItem = orderReducer(initialState, addToOrder({ pizza: mockPizza, quantity: 2 }));
        const state = orderReducer(stateWithItem, updateQuantity({ pizzaId: 'margherita', quantity: 5 }));
        expect(state.items[0].quantity).toBe(5);
        expect(state.items[0].lineSubtotal).toBe(50);
        expect(state.items[0].discountRate).toBe(0.1); // >= 3 gets discount
    });

    it('should remove item when updateQuantity sets to 0', () => {
        const stateWithItem = orderReducer(initialState, addToOrder({ pizza: mockPizza, quantity: 2 }));
        const state = orderReducer(stateWithItem, updateQuantity({ pizzaId: 'margherita', quantity: 0 }));
        expect(state.items).toHaveLength(0);
    });

    it('should handle removeItem', () => {
        let state = orderReducer(initialState, addToOrder({ pizza: mockPizza, quantity: 1 }));
        state = orderReducer(state, addToOrder({ pizza: mockPizza2, quantity: 2 }));
        expect(state.items).toHaveLength(2);

        state = orderReducer(state, removeItem('margherita'));
        expect(state.items).toHaveLength(1);
        expect(state.items[0].pizzaId).toBe('pepperoni');
    });

    it('should handle clearOrder', () => {
        let state = orderReducer(initialState, addToOrder({ pizza: mockPizza, quantity: 2 }));
        state = orderReducer(state, addToOrder({ pizza: mockPizza2, quantity: 1 }));
        expect(state.items).toHaveLength(2);

        state = orderReducer(state, clearOrder());
        expect(state.items).toHaveLength(0);
    });
});

describe('orderSlice selectors', () => {
    const createMockState = (items: OrderItem[]) => ({
        pizza: { pizzas: [], filters: {} as any },
        order: { items },
    });

    it('selectItems returns items', () => {
        const items: OrderItem[] = [
            { pizzaId: 'test', name: 'Test', unitPrice: 10, quantity: 2, discountRate: 0, lineSubtotal: 20, lineDiscount: 0, lineTotal: 20 },
        ];
        expect(selectItems(createMockState(items))).toEqual(items);
    });

    it('selectTotals computes subtotal correctly', () => {
        const items: OrderItem[] = [
            { pizzaId: 'test1', name: 'Test1', unitPrice: 10, quantity: 2, discountRate: 0, lineSubtotal: 20, lineDiscount: 0, lineTotal: 20 },
            { pizzaId: 'test2', name: 'Test2', unitPrice: 15, quantity: 1, discountRate: 0, lineSubtotal: 15, lineDiscount: 0, lineTotal: 15 },
        ];
        const totals = selectTotals(createMockState(items));
        expect(totals.subtotal).toBe(35);
        expect(totals.totalDiscount).toBe(0);
        expect(totals.total).toBe(35);
    });

    it('selectTotals computes discount correctly', () => {
        const items: OrderItem[] = [
            { pizzaId: 'test1', name: 'Test1', unitPrice: 10, quantity: 3, discountRate: 0.1, lineSubtotal: 30, lineDiscount: 3, lineTotal: 27 },
        ];
        const totals = selectTotals(createMockState(items));
        expect(totals.subtotal).toBe(30);
        expect(totals.totalDiscount).toBe(3);
        expect(totals.total).toBe(27);
    });

    it('selectTotals returns zeros for empty cart', () => {
        const totals = selectTotals(createMockState([]));
        expect(totals.subtotal).toBe(0);
        expect(totals.totalDiscount).toBe(0);
        expect(totals.total).toBe(0);
    });
});
