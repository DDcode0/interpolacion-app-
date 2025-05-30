// src/components/Chart.jsx
import { Line } from 'react-chartjs-2';
import { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend
);

export default function Chart({ polynomialJs, points }) {
  // Definir rango de x para graficar
  const xs = points.map(p => p.x);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);

  // Generar 100 puntos equiespaciados
  const data = useMemo(() => {
    const xsPlot = Array.from({ length: 100 }, (_, i) =>
      minX + (maxX - minX) * i / 99
    );
    // preparar función
    const f = new Function('x', `return ${polynomialJs};`);
    const ysPlot = xsPlot.map(x => f(x));

    return {
      labels: xsPlot,
      datasets: [
        {
          label: 'Interpolante',
          data: ysPlot,
          fill: false,
          borderWidth: 2,
          borderColor: '#3B82F6'  // Azul Tailwind
        },
        {
          label: 'Puntos dados',
          data: points.map(p => ({ x: p.x, y: p.y })),
          pointBackgroundColor: 'red',
          showLine: false
        }
      ]
    };
  }, [polynomialJs, points, minX, maxX]);

  return (
    <div className="mt-6">
      <Line
        options={{
          scales: {
            x: { type: 'linear', title: { display: true, text: 'x' } },
            y: { title: { display: true, text: 'f(x)' } }
          }
        }}
        data={data}
      />
    </div>
  );
}
