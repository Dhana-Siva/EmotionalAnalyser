import { Box, Paper, Typography } from '@mui/material';
import SmartToyIcon from '@mui/icons-material/SmartToy';

export default function ChatMessage({ message }) {
  const isBot = message.sender === 'bot';

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: isBot ? 'flex-start' : 'flex-end',
        mb: 2,
        gap: 1,
      }}
    >
      {isBot && (
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            bgcolor: 'secondary.main',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            mt: 0.5,
          }}
        >
          <SmartToyIcon sx={{ color: 'white', fontSize: 20 }} />
        </Box>
      )}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          maxWidth: '70%',
          bgcolor: isBot ? 'grey.100' : 'primary.main',
          color: isBot ? 'text.primary' : 'white',
          borderRadius: isBot ? '4px 16px 16px 16px' : '16px 4px 16px 16px',
        }}
      >
        <Typography
          variant="body1"
          sx={{
            whiteSpace: 'pre-line',
            '& strong': { fontWeight: 700 },
          }}
          dangerouslySetInnerHTML={{
            __html: message.text
              .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
              .replace(/\n/g, '<br/>'),
          }}
        />
        <Typography variant="caption" sx={{ opacity: 0.6, mt: 0.5, display: 'block' }}>
          {message.time}
        </Typography>
      </Paper>
    </Box>
  );
}
