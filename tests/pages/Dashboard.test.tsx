import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import Dashboard from '../../src/pages/Dashboard';
import pizzaReducer from '../../src/redux/pizzaSlice';
import orderReducer from '../../src/redux/orderSlice';
import type { Pizza } from '../../src/types';

const mockPizzas: Pizza[] = [
    { id: 'margherita', name: 'Margherita', price: 8, ingredients: ['cheese', 'tomato'], category: 'classic', imageUrl: 'http://example.com/marg.jpg' },
    { id: 'pepperoni', name: 'Pepperoni', price: 10, ingredients: ['cheese', 'pepperoni'], category: 'meat', imageUrl: 'http://example.com/pep.jpg' },
];

const createTestStore = (pizzas: Pizza[] = mockPizzas) =>
    configureStore({
        reducer: {
            pizza: pizzaReducer,
            order: orderReducer,
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
            order: {
                items: [],
            },
        },
    });

const renderDashboard = (pizzas: Pizza[] = mockPizzas) => {
    const store = createTestStore(pizzas);
    return {
        store,
        ...render(
            <Provider store={store}>
                <MemoryRouter>
                    <Dashboard />
                </MemoryRouter>
            </Provider>
        ),
    };
};

describe('Dashboard', () => {
    it('renders MenuFilters component', () => {
        renderDashboard();
        expect(screen.getByPlaceholderText('Search by name')).toBeInTheDocument();
    });

    it('renders pizza cards for each pizza', () => {
        renderDashboard();
        expect(screen.getByText('Margherita')).toBeInTheDocument();
        expect(screen.getByText('Pepperoni')).toBeInTheDocument();
    });

    it('renders OrderSummary component', () => {
        renderDashboard();
        expect(screen.getByRole('heading', { name: /order summary/i })).toBeInTheDocument();
    });

    it('shows empty order message initially', () => {
        renderDashboard();
        expect(screen.getByText('No items yet.')).toBeInTheDocument();
    });

    it('renders correct number of pizza cards', () => {
        renderDashboard();
        const addButtons = screen.getAllByRole('button', { name: /add/i });
        expect(addButtons).toHaveLength(2);
    });

    it('renders with empty pizza list', () => {
        renderDashboard([]);
        expect(screen.queryByRole('button', { name: /add/i })).not.toBeInTheDocument();
    });
});
