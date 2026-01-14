import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import PizzaDetails from '../../src/pages/PizzaDetails';
import pizzaReducer from '../../src/redux/pizzaSlice';
import orderReducer from '../../src/redux/orderSlice';
import type { Pizza } from '../../src/types';

const mockPizzas: Pizza[] = [
    {
        id: 'margherita',
        name: 'Margherita',
        price: 10,
        ingredients: ['cheese', 'tomato', 'basil'],
        category: 'classic',
        imageUrl: 'http://example.com/marg.jpg',
        description: 'Classic Italian pizza',
    },
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

const renderPizzaDetails = (pizzaId: string = 'margherita', pizzas: Pizza[] = mockPizzas) => {
    const store = createTestStore(pizzas);
    return {
        store,
        ...render(
            <Provider store={store}>
                <MemoryRouter initialEntries={[`/pizza/${pizzaId}`]}>
                    <Routes>
                        <Route path="/pizza/:id" element={<PizzaDetails />} />
                    </Routes>
                </MemoryRouter>
            </Provider>
        ),
    };
};

describe('PizzaDetails', () => {
    it('renders pizza name', () => {
        renderPizzaDetails();
        expect(screen.getByRole('heading', { name: 'Margherita' })).toBeInTheDocument();
    });

    it('renders pizza description', () => {
        renderPizzaDetails();
        expect(screen.getByText('Classic Italian pizza')).toBeInTheDocument();
    });

    it('renders pizza ingredients', () => {
        renderPizzaDetails();
        expect(screen.getByText(/Ingredients: cheese, tomato, basil/)).toBeInTheDocument();
    });

    it('renders pizza price formatted', () => {
        renderPizzaDetails();
        expect(screen.getByText('$10.00')).toBeInTheDocument();
    });

    it('renders pizza image', () => {
        renderPizzaDetails();
        const img = screen.getByRole('img', { name: 'Margherita' });
        expect(img).toHaveAttribute('src', 'http://example.com/marg.jpg');
    });

    it('renders Add to order button', () => {
        renderPizzaDetails();
        expect(screen.getByRole('button', { name: /add to order/i })).toBeInTheDocument();
    });

    it('renders quantity input with default value 1', () => {
        renderPizzaDetails();
        const input = screen.getByRole('spinbutton') as HTMLInputElement;
        expect(input.value).toBe('1');
    });

    it('shows not found message for invalid pizza id', () => {
        renderPizzaDetails('nonexistent');
        expect(screen.getByText('Pizza not found.')).toBeInTheDocument();
    });

    it('adds pizza to order when button clicked', () => {
        const { store } = renderPizzaDetails();
        fireEvent.click(screen.getByRole('button', { name: /add to order/i }));
        expect(store.getState().order.items).toHaveLength(1);
        expect(store.getState().order.items[0].pizzaId).toBe('margherita');
    });

    it('adds correct quantity when changed', () => {
        const { store } = renderPizzaDetails();
        const input = screen.getByRole('spinbutton');
        fireEvent.change(input, { target: { value: '4' } });
        fireEvent.click(screen.getByRole('button', { name: /add to order/i }));
        expect(store.getState().order.items[0].quantity).toBe(4);
    });

    it('uses default description when none provided', () => {
        const pizzaNoDesc: Pizza[] = [{ ...mockPizzas[0], description: undefined }];
        renderPizzaDetails('margherita', pizzaNoDesc);
        expect(screen.getByText('Delicious pizza.')).toBeInTheDocument();
    });
});
