import { useMenuFilters } from '../../hooks/useMenuFilters';

export default function MenuFilters() {
    const { filters, setFilters, allIngredients, categories } = useMenuFilters();

    return (
        <div className="grid md:grid-cols-5 gap-3 bg-white p-3 border rounded">
            <input
                placeholder="Search by name"
                value={filters.search}
                onChange={e => setFilters({ search: e.target.value })}
                className="border rounded px-2 py-1 md:col-span-2"
            />
            <select
                value={filters.ingredient ?? ''}
                onChange={e => setFilters({ ingredient: e.target.value || null })}
                className="border rounded px-2 py-1"
            >
                <option value="">Ingredient</option>
                {allIngredients.map(i => <option key={i} value={i}>{i}</option>)}
            </select>
            <select
                value={filters.category ?? ''}
                onChange={e => setFilters({ category: e.target.value || null })}
                className="border rounded px-2 py-1"
            >
                <option value="">Category</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <input
                type="number"
                placeholder="Max price"
                value={filters.maxPrice ?? ''}
                onChange={e => setFilters({ maxPrice: e.target.value ? Number(e.target.value) : null })}
                className="border rounded px-2 py-1"
            />
            <div className="flex gap-2 md:col-span-2">
                <select
                    value={filters.sortBy}
                    onChange={e => setFilters({ sortBy: e.target.value as 'name' | 'price' })}
                    className="border rounded px-2 py-1"
                >
                    <option value="name">Sort by name</option>
                    <option value="price">Sort by price</option>
                </select>
                <select
                    value={filters.sortDir}
                    onChange={e => setFilters({ sortDir: e.target.value as 'asc' | 'desc' })}
                    className="border rounded px-2 py-1"
                >
                    <option value="asc">Asc</option>
                    <option value="desc">Desc</option>
                </select>
            </div>
        </div>
    );
}
