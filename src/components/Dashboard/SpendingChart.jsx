import { Card, CardContent, Typography } from '@mui/material';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import transactions from '../../data/transactions.json';

ChartJS.register(ArcElement, Tooltip, Legend);

const spending = {};
transactions
  .filter((t) => t.amount < 0 && !t.anomaly && t.category !== 'Income' && t.category !== 'Transfer')
  .forEach((t) => {
    spending[t.category] = (spending[t.category] || 0) + Math.abs(t.amount);
  });

const sortedEntries = Object.entries(spending).sort((a, b) => b[1] - a[1]);
const labels = sortedEntries.map(([cat]) => cat);
const values = sortedEntries.map(([, amt]) => Math.round(amt * 100) / 100);

const colors = [
  '#0A2540', '#00897B', '#5E35B1', '#E65100', '#1565C0',
  '#2E7D32', '#C62828', '#F9A825', '#4527A0', '#00838F',
];

const data = {
  labels,
  datasets: [
    {
      data: values,
      backgroundColor: colors.slice(0, labels.length),
      borderWidth: 2,
      borderColor: '#fff',
    },
  ],
};

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'right',
      labels: { padding: 16, usePointStyle: true, pointStyleWidth: 10 },
    },
    tooltip: {
      callbacks: {
        label: (ctx) => ` $${ctx.parsed.toFixed(2)}`,
      },
    },
  },
};

export default function SpendingChart() {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Spending by Category
        </Typography>
        <div style={{ height: 280 }}>
          <Doughnut data={data} options={options} />
        </div>
      </CardContent>
    </Card>
  );
}
