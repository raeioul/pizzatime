import { money } from '../../utils/format';
import QuantityInput from '../Common/QuantityInput';
import { useOrderContext } from '../../context/OrderProvider';

type Props = {
    pizzaId: string;
    name: string;
    unitPrice: number;
    quantity: number;
    lineSubtotal: number;
    lineDiscount: number;
    lineTotal: number;
};

export default function OrderItemRow(props: Props) {
    const { updateQuantity, removeItem } = useOrderContext();
    const { pizzaId, name, unitPrice, quantity, lineSubtotal, lineDiscount, lineTotal } = props;

    return (
        <div className="grid grid-cols-6 gap-2 items-center py-2 border-b">
            <div className="col-span-2">{name}</div>
            <div>{money(unitPrice)}</div>
            <div>
                <QuantityInput value={quantity} onChange={n => updateQuantity(pizzaId, n)} />
            </div>
            <div className="text-slate-700">
                <div>Subtotal: {money(lineSubtotal)}</div>
                <div>Discount: -{money(lineDiscount)}</div>
                <div className="font-semibold">Line total: {money(lineTotal)}</div>
            </div>
            <button
                className="px-2 py-1 bg-red-600 text-white rounded"
                onClick={() => removeItem(pizzaId)}
            >
                Remove
            </button>
        </div>
    );
}
