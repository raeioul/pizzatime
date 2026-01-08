import { useState } from 'react';
import { usePizzaContext } from '../context/PizzaProvider';
import type { Pizza } from '../types';

type FormState = {
    name: string;
    price: string;
    ingredients: string;
    category: string;
    imageUrl: string;
    description: string;
};

const initial: FormState = {
    name: '',
    price: '',
    ingredients: '',
    category: '',
    imageUrl: '',
    description: '',
};

export default function AddPizza() {
    const { addPizza } = usePizzaContext();
    const [form, setForm] = useState<FormState>(initial);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validate = () => {
        const e: Record<string, string> = {};
        if (!form.name.trim()) e.name = 'Name is required';
        const price = Number(form.price);
        if (!form.price || isNaN(price) || price <= 0) e.price = 'Price must be a positive number';
        const ing = form.ingredients.split(',').map(s => s.trim()).filter(Boolean);
        if (ing.length === 0) e.ingredients = 'At least one ingredient';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const submit = (ev: React.FormEvent) => {
        ev.preventDefault();
        if (!validate()) return;
        const price = Number(form.price);
        const ingredients = form.ingredients.split(',').map(s => s.trim()).filter(Boolean);
        const pizza: Pizza = {
            id: form.name.toLowerCase().replace(/\s+/g, '-'),
            name: form.name.trim(),
            price,
            ingredients,
            category: form.category || 'special',
            imageUrl: form.imageUrl || undefined,
            description: form.description || undefined,
        };
        addPizza(pizza);
        alert('Pizza added to menu!');
        setForm(initial);
    };

    const set = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setForm(prev => ({ ...prev, [k]: e.target.value }));

    return (
        <form onSubmit={submit} className="bg-white border rounded p-4 grid gap-3 max-w-xl">
            <h2 className="text-lg font-semibold">Add Pizza</h2>

            <label className="grid gap-1">
                <span>Name *</span>
                <input value={form.name} onChange={set('name')} className="border rounded px-2 py-1" />
                {errors.name && <span className="text-red-600 text-sm">{errors.name}</span>}
            </label>

            <label className="grid gap-1">
                <span>Price *</span>
                <input value={form.price} onChange={set('price')} className="border rounded px-2 py-1" />
                {errors.price && <span className="text-red-600 text-sm">{errors.price}</span>}
            </label>

            <label className="grid gap-1">
                <span>Ingredients (comma-separated) *</span>
                <input value={form.ingredients} onChange={set('ingredients')} className="border rounded px-2 py-1" />
                {errors.ingredients && <span className="text-red-600 text-sm">{errors.ingredients}</span>}
            </label>

            <label className="grid gap-1">
                <span>Category</span>
                <input value={form.category} onChange={set('category')} className="border rounded px-2 py-1" />
            </label>

            <label className="grid gap-1">
                <span>Image URL</span>
                <input value={form.imageUrl} onChange={set('imageUrl')} className="border rounded px-2 py-1" />
            </label>

            <label className="grid gap-1">
                <span>Description</span>
                <textarea value={form.description} onChange={set('description')} className="border rounded px-2 py-1" />
            </label>

            <button className="px-4 py-2 bg-slate-900 text-white rounded hover:bg-slate-800">Add to menu</button>
        </form>
    );
}
