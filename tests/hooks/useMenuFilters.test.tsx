import { renderHook, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { useMenuFilters } from '../../src/hooks/useMenuFilters';
import pizzaReducer from '../../src/redux/pizzaSlice';
import React from 'react';

const createTestStore = () =>
    configureStore({
        reducer: {
            pizza: pizzaReducer,
        },
    });

const wrapper = ({ children }: { children: React.ReactNode }) => (
    <Provider store= { createTestStore() } > { children } </Provider>
);

describe('useMenuFilters', () => {
    it('updates search filter', () => {
        const { result } = renderHook(() => useMenuFilters(), {
            wrapper,
        });

        act(() => result.current.setFilters({ search: 'Margherita' }));
        expect(result.current.filters.search).toBe('Margherita');
    });

    it('sets maxPrice correctly', () => {
        const { result } = renderHook(() => useMenuFilters(), {
            wrapper,
        });

        act(() => result.current.setFilters({ maxPrice: 10 }));
        expect(result.current.filters.maxPrice).toBe(10);
    });
});