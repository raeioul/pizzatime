import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import MenuFilters from '../../src/components/Menu/MenuFilters';
import pizzaReducer from '../../src/redux/pizzaSlice';
import type { Pizza } from '../../src/types';

const mockPizzas: Pizza[] = [
    { id: 'margherita', name: 'Margherita', price: 8, ingredients: ['cheese', 'tomato'], category: 'classic' },
    { id: 'pepperoni', name: 'Pepperoni', price: 10, ingredients: ['cheese', 'pepperoni'], category: 'meat' },
    { id: 'veggie', name: 'Veggie', price: 12, ingredients: ['peppers', 'onions'], category: 'vegetarian' },
];

const createTestStore = (pizzas: Pizza[] = mockPizzas) =>
    configureStore({
        reducer: {
            pizza: pizzaReducer,
        },
        preloadedState: {
            pizza: {
                pizzas,
                filters: {
                    search: '',
                    ingredient: null,
                    category: null,
                    maxPrice: null,
                    sortBy: 'name' as const,
                    sortDir: 'asc' as const,
                },
            },
        },
    });

const renderWithProviders = (pizzas: Pizza[] = mockPizzas) => {
    const store = createTestStore(pizzas);
    return {
        store,
        ...render(
            <Provider store={store}>
                <MenuFilters />
            </Provider>
        ),
    };
};

describe('MenuFilters', () => {
    it('renders search input', () => {
        renderWithProviders();
        expect(screen.getByPlaceholderText('Search by name')).toBeInTheDocument();
    });

    it('renders ingredient select', () => {
        renderWithProviders();
        expect(screen.getByText('Ingredient')).toBeInTheDocument();
    });

    it('renders category select with options', () => {
        renderWithProviders();
        expect(screen.getByText('Category')).toBeInTheDocument();
        expect(screen.getByText('classic')).toBeInTheDocument();
        expect(screen.getByText('meat')).toBeInTheDocument();
        expect(screen.getByText('vegetarian')).toBeInTheDocument();
    });

    it('renders sort by select', () => {
        renderWithProviders();
        expect(screen.getByText('Sort by name')).toBeInTheDocument();
        expect(screen.getByText('Sort by price')).toBeInTheDocument();
    });

    it('renders sort direction select', () => {
        renderWithProviders();
        expect(screen.getByText('Asc')).toBeInTheDocument();
        expect(screen.getByText('Desc')).toBeInTheDocument();
    });

    it('updates search filter in store', () => {
        const { store } = renderWithProviders();
        const searchInput = screen.getByPlaceholderText('Search by name');
        fireEvent.change(searchInput, { target: { value: 'marg' } });
        expect(store.getState().pizza.filters.search).toBe('marg');
    });

    it('renders max price input', () => {
        renderWithProviders();
        expect(screen.getByPlaceholderText('Max price')).toBeInTheDocument();
    });

    it('updates maxPrice filter in store', () => {
        const { store } = renderWithProviders();
        const maxPriceInput = screen.getByPlaceholderText('Max price');
        fireEvent.change(maxPriceInput, { target: { value: '10' } });
        expect(store.getState().pizza.filters.maxPrice).toBe(10);
    });

    it('populates ingredient options from pizzas', () => {
        renderWithProviders();
        // All unique ingredients should be present
        expect(screen.getByText('cheese')).toBeInTheDocument();
        expect(screen.getByText('tomato')).toBeInTheDocument();
        expect(screen.getByText('pepperoni')).toBeInTheDocument();
        expect(screen.getByText('peppers')).toBeInTheDocument();
        expect(screen.getByText('onions')).toBeInTheDocument();
    });
});
