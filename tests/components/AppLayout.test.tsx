import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AppLayout from '../../src/components/Layout/AppLayout';

// Mock NavBar to simplify testing
vi.mock('../../src/components/Layout/NavBar', () => ({
    default: () => <nav data-testid="navbar">NavBar</nav>,
}));

import { vi } from 'vitest';

describe('AppLayout', () => {
    it('renders NavBar', () => {
        render(
            <MemoryRouter>
                <AppLayout>
                    <div>Content</div>
                </AppLayout>
            </MemoryRouter>
        );
        expect(screen.getByTestId('navbar')).toBeInTheDocument();
    });

    it('renders children', () => {
        render(
            <MemoryRouter>
                <AppLayout>
                    <div data-testid="child-content">Child Content</div>
                </AppLayout>
            </MemoryRouter>
        );
        expect(screen.getByTestId('child-content')).toBeInTheDocument();
        expect(screen.getByText('Child Content')).toBeInTheDocument();
    });

    it('wraps content in main element', () => {
        render(
            <MemoryRouter>
                <AppLayout>
                    <div>Content</div>
                </AppLayout>
            </MemoryRouter>
        );
        const main = screen.getByRole('main');
        expect(main).toBeInTheDocument();
        expect(main).toHaveTextContent('Content');
    });
});
