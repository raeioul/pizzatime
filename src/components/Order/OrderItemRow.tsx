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
    const {
        pizzaId,
        name,
        unitPrice,
        quantity,
        lineSubtotal,
        lineDiscount,
        lineTotal,
    } = props;

    return (
        <div className="py-4 border-b space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="font-medium text-base break-words">{name}</div>
                <div className="flex flex-wrap gap-4 sm:gap-6 items-center">
                    <div className="text-sm text-slate-600">{money(unitPrice)}</div>
                    <QuantityInput
                        value={quantity}
                        onChange={(n) => updateQuantity(pizzaId, n)}
                    />
                </div>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 text-sm text-slate-700">
                <div className="space-y-0.5">
                    <div>Subtotal: {money(lineSubtotal)}</div>
                    <div>Discount: -{money(lineDiscount)}</div>
                    <div className="font-semibold">Line total: {money(lineTotal)}</div>
                </div>
                <button
                    className="px-3 py-1 bg-red-600 text-white rounded self-start sm:self-auto"
                    onClick={() => removeItem(pizzaId)}
                >
                    Remove
                </button>
            </div>
        </div>
    );
}