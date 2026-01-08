import { money } from '../../src/utils/format';

describe('money()', () => {
    it('formats positive numbers', () => {
        expect(money(5)).toBe('$5.00');
    });

    it('formats decimals correctly', () => {
        expect(money(7.5)).toBe('$7.50');
    });

    it('handles zero', () => {
        expect(money(0)).toBe('$0.00');
    });
});