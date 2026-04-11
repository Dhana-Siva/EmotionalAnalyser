import { Card, CardContent, Typography, Stack, Box, Button, Divider } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SavingsIcon from '@mui/icons-material/Savings';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useMood } from '../../context/MoodContext';

const highlights = [
  { icon: <TrendingUpIcon />, text: 'Your savings are up 12% this quarter!', color: '#48BB78' },
  { icon: <SavingsIcon />, text: 'You saved $438 this month — great job!', color: '#38A169' },
];

export default function EncouragementCard() {
  const { resolveMood } = useMood();

  return (
    <Card sx={{ bgcolor: '#F0FFF4', border: '1px solid #C6F6D5' }}>
      <CardContent>
        <Typography variant="h6" sx={{ color: '#2F855A', mb: 2 }}>
          Dhana, your banking activity looks clean.
        </Typography>
        <Typography variant="body2" sx={{ color: '#4A5568', mb: 2 }}>
          Let us know if there's any activity or transaction you're concerned about — we're here to help.
        </Typography>
        <Stack spacing={2}>
          {highlights.map((h, i) => (
            <Box
              key={i}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                p: 1.5,
                bgcolor: '#fff',
                borderRadius: 2,
                border: '1px solid #E2E8F0',
              }}
            >
              <Box sx={{ color: h.color, display: 'flex' }}>{h.icon}</Box>
              <Typography variant="body1" fontWeight={600} sx={{ color: '#2D3748' }}>
                {h.text}
              </Typography>
            </Box>
          ))}
        </Stack>
        <Divider sx={{ my: 2 }} />
        <Button
          fullWidth
          startIcon={<CheckCircleIcon />}
          onClick={resolveMood}
          sx={{ color: '#48BB78' }}
        >
          All looks good — take me to my dashboard
        </Button>
      </CardContent>
    </Card>
  );
}
