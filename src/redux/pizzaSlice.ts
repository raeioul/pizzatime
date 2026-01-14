import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { createSelector } from '@reduxjs/toolkit';
import type { Pizza, MenuFilters } from '../types';
import pizzasData from '../data/pizzas.json';
import type { RootState } from './store';

const defaultFilters: MenuFilters = {
    search: '',
    ingredient: null,
    category: null,
    maxPrice: null,
    sortBy: 'name',
    sortDir: 'asc',
};

type PizzaState = {
    pizzas: Pizza[];
    filters: MenuFilters;
};

const initialState: PizzaState = {
    pizzas: pizzasData as Pizza[],
    filters: defaultFilters,
};

const pizzaSlice = createSlice({
    name: 'pizza',
    initialState,
    reducers: {
        setPizzas(state, action: PayloadAction<Pizza[]>) {
            state.pizzas = action.payload;
        },
        setFilters(state, action: PayloadAction<Partial<MenuFilters>>) {
            state.filters = { ...state.filters, ...action.payload };
        },
        addPizza(state, action: PayloadAction<Pizza>) {
            if (!state.pizzas.some(p => p.id === action.payload.id)) {
                state.pizzas.push(action.payload);
            }
        },
    },
});

export const { setPizzas, setFilters, addPizza } = pizzaSlice.actions;
export default pizzaSlice.reducer;

// Selectors
export const selectPizzas = (state: RootState) => state.pizza.pizzas;
export const selectFilters = (state: RootState) => state.pizza.filters;

export const selectFilteredPizzas = createSelector(
    [selectPizzas, selectFilters],
    (pizzas, filters) => {
        let list = [...pizzas];

        // search
        if (filters.search) {
            const q = filters.search.toLowerCase();
            list = list.filter(p => p.name.toLowerCase().includes(q));
        }
        // ingredient
        if (filters.ingredient) {
            list = list.filter(p => p.ingredients.includes(filters.ingredient!));
        }
        // category
        if (filters.category) {
            list = list.filter(p => p.category === filters.category);
        }
        // max price
        if (filters.maxPrice != null) {
            list = list.filter(p => p.price <= filters.maxPrice!);
        }
        // sort
        list.sort((a, b) => {
            const dir = filters.sortDir === 'asc' ? 1 : -1;
            if (filters.sortBy === 'name') return a.name.localeCompare(b.name) * dir;
            return (a.price - b.price) * dir;
        });

        return list;
    }
);
