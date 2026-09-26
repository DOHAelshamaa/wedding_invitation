import { useState } from 'react';
import { motion } from 'framer-motion';
import { Section } from '@/components/ui/Section';
import { Divider } from '@/components/ui/Divider';
import { Button } from '@/components/ui/Button';
import { useWishes } from '@/hooks/useWishes';

export function Wishes({ weddingId }: { weddingId: string }) {
  const { wishes, submitting, submitError, submitSuccess, submitWish, resetSubmitState } =
    useWishes(weddingId);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitWish(name, message);
  };

  const handleReset = () => {
    setName('');
    setMessage('');
    resetSubmitState();
  };

  return (
    <Section background="cream" className="max-w-2xl">
      <div className="text-center">
        <Divider label="Wishes For Us" />
      </div>

      {submitSuccess ? (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto mt-10 max-w-sm text-center"
        >
          <p className="font-display text-xl italic text-dark-brown">
            Thank you for your kind words.
          </p>
          <p className="mt-2 text-sm text-brown">
            Your message will appear here once it's been reviewed.
          </p>
          <button
            type="button"
            onClick={handleReset}
            className="mt-6 text-xs uppercase tracking-widest2 text-taupe underline underline-offset-4"
          >
            Send another wish
          </button>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="mx-auto mt-10 max-w-sm space-y-5">
          <div>
            <label htmlFor="guest-name" className="block text-xs uppercase tracking-widest2 text-taupe">
              Your Name
            </label>
            <input
              id="guest-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={80}
              required
              className="mt-2 w-full border-0 border-b border-taupe/50 bg-transparent py-2 text-dark-brown placeholder:text-taupe/60 focus:border-clay focus:outline-none"
              placeholder="Ahmed"
            />
          </div>
          <div>
            <label htmlFor="guest-message" className="block text-xs uppercase tracking-widest2 text-taupe">
              Your Message
            </label>
            <textarea
              id="guest-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={500}
              required
              rows={4}
              className="mt-2 w-full resize-none border border-taupe/40 bg-white/60 px-3 py-2 text-dark-brown placeholder:text-taupe/60 focus:border-clay focus:outline-none"
              placeholder="Congratulations to both of you…"
            />
          </div>

          {submitError && (
            <p role="alert" className="text-sm text-red-800">
              {submitError}
            </p>
          )}

          <div className="text-center">
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Sending…' : 'Send Wish'}
            </Button>
          </div>
        </form>
      )}

      {wishes.length > 0 && (
        <div className="mx-auto mt-16 grid max-w-3xl gap-6 sm:grid-cols-2">
          {wishes.map((wish, i) => (
            <motion.blockquote
              key={wish.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: (i % 4) * 0.06 }}
              className="border border-taupe/25 bg-white/60 p-6 text-left shadow-soft"
            >
              <p className="font-display text-lg italic leading-relaxed text-dark-brown">
                "{wish.message}"
              </p>
              <footer className="mt-4 text-xs uppercase tracking-widest2 text-taupe">
                — {wish.guest_name}
              </footer>
            </motion.blockquote>
          ))}
        </div>
      )}
    </Section>
  );
}
