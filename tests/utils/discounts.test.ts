import { applyLineDiscount, computeOrderTotals } from '../../src/utils/discounts';
import type { OrderItem } from '../../src/types';

describe('applyLineDiscount', () => {
    const createLine = (quantity: number, unitPrice: number = 10): OrderItem => ({
        pizzaId: 'test',
        name: 'Test Pizza',
        unitPrice,
        quantity,
        discountRate: 0,
        lineSubtotal: 0,
        lineDiscount: 0,
        lineTotal: 0,
    });

    it('applies no discount for quantity < 3', () => {
        const line = applyLineDiscount(createLine(1));
        expect(line.discountRate).toBe(0);
        expect(line.lineSubtotal).toBe(10);
        expect(line.lineDiscount).toBe(0);
        expect(line.lineTotal).toBe(10);
    });

    it('applies no discount for quantity = 2', () => {
        const line = applyLineDiscount(createLine(2));
        expect(line.discountRate).toBe(0);
        expect(line.lineSubtotal).toBe(20);
        expect(line.lineDiscount).toBe(0);
        expect(line.lineTotal).toBe(20);
    });

    it('applies 10% discount for quantity = 3', () => {
        const line = applyLineDiscount(createLine(3));
        expect(line.discountRate).toBe(0.1);
        expect(line.lineSubtotal).toBe(30);
        expect(line.lineDiscount).toBe(3);
        expect(line.lineTotal).toBe(27);
    });

    it('applies 10% discount for quantity > 3', () => {
        const line = applyLineDiscount(createLine(5));
        expect(line.discountRate).toBe(0.1);
        expect(line.lineSubtotal).toBe(50);
        expect(line.lineDiscount).toBe(5);
        expect(line.lineTotal).toBe(45);
    });

    it('handles decimal prices correctly', () => {
        const line = applyLineDiscount(createLine(3, 9.99));
        expect(line.lineSubtotal).toBeCloseTo(29.97);
        expect(line.lineDiscount).toBeCloseTo(3.00);
        expect(line.lineTotal).toBeCloseTo(26.97);
    });
});

describe('computeOrderTotals', () => {
    it('returns zeros for empty array', () => {
        const totals = computeOrderTotals([]);
        expect(totals.subtotal).toBe(0);
        expect(totals.totalDiscount).toBe(0);
        expect(totals.total).toBe(0);
    });

    it('computes totals for single item without discount', () => {
        const items: OrderItem[] = [
            { pizzaId: 'a', name: 'A', unitPrice: 10, quantity: 2, discountRate: 0, lineSubtotal: 20, lineDiscount: 0, lineTotal: 20 },
        ];
        const totals = computeOrderTotals(items);
        expect(totals.subtotal).toBe(20);
        expect(totals.totalDiscount).toBe(0);
        expect(totals.total).toBe(20);
    });

    it('computes totals for single item with discount', () => {
        const items: OrderItem[] = [
            { pizzaId: 'a', name: 'A', unitPrice: 10, quantity: 3, discountRate: 0.1, lineSubtotal: 30, lineDiscount: 3, lineTotal: 27 },
        ];
        const totals = computeOrderTotals(items);
        expect(totals.subtotal).toBe(30);
        expect(totals.totalDiscount).toBe(3);
        expect(totals.total).toBe(27);
    });

    it('computes totals for multiple items', () => {
        const items: OrderItem[] = [
            { pizzaId: 'a', name: 'A', unitPrice: 10, quantity: 3, discountRate: 0.1, lineSubtotal: 30, lineDiscount: 3, lineTotal: 27 },
            { pizzaId: 'b', name: 'B', unitPrice: 8, quantity: 2, discountRate: 0, lineSubtotal: 16, lineDiscount: 0, lineTotal: 16 },
            { pizzaId: 'c', name: 'C', unitPrice: 12, quantity: 4, discountRate: 0.1, lineSubtotal: 48, lineDiscount: 4.8, lineTotal: 43.2 },
        ];
        const totals = computeOrderTotals(items);
        expect(totals.subtotal).toBe(94);
        expect(totals.totalDiscount).toBe(7.8);
        expect(totals.total).toBe(86.2);
    });
});
