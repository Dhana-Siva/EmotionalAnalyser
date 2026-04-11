import { Typography, Stack, Grid } from '@mui/material';
import SpendingInsights from '../components/Insights/SpendingInsights';
import AnomalyList from '../components/Insights/AnomalyList';

export default function InsightsPage() {
  return (
    <Stack spacing={3}>
      <Typography variant="h4">Spending Insights</Typography>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 7 }}>
          <SpendingInsights />
        </Grid>
        <Grid size={{ xs: 12, md: 5 }}>
          <AnomalyList />
        </Grid>
      </Grid>
    </Stack>
  );
}
