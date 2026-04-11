import {
  Card,
  CardContent,
  Typography,
  Stack,
  Chip,
  Box,
  Divider,
} from '@mui/material';
import ShieldIcon from '@mui/icons-material/Shield';
import transactions from '../../data/transactions.json';

const anomalies = transactions.filter((t) => t.anomaly);

const severityLabel = { high: 'High Risk', medium: 'Medium Risk', low: 'Low Risk' };
const severityColor = { high: 'error', medium: 'warning', low: 'info' };

const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

export default function AnomalyList() {
  return (
    <Card>
      <CardContent>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
          <ShieldIcon color="error" />
          <Typography variant="h6">Anomaly Detection</Typography>
          <Chip label={`${anomalies.length} flagged`} color="error" size="small" />
        </Stack>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Our AI monitors your transactions in real-time for unusual patterns, large amounts,
          and unrecognized merchants.
        </Typography>
        <Stack spacing={0}>
          {anomalies.map((t, i) => (
            <Box key={t.id}>
              {i > 0 && <Divider />}
              <Box sx={{ py: 2 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                  <Box>
                    <Typography variant="subtitle2">{t.description}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t.date} • {t.category}
                    </Typography>
                  </Box>
                  <Stack alignItems="flex-end" spacing={0.5}>
                    <Typography variant="subtitle2" fontWeight={700}>
                      {formatCurrency(Math.abs(t.amount))}
                    </Typography>
                    <Chip
                      label={severityLabel[t.severity]}
                      color={severityColor[t.severity]}
                      size="small"
                    />
                  </Stack>
                </Stack>
                <Box
                  sx={{
                    mt: 1,
                    p: 1.5,
                    bgcolor: 'grey.50',
                    borderRadius: 1,
                    borderLeft: '3px solid',
                    borderColor: `${severityColor[t.severity]}.main`,
                  }}
                >
                  <Typography variant="body2">
                    <strong>Why flagged:</strong> {t.anomalyReason}
                  </Typography>
                </Box>
              </Box>
            </Box>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
}
