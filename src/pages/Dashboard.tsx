import { usePizzaContext } from '../context/PizzaProvider';
import MenuFilters from '../components/Menu/MenuFilters';
import PizzaCard from '../components/Menu/PizzaCard';
import OrderSummary from '../components/Order/OrderSummary';
import PriceChart from '../components/Menu/PriceChart';

export default function Dashboard() {
    const { filtered } = usePizzaContext();

    return (
        <div className="flex flex-col gap-6 p-4 max-w-4xl mx-auto">
            {/* Main content */}
            <div className="flex flex-col gap-4">
                <MenuFilters />
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filtered.map(p => (
                        <PizzaCard key={p.id} pizza={p} />
                    ))}
                </div>

            </div>
            <OrderSummary />
            <PriceChart />
        </div>
    );
}