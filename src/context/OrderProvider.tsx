import React, { createContext, useContext, useMemo, useState } from 'react';
import type { Order, OrderItem, Pizza } from '../types';
import { applyLineDiscount, computeOrderTotals } from '../utils/discounts';
import { storage } from '../utils/storage';

type OrderContextValue = {
    items: OrderItem[];
    addToOrder: (pizza: Pizza, quantity: number) => void;
    updateQuantity: (pizzaId: string, quantity: number) => void;
    removeItem: (pizzaId: string) => void;
    clearOrder: () => void;
    confirmOrder: () => Order | null;
    totals: { subtotal: number; totalDiscount: number; total: number };
};

const OrderContext = createContext<OrderContextValue | null>(null);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [items, setItems] = useState<OrderItem[]>([]);

    const addToOrder = (pizza: Pizza, quantity: number) => {
        if (quantity <= 0) return;
        setItems(prev => {
            const existing = prev.find(i => i.pizzaId === pizza.id);
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
                return prev.map(i => (i.pizzaId === pizza.id ? line : i));
            }
            return [...prev, line];
        });
    };

    const updateQuantity = (pizzaId: string, quantity: number) => {
        setItems(prev =>
            prev
                .map(i =>
                    i.pizzaId === pizzaId
                        ? applyLineDiscount({ ...i, quantity })
                        : i
                )
                .filter(i => i.quantity > 0)
        );
    };

    const removeItem = (pizzaId: string) => {
        setItems(prev => prev.filter(i => i.pizzaId !== pizzaId));
    };

    const clearOrder = () => setItems([]);

    const totals = useMemo(() => computeOrderTotals(items), [items]);

    const confirmOrder = (): Order | null => {
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
        clearOrder();
        return order;
    };

    return (
        <OrderContext.Provider
            value={{ items, addToOrder, updateQuantity, removeItem, clearOrder, confirmOrder, totals }}
        >
            {children}
        </OrderContext.Provider>
    );
};

export const useOrderContext = () => {
    const ctx = useContext(OrderContext);
    if (!ctx) throw new Error('useOrderContext must be used within OrderProvider');
    return ctx;
};
