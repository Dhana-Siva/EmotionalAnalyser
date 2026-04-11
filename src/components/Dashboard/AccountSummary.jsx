import { Card, CardContent, Typography, Grid, Box, Chip } from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import SavingsIcon from '@mui/icons-material/Savings';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import accounts from '../../data/accounts.json';
import BalanceSparkline from './BalanceSparkline';

const iconMap = {
  Checking: <AccountBalanceWalletIcon sx={{ fontSize: 32 }} />,
  Savings: <SavingsIcon sx={{ fontSize: 32 }} />,
  'Credit Card': <CreditCardIcon sx={{ fontSize: 32 }} />,
};

const colorMap = {
  Checking: '#0A2540',
  Savings: '#00897B',
  'Credit Card': '#5E35B1',
};

const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

export default function AccountSummary() {
  return (
    <Grid container spacing={3}>
      {accounts.map((account) => (
        <Grid size={{ xs: 12, md: 4 }} key={account.id}>
          <Card
            sx={{
              background: `linear-gradient(135deg, ${colorMap[account.type]}, ${colorMap[account.type]}CC)`,
              color: 'white',
              height: '100%',
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                {iconMap[account.type]}
                <Chip
                  label={account.type}
                  size="small"
                  sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                />
              </Box>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                {account.name}
              </Typography>
              <Typography variant="h4" sx={{ my: 1 }}>
                {formatCurrency(account.balance)}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.7 }}>
                {account.type === 'Credit Card'
                  ? `Available: ${formatCurrency(account.availableCredit)}`
                  : `Available: ${formatCurrency(account.availableBalance)}`}
              </Typography>
              {account.balanceHistory && (
                <BalanceSparkline history={account.balanceHistory} />
              )}
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
