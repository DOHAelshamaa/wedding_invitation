import { Heart } from 'lucide-react';
import type { Wedding } from '@/types/wedding';

export function Footer({ wedding }: { wedding: Wedding }) {
  return (
    <footer className="relative overflow-hidden bg-dark-brown px-6 py-24 text-center text-cream sm:py-32">
      <Heart size={20} className="mx-auto mb-6 text-gold" strokeWidth={1.25} />

      <p className="font-display text-3xl italic">
        {wedding.groom_name} &amp; {wedding.bride_name}
      </p>

      {(wedding.groom_message || wedding.bride_message) && (
        <div className="mx-auto mt-8 max-w-md space-y-3 text-sm leading-relaxed text-cream/80">
          {wedding.groom_message && <p>{wedding.groom_message}</p>}
          {wedding.bride_message && <p>{wedding.bride_message}</p>}
        </div>
      )}

      {wedding.hashtag && (
        <p className="mt-8 text-xs uppercase tracking-widest2 text-gold">{wedding.hashtag}</p>
      )}

      <div className="mx-auto my-8 h-px w-14 bg-cream/20" />

      <p className="text-xs text-cream/50">
        With love, see you on{' '}
        {new Date(wedding.wedding_date + 'T00:00:00').toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        })}
      </p>
    </footer>
  );
}
