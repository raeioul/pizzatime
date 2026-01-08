import { Link, NavLink } from 'react-router-dom';

export default function NavBar() {
    return (
        <nav className="flex items-center justify-between px-4 py-3 bg-slate-900 text-white">
            <Link to="/" className="font-semibold">PizzaApp</Link>
            <div className="flex gap-4">
                <NavLink to="/" className={({ isActive }) => isActive ? 'underline' : ''}>Menu</NavLink>
                <NavLink to="/add" className={({ isActive }) => isActive ? 'underline' : ''}>Add Pizza</NavLink>
            </div>
        </nav>
    );
}
