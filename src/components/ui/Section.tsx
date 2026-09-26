import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { ParallaxBotanical } from './ParallaxBotanical';

type Background = 'cream' | 'parchment' | 'dark';

const bgClasses: Record<Background, string> = {
  cream: 'bg-cream',
  parchment: 'bg-parchment/70',
  dark: 'bg-dark-brown text-cream',
};

interface SectionProps {
  children: ReactNode;
  /** Applied to the inner content wrapper (max-w, text-align, etc.) — not the full-bleed section. */
  className?: string;
  id?: string;
  /** Full-bleed background tone. Alternate these between sections for visual rhythm. */
  background?: Background;
  /** Adds subtle scroll-parallax botanical branches in the side margins (desktop only). */
  botanicals?: boolean;
}

export function Section({
  children,
  className = '',
  id,
  background = 'cream',
  botanicals = false,
}: SectionProps) {
  return (
    <section
      id={id}
      className={`relative overflow-hidden py-24 sm:py-32 ${bgClasses[background]}`}
    >
      {botanicals && (
        <>
          <ParallaxBotanical side="left" />
          <ParallaxBotanical side="right" />
        </>
      )}

      {/*
        Reveals on mount rather than on scroll-into-view. whileInView relies on
        IntersectionObserver timing that can misfire on real mobile browsers,
        where the visible viewport resizes as the address bar collapses while
        scrolling — that mismatch can permanently strand content at opacity: 0
        even though it visually "should" have triggered. Animating on mount
        keeps the same soft entrance feel without depending on that detection.
      */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className={`relative z-10 mx-auto px-6 ${className}`}
      >
        {children}
      </motion.div>
    </section>
  );
}
