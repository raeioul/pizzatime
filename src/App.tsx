import AppLayout from './components/Layout/AppLayout';
import AppRoutes from './routes/AppRoutes';
import { PizzaProvider } from './context/PizzaProvider';
import { OrderProvider } from './context/OrderProvider';

export default function App() {
  return (
    <PizzaProvider>
      <OrderProvider>
        <AppLayout>
          <AppRoutes />
        </AppLayout>
      </OrderProvider>
    </PizzaProvider>
  );
}
