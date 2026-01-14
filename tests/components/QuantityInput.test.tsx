import { render, screen, fireEvent } from '@testing-library/react';
import QuantityInput from '../../src/components/Common/QuantityInput';
import { vi } from 'vitest';

describe('QuantityInput', () => {
    it('renders with the given value', () => {
        render(<QuantityInput value={5} onChange={() => { }} />);
        const input = screen.getByRole('spinbutton') as HTMLInputElement;
        expect(input.value).toBe('5');
    });

    it('calls onChange when value changes', () => {
        const handleChange = vi.fn();
        render(<QuantityInput value={1} onChange={handleChange} />);
        const input = screen.getByRole('spinbutton');
        fireEvent.change(input, { target: { value: '3' } });
        expect(handleChange).toHaveBeenCalledWith(3);
    });

    it('respects min value', () => {
        const handleChange = vi.fn();
        render(<QuantityInput value={5} onChange={handleChange} min={1} />);
        const input = screen.getByRole('spinbutton');
        fireEvent.change(input, { target: { value: '0' } });
        expect(handleChange).toHaveBeenCalledWith(1);
    });

    it('respects max value', () => {
        const handleChange = vi.fn();
        render(<QuantityInput value={5} onChange={handleChange} max={10} />);
        const input = screen.getByRole('spinbutton');
        fireEvent.change(input, { target: { value: '15' } });
        expect(handleChange).toHaveBeenCalledWith(10);
    });

    it('uses default min=1 and max=99', () => {
        render(<QuantityInput value={50} onChange={() => { }} />);
        const input = screen.getByRole('spinbutton') as HTMLInputElement;
        expect(input.min).toBe('1');
        expect(input.max).toBe('99');
    });

    it('clamps value to valid range', () => {
        const handleChange = vi.fn();
        render(<QuantityInput value={5} onChange={handleChange} min={2} max={8} />);
        const input = screen.getByRole('spinbutton');

        // Below min
        fireEvent.change(input, { target: { value: '1' } });
        expect(handleChange).toHaveBeenCalledWith(2);

        // Above max
        fireEvent.change(input, { target: { value: '10' } });
        expect(handleChange).toHaveBeenCalledWith(8);
    });
});
