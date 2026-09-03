import { Pause, Play } from 'lucide-react';
import { useMusic } from '@/context/MusicContext';

export function MusicPlayer() {
  const { isPlaying, hasStarted, toggle } = useMusic();

  if (!hasStarted) return null;

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isPlaying ? 'Pause music' : 'Play music'}
      aria-pressed={isPlaying}
      className="fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-taupe/50 bg-cream/90 text-dark-brown shadow-soft backdrop-blur transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-clay"
    >
      <span
        className={`absolute inset-0 rounded-full border border-gold/60 ${
          isPlaying ? 'animate-ping opacity-40' : 'opacity-0'
        }`}
        aria-hidden="true"
      />
      {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
    </button>
  );
}
