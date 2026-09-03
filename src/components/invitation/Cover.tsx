import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';
import { Botanical } from '@/components/ui/Botanical';
import { useMusic } from '@/context/MusicContext';
import type { Wedding } from '@/types/wedding';

interface CoverProps {
  wedding: Wedding;
  onOpen: () => void;
}

const formattedDate = (iso: string) =>
  new Date(iso + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

export function Cover({ wedding, onOpen }: CoverProps) {
  const { start } = useMusic();
  const [isOpening, setIsOpening] = useState(false);

  const handleOpen = async () => {
    setIsOpening(true);
    if (wedding.music_url) {
      await start(wedding.music_url, wedding.music_start_offset ?? 0);
    }
    // Let the exit animation play before mounting the full invitation.
    window.setTimeout(onOpen, 650);
  };

  return (
    <AnimatePresence>
      {!isOpening ? (
        <motion.div
          key="cover"
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="relative flex min-h-screen items-center justify-center overflow-hidden bg-cream px-6 py-16"
        >
          <div className="pointer-events-none absolute inset-0 bg-grain" />
          <Botanical className="pointer-events-none absolute -left-6 top-1/2 h-[85%] w-28 -translate-y-1/2 opacity-90 sm:left-2 sm:w-36 animate-drift" />
          <Botanical
            flip
            className="pointer-events-none absolute -right-6 top-1/2 h-[85%] w-28 -translate-y-1/2 opacity-90 sm:right-2 sm:w-36 animate-drift"
          />

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            className="relative z-10 w-full max-w-sm rounded-[2px] border border-taupe/30 bg-white/70 px-8 py-14 text-center shadow-card backdrop-blur-sm sm:max-w-md sm:px-14"
          >
            {wedding.cover_image ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.15, ease: 'easeOut' }}
                className="mx-auto mb-6 h-28 w-28 overflow-hidden rounded-full border-2 border-gold/60 shadow-soft sm:h-32 sm:w-32"
              >
                <img
                  src={wedding.cover_image}
                  alt={`${wedding.groom_name} and ${wedding.bride_name}`}
                  className="h-full w-full object-cover object-top"
                />
              </motion.div>
            ) : (
              <Heart size={22} className="mx-auto mb-6 text-clay" strokeWidth={1.25} />
            )}

            <p className="text-xs uppercase tracking-widest2 text-taupe">The Wedding Of</p>

            <h1 className="mt-5 font-display text-4xl italic leading-tight text-dark-brown sm:text-5xl">
              {wedding.groom_name}
            </h1>
            <div className="my-2 font-display text-2xl text-clay">&amp;</div>
            <h1 className="font-display text-4xl italic leading-tight text-dark-brown sm:text-5xl">
              {wedding.bride_name}
            </h1>

            <div className="mx-auto my-7 h-px w-14 bg-taupe/50" />

            <p className="text-sm tracking-widest2 text-brown">
              {formattedDate(wedding.wedding_date)}
            </p>

            <p className="mt-6 font-display text-base italic text-taupe">Cordially Invites</p>

            <button
              type="button"
              onClick={handleOpen}
              className="mt-9 inline-flex items-center justify-center border border-brown px-10 py-3 text-xs uppercase tracking-widest2 text-brown transition-colors duration-300 hover:bg-dark-brown hover:text-white focus-visible:outline-2 focus-visible:outline-clay"
            >
              Open
            </button>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
