import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { createSelector } from '@reduxjs/toolkit';
import type { Order, OrderItem, Pizza } from '../types';
import { applyLineDiscount, computeOrderTotals } from '../utils/discounts';
import { storage } from '../utils/storage';
import type { RootState } from './store';

type OrderState = {
    items: OrderItem[];
};

const initialState: OrderState = {
    items: [],
};

const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        addToOrder(state, action: PayloadAction<{ pizza: Pizza; quantity: number }>) {
            const { pizza, quantity } = action.payload;
            if (quantity <= 0) return;

            const existing = state.items.find(i => i.pizzaId === pizza.id);
            const newQty = (existing?.quantity ?? 0) + quantity;
            const line = applyLineDiscount({
                pizzaId: pizza.id,
                name: pizza.name,
                unitPrice: pizza.price,
                quantity: newQty,
                discountRate: 0,
                lineSubtotal: 0,
                lineDiscount: 0,
                lineTotal: 0,
            });

            if (existing) {
                const index = state.items.findIndex(i => i.pizzaId === pizza.id);
                state.items[index] = line;
            } else {
                state.items.push(line);
            }
        },
        updateQuantity(state, action: PayloadAction<{ pizzaId: string; quantity: number }>) {
            const { pizzaId, quantity } = action.payload;
            state.items = state.items
                .map(i =>
                    i.pizzaId === pizzaId
                        ? applyLineDiscount({ ...i, quantity })
                        : i
                )
                .filter(i => i.quantity > 0);
        },
        removeItem(state, action: PayloadAction<string>) {
            state.items = state.items.filter(i => i.pizzaId !== action.payload);
        },
        clearOrder(state) {
            state.items = [];
        },
    },
});

export const { addToOrder, updateQuantity, removeItem, clearOrder } = orderSlice.actions;
export default orderSlice.reducer;

// Selectors
export const selectItems = (state: RootState) => state.order.items;

export const selectTotals = createSelector([selectItems], items =>
    computeOrderTotals(items)
);

// Thunk for confirming order (saves to storage, then clears)
export const confirmOrder = () => (dispatch: (action: ReturnType<typeof clearOrder>) => void, getState: () => RootState): Order | null => {
    const state = getState();
    const items = selectItems(state);
    const totals = selectTotals(state);

    if (items.length === 0) return null;

    const order: Order = {
        id: crypto.randomUUID(),
        items,
        subtotal: totals.subtotal,
        totalDiscount: totals.totalDiscount,
        total: totals.total,
        createdAt: new Date().toISOString(),
    };

    storage.saveOrder(order);
    dispatch(clearOrder());
    return order;
};
