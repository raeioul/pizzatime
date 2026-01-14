import pizzaReducer, {
    setPizzas,
    setFilters,
    addPizza,
    selectPizzas,
    selectFilters,
    selectFilteredPizzas,
} from '../../src/redux/pizzaSlice';
import type { Pizza, MenuFilters } from '../../src/types';

const mockPizzas: Pizza[] = [
    { id: 'margherita', name: 'Margherita', price: 8, ingredients: ['cheese', 'tomato'], category: 'classic' },
    { id: 'pepperoni', name: 'Pepperoni', price: 10, ingredients: ['cheese', 'pepperoni'], category: 'meat' },
    { id: 'veggie', name: 'Veggie Supreme', price: 12, ingredients: ['peppers', 'onions', 'mushrooms'], category: 'vegetarian' },
];

describe('pizzaSlice reducer', () => {
    const initialState = {
        pizzas: [],
        filters: {
            search: '',
            ingredient: null,
            category: null,
            maxPrice: null,
            sortBy: 'name' as const,
            sortDir: 'asc' as const,
        },
    };

    it('should handle setPizzas', () => {
        const state = pizzaReducer(initialState, setPizzas(mockPizzas));
        expect(state.pizzas).toHaveLength(3);
        expect(state.pizzas[0].name).toBe('Margherita');
    });

    it('should handle setFilters with partial update', () => {
        const state = pizzaReducer(initialState, setFilters({ search: 'marg' }));
        expect(state.filters.search).toBe('marg');
        expect(state.filters.sortBy).toBe('name'); // unchanged
    });

    it('should handle setFilters with multiple fields', () => {
        const state = pizzaReducer(initialState, setFilters({ category: 'meat', maxPrice: 15 }));
        expect(state.filters.category).toBe('meat');
        expect(state.filters.maxPrice).toBe(15);
    });

    it('should handle addPizza for new pizza', () => {
        const stateWithPizzas = { ...initialState, pizzas: mockPizzas };
        const newPizza: Pizza = { id: 'hawaiian', name: 'Hawaiian', price: 11, ingredients: ['pineapple', 'ham'], category: 'special' };
        const state = pizzaReducer(stateWithPizzas, addPizza(newPizza));
        expect(state.pizzas).toHaveLength(4);
        expect(state.pizzas[3].name).toBe('Hawaiian');
    });

    it('should not add duplicate pizza', () => {
        const stateWithPizzas = { ...initialState, pizzas: mockPizzas };
        const state = pizzaReducer(stateWithPizzas, addPizza(mockPizzas[0]));
        expect(state.pizzas).toHaveLength(3);
    });
});

describe('pizzaSlice selectors', () => {
    const mockState = {
        pizza: {
            pizzas: mockPizzas,
            filters: {
                search: '',
                ingredient: null,
                category: null,
                maxPrice: null,
                sortBy: 'name' as const,
                sortDir: 'asc' as const,
            },
        },
        order: { items: [] },
    };

    it('selectPizzas returns all pizzas', () => {
        expect(selectPizzas(mockState)).toHaveLength(3);
    });

    it('selectFilters returns current filters', () => {
        expect(selectFilters(mockState).sortBy).toBe('name');
    });

    it('selectFilteredPizzas filters by search', () => {
        const stateWithSearch = {
            ...mockState,
            pizza: { ...mockState.pizza, filters: { ...mockState.pizza.filters, search: 'marg' } },
        };
        const filtered = selectFilteredPizzas(stateWithSearch);
        expect(filtered).toHaveLength(1);
        expect(filtered[0].name).toBe('Margherita');
    });

    it('selectFilteredPizzas filters by ingredient', () => {
        const stateWithIngredient = {
            ...mockState,
            pizza: { ...mockState.pizza, filters: { ...mockState.pizza.filters, ingredient: 'cheese' } },
        };
        const filtered = selectFilteredPizzas(stateWithIngredient);
        expect(filtered).toHaveLength(2);
    });

    it('selectFilteredPizzas filters by category', () => {
        const stateWithCategory = {
            ...mockState,
            pizza: { ...mockState.pizza, filters: { ...mockState.pizza.filters, category: 'vegetarian' } },
        };
        const filtered = selectFilteredPizzas(stateWithCategory);
        expect(filtered).toHaveLength(1);
        expect(filtered[0].name).toBe('Veggie Supreme');
    });

    it('selectFilteredPizzas filters by maxPrice', () => {
        const stateWithMaxPrice = {
            ...mockState,
            pizza: { ...mockState.pizza, filters: { ...mockState.pizza.filters, maxPrice: 9 } },
        };
        const filtered = selectFilteredPizzas(stateWithMaxPrice);
        expect(filtered).toHaveLength(1);
        expect(filtered[0].name).toBe('Margherita');
    });

    it('selectFilteredPizzas sorts by name ascending', () => {
        const filtered = selectFilteredPizzas(mockState);
        expect(filtered[0].name).toBe('Margherita');
        expect(filtered[1].name).toBe('Pepperoni');
        expect(filtered[2].name).toBe('Veggie Supreme');
    });

    it('selectFilteredPizzas sorts by name descending', () => {
        const stateDesc = {
            ...mockState,
            pizza: { ...mockState.pizza, filters: { ...mockState.pizza.filters, sortDir: 'desc' as const } },
        };
        const filtered = selectFilteredPizzas(stateDesc);
        expect(filtered[0].name).toBe('Veggie Supreme');
        expect(filtered[2].name).toBe('Margherita');
    });

    it('selectFilteredPizzas sorts by price ascending', () => {
        const stateByPrice = {
            ...mockState,
            pizza: { ...mockState.pizza, filters: { ...mockState.pizza.filters, sortBy: 'price' as const } },
        };
        const filtered = selectFilteredPizzas(stateByPrice);
        expect(filtered[0].price).toBe(8);
        expect(filtered[2].price).toBe(12);
    });

    it('selectFilteredPizzas sorts by price descending', () => {
        const stateByPriceDesc = {
            ...mockState,
            pizza: { ...mockState.pizza, filters: { ...mockState.pizza.filters, sortBy: 'price' as const, sortDir: 'desc' as const } },
        };
        const filtered = selectFilteredPizzas(stateByPriceDesc);
        expect(filtered[0].price).toBe(12);
        expect(filtered[2].price).toBe(8);
    });
});
