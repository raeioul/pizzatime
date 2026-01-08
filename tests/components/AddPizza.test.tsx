import { render, screen, fireEvent } from '@testing-library/react';
import AddPizza from '../../src/pages/AddPizza';
import { PizzaProvider } from '../../src/context/PizzaProvider';
import { vi } from 'vitest';

describe('AddPizza form', () => {
  it('shows validation errors', async () => {
    render(
      <PizzaProvider>
        <AddPizza />
      </PizzaProvider>
    );

    fireEvent.click(screen.getByText(/Add to menu/i));

    expect(await screen.findByText(/Name is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/Price is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/Ingredients are required/i)).toBeInTheDocument();
  });

  it('submits valid pizza', async () => {
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => { });

    render(
      <PizzaProvider>
        <AddPizza />
      </PizzaProvider>
    );

    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'Margherita' } });
    fireEvent.change(screen.getByLabelText(/Price/i), { target: { value: '7.5' } });
    fireEvent.change(screen.getByLabelText(/Ingredients/i), { target: { value: 'cheese,tomato' } });
    fireEvent.change(screen.getByLabelText(/Category/i), { target: { value: 'classic' } });
    fireEvent.change(screen.getByLabelText(/Image URL/i), { target: { value: 'http://example.com/pizza.jpg' } });
    fireEvent.change(screen.getByLabelText(/Description/i), { target: { value: 'Delicious pizza' } });

    fireEvent.click(screen.getByText(/Add to menu/i));
  });
});