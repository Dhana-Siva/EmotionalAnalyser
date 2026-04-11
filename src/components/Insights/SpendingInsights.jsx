import { Card, CardContent, Typography, Box, Stack, LinearProgress } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import transactions from '../../data/transactions.json';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const spending = {};
transactions
  .filter((t) => t.amount < 0 && !t.anomaly && t.category !== 'Income' && t.category !== 'Transfer')
  .forEach((t) => {
    spending[t.category] = (spending[t.category] || 0) + Math.abs(t.amount);
  });

const sorted = Object.entries(spending).sort((a, b) => b[1] - a[1]);
const total = sorted.reduce((sum, [, v]) => sum + v, 0);

const barData = {
  labels: sorted.map(([cat]) => cat),
  datasets: [
    {
      label: 'This Month',
      data: sorted.map(([, amt]) => Math.round(amt * 100) / 100),
      backgroundColor: '#0A2540',
      borderRadius: 6,
    },
    {
      label: 'Last Month',
      data: sorted.map(([, amt]) => Math.round((amt * (0.7 + Math.random() * 0.6)) * 100) / 100),
      backgroundColor: '#00897B',
      borderRadius: 6,
    },
  ],
};

const barOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'top' },
    tooltip: { callbacks: { label: (ctx) => ` $${ctx.parsed.y.toFixed(2)}` } },
  },
  scales: {
    y: { beginAtZero: true, ticks: { callback: (v) => `$${v}` } },
  },
};

const insights = [
  { text: 'Your dining spending is up 30% compared to last month. Consider setting a budget alert.', type: 'warning' },
  { text: 'Great job! Your grocery spending decreased by 12% this month.', type: 'success' },
  { text: 'You have 3 active subscriptions totaling $76.97/month. Review them for potential savings.', type: 'info' },
  { text: 'Your housing costs represent 45% of your income. This is within the recommended range.', type: 'success' },
];

const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

export default function SpendingInsights() {
  return (
    <Stack spacing={3}>
      {/* Bar Chart */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Monthly Spending Comparison
          </Typography>
          <Box sx={{ height: 350 }}>
            <Bar data={barData} options={barOptions} />
          </Box>
        </CardContent>
      </Card>

      {/* Category Breakdown */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Category Breakdown
          </Typography>
          <Stack spacing={2}>
            {sorted.map(([cat, amt]) => (
              <Box key={cat}>
                <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                  <Typography variant="body2">{cat}</Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {formatCurrency(amt)} ({((amt / total) * 100).toFixed(1)}%)
                  </Typography>
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={(amt / sorted[0][1]) * 100}
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>
            ))}
          </Stack>
        </CardContent>
      </Card>

      {/* AI Insights */}
      <Card>
        <CardContent>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
            <TipsAndUpdatesIcon color="secondary" />
            <Typography variant="h6">AI Insights</Typography>
          </Stack>
          <Stack spacing={1.5}>
            {insights.map((insight, i) => (
              <Box
                key={i}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor:
                    insight.type === 'warning'
                      ? 'warning.main'
                      : insight.type === 'success'
                      ? 'success.main'
                      : 'info.main',
                  color: 'white',
                }}
              >
                <Typography variant="body2">{insight.text}</Typography>
              </Box>
            ))}
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
}
