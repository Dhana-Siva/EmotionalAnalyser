import { Box, Typography } from '@mui/material';
import ChatWindow from '../components/Chat/ChatWindow';

export default function ChatPage() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 112px)' }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        AI Assistant
      </Typography>
      <Box
        sx={{
          flex: 1,
          bgcolor: 'background.paper',
          borderRadius: 3,
          overflow: 'hidden',
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        }}
      >
        <ChatWindow />
      </Box>
    </Box>
  );
}
