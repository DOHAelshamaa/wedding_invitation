import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';

interface MusicContextValue {
  isPlaying: boolean;
  isReady: boolean;
  hasStarted: boolean;
  /** Called by the OPEN button. Starts playback inside the user gesture. */
  start: (src: string, startOffsetSeconds?: number) => Promise<void>;
  toggle: () => void;
}

const MusicContext = createContext<MusicContextValue | null>(null);

export function MusicProvider({ children }: { children: ReactNode }) {
  // A single Audio element lives for the lifetime of the app.
  // It is created once (lazily) and never recreated on re-render.
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const getAudio = useCallback(() => {
    if (!audioRef.current) {
      const audio = new Audio();
      audio.loop = true;
      audio.preload = 'auto';
      audio.volume = 0.6;
      audioRef.current = audio;
    }
    return audioRef.current;
  }, []);

  useEffect(() => {
    const audio = getAudio();
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onCanPlay = () => setIsReady(true);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('canplaythrough', onCanPlay);
    return () => {
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('canplaythrough', onCanPlay);
    };
  }, [getAudio]);

  const start = useCallback(
    async (src: string, startOffsetSeconds = 0) => {
      const audio = getAudio();
      const isFirstLoad = !audio.src || !audio.src.endsWith(src);
      // Only set src once — never reassign on every render/section change,
      // or playback would restart.
      if (isFirstLoad) {
        audio.src = src;
      }
      setHasStarted(true);
      try {
        await audio.play();
        // Seek only right after the very first load, so resuming later
        // (pause/play via the music control) never jumps the track back.
        if (isFirstLoad && startOffsetSeconds > 0) {
          audio.currentTime = startOffsetSeconds;
        }
      } catch {
        // Autoplay was blocked even inside the gesture (rare). The user
        // can still tap the visible music control to retry.
        setIsPlaying(false);
      }
    },
    [getAudio]
  );

  const toggle = useCallback(() => {
    const audio = getAudio();
    if (audio.paused) {
      audio.play().catch(() => setIsPlaying(false));
    } else {
      audio.pause();
    }
  }, [getAudio]);

  return (
    <MusicContext.Provider value={{ isPlaying, isReady, hasStarted, start, toggle }}>
      {children}
    </MusicContext.Provider>
  );
}

export function useMusic() {
  const ctx = useContext(MusicContext);
  if (!ctx) throw new Error('useMusic must be used within MusicProvider');
  return ctx;
}
