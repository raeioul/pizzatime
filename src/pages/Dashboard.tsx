import { usePizzaContext } from '../context/PizzaProvider';
import MenuFilters from '../components/Menu/MenuFilters';
import PizzaCard from '../components/Menu/PizzaCard';
import OrderSummary from '../components/Order/OrderSummary';
import PriceChart from '../components/Menu/PriceChart';
export default function Dashboard() {
    const { filtered } = usePizzaContext();
    return (
        <div className="grid lg:grid-cols-3 gap-4" >
            <div className="lg:col-span-2 flex flex-col gap-4" >
                <MenuFilters />
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filtered.map(p => <PizzaCard key={p.id} pizza={p} />)}
                </div>
                <PriceChart />
            </div>
            <OrderSummary />
        </div>
    );
}