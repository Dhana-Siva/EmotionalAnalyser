import { useState } from 'react';
import {
  Typography,
  Stack,
  Card,
  CardContent,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  TextField,
  MenuItem,
  Box,
} from '@mui/material';
import accounts from '../data/accounts.json';
import transactions from '../data/transactions.json';

const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

export default function AccountsPage() {
  const [selectedAccount, setSelectedAccount] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filteredTxns = transactions
    .filter((t) => selectedAccount === 'all' || t.accountId === selectedAccount)
    .filter((t) => categoryFilter === 'all' || t.category === categoryFilter)
    .sort((a, b) => b.date.localeCompare(a.date));

  const categories = [...new Set(transactions.map((t) => t.category))].sort();

  return (
    <Stack spacing={3}>
      <Typography variant="h4">Accounts</Typography>

      <Grid container spacing={3}>
        {accounts.map((account) => (
          <Grid size={{ xs: 12, md: 4 }} key={account.id}>
            <Card
              sx={{
                cursor: 'pointer',
                border: selectedAccount === account.id ? '2px solid' : '2px solid transparent',
                borderColor: selectedAccount === account.id ? 'secondary.main' : 'transparent',
              }}
              onClick={() =>
                setSelectedAccount(selectedAccount === account.id ? 'all' : account.id)
              }
            >
              <CardContent>
                <Typography variant="overline" color="text.secondary">
                  {account.type}
                </Typography>
                <Typography variant="h5">{formatCurrency(account.balance)}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {account.name} • {account.accountNumber}
                </Typography>
                {account.interestRate && (
                  <Chip
                    label={`${account.interestRate}% APY`}
                    color="secondary"
                    size="small"
                    sx={{ mt: 1 }}
                  />
                )}
                {account.dueDate && (
                  <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                    Min payment {formatCurrency(account.minimumPayment)} due {account.dueDate}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Filters */}
      <Stack direction="row" spacing={2}>
        <TextField
          select
          label="Account"
          value={selectedAccount}
          onChange={(e) => setSelectedAccount(e.target.value)}
          size="small"
          sx={{ minWidth: 180 }}
        >
          <MenuItem value="all">All Accounts</MenuItem>
          {accounts.map((a) => (
            <MenuItem key={a.id} value={a.id}>
              {a.name}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Category"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          size="small"
          sx={{ minWidth: 160 }}
        >
          <MenuItem value="all">All Categories</MenuItem>
          {categories.map((cat) => (
            <MenuItem key={cat} value={cat}>
              {cat}
            </MenuItem>
          ))}
        </TextField>
      </Stack>

      {/* Transaction Table */}
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Category</TableCell>
                <TableCell align="right">Amount</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTxns.map((t) => (
                <TableRow key={t.id} hover>
                  <TableCell>{t.date}</TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" fontWeight={600}>
                        {t.description}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip label={t.category} size="small" />
                  </TableCell>
                  <TableCell align="right">
                    <Typography
                      fontWeight={600}
                      color={t.amount > 0 ? 'success.main' : 'text.primary'}
                    >
                      {t.amount > 0 ? '+' : ''}
                      {formatCurrency(t.amount)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {t.anomaly ? (
                      <Chip label="Flagged" color="error" size="small" />
                    ) : (
                      <Chip label="Cleared" color="success" size="small" variant="outlined" />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Stack>
  );
}
