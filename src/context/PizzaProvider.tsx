import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { Pizza, MenuFilters } from '../types';
import pizzasData from '../../public/data/pizzas.json';

type PizzaContextValue = {
    pizzas: Pizza[];
    filtered: Pizza[];
    filters: MenuFilters;
    setFilters: (f: Partial<MenuFilters>) => void;
    addPizza: (p: Pizza) => void;
};

const defaultFilters: MenuFilters = {
    search: '',
    ingredient: null,
    category: null,
    maxPrice: null,
    sortBy: 'name',
    sortDir: 'asc',
};

const PizzaContext = createContext<PizzaContextValue | null>(null);

export const PizzaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [pizzas, setPizzas] = useState<Pizza[]>([]);
    const [filters, setFiltersState] = useState<MenuFilters>(defaultFilters);

    useEffect(() => {
        setPizzas(pizzasData as Pizza[]);
    }, []);

    const setFilters = (f: Partial<MenuFilters>) =>
        setFiltersState(prev => ({ ...prev, ...f }));

    const filtered = useMemo(() => {
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
    }, [pizzas, filters]);

    const addPizza = (p: Pizza) => {
        setPizzas(prev => {
            if (prev.some(x => x.id === p.id)) return prev;
            return [...prev, p];
        });
    };

    return (
        <PizzaContext.Provider value={{ pizzas, filtered, filters, setFilters, addPizza }}>
            {children}
        </PizzaContext.Provider>
    );
};

export const usePizzaContext = () => {
    const ctx = useContext(PizzaContext);
    if (!ctx) throw new Error('usePizzaContext must be used within PizzaProvider');
    return ctx;
};
