import { Section } from '@/components/ui/Section';
import { Divider } from '@/components/ui/Divider';
import type { Wedding } from '@/types/wedding';

interface Item {
  label: string;
  time: string;
}

/** Order of the day — only renders the moments that have a time set. */
export function Events({ wedding }: { wedding: Wedding }) {
  const items: Item[] = [];
  if (wedding.ceremony_time) items.push({ label: 'Ceremony', time: wedding.ceremony_time });
  if (wedding.reception_time) items.push({ label: 'Reception', time: wedding.reception_time });

  if (items.length === 0) return null;

  return (
    <Section className="mx-auto max-w-lg text-center">
      <Divider label="Order Of The Day" />

      <div className="mt-12 space-y-8">
        {items.map((item) => (
          <div key={item.label} className="flex items-center justify-center gap-6">
            <span className="font-display text-2xl italic text-dark-brown">{item.time}</span>
            <span className="h-px w-8 bg-taupe/40" aria-hidden="true" />
            <span className="text-xs uppercase tracking-widest2 text-taupe">{item.label}</span>
          </div>
        ))}
      </div>
    </Section>
  );
}
