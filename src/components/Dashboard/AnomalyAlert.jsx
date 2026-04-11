import { useState } from 'react';
import {
  Alert, AlertTitle, Card, CardContent, Typography, Stack, Chip,
  ToggleButton, ToggleButtonGroup, Dialog, DialogTitle, DialogContent,
  DialogActions, Button, Divider, List, ListItem, ListItemText, Box,
} from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';
import LockIcon from '@mui/icons-material/Lock';
import PhoneIcon from '@mui/icons-material/Phone';
import GavelIcon from '@mui/icons-material/Gavel';
import ErrorIcon from '@mui/icons-material/Error';
import transactions from '../../data/transactions.json';

const anomalies = transactions.filter((t) => t.anomaly);
const history = transactions.filter((t) => !t.anomaly);

const severityColor = { high: 'error', medium: 'warning', low: 'info' };

const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

function getHistoryContext(anomaly) {
  return history.filter((t) => t.category === anomaly.category).slice(0, 3);
}

const CONCERN_ACTIONS = [
  {
    id: 'freeze',
    icon: <LockIcon />,
    label: 'Freeze Card',
    description: 'Temporarily block all transactions on this card instantly.',
    color: '#E53E3E',
    bg: '#FFF5F5',
    border: '#FC8181',
  },
  {
    id: 'call',
    icon: <PhoneIcon />,
    label: 'Call Us Now',
    description: 'Speak with a fraud specialist immediately.',
    sub: '1-800-NOVABANK • Available 24/7',
    color: '#2B6CB0',
    bg: '#EBF8FF',
    border: '#63B3ED',
  },
  {
    id: 'dispute',
    icon: <GavelIcon />,
    label: 'Dispute Transaction',
    description: 'File an official dispute and start the investigation process.',
    color: '#744210',
    bg: '#FFFAF0',
    border: '#F6AD55',
  },
];

export default function AnomalyAlert({ reviews, setReviews, confirmed, setConfirmed, flagged, setFlagged }) {
  const [activeAnomaly, setActiveAnomaly] = useState(null);
  const [dialogType, setDialogType] = useState(null); // 'authentic' | 'concern'
  const [takenAction, setTakenAction] = useState(null);

  if (anomalies.length === 0) return null;

  const handleReview = (id, value) => {
    if (value === 'authentic') {
      setActiveAnomaly(anomalies.find((t) => t.id === id));
      setDialogType('authentic');
    } else if (value === 'concern') {
      setActiveAnomaly(anomalies.find((t) => t.id === id));
      setDialogType('concern');
      setTakenAction(null);
    }
  };

  const handleConfirmAuthentic = () => {
    setConfirmed((prev) => ({ ...prev, [activeAnomaly.id]: true }));
    setReviews((prev) => ({ ...prev, [activeAnomaly.id]: 'authentic' }));
    closeDialog();
  };

  const handleConcernAction = (actionId) => {
    setTakenAction(actionId);
  };

  const handleConcernDone = () => {
    setFlagged((prev) => ({ ...prev, [activeAnomaly.id]: takenAction || 'concern' }));
    setReviews((prev) => ({ ...prev, [activeAnomaly.id]: 'concern' }));
    closeDialog();
  };

  const closeDialog = () => {
    setActiveAnomaly(null);
    setDialogType(null);
    setTakenAction(null);
  };

  return (
    <>
      <Card>
        <CardContent>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
            <WarningAmberIcon color="warning" />
            <Typography variant="h6">Unusual Activity Detected</Typography>
            <Chip label={`${anomalies.length} alerts`} color="error" size="small" />
          </Stack>
          <Stack spacing={1.5}>
            {[...anomalies].sort((a, b) => (confirmed[a.id] ? 1 : 0) - (confirmed[b.id] ? 1 : 0)).map((t) => {
              if (confirmed[t.id]) {
                return (
                  <Alert
                    key={t.id}
                    icon={<CheckCircleIcon />}
                    severity="success"
                    variant="outlined"
                    sx={{
                      flexWrap: 'wrap',
                      '& .MuiAlert-action': {
                        width: { xs: '100%', sm: 'auto' },
                        ml: { xs: 0, sm: 'auto' },
                        pl: { xs: 0, sm: 2 },
                        pt: { xs: 0.5, sm: 0 },
                      },
                    }}
                    action={
                      <Button
                        size="small"
                        color="error"
                        variant="outlined"
                        startIcon={<ReportProblemOutlinedIcon />}
                        onClick={() => { setActiveAnomaly(t); setDialogType('concern'); setTakenAction(null); }}
                        sx={{ fontSize: 11, whiteSpace: 'nowrap' }}
                      >
                        Report Concern
                      </Button>
                    }
                  >
                    <AlertTitle sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1 }}>
                      {t.description} — {formatCurrency(Math.abs(t.amount))}
                      <Chip label="Confirmed" color="success" size="small" />
                    </AlertTitle>
                    {t.date} • Marked as authentic
                  </Alert>
                );
              }

              if (flagged[t.id]) {
                const action = CONCERN_ACTIONS.find((a) => a.id === flagged[t.id]);
                return (
                  <Alert key={t.id} icon={<ErrorIcon />} severity="error" variant="outlined">
                    <AlertTitle sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1 }}>
                      {t.description} — {formatCurrency(Math.abs(t.amount))}
                      <Chip label="Under Review" color="error" size="small" />
                    </AlertTitle>
                    {t.date} • {action ? `Action taken: ${action.label}` : 'Flagged as concern'}
                  </Alert>
                );
              }

              return (
                <Alert
                  key={t.id}
                  severity={severityColor[t.severity]}
                  variant="outlined"
                  sx={{
                    flexWrap: 'wrap',
                    '& .MuiAlert-action': {
                      width: { xs: '100%', sm: 'auto' },
                      ml: { xs: 0, sm: 'auto' },
                      pl: { xs: 0, sm: 2 },
                      pt: { xs: 0.5, sm: 0 },
                    },
                  }}
                  action={
                    <ToggleButtonGroup
                      size="small"
                      exclusive
                      value={reviews[t.id] ?? null}
                      onChange={(_, val) => handleReview(t.id, val)}
                    >
                      <ToggleButton
                        value="authentic"
                        sx={{
                          fontSize: 11,
                          px: 1.5,
                          color: '#276749',
                          borderColor: '#48BB78',
                          bgcolor: '#F0FFF4',
                          fontWeight: 600,
                          '&:hover': { bgcolor: '#C6F6D5' },
                          '&.Mui-selected': { bgcolor: '#48BB78', color: '#fff', borderColor: '#2F855A' },
                        }}
                      >
                        <CheckCircleOutlineIcon sx={{ fontSize: 14, mr: 0.5 }} />
                        Authentic
                      </ToggleButton>
                      <ToggleButton
                        value="concern"
                        sx={{
                          fontSize: 11,
                          px: 1.5,
                          color: '#C53030',
                          borderColor: '#FC8181',
                          bgcolor: '#FFF5F5',
                          fontWeight: 600,
                          '&:hover': { bgcolor: '#FED7D7' },
                          '&.Mui-selected': { bgcolor: '#E53E3E', color: '#fff', borderColor: '#C53030' },
                        }}
                      >
                        <ReportProblemOutlinedIcon sx={{ fontSize: 14, mr: 0.5 }} />
                        Concern
                      </ToggleButton>
                    </ToggleButtonGroup>
                  }
                >
                  <AlertTitle>
                    {t.description} — {formatCurrency(Math.abs(t.amount))}
                  </AlertTitle>
                  {t.anomalyReason} • {t.date}
                </Alert>
              );
            })}
          </Stack>
        </CardContent>
      </Card>

      {/* Authentic Dialog */}
      {activeAnomaly && dialogType === 'authentic' && (
        <Dialog open onClose={closeDialog} maxWidth="sm" fullWidth>
          <DialogTitle>Verify This Transaction</DialogTitle>
          <DialogContent>
            <Typography variant="body1" fontWeight={600}>{activeAnomaly.description}</Typography>
            <Typography variant="h5" color="primary" sx={{ my: 0.5 }}>
              {formatCurrency(Math.abs(activeAnomaly.amount))}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {activeAnomaly.date} • {activeAnomaly.anomalyReason}
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle2" gutterBottom>Similar transactions from your history:</Typography>
            {getHistoryContext(activeAnomaly).length > 0 ? (
              <List dense disablePadding>
                {getHistoryContext(activeAnomaly).map((h) => (
                  <ListItem key={h.id} disablePadding sx={{ py: 0.5 }}>
                    <ListItemText
                      primary={h.description}
                      secondary={`${h.date} • ${formatCurrency(Math.abs(h.amount))}`}
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No similar transactions found in your recent history.
              </Typography>
            )}
            <Divider sx={{ my: 2 }} />
            <Typography variant="body2" color="text.secondary">
              Take a moment to review — does this transaction look familiar to you?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeDialog} color="inherit">Cancel</Button>
            <Button onClick={handleConfirmAuthentic} variant="contained" color="success" startIcon={<CheckCircleIcon />}>
              Confirm — This is mine
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Concern Dialog */}
      {activeAnomaly && dialogType === 'concern' && (
        <Dialog open onClose={closeDialog} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ color: '#C53030' }}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <ErrorIcon color="error" />
              <span>Take Action on This Transaction</span>
            </Stack>
          </DialogTitle>
          <DialogContent>
            <Box sx={{ bgcolor: '#FFF5F5', border: '1px solid #FC8181', borderRadius: 2, p: 2, mb: 2 }}>
              <Typography variant="body1" fontWeight={700}>{activeAnomaly.description}</Typography>
              <Typography variant="h5" color="error" sx={{ my: 0.5 }}>
                {formatCurrency(Math.abs(activeAnomaly.amount))}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {activeAnomaly.date} • {activeAnomaly.anomalyReason}
              </Typography>
            </Box>

            <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
              What would you like to do?
            </Typography>

            <Stack spacing={1.5}>
              {CONCERN_ACTIONS.map((action) => (
                <Box
                  key={action.id}
                  onClick={() => handleConcernAction(action.id)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    p: 2,
                    borderRadius: 2,
                    border: `2px solid`,
                    borderColor: takenAction === action.id ? action.color : action.border,
                    bgcolor: takenAction === action.id ? action.bg : '#fff',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    '&:hover': { bgcolor: action.bg },
                  }}
                >
                  <Box sx={{ color: action.color, display: 'flex' }}>{action.icon}</Box>
                  <Box>
                    <Typography variant="body2" fontWeight={700} sx={{ color: action.color }}>
                      {action.label}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {action.description}
                    </Typography>
                    {action.sub && (
                      <Typography variant="caption" display="block" fontWeight={600} sx={{ color: action.color }}>
                        {action.sub}
                      </Typography>
                    )}
                  </Box>
                  {takenAction === action.id && (
                    <CheckCircleIcon sx={{ ml: 'auto', color: action.color, fontSize: 20 }} />
                  )}
                </Box>
              ))}
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeDialog} color="inherit">Cancel</Button>
            <Button
              onClick={handleConcernDone}
              variant="contained"
              color="error"
              disabled={!takenAction}
            >
              Confirm Action
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
}
