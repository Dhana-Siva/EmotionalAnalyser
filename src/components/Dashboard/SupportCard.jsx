import {
  Card, CardContent, Typography, Button, Stack,
  Box, Divider, Chip, List, ListItem, ListItemText, ListItemIcon,
} from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import ChatIcon from '@mui/icons-material/Chat';
import SecurityIcon from '@mui/icons-material/Security';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import { useMood } from '../../context/MoodContext';
import transactions from '../../data/transactions.json';

// Get the most recent 2 days of transactions from mock data
const sorted = [...transactions].sort((a, b) => b.date.localeCompare(a.date));
const latestDate = sorted[0]?.date;
const overnightTxns = sorted.filter((t) => {
  const diffMs = new Date(latestDate) - new Date(t.date);
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  return diffDays <= 1;
}).slice(0, 8);

const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Math.abs(amount));

export default function SupportCard() {
  const { resolveMood } = useMood();

  const anomalies = overnightTxns.filter((t) => t.anomaly);
  const normal = overnightTxns.filter((t) => !t.anomaly);

  return (
    <Card sx={{ bgcolor: '#F0F8F5', border: '1px solid #B2DFDB' }}>
      <CardContent>

        {/* Header */}
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
          <SecurityIcon sx={{ color: '#5B8C9D' }} />
          <Typography variant="h6" sx={{ color: '#5B8C9D' }}>
            We're Here For You
          </Typography>
        </Stack>
        <Typography variant="body2" sx={{ color: '#4A5568', mb: 2 }}>
          Everything is secure and under control. Here's what happened overnight — let us know if anything looks off.
        </Typography>

        {/* Overnight Transactions */}
        <Box sx={{ mb: 2 }}>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
            <InfoOutlinedIcon sx={{ fontSize: 18, color: '#5B8C9D' }} />
            <Typography variant="subtitle2" sx={{ color: '#5B8C9D', fontWeight: 700 }}>
              Overnight Activity · {new Date(latestDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
            </Typography>
          </Stack>

          {/* Anomalies first — highlighted */}
          {anomalies.length > 0 && (
            <Box sx={{ mb: 1.5 }}>
              {anomalies.map((t) => (
                <Box
                  key={t.id}
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 1,
                    p: 1.2,
                    mb: 1,
                    bgcolor: '#FFF8E1',
                    border: '1px solid #FFE082',
                    borderRadius: 2,
                  }}
                >
                  <WarningAmberIcon sx={{ fontSize: 18, color: '#F59E0B', mt: 0.3, flexShrink: 0 }} />
                  <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="body2" fontWeight={700} noWrap sx={{ color: '#92400E' }}>
                        {t.description}
                      </Typography>
                      <Typography variant="body2" fontWeight={700} sx={{ color: t.amount > 0 ? '#059669' : '#DC2626', ml: 1, flexShrink: 0 }}>
                        {t.amount > 0 ? '+' : '-'}{formatCurrency(t.amount)}
                      </Typography>
                    </Stack>
                    <Typography variant="caption" sx={{ color: '#B45309' }}>
                      ⚠ {t.anomalyReason}
                    </Typography>
                    <Box sx={{ mt: 0.5 }}>
                      <Chip
                        label={t.severity === 'high' ? 'High Risk' : t.severity === 'medium' ? 'Medium Risk' : 'Low Risk'}
                        size="small"
                        sx={{
                          fontSize: 10,
                          height: 18,
                          bgcolor: t.severity === 'high' ? '#FEE2E2' : t.severity === 'medium' ? '#FEF3C7' : '#ECFDF5',
                          color: t.severity === 'high' ? '#DC2626' : t.severity === 'medium' ? '#D97706' : '#059669',
                        }}
                      />
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
          )}

          {/* Normal transactions */}
          <List dense disablePadding sx={{ bgcolor: '#fff', borderRadius: 2, border: '1px solid #E2E8F0' }}>
            {normal.map((t, i) => (
              <ListItem
                key={t.id}
                divider={i < normal.length - 1}
                sx={{ py: 0.8, px: 1.5 }}
              >
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <Box
                    sx={{
                      width: 8, height: 8, borderRadius: '50%',
                      bgcolor: t.amount > 0 ? '#059669' : '#94A3B8',
                    }}
                  />
                </ListItemIcon>
                <ListItemText
                  primary={t.description}
                  secondary={t.category}
                  primaryTypographyProps={{ variant: 'body2', fontWeight: 500, noWrap: true }}
                  secondaryTypographyProps={{ variant: 'caption' }}
                />
                <Typography
                  variant="body2"
                  fontWeight={600}
                  sx={{ color: t.amount > 0 ? '#059669' : '#374151', flexShrink: 0, ml: 1 }}
                >
                  {t.amount > 0 ? '+' : '-'}{formatCurrency(t.amount)}
                </Typography>
              </ListItem>
            ))}
          </List>
        </Box>

        {/* "Does anything look concerning?" prompt */}
        <Box
          sx={{
            p: 1.5,
            bgcolor: '#E0F2FE',
            borderRadius: 2,
            border: '1px solid #BAE6FD',
            mb: 2,
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
            <ReportProblemIcon sx={{ fontSize: 18, color: '#0369A1' }} />
            <Typography variant="subtitle2" sx={{ color: '#0369A1', fontWeight: 700 }}>
              Does anything look concerning?
            </Typography>
          </Stack>
          <Typography variant="caption" sx={{ color: '#0C4A6E' }}>
            If you don't recognise a transaction or something feels off, tap below and we'll look into it right away.
          </Typography>
          <Stack direction="row" spacing={1.5} sx={{ mt: 1.5 }}>
            <Button
              variant="contained"
              size="small"
              startIcon={<ReportProblemIcon />}
              sx={{ bgcolor: '#0369A1', '&:hover': { bgcolor: '#075985' }, fontSize: 12 }}
            >
              Report an Issue
            </Button>
            <Button
              variant="outlined"
              size="small"
              startIcon={<ChatIcon />}
              sx={{ borderColor: '#0369A1', color: '#0369A1', fontSize: 12 }}
            >
              Dispute Transaction
            </Button>
          </Stack>
        </Box>

        {/* Contact options */}
        <Stack direction="row" spacing={2} flexWrap="wrap" sx={{ mb: 2 }}>
          <Button
            variant="contained"
            startIcon={<PhoneIcon />}
            size="small"
            sx={{ bgcolor: '#5B8C9D', '&:hover': { bgcolor: '#477080' } }}
          >
            1-800-NOVA-BANK
          </Button>
          <Button
            variant="outlined"
            startIcon={<ChatIcon />}
            size="small"
            sx={{ borderColor: '#5B8C9D', color: '#5B8C9D', '&:hover': { borderColor: '#477080', bgcolor: '#E6F4F0' } }}
          >
            Live Chat
          </Button>
        </Stack>

        <Box
          sx={{
            p: 1.5,
            bgcolor: '#E6FFFA',
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <SecurityIcon sx={{ fontSize: 18, color: '#38B2AC' }} />
          <Typography variant="caption" sx={{ color: '#285E61' }}>
            Your accounts are protected by 256-bit encryption and 24/7 fraud monitoring.
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />
        <Button
          fullWidth
          startIcon={<CheckCircleIcon />}
          onClick={resolveMood}
          sx={{ color: '#48BB78' }}
        >
          All looks fine — take me to my dashboard
        </Button>

      </CardContent>
    </Card>
  );
}
