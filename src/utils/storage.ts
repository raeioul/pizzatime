import type { Order } from '../types';

const ORDERS_KEY = 'pizza_orders';

const getOrders = (): Order[] => {
    try {
        const raw = localStorage.getItem(ORDERS_KEY);
        return raw ? (JSON.parse(raw) as Order[]) : [];
    } catch {
        return [];
    }
};

const setOrders = (orders: Order[]) => {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
};

export const storage = {
    saveOrder(order: Order) {
        const orders = getOrders();
        orders.push(order);
        setOrders(orders);
    },
    listOrders(): Order[] {
        return getOrders();
    },
    clear() {
        localStorage.removeItem(ORDERS_KEY);
    },
};
