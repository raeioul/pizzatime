import { useForm } from 'react-hook-form';
import { usePizzaContext } from '../context/PizzaProvider';
import type { Pizza } from '../types';
import { useState } from 'react';

type FormState = {
    name: string;
    price: string;
    ingredients: string;
    category: string;
    imageUrl: string;
    description: string;
};

export default function AddPizza() {
    const { addPizza } = usePizzaContext();
    const [success, setSuccess] = useState('');

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormState>({
        mode: 'onSubmit',
        defaultValues: {
            name: '',
            price: '',
            ingredients: '',
            category: '',
            imageUrl: '',
            description: '',
        },
    });

    const onSubmit = (data: FormState) => {
        const price = Number(data.price);
        const ingredients = data.ingredients
            .split(',')
            .map(s => s.trim())
            .filter(Boolean);

        const pizza: Pizza = {
            id: data.name.toLowerCase().replace(/\s+/g, '-'),
            name: data.name.trim(),
            price,
            ingredients,
            category: data.category || 'special',
            imageUrl: data.imageUrl || undefined,
            description: data.description || undefined,
        };

        addPizza(pizza);
        setSuccess('Pizza added to menu!');
        reset();
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white border rounded p-4 grid gap-3 max-w-xl"
        >
            <h2 className="text-lg font-semibold">Add Pizza</h2>

            <label className="grid gap-1">
                <span>Name *</span>
                <input
                    {...register('name', { required: 'Name is required' })}
                    className="border rounded px-2 py-1"
                />
                {errors.name && <span className="text-red-600 text-sm">{errors.name.message}</span>}
            </label>

            <label className="grid gap-1">
                <span>Price *</span>
                <input
                    {...register('price', {
                        required: 'Price is required',
                        validate: value =>
                            !isNaN(Number(value)) && Number(value) > 0
                                ? true
                                : 'Price must be a positive number',
                    })}
                    className="border rounded px-2 py-1"
                />
                {errors.price && <span className="text-red-600 text-sm">{errors.price.message}</span>}
            </label>

            <label className="grid gap-1">
                <span>Ingredients (comma-separated) *</span>
                <input
                    {...register('ingredients', {
                        required: 'Ingredients are required',
                        validate: value =>
                            value.split(',').map(s => s.trim()).filter(Boolean).length > 0
                                ? true
                                : 'At least one ingredient required',
                    })}
                    className="border rounded px-2 py-1"
                />
                {errors.ingredients && (
                    <span className="text-red-600 text-sm">{errors.ingredients.message}</span>
                )}
            </label>

            <label className="grid gap-1">
                <span>Category *</span>
                <input
                    {...register('category', { required: 'Category is required' })}
                    className="border rounded px-2 py-1"
                />
                {errors.category && <span className="text-red-600 text-sm">{errors.category.message}</span>}
            </label>

            <label className="grid gap-1">
                <span>Image URL *</span>
                <input
                    {...register('imageUrl', { required: 'Image URL is required' })}
                    className="border rounded px-2 py-1"
                />
                {errors.imageUrl && <span className="text-red-600 text-sm">{errors.imageUrl.message}</span>}
            </label>

            <label className="grid gap-1">
                <span>Description *</span>
                <textarea
                    {...register('description', { required: 'Description is required' })}
                    className="border rounded px-2 py-1"
                />
                {errors.description && (
                    <span className="text-red-600 text-sm">{errors.description.message}</span>
                )}
            </label>

            <button className="px-4 py-2 bg-slate-900 text-white rounded hover:bg-slate-800">
                Add to menu
            </button>

            {success && <div className="text-green-600 font-medium">{success}</div>}
        </form>
    );
}