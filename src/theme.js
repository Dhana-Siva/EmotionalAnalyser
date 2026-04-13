import { createTheme } from '@mui/material/styles';

const moodPalettes = {
  neutral: {
    primary: { main: '#0A2540', light: '#1A3A5C', dark: '#061A2E' },
    secondary: { main: '#00897B', light: '#4DB6AC', dark: '#00695C' },
    background: { default: '#F5F7FA', paper: '#FFFFFF' },
  },
  happy: {
    primary: { main: '#FF6B35', light: '#FF8F66', dark: '#E05520' },
    secondary: { main: '#F7931E', light: '#FFAD4D', dark: '#D97D0A' },
    background: { default: '#FFF9F0', paper: '#FFFFFF' },
  },
  sad: {
    primary: { main: '#4A5568', light: '#718096', dark: '#2D3748' },
    secondary: { main: '#48BB78', light: '#68D391', dark: '#38A169' },
    background: { default: '#F7FAFC', paper: '#FFFFFF' },
  },
  stressed: {
    primary: { main: '#5B8C9D', light: '#7FB3C2', dark: '#477080' },
    secondary: { main: '#98D8C8', light: '#B2E6D9', dark: '#6CC4AD' },
    background: { default: '#F0F8F5', paper: '#FFFFFF' },
  },
  angry: {
    primary: { main: '#2D3748', light: '#4A5568', dark: '#1A202C' },
    secondary: { main: '#ED8936', light: '#F6AD55', dark: '#DD6B20' },
    background: { default: '#F7FAFC', paper: '#FFFFFF' },
  },
  fearful: {
    primary: { main: '#991B1B', light: '#DC2626', dark: '#7F1D1D' },
    secondary: { main: '#F87171', light: '#FCA5A5', dark: '#EF4444' },
    background: { default: '#FFF5F5', paper: '#FFFFFF' },
  },
};

export function createMoodTheme(mood = 'neutral') {
  const palette = moodPalettes[mood] || moodPalettes.neutral;

  return createTheme({
    palette: {
      ...palette,
      success: { main: '#2E7D32' },
      warning: { main: '#ED6C02' },
      error: { main: '#D32F2F' },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h4: { fontWeight: 700 },
      h5: { fontWeight: 600 },
      h6: { fontWeight: 600 },
    },
    shape: { borderRadius: 12 },
    components: {
      MuiCard: {
        styleOverrides: {
          root: { boxShadow: '0 2px 12px rgba(0,0,0,0.08)' },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: { textTransform: 'none', fontWeight: 600 },
        },
      },
    },
  });
}

const theme = createMoodTheme('neutral');
export default theme;
