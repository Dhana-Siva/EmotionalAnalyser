import { Card, CardContent, Typography, Button, Stack, Box, Divider } from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import LocalPoliceIcon from '@mui/icons-material/LocalPolice';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { useMood } from '../../context/MoodContext';

const HELP_LINES = [
  { label: 'Emergency Services', number: '911',          icon: <LocalPoliceIcon />,  color: '#DC2626', bg: '#FEE2E2' },
  { label: 'NovaBank 24/7 Help', number: '1-800-NOVA',   icon: <SupportAgentIcon />, color: '#1D4ED8', bg: '#EFF6FF' },
  { label: 'Fraud Helpline',     number: '1-800-FRAUD',  icon: <PhoneIcon />,        color: '#7C3AED', bg: '#F5F3FF' },
];

export default function FearCard() {
  const { resolveMood } = useMood();

  return (
    <Card sx={{ border: '2px solid #DC2626', bgcolor: '#FFF5F5' }}>
      <CardContent>

        {/* Header */}
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1.5 }}>
          <WarningAmberIcon sx={{ color: '#DC2626', fontSize: 30 }} />
          <Box>
            <Typography variant="h6" fontWeight={800} sx={{ color: '#DC2626', lineHeight: 1.2 }}>
              Do You Need Help?
            </Typography>
            <Typography variant="caption" sx={{ color: '#991B1B' }}>
              உதவி தேவையா? We're here for you.
            </Typography>
          </Box>
        </Stack>

        <Typography variant="body2" sx={{ color: '#7F1D1D', mb: 2, lineHeight: 1.6 }}>
          We noticed you may be distressed. If you feel unsafe or need immediate assistance, please reach out — you're not alone.
        </Typography>

        {/* Help lines */}
        <Stack spacing={1.5} sx={{ mb: 2 }}>
          {HELP_LINES.map((line) => (
            <Box
              key={line.label}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                p: 1.5,
                bgcolor: line.bg,
                borderRadius: 2,
                border: `1px solid ${line.color}33`,
              }}
            >
              <Box sx={{ color: line.color, display: 'flex' }}>{line.icon}</Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" fontWeight={700} sx={{ color: line.color }}>
                  {line.label}
                </Typography>
                <Typography variant="caption" sx={{ color: line.color, opacity: 0.8 }}>
                  {line.number}
                </Typography>
              </Box>
              <Button
                variant="contained"
                size="small"
                sx={{
                  bgcolor: line.color,
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: 12,
                  '&:hover': { bgcolor: line.color, opacity: 0.9 },
                }}
              >
                Call Now
              </Button>
            </Box>
          ))}
        </Stack>

        {/* Safety message */}
        <Box sx={{ p: 1.5, bgcolor: '#FEF3C7', borderRadius: 2, border: '1px solid #FDE68A', mb: 2 }}>
          <Typography variant="caption" sx={{ color: '#92400E', lineHeight: 1.6 }}>
            🔒 Your account is safe. NovaBank monitors your account 24/7. If you suspect any fraudulent activity, our team will act immediately.
          </Typography>
        </Box>

        <Divider sx={{ mb: 2 }} />

        <Button
          fullWidth
          startIcon={<CheckCircleIcon />}
          onClick={resolveMood}
          sx={{ color: '#059669', fontWeight: 600 }}
        >
          I'm safe — take me back to my dashboard
        </Button>

      </CardContent>
    </Card>
  );
}
