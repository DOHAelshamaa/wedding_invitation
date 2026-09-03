import { motion } from 'framer-motion';
import { Section } from '@/components/ui/Section';
import type { Wedding } from '@/types/wedding';

function getHookLines(wedding: Wedding): [string, string] {
  if (wedding.story_hook && wedding.story_hook.length === 2) {
    return wedding.story_hook;
  }
  const proposal = wedding.story_events?.find((e) => e.key === 'proposal');
  return [
    wedding.story ?? 'A story written one quiet moment at a time.',
    proposal?.description ?? 'And somewhere along the way, forever began.',
  ];
}

export function Story({ wedding }: { wedding: Wedding }) {
  const [lineOne, lineTwo] = getHookLines(wedding);

  return (
    <Section background="cream" botanicals className="max-w-2xl text-center">
      <p className="text-xs uppercase tracking-widest2 text-taupe">Our Story</p>

      <motion.p
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="mt-8 font-display text-3xl italic leading-snug text-dark-brown sm:text-4xl"
      >
        {lineOne}
      </motion.p>

      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.7, delay: 0.3, ease: 'easeOut' }}
        className="mx-auto my-8 h-px w-16 origin-center bg-gold/70"
      />

      <motion.p
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="font-display text-2xl italic leading-snug text-clay sm:text-3xl"
      >
        {lineTwo}
      </motion.p>
    </Section>
  );
}
