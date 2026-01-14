import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import PizzaCard from '../../src/components/Menu/PizzaCard';
import pizzaReducer from '../../src/redux/pizzaSlice';
import orderReducer from '../../src/redux/orderSlice';
import type { Pizza } from '../../src/types';

const mockPizza: Pizza = {
    id: 'margherita',
    name: 'Margherita',
    price: 10,
    ingredients: ['cheese', 'tomato', 'basil'],
    imageUrl: 'http://example.com/pizza.jpg',
    category: 'classic',
};

const createTestStore = () =>
    configureStore({
        reducer: {
            pizza: pizzaReducer,
            order: orderReducer,
        },
    });

const renderWithProviders = (pizza: Pizza = mockPizza) => {
    const store = createTestStore();
    return {
        store,
        ...render(
            <Provider store={store}>
                <MemoryRouter>
                    <PizzaCard pizza={pizza} />
                </MemoryRouter>
            </Provider>
        ),
    };
};

describe('PizzaCard', () => {
    it('renders pizza name', () => {
        renderWithProviders();
        expect(screen.getByText('Margherita')).toBeInTheDocument();
    });

    it('renders pizza price formatted', () => {
        renderWithProviders();
        expect(screen.getByText('$10.00')).toBeInTheDocument();
    });

    it('renders ingredients', () => {
        renderWithProviders();
        expect(screen.getByText('cheese, tomato, basil')).toBeInTheDocument();
    });

    it('renders Add button', () => {
        renderWithProviders();
        expect(screen.getByRole('button', { name: /add/i })).toBeInTheDocument();
    });

    it('renders quantity input with default value 1', () => {
        renderWithProviders();
        const input = screen.getByRole('spinbutton') as HTMLInputElement;
        expect(input.value).toBe('1');
    });

    it('links to pizza details page', () => {
        renderWithProviders();
        const link = screen.getByRole('link', { name: 'Margherita' });
        expect(link).toHaveAttribute('href', '/pizza/margherita');
    });

    it('adds pizza to order when Add button clicked', () => {
        const { store } = renderWithProviders();
        fireEvent.click(screen.getByRole('button', { name: /add/i }));
        const state = store.getState();
        expect(state.order.items).toHaveLength(1);
        expect(state.order.items[0].pizzaId).toBe('margherita');
        expect(state.order.items[0].quantity).toBe(1);
    });

    it('adds correct quantity when changed', () => {
        const { store } = renderWithProviders();
        const input = screen.getByRole('spinbutton');
        fireEvent.change(input, { target: { value: '3' } });
        fireEvent.click(screen.getByRole('button', { name: /add/i }));
        const state = store.getState();
        expect(state.order.items[0].quantity).toBe(3);
    });

    it('renders pizza image', () => {
        renderWithProviders();
        const img = screen.getByRole('img', { name: 'Margherita' });
        expect(img).toHaveAttribute('src', 'http://example.com/pizza.jpg');
    });
});
