import { Section } from '@/components/ui/Section';
import { Divider } from '@/components/ui/Divider';
import type { Wedding } from '@/types/wedding';

export function Welcome({ wedding }: { wedding: Wedding }) {
  if (!wedding.welcome_text) return null;

  return (
    <Section background="cream" botanicals className="max-w-xl text-center">
      <Divider label="Welcome" />
      <p className="mt-8 font-display text-2xl italic leading-relaxed text-dark-brown sm:text-3xl">
        {wedding.welcome_text}
      </p>
    </Section>
  );
}
