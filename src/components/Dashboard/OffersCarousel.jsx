import { Box, Card, CardContent, Typography, Button, Stack } from '@mui/material';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import offers from '../../data/offers.json';
import { useMood } from '../../context/MoodContext';

export default function OffersCarousel() {
  const { timeOfDay } = useMood();

  const filtered = offers.filter((o) => o.timeOfDay.includes(timeOfDay));

  if (filtered.length === 0) return null;

  return (
    <Card sx={{ bgcolor: '#FFF9F0', border: '1px solid #FFE0C0' }}>
      <CardContent>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
          <LocalOfferIcon sx={{ color: '#FF6B35' }} />
          <Typography variant="h6" sx={{ color: '#FF6B35' }}>
            Offers For You
          </Typography>
        </Stack>
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            overflowX: 'auto',
            pb: 1,
            '&::-webkit-scrollbar': { height: 6 },
            '&::-webkit-scrollbar-thumb': { bgcolor: '#FFD0A8', borderRadius: 3 },
          }}
        >
          {filtered.map((offer) => (
            <Card
              key={offer.id}
              sx={{
                minWidth: 260,
                flexShrink: 0,
                background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
                color: '#fff',
              }}
            >
              <CardContent>
                <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                  {offer.title}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9, mb: 2 }}>
                  {offer.description}
                </Typography>
                <Button
                  variant="contained"
                  size="small"
                  sx={{
                    bgcolor: '#fff',
                    color: '#FF6B35',
                    '&:hover': { bgcolor: '#FFF3E8' },
                  }}
                >
                  {offer.ctaText}
                </Button>
              </CardContent>
            </Card>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}
