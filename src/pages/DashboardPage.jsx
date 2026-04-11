import { useState } from 'react';
import { Typography, Stack, Grid, Card, CardContent, Chip, Box } from '@mui/material';
import AccountSummary from '../components/Dashboard/AccountSummary';
import SpendingChart from '../components/Dashboard/SpendingChart';
import AnomalyAlert from '../components/Dashboard/AnomalyAlert';
import OffersCarousel from '../components/Dashboard/OffersCarousel';
import EncouragementCard from '../components/Dashboard/EncouragementCard';
import SupportCard from '../components/Dashboard/SupportCard';
import QuickHelpCard from '../components/Dashboard/QuickHelpCard';
import { useMood } from '../context/MoodContext';
import transactions from '../data/transactions.json';

const recentTxns = transactions
  .filter((t) => !t.anomaly)
  .sort((a, b) => b.date.localeCompare(a.date))
  .slice(0, 6);

const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

function MoodCard({ mood }) {
  if (mood === 'angry') return <QuickHelpCard />;
  if (mood === 'stressed') return <SupportCard />;
  if (mood === 'sad') return <EncouragementCard />;
  // Show offers for happy, neutral, and any other non-negative mood
  return <OffersCarousel />;
}

export default function DashboardPage() {
  const { currentMood } = useMood();

  // Anomaly review state lives here so it survives AnomalyAlert re-mounts across mood changes
  const [reviews, setReviews] = useState({});
  const [confirmed, setConfirmed] = useState({});
  const [flagged, setFlagged] = useState({});

  // Always show panel if there are active concern items, even in sad mood
  const hasConcerns = Object.keys(flagged).length > 0;
  const showAnomalies = currentMood !== 'sad' || hasConcerns;
  const showCharts = currentMood !== 'stressed' && currentMood !== 'angry';
  // Anomalies float to top when negative mood, bottom when calm
  const anomalyOrder = ['angry', 'stressed'].includes(currentMood) ? 0 : 2;

  return (
    <Stack spacing={3}>
      <Typography variant="h4">Dashboard</Typography>

      <MoodCard mood={currentMood} />

      <AccountSummary />

      {/* Flex container so CSS order can reposition without unmounting AnomalyAlert */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Always mounted — display:none preserves internal state across mood changes */}
        <Box sx={{ order: anomalyOrder, display: showAnomalies ? 'block' : 'none' }}>
          <AnomalyAlert
            reviews={reviews} setReviews={setReviews}
            confirmed={confirmed} setConfirmed={setConfirmed}
            flagged={flagged} setFlagged={setFlagged}
          />
        </Box>

        {showCharts && (
          <Box sx={{ order: 1 }}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 7 }}>
                <SpendingChart />
              </Grid>
              <Grid size={{ xs: 12, md: 5 }}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Recent Transactions
                    </Typography>
                    <Stack spacing={1}>
                      {recentTxns.map((t) => (
                        <Box
                          key={t.id}
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            py: 1,
                            borderBottom: '1px solid',
                            borderColor: 'divider',
                          }}
                        >
                          <Box>
                            <Typography variant="body2" fontWeight={600}>
                              {t.description}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {t.date}
                            </Typography>
                          </Box>
                          <Box sx={{ textAlign: 'right' }}>
                            <Typography
                              variant="body2"
                              fontWeight={600}
                              color={t.amount > 0 ? 'success.main' : 'text.primary'}
                            >
                              {t.amount > 0 ? '+' : ''}
                              {formatCurrency(t.amount)}
                            </Typography>
                            <Chip label={t.category} size="small" sx={{ fontSize: 11 }} />
                          </Box>
                        </Box>
                      ))}
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}
      </Box>
    </Stack>
  );
}
