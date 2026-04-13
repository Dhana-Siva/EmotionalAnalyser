import {
  AppBar, Toolbar, Typography, IconButton, Badge,
  Avatar, Box, Chip, useMediaQuery, useTheme,
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MenuIcon from '@mui/icons-material/Menu';
import WebcamMood from '../FaceDetection/WebcamMood';
import { useMood } from '../../context/MoodContext';

const drawerWidth = 240;

const MOOD_GREETINGS = {
  happy:    "You seem happy today! 😊",
  sad:      "Need anything? We're here for you.",
  angry:    "We're ready to help. Let us know.",
  stressed: "Take it easy — everything's under control.",
  fearful:  "Are you okay? Help is just a tap away. 😨",
  neutral:  "Welcome back, Dhana",
};

const MOOD_CHIP_COLORS = {
  happy:    '#FF6B35',
  sad:      '#4A5568',
  angry:    '#E53E3E',
  stressed: '#5B8C9D',
  fearful:  '#DC2626',
  neutral:  '#00897B',
};

export default function TopBar({ onMobileToggle }) {
  const { currentMood, isWebcamActive, faceDetected } = useMood();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const greeting = isWebcamActive && faceDetected
    ? MOOD_GREETINGS[currentMood]
    : 'Welcome back, Dhana';

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        width: { xs: '100%', md: `calc(100% - ${drawerWidth}px)` },
        ml: { xs: 0, md: `${drawerWidth}px` },
        bgcolor: 'background.paper',
        color: 'text.primary',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Toolbar sx={{ gap: 1 }}>
        {/* Hamburger — only on mobile */}
        <IconButton
          edge="start"
          onClick={onMobileToggle}
          sx={{ display: { md: 'none' }, color: 'text.primary', mr: 0.5 }}
        >
          <MenuIcon />
        </IconButton>

        <Typography
          variant={isMobile ? 'body1' : 'h6'}
          sx={{ flexGrow: 1, fontWeight: 600, noWrap: true }}
          noWrap
        >
          {greeting}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, md: 1.5 } }}>
          {isWebcamActive && faceDetected && currentMood !== 'neutral' && (
            <Chip
              label={currentMood.charAt(0).toUpperCase() + currentMood.slice(1)}
              size="small"
              sx={{
                bgcolor: MOOD_CHIP_COLORS[currentMood],
                color: '#fff',
                fontWeight: 600,
                fontSize: 11,
                display: { xs: 'none', sm: 'flex' },
              }}
            />
          )}

          <WebcamMood />

          <IconButton size={isMobile ? 'small' : 'medium'}>
            <Badge badgeContent={3} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          <Avatar sx={{ bgcolor: 'secondary.main', width: 32, height: 32, fontSize: 14 }}>
            D
          </Avatar>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
