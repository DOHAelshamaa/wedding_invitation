import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-cream px-6 text-center">
      <Heart size={22} className="mb-6 text-clay" strokeWidth={1.25} />
      <h1 className="font-display text-3xl italic text-dark-brown">Invitation Not Found</h1>
      <p className="mt-4 max-w-sm text-sm leading-relaxed text-brown">
        We couldn't find the invitation you're looking for. Please double-check the link you were
        given, or contact the couple directly.
      </p>
      <Link
        to="/"
        className="mt-8 text-xs uppercase tracking-widest2 text-taupe underline underline-offset-4"
      >
        Back Home
      </Link>
    </div>
  );
}
