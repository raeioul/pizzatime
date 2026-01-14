import { useAppSelector, useAppDispatch } from '../redux/store';
import { selectPizzas, selectFilters, selectFilteredPizzas, setFilters } from '../redux/pizzaSlice';
import type { MenuFilters } from '../types';

export const useMenuFilters = () => {
    const dispatch = useAppDispatch();
    const filters = useAppSelector(selectFilters);
    const filtered = useAppSelector(selectFilteredPizzas);
    const pizzas = useAppSelector(selectPizzas);

    const allIngredients = Array.from(new Set(pizzas.flatMap(p => p.ingredients))).sort();
    const categories = Array.from(new Set(pizzas.map(p => p.category).filter(Boolean))) as string[];

    const updateFilters = (f: Partial<MenuFilters>) => {
        dispatch(setFilters(f));
    };

    return { filters, setFilters: updateFilters, filtered, allIngredients, categories };
};
