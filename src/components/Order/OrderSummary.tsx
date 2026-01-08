import { useOrderContext } from '../../context/OrderProvider';
import OrderItemRow from './OrderItemRow';
import { money } from '../../utils/format';

export default function OrderSummary() {
    const { items, totals, confirmOrder } = useOrderContext();

    const handleConfirm = () => {
        const order = confirmOrder();
        if (order) {
            alert(`Order confirmed! Total: ${money(order.total)}\nOrder ID: ${order.id}`);
        } else {
            alert('Your order is empty.');
        }
    };

    return (
        <div className="bg-white border rounded p-4">
            <h2 className="text-lg font-semibold mb-2">Order Summary</h2>
            {items.length === 0 ? (
                <p className="text-slate-600">No items yet.</p>
            ) : (
                <>
                    {items.map(i => (
                        <OrderItemRow key={i.pizzaId} {...i} />
                    ))}
                    <div className="mt-3 text-right">
                        <div>Subtotal: {money(totals.subtotal)}</div>
                        <div>Discount: -{money(totals.totalDiscount)}</div>
                        <div className="text-xl font-bold">Total: {money(totals.total)}</div>
                    </div>
                    <div className="mt-3 flex justify-end">
                        <button
                            className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
                            onClick={handleConfirm}
                        >
                            Confirm Order
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
