import { MapPin } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { Divider } from '@/components/ui/Divider';
import { Button } from '@/components/ui/Button';
import type { Wedding } from '@/types/wedding';

export function WeddingDetails({ wedding }: { wedding: Wedding }) {
  const date = new Date(wedding.wedding_date + 'T00:00:00');
  const day = date.getDate();
  const month = date.toLocaleDateString('en-US', { month: 'long' });
  const year = date.getFullYear();

  return (
    <Section background="parchment" className="max-w-xl text-center">
      <Divider label="Save The Date" />

      <div className="mt-10 flex items-center justify-center gap-6 sm:gap-10">
        <span className="font-display text-6xl italic text-dark-brown sm:text-7xl">{day}</span>
        <div className="h-14 w-px bg-taupe/40" />
        <div className="text-left">
          <p className="font-display text-2xl text-dark-brown">{month}</p>
          <p className="text-sm tracking-widest2 text-taupe">{year}</p>
        </div>
      </div>

      <p className="mt-4 text-sm tracking-widest2 text-brown">{wedding.wedding_day}</p>

      {wedding.ceremony_time && (
        <p className="mt-8 font-display text-lg italic text-dark-brown">
          Ceremony begins at {wedding.ceremony_time}
        </p>
      )}
      {wedding.reception_time && (
        <p className="mt-2 font-display text-lg italic text-dark-brown">
          Reception follows at {wedding.reception_time}
        </p>
      )}

      <div className="mx-auto my-10 h-px w-14 bg-taupe/50" />

      <p className="font-display text-xl text-dark-brown">{wedding.venue}</p>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-brown">{wedding.address}</p>

      {wedding.maps_url && (
        <a href={wedding.maps_url} target="_blank" rel="noreferrer" className="mt-8 inline-block">
          <Button variant="outline">
            <MapPin size={16} /> View on Map
          </Button>
        </a>
      )}
    </Section>
  );
}
