import { useState, useRef, useEffect, useCallback } from 'react';
import { Box, IconButton, Typography, Tooltip, useMediaQuery, useTheme } from '@mui/material';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import * as faceapi from 'face-api.js';
import { useMood } from '../../context/MoodContext';

const MOOD_EMOJI = {
  happy:   '😊',
  sad:     '😢',
  angry:   '😠',
  stressed:'😰',
  fearful: '😨',
  neutral: '😐',
};

const MOOD_BORDER_COLOR = {
  happy:   '#FF6B35',
  sad:     '#4A5568',
  angry:   '#E53E3E',
  stressed:'#5B8C9D',
  fearful: '#DC2626',
  neutral: '#00897B',
};

function mapExpressions(expressions) {
  const { angry, fearful, disgusted, sad, happy, neutral, surprised } = expressions;

  // Stressed = fearful OR disgusted OR surprised (wide eyes, raised brows)
  // Check fearful independently — don't average it away
  const stressScore = Math.max(fearful, disgusted, (fearful + disgusted) / 2);

  // Fearful is checked FIRST — it's safety-critical and must not be masked by angry
  // face-api often assigns high angry scores when someone looks scared/tense
  if (fearful  > 0.07) return { mood: 'fearful', confidence: fearful };
  if (angry    > 0.25) return { mood: 'angry',   confidence: angry };
  if (stressScore > 0.15) return { mood: 'stressed', confidence: stressScore };
  if (sad      > 0.25) return { mood: 'sad',      confidence: sad };

  const candidates = [
    { mood: 'happy',   score: happy },
    { mood: 'neutral', score: neutral },
  ];
  const dominant = candidates.reduce((a, b) => (b.score > a.score ? b : a));
  return { mood: dominant.mood, confidence: dominant.score };
}

export default function WebcamMood() {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const intervalRef = useRef(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [debugScores, setDebugScores] = useState(null);
  const { currentMood, isWebcamActive, faceDetected, updateMood, setNoFace, setWebcamActive } = useMood();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const videoWidth = isMobile ? 80 : 120;
  const videoHeight = isMobile ? 60 : 90;

  useEffect(() => {
    async function loadModels() {
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
          faceapi.nets.faceExpressionNet.loadFromUri('/models'),
        ]);
        setModelsLoaded(true);
      } catch (e) {
        console.error('Failed to load face-api models:', e);
        setCameraError('Models failed to load');
      }
    }
    loadModels();
  }, []);

  const startDetection = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    // Use a longer interval on mobile — Safari/iPhone WebGL is slower
    const interval = isMobile ? 1200 : 600;

    intervalRef.current = setInterval(async () => {
      const video = videoRef.current;
      if (!video) return;
      // Wait until video has enough data (readyState 3 = HAVE_FUTURE_DATA, 4 = HAVE_ENOUGH_DATA)
      if (video.readyState < 3) return;
      if (video.paused || video.ended) return;

      try {
        const detection = await faceapi
          .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.3 }))
          .withFaceExpressions();

        if (detection) {
          const e = detection.expressions;
          setDebugScores({
            angry:   (e.angry   * 100).toFixed(0),
            fearful: (e.fearful * 100).toFixed(0),
            sad:     (e.sad     * 100).toFixed(0),
            happy:   (e.happy   * 100).toFixed(0),
            neutral: (e.neutral * 100).toFixed(0),
          });
          const { mood, confidence } = mapExpressions(e);
          updateMood(mood, confidence);
        } else {
          setNoFace();
          setDebugScores(null);
        }
      } catch (e) {
        console.warn('Face detection error:', e);
      }
    }, interval);
  }, [updateMood, setNoFace, isMobile]);

  const startWebcam = useCallback(async () => {
    try {
      setCameraError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 320, height: 240, facingMode: 'user' },
      });
      streamRef.current = stream;
      setWebcamActive(true);
    } catch (e) {
      console.error('Camera error:', e);
      setCameraError('Camera access denied');
      setWebcamActive(false);
    }
  }, [setWebcamActive]);

  const stopWebcam = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) videoRef.current.srcObject = null;
    setWebcamActive(false);
  }, [setWebcamActive]);

  // Attach stream to video element, then wait for video to be ready before detecting
  useEffect(() => {
    if (!isWebcamActive || !videoRef.current || !streamRef.current) return;

    const video = videoRef.current;
    video.srcObject = streamRef.current;

    // Wait for Safari to confirm video is actually playing before running detection
    const onReady = () => startDetection();
    video.addEventListener('loadeddata', onReady, { once: true });

    // Fallback: start anyway after 3s in case the event already fired
    const fallback = setTimeout(startDetection, 3000);

    return () => {
      video.removeEventListener('loadeddata', onReady);
      clearTimeout(fallback);
    };
  }, [isWebcamActive, startDetection]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const toggleWebcam = () => {
    if (isWebcamActive) stopWebcam();
    else startWebcam();
  };

  const borderColor = MOOD_BORDER_COLOR[currentMood] || MOOD_BORDER_COLOR.neutral;

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      {isWebcamActive && debugScores && (
        <Box sx={{
          fontSize: 10, lineHeight: 1.4, bgcolor: 'rgba(0,0,0,0.75)',
          color: '#fff', borderRadius: 1, px: 0.8, py: 0.5,
          fontFamily: 'monospace', minWidth: 80,
        }}>
          {Object.entries(debugScores).map(([k, v]) => (
            <Box key={k} sx={{ display: 'flex', justifyContent: 'space-between', gap: 1 }}>
              <span style={{ color: k === 'fearful' ? '#f87171' : k === 'angry' ? '#fbbf24' : '#aaa' }}>{k}</span>
              <span>{v}%</span>
            </Box>
          ))}
        </Box>
      )}

      {isWebcamActive && (
        <Box sx={{ position: 'relative' }}>
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            style={{
              width: videoWidth,
              height: videoHeight,
              objectFit: 'cover',
              borderRadius: 8,
              border: `3px solid ${borderColor}`,
              transform: 'scaleX(-1)',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: -4,
              right: -4,
              fontSize: 18,
              bgcolor: 'background.paper',
              borderRadius: '50%',
              width: 28,
              height: 28,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 1,
            }}
          >
            {faceDetected ? MOOD_EMOJI[currentMood] : '👤'}
          </Box>
        </Box>
      )}

      {cameraError && (
        <Typography variant="caption" color="error" sx={{ maxWidth: 100 }}>
          {cameraError}
        </Typography>
      )}

      <Tooltip title={isWebcamActive ? 'Turn off camera' : modelsLoaded ? 'Turn on camera' : 'Loading models...'}>
        <span>
          <IconButton
            onClick={toggleWebcam}
            disabled={!modelsLoaded}
            size="small"
            sx={{ color: isWebcamActive ? 'secondary.main' : 'text.secondary' }}
          >
            {isWebcamActive ? <VideocamIcon /> : <VideocamOffIcon />}
          </IconButton>
        </span>
      </Tooltip>
    </Box>
  );
}
