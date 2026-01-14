import { storage } from '../../src/utils/storage';
import type { Order } from '../../src/types';
import { vi, beforeEach, afterEach } from 'vitest';

describe('storage', () => {
    const mockOrder: Order = {
        id: 'order-123',
        items: [
            { pizzaId: 'test', name: 'Test', unitPrice: 10, quantity: 2, discountRate: 0, lineSubtotal: 20, lineDiscount: 0, lineTotal: 20 },
        ],
        subtotal: 20,
        totalDiscount: 0,
        total: 20,
        createdAt: '2024-01-01T00:00:00.000Z',
    };

    let localStorageMock: { [key: string]: string };

    beforeEach(() => {
        localStorageMock = {};
        vi.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => localStorageMock[key] ?? null);
        vi.spyOn(Storage.prototype, 'setItem').mockImplementation((key, value) => {
            localStorageMock[key] = value;
        });
        vi.spyOn(Storage.prototype, 'removeItem').mockImplementation((key) => {
            delete localStorageMock[key];
        });
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('saveOrder adds order to storage', () => {
        storage.saveOrder(mockOrder);
        const stored = JSON.parse(localStorageMock['pizza_orders']);
        expect(stored).toHaveLength(1);
        expect(stored[0].id).toBe('order-123');
    });

    it('saveOrder appends to existing orders', () => {
        storage.saveOrder(mockOrder);
        const secondOrder = { ...mockOrder, id: 'order-456' };
        storage.saveOrder(secondOrder);
        const stored = JSON.parse(localStorageMock['pizza_orders']);
        expect(stored).toHaveLength(2);
    });

    it('listOrders returns empty array when no orders', () => {
        expect(storage.listOrders()).toEqual([]);
    });

    it('listOrders returns saved orders', () => {
        storage.saveOrder(mockOrder);
        const orders = storage.listOrders();
        expect(orders).toHaveLength(1);
        expect(orders[0].id).toBe('order-123');
    });

    it('clear removes all orders', () => {
        storage.saveOrder(mockOrder);
        expect(storage.listOrders()).toHaveLength(1);
        storage.clear();
        expect(storage.listOrders()).toEqual([]);
    });

    it('handles corrupted localStorage gracefully', () => {
        localStorageMock['pizza_orders'] = 'not valid json';
        expect(storage.listOrders()).toEqual([]);
    });
});
