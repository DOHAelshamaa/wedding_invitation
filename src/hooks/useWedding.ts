import { useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { fallbackWedding, fallbackGallery } from '@/data/fallbackWedding';
import type { Wedding, GalleryImage } from '@/types/wedding';

interface UseWeddingResult {
  wedding: Wedding | null;
  gallery: GalleryImage[];
  loading: boolean;
  error: string | null;
  notFound: boolean;
}

export function useWedding(slug: string | undefined): UseWeddingResult {
  const [wedding, setWedding] = useState<Wedding | null>(null);
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      setNotFound(false);

      // Local design/demo mode: no Supabase project connected yet.
      if (!isSupabaseConfigured) {
        if (!slug || slug === fallbackWedding.slug) {
          if (!cancelled) {
            setWedding(fallbackWedding);
            setGallery(fallbackGallery);
          }
        } else if (!cancelled) {
          setNotFound(true);
        }
        if (!cancelled) setLoading(false);
        return;
      }

      try {
        const { data: weddingData, error: weddingError } = await supabase
          .from('weddings')
          .select('*')
          .eq('slug', slug)
          .maybeSingle();

        if (weddingError) throw weddingError;
        if (!weddingData) {
          if (!cancelled) setNotFound(true);
          return;
        }

        const { data: galleryData, error: galleryError } = await supabase
          .from('gallery_images')
          .select('*')
          .eq('wedding_id', weddingData.id)
          .order('sort_order', { ascending: true });

        if (galleryError) throw galleryError;

        if (!cancelled) {
          setWedding(weddingData as Wedding);
          setGallery((galleryData as GalleryImage[]) ?? []);
        }
      } catch (err) {
        console.error('Failed to load wedding', err);
        if (!cancelled) setError('We could not load this invitation right now.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  return { wedding, gallery, loading, error, notFound };
}
