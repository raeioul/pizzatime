import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import NavBar from '../../src/components/Layout/NavBar';

describe('NavBar', () => {
    const renderNavBar = () =>
        render(
            <MemoryRouter>
                <NavBar />
            </MemoryRouter>
        );

    it('renders the app title/logo', () => {
        renderNavBar();
        expect(screen.getByText('PizzaApp')).toBeInTheDocument();
    });

    it('renders Menu link', () => {
        renderNavBar();
        const menuLink = screen.getByRole('link', { name: /menu/i });
        expect(menuLink).toBeInTheDocument();
        expect(menuLink).toHaveAttribute('href', '/');
    });

    it('renders Add Pizza link', () => {
        renderNavBar();
        const addPizzaLink = screen.getByRole('link', { name: /add pizza/i });
        expect(addPizzaLink).toBeInTheDocument();
        expect(addPizzaLink).toHaveAttribute('href', '/add');
    });

    it('logo links to home', () => {
        renderNavBar();
        const logoLink = screen.getByRole('link', { name: /pizzaapp/i });
        expect(logoLink).toHaveAttribute('href', '/');
    });

    it('applies underline to active link', () => {
        render(
            <MemoryRouter initialEntries={['/']}>
                <NavBar />
            </MemoryRouter>
        );
        const menuLink = screen.getByRole('link', { name: /menu/i });
        expect(menuLink).toHaveClass('underline');
    });

    it('does not underline inactive link', () => {
        render(
            <MemoryRouter initialEntries={['/']}>
                <NavBar />
            </MemoryRouter>
        );
        const addPizzaLink = screen.getByRole('link', { name: /add pizza/i });
        expect(addPizzaLink).not.toHaveClass('underline');
    });
});
