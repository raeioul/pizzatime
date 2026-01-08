import type { OrderItem } from '../types';

// Rule: 10% off if quantity >= 3 for the same pizza
export const applyLineDiscount = (line: OrderItem): OrderItem => {
    const lineSubtotal = line.unitPrice * line.quantity;
    const discountRate = line.quantity >= 3 ? 0.1 : 0;
    const lineDiscount = +(lineSubtotal * discountRate).toFixed(2);
    const lineTotal = +(lineSubtotal - lineDiscount).toFixed(2);
    return { ...line, discountRate, lineSubtotal, lineDiscount, lineTotal };
};

export const computeOrderTotals = (items: OrderItem[]) => {
    const subtotal = +items.reduce((s, i) => s + i.lineSubtotal, 0).toFixed(2);
    const totalDiscount = +items.reduce((s, i) => s + i.lineDiscount, 0).toFixed(2);
    const total = +(subtotal - totalDiscount).toFixed(2);
    return { subtotal, totalDiscount, total };
};
