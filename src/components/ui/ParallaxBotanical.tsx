import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Botanical } from './Botanical';

interface ParallaxBotanicalProps {
  side: 'left' | 'right';
}

/**
 * A botanical branch pinned to a section's side margin, drifting gently
 * up/down as the section scrolls through view. Desktop only (hidden on
 * small screens) and kept subtle per design direction — a small pixel
 * range, not a dramatic parallax.
 */
export function ParallaxBotanical({ side }: ParallaxBotanicalProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [-18, 18]);

  return (
    <div
      ref={ref}
      className={`pointer-events-none absolute inset-y-0 ${
        side === 'left' ? 'left-0 sm:left-2' : 'right-0 sm:right-2'
      } hidden w-20 opacity-40 sm:block lg:w-28`}
      aria-hidden="true"
    >
      <motion.div style={{ y }} className="flex h-full items-center">
        <Botanical flip={side === 'right'} className="h-[85%] w-full" />
      </motion.div>
    </div>
  );
}
