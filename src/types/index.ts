export type Pizza = {
    id: string;
    name: string;
    price: number;
    ingredients: string[];
    imageUrl?: string;
    category?: 'vegetarian' | 'classic' | 'meat' | 'special' | string;
    description?: string;
};

export type OrderItem = {
    pizzaId: string;
    name: string;
    unitPrice: number;
    quantity: number;
    discountRate: number; // e.g., 0.1 for 10%
    lineSubtotal: number; // unitPrice * quantity
    lineDiscount: number; // lineSubtotal * discountRate
    lineTotal: number; // lineSubtotal - lineDiscount
};

export type Order = {
    id: string;
    items: OrderItem[];
    subtotal: number;
    totalDiscount: number;
    total: number;
    createdAt: string;
};

export type MenuFilters = {
    search: string;
    ingredient: string | null;
    category: string | null;
    maxPrice: number | null;
    sortBy: 'name' | 'price';
    sortDir: 'asc' | 'desc';
};
