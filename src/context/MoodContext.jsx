import { createContext, useContext, useReducer, useCallback, useRef } from 'react';

const MoodContext = createContext(null);

const NEGATIVE_MOODS = ['angry', 'stressed', 'sad'];

function getTimeOfDay() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night';
}

const initialState = {
  currentMood: 'neutral',
  moodConfidence: 0,
  isWebcamActive: false,
  faceDetected: false,
  moodLocked: false,
  timeOfDay: getTimeOfDay(),
};

function moodReducer(state, action) {
  switch (action.type) {
    case 'SET_MOOD':
      // If mood is locked to a negative state, ignore new detections
      if (state.moodLocked) return { ...state, faceDetected: true };
      return {
        ...state,
        currentMood: action.payload.mood,
        moodConfidence: action.payload.confidence,
        faceDetected: true,
        // Lock if entering a negative mood
        moodLocked: NEGATIVE_MOODS.includes(action.payload.mood),
      };
    case 'RESOLVE_MOOD':
      return { ...state, currentMood: 'neutral', moodConfidence: 0, moodLocked: false };
    case 'SET_NO_FACE':
      return { ...state, faceDetected: false };
    case 'SET_WEBCAM_ACTIVE':
      return { ...state, isWebcamActive: action.payload };
    case 'RESET_MOOD':
      return { ...state, currentMood: 'neutral', moodConfidence: 0, faceDetected: false, moodLocked: false };
    default:
      return state;
  }
}

const CONFIDENCE_THRESHOLD = 0.25;
const NEGATIVE_CONFIDENCE_THRESHOLD = 0.15; // very sensitive for negative moods
const DEBOUNCE_MS = 500; // react within half a second

export function MoodProvider({ children }) {
  const [state, dispatch] = useReducer(moodReducer, initialState);
  const debounceTimer = useRef(null);

  const updateMood = useCallback((mood, confidence) => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(() => {
      const threshold = NEGATIVE_MOODS.includes(mood)
        ? NEGATIVE_CONFIDENCE_THRESHOLD
        : CONFIDENCE_THRESHOLD;
      if (confidence >= threshold) {
        dispatch({ type: 'SET_MOOD', payload: { mood, confidence } });
      }
    }, DEBOUNCE_MS);
  }, []);

  const setNoFace = useCallback(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      dispatch({ type: 'SET_NO_FACE' });
    }, DEBOUNCE_MS);
  }, []);

  const setWebcamActive = useCallback((active) => {
    dispatch({ type: 'SET_WEBCAM_ACTIVE', payload: active });
    if (!active) dispatch({ type: 'RESET_MOOD' });
  }, []);

  const resolveMood = useCallback(() => {
    dispatch({ type: 'RESOLVE_MOOD' });
  }, []);

  return (
    <MoodContext.Provider value={{ ...state, updateMood, setNoFace, setWebcamActive, resolveMood }}>
      {children}
    </MoodContext.Provider>
  );
}

export function useMood() {
  const context = useContext(MoodContext);
  if (!context) throw new Error('useMood must be used within a MoodProvider');
  return context;
}
