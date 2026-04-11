import { Card, CardContent, Typography, Button, Stack, Divider } from '@mui/material';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import GavelIcon from '@mui/icons-material/Gavel';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import HelpIcon from '@mui/icons-material/Help';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useMood } from '../../context/MoodContext';

const actions = [
  { label: 'Report an Issue', icon: <ReportProblemIcon />, color: '#E53E3E' },
  { label: 'Dispute Transaction', icon: <GavelIcon />, color: '#DD6B20' },
  { label: 'Contact Supervisor', icon: <SupportAgentIcon />, color: '#2D3748' },
];

export default function QuickHelpCard() {
  const { resolveMood } = useMood();

  return (
    <Card sx={{ border: '2px solid #ED8936' }}>
      <CardContent>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
          <HelpIcon sx={{ color: '#ED8936', fontSize: 28 }} />
          <Typography variant="h6" fontWeight={700}>
            Get Help Now
          </Typography>
        </Stack>
        <Stack spacing={1.5}>
          {actions.map((action) => (
            <Button
              key={action.label}
              variant="contained"
              startIcon={action.icon}
              fullWidth
              sx={{
                bgcolor: action.color,
                color: '#fff',
                py: 1.5,
                fontSize: '1rem',
                '&:hover': { opacity: 0.9, bgcolor: action.color },
              }}
            >
              {action.label}
            </Button>
          ))}
        </Stack>
        <Divider sx={{ my: 2 }} />
        <Button
          fullWidth
          startIcon={<CheckCircleIcon />}
          onClick={resolveMood}
          sx={{ color: '#48BB78' }}
        >
          I'm feeling better — show me offers
        </Button>
      </CardContent>
    </Card>
  );
}
