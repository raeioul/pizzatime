import { Route, Routes } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import PizzaDetails from '../pages/PizzaDetails';
import AddPizza from '../pages/AddPizza';

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/pizza/:id" element={<PizzaDetails />} />
            <Route path="/add" element={<AddPizza />} />
        </Routes>
    );
}
