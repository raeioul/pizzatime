import { renderHook, act } from '@testing-library/react';
import { useMenuFilters } from '../../src/hooks/useMenuFilters';
import { PizzaProvider } from '../../src/context/PizzaProvider';

describe('useMenuFilters', () => {
    it('updates search filter', () => {
        const { result } = renderHook(() => useMenuFilters(), {
            wrapper: PizzaProvider,
        });

        act(() => result.current.setFilters({ search: 'Margherita' }));
        expect(result.current.filters.search).toBe('Margherita');
    });

    it('sets maxPrice correctly', () => {
        const { result } = renderHook(() => useMenuFilters(), {
            wrapper: PizzaProvider,
        });

        act(() => result.current.setFilters({ maxPrice: 10 }));
        expect(result.current.filters.maxPrice).toBe(10);
    });
});