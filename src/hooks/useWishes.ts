import { useCallback, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { Wish } from '@/types/wish';

interface UseWishesResult {
  wishes: Wish[];
  loading: boolean;
  submitting: boolean;
  submitError: string | null;
  submitSuccess: boolean;
  submitWish: (guestName: string, message: string) => Promise<void>;
  resetSubmitState: () => void;
}

export function useWishes(weddingId: string | undefined): UseWishesResult {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Initial load of approved wishes.
  useEffect(() => {
    if (!weddingId) return;
    let cancelled = false;

    async function loadWishes() {
      setLoading(true);
      if (!isSupabaseConfigured) {
        if (!cancelled) {
          setWishes([]);
          setLoading(false);
        }
        return;
      }
      const { data, error } = await supabase
        .from('wishes')
        .select('*')
        .eq('wedding_id', weddingId)
        .eq('approved', true)
        .order('created_at', { ascending: false });

      if (!cancelled) {
        if (!error && data) setWishes(data as Wish[]);
        setLoading(false);
      }
    }

    loadWishes();
    return () => {
      cancelled = true;
    };
  }, [weddingId]);

  // Realtime: pick up newly-approved wishes without a full reload.
  useEffect(() => {
    if (!weddingId || !isSupabaseConfigured) return;

    const channel = supabase
      .channel(`wishes-${weddingId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'wishes',
          filter: `wedding_id=eq.${weddingId}`,
        },
        (payload) => {
          const row = payload.new as Wish | undefined;
          const oldRow = payload.old as Wish | undefined;

          setWishes((current) => {
            if (payload.eventType === 'DELETE' && oldRow) {
              return current.filter((w) => w.id !== oldRow.id);
            }
            if (!row) return current;
            if (!row.approved) {
              // Not approved (or was un-approved) — make sure it's not shown.
              return current.filter((w) => w.id !== row.id);
            }
            const exists = current.some((w) => w.id === row.id);
            if (exists) {
              return current.map((w) => (w.id === row.id ? row : w));
            }
            return [row, ...current];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [weddingId]);

  const submitWish = useCallback(
    async (guestName: string, message: string) => {
      setSubmitError(null);
      setSubmitSuccess(false);

      const trimmedName = guestName.trim();
      const trimmedMessage = message.trim();

      if (!trimmedName || !trimmedMessage) {
        setSubmitError('Please share your name and a short message.');
        return;
      }
      if (!weddingId) {
        setSubmitError('This invitation is not ready to receive wishes yet.');
        return;
      }

      setSubmitting(true);
      try {
        if (!isSupabaseConfigured) {
          // Local demo mode — simulate success without a backend.
          await new Promise((resolve) => setTimeout(resolve, 500));
          setSubmitSuccess(true);
          return;
        }

        const { error } = await supabase.from('wishes').insert({
          wedding_id: weddingId,
          guest_name: trimmedName,
          message: trimmedMessage,
          approved: false,
        });

        if (error) throw error;
        setSubmitSuccess(true);
      } catch (err) {
        console.error('Failed to submit wish', err);
        setSubmitError('Something went wrong sending your wish. Please try again.');
      } finally {
        setSubmitting(false);
      }
    },
    [weddingId]
  );

  const resetSubmitState = useCallback(() => {
    setSubmitSuccess(false);
    setSubmitError(null);
  }, []);

  return { wishes, loading, submitting, submitError, submitSuccess, submitWish, resetSubmitState };
}
