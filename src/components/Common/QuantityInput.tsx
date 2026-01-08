type Props = {
    value: number;
    onChange: (n: number) => void;
    min?: number;
    max?: number;
};
export default function QuantityInput({ value, onChange, min = 1, max = 99 }: Props) {
    return (
        <input
            type="number"
            min={min}
            max={max}
            value={value}
            onChange={e => onChange(Math.max(min, Math.min(max, Number(e.target.value))))}
            className="w-20 border rounded px-2 py-1"
        />
    );
}
