import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Filler,
  Tooltip,
} from 'chart.js';

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Filler, Tooltip);

const formatCurrencyShort = (v) => {
  if (v >= 1000) return `$${(v / 1000).toFixed(0)}k`;
  return `$${v}`;
};

const formatCurrencyFull = (v) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v);

export default function BalanceSparkline({ history }) {
  if (!history?.length) return null;

  const data = {
    labels: history.map((h) => h.month),
    datasets: [
      {
        data: history.map((h) => h.balance),
        borderColor: 'rgba(255,255,255,0.85)',
        backgroundColor: 'rgba(255,255,255,0.12)',
        fill: true,
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 4,
        pointHoverBackgroundColor: '#fff',
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => formatCurrencyFull(ctx.parsed.y),
        },
        backgroundColor: 'rgba(0,0,0,0.75)',
        titleColor: '#fff',
        bodyColor: '#fff',
        padding: 8,
        displayColors: false,
      },
    },
    scales: {
      x: {
        display: true,
        ticks: {
          color: 'rgba(255,255,255,0.6)',
          font: { size: 9 },
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: 6,
        },
        grid: { display: false },
        border: { display: false },
      },
      y: {
        display: true,
        position: 'left',
        ticks: {
          color: 'rgba(255,255,255,0.6)',
          font: { size: 9 },
          maxTicksLimit: 4,
          callback: (v) => formatCurrencyShort(v),
        },
        grid: {
          color: 'rgba(255,255,255,0.08)',
        },
        border: { display: false },
      },
    },
    interaction: { mode: 'index', intersect: false },
  };

  return (
    <div style={{ height: 100, marginTop: 16 }}>
      <Line data={data} options={options} />
    </div>
  );
}
