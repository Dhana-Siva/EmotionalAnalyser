import { useState, useRef, useEffect } from 'react';
import {
  Box,
  TextField,
  IconButton,
  Chip,
  Stack,
  Typography,
  CircularProgress,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ChatMessage from './ChatMessage';
import { getResponse, quickActions } from '../../data/chatResponses';
import { useMood } from '../../context/MoodContext';

const now = () =>
  new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

export default function ChatWindow() {
  const { currentMood } = useMood();
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: "Hello! 👋 I'm your AI banking assistant. How can I help you today?",
      time: now(),
    },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const sendMessage = (text) => {
    if (!text.trim()) return;

    const userMsg = { id: Date.now(), sender: 'user', text, time: now() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setTyping(true);

    setTimeout(() => {
      const response = getResponse(text, currentMood);
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, sender: 'bot', text: response, time: now() },
      ]);
      setTyping(false);
    }, 800 + Math.random() * 700);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Messages */}
      <Box sx={{ flex: 1, overflow: 'auto', p: 3 }}>
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
        {typing && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 6 }}>
            <CircularProgress size={16} />
            <Typography variant="body2" color="text.secondary">
              AI is typing...
            </Typography>
          </Box>
        )}
        <div ref={endRef} />
      </Box>

      {/* Quick Actions */}
      <Stack direction="row" spacing={1} sx={{ px: 3, pb: 1, flexWrap: 'wrap', gap: 1 }}>
        {quickActions.map((action) => (
          <Chip
            key={action}
            label={action}
            variant="outlined"
            color="primary"
            onClick={() => sendMessage(action)}
            sx={{ cursor: 'pointer' }}
          />
        ))}
      </Stack>

      {/* Input */}
      <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
        <Stack direction="row" spacing={1}>
          <TextField
            fullWidth
            placeholder="Ask me anything about your accounts..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
            size="small"
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
          />
          <IconButton
            color="primary"
            onClick={() => sendMessage(input)}
            disabled={!input.trim()}
          >
            <SendIcon />
          </IconButton>
        </Stack>
      </Box>
    </Box>
  );
}
