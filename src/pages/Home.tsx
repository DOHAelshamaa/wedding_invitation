import { Heart } from 'lucide-react';
import { fallbackWedding } from '@/data/fallbackWedding';

/**
 * Root landing page. In production you might replace this with a marketing
 * page for the invitation platform itself. For now it points to the demo
 * wedding created from the provided data.
 */
export function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-cream px-6 text-center">
      <Heart size={22} className="mb-6 text-clay" strokeWidth={1.25} />
      <h1 className="font-display text-3xl italic text-dark-brown">Wedding Invitations</h1>
      <p className="mt-4 max-w-sm text-sm leading-relaxed text-brown">
        Every invitation lives at its own link, for example:
      </p>
      <a
        href={`/w/${fallbackWedding.slug}`}
        className="mt-6 text-sm uppercase tracking-widest2 text-taupe underline underline-offset-4"
      >
        /w/{fallbackWedding.slug}
      </a>
    </div>
  );
}
