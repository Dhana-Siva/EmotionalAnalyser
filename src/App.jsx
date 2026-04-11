import { useMemo, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box, Toolbar } from '@mui/material';
import { createMoodTheme } from './theme';
import { MoodProvider, useMood } from './context/MoodContext';
import Sidebar from './components/Layout/Sidebar';
import TopBar from './components/Layout/TopBar';
import DashboardPage from './pages/DashboardPage';
import AccountsPage from './pages/AccountsPage';
import InsightsPage from './pages/InsightsPage';
import ChatPage from './pages/ChatPage';

const drawerWidth = 240;

function AppContent() {
  const { currentMood } = useMood();
  const theme = useMemo(() => createMoodTheme(currentMood), [currentMood]);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => setMobileOpen((prev) => !prev);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex' }}>
        <Sidebar mobileOpen={mobileOpen} onMobileToggle={handleDrawerToggle} />
        <TopBar onMobileToggle={handleDrawerToggle} />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            minWidth: 0,
            p: { xs: 2, md: 3 },
            bgcolor: 'background.default',
            minHeight: '100vh',
            width: { xs: '100%', md: `calc(100% - ${drawerWidth}px)` },
          }}
        >
          <Toolbar />
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/accounts" element={<AccountsPage />} />
            <Route path="/insights" element={<InsightsPage />} />
            <Route path="/chat" element={<ChatPage />} />
          </Routes>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <MoodProvider>
        <AppContent />
      </MoodProvider>
    </BrowserRouter>
  );
}
