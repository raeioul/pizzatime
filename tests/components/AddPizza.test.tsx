import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import AddPizza from '../../src/pages/AddPizza';
import pizzaReducer from '../../src/redux/pizzaSlice';
import { vi } from 'vitest';

const createTestStore = () =>
  configureStore({
    reducer: {
      pizza: pizzaReducer,
    },
  });

describe('AddPizza form', () => {
  it('shows validation errors', async () => {
    render(
      <Provider store={createTestStore()}>
        <AddPizza />
      </Provider>
    );

    fireEvent.click(screen.getByText(/Add to menu/i));

    expect(await screen.findByText(/Name is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/Price is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/Ingredients are required/i)).toBeInTheDocument();
  });

  it('submits valid pizza', async () => {
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => { });

    render(
      <Provider store={createTestStore()}>
        <AddPizza />
      </Provider>
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