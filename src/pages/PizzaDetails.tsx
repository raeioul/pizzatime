import { useParams } from 'react-router-dom';
import { usePizzaContext } from '../context/PizzaProvider';
import { useOrderContext } from '../context/OrderProvider';
import QuantityInput from '../components/Common/QuantityInput';
import { useState } from 'react';
import { money } from '../utils/format';

export default function PizzaDetails() {
    const { id } = useParams<{ id: string }>();
    const { pizzas } = usePizzaContext();
    const pizza = pizzas.find(p => p.id === id);
    const { addToOrder } = useOrderContext();
    const [qty, setQty] = useState(1);

    if (!pizza) return <p>Pizza not found.</p>;

    return (
        <div className="bg-white border rounded p-4 grid md:grid-cols-2 gap-4">
            <img
                src={pizza.imageUrl || 'https://via.placeholder.com/500x300?text=Pizza'}
                alt={pizza.name}
                className="w-full h-64 object-cover rounded"
            />
            <div>
                <h1 className="text-2xl font-semibold">{pizza.name}</h1>
                <p className="text-slate-700 mt-1">{pizza.description || 'Delicious pizza.'}</p>
                <p className="mt-2">Ingredients: {pizza.ingredients.join(', ')}</p>
                <p className="mt-2 font-semibold">{money(pizza.price)}</p>
                <div className="mt-3 flex items-center gap-2">
                    <QuantityInput value={qty} onChange={setQty} />
                    <button
                        className="px-3 py-1 rounded bg-slate-900 text-white hover:bg-slate-800"
                        onClick={() => addToOrder(pizza, qty)}
                    >
                        Add to order
                    </button>
                </div>
            </div>
        </div>
    );
}
