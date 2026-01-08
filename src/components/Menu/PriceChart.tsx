import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { usePizzaContext } from '../../context/PizzaProvider';

export default function PriceChart() {
    const { filtered } = usePizzaContext();
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const chartRef = useRef<Chart | null>(null);

    useEffect(() => {
        if (!canvasRef.current) return;
        chartRef.current?.destroy();
        chartRef.current = new Chart(canvasRef.current, {
            type: 'bar',
            data: {
                labels: filtered.map(p => p.name),
                datasets: [
                    {
                        label: 'Price',
                        data: filtered.map(p => p.price),
                        backgroundColor: 'rgba(30, 41, 59, 0.6)',
                    },
                ],
            },
            options: { responsive: true, maintainAspectRatio: false },
        });
        return () => chartRef.current?.destroy();
    }, [filtered]);

    return (
        <div className="h-64 bg-white border rounded p-3">
            <canvas ref={canvasRef} />
        </div>
    );
}
