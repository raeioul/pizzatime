import { usePizzaContext } from '../context/PizzaProvider';

export const useMenuFilters = () => {
    const { filters, setFilters, filtered, pizzas } = usePizzaContext();
    const allIngredients = Array.from(new Set(pizzas.flatMap(p => p.ingredients))).sort();
    const categories = Array.from(new Set(pizzas.map(p => p.category).filter(Boolean))) as string[];
    return { filters, setFilters, filtered, allIngredients, categories };
};
