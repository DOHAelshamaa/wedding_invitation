import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { Divider } from '@/components/ui/Divider';
import type { GalleryImage } from '@/types/wedding';

export function Gallery({ images }: { images: GalleryImage[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  if (images.length === 0) return null;
  const active = activeIndex !== null ? images[activeIndex] : null;

  return (
    <Section background="parchment" className="max-w-4xl text-center">
      <Divider label="Gallery" />

      <div className="mt-12 columns-2 gap-3 sm:columns-3 sm:gap-4">
        {images.map((img, i) => (
          <button
            key={img.id}
            type="button"
            onClick={() => setActiveIndex(i)}
            className={`group mb-3 block w-full overflow-hidden rounded-[2px] shadow-soft focus-visible:outline-2 focus-visible:outline-clay sm:mb-4 ${
              img.orientation === 'landscape' ? 'aspect-[4/3]' : 'aspect-[3/4]'
            }`}
            aria-label={`View photo: ${img.alt_text ?? 'Wedding photo'}`}
          >
            <img
              src={img.image_url}
              alt={img.alt_text ?? ''}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </button>
        ))}
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-ink/90 p-6"
            role="dialog"
            aria-modal="true"
            aria-label="Photo viewer"
            onClick={() => setActiveIndex(null)}
          >
            <button
              type="button"
              onClick={() => setActiveIndex(null)}
              aria-label="Close photo viewer"
              className="absolute right-6 top-6 text-white/80 hover:text-white focus-visible:outline-2 focus-visible:outline-gold"
            >
              <X size={26} />
            </button>
            <motion.img
              initial={{ scale: 0.96 }}
              animate={{ scale: 1 }}
              src={active.image_url}
              alt={active.alt_text ?? ''}
              className="max-h-[85vh] max-w-full rounded-sm object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </Section>
  );
}
