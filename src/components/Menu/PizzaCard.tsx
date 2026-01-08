import { Link } from 'react-router-dom';
import type { Pizza } from '../../types';
import QuantityInput from '../Common/QuantityInput';
import { useState } from 'react';
import { useOrderContext } from '../../context/OrderProvider';
import { money } from '../../utils/format';

export default function PizzaCard({ pizza }: { pizza: Pizza }) {
    const [qty, setQty] = useState(1);
    const { addToOrder } = useOrderContext();

    return (
        <div className="border rounded-lg p-4 bg-white shadow-sm flex flex-col gap-2">
            <img
                src={pizza.imageUrl}
                onError={(e) => {
                    e.currentTarget.src =
                        'https://cdn.bolivia.com/gastronomia/2011/08/25/pizza-margarita-3684.jpg'
                }}
                alt={pizza.name}
                className="w-full h-40 object-cover rounded"
            />
            <div className="flex items-center justify-between">
                <Link to={`/pizza/${pizza.id}`} className="font-semibold hover:underline">
                    {pizza.name}
                </Link>
                <span className="text-slate-700">{money(pizza.price)}</span>
            </div>
            <p className="text-sm text-slate-600">{pizza.ingredients.join(', ')}</p>
            <div className="flex items-center gap-2">
                <QuantityInput value={qty} onChange={setQty} />
                <button
                    className="px-3 py-1 rounded bg-slate-900 text-white hover:bg-slate-800"
                    onClick={() => addToOrder(pizza, qty)}
                >
                    Add
                </button>
            </div>
        </div>
    );
}
