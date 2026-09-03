import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;

/**
 * `isSupabaseConfigured` lets the app fall back to local seed data
 * (see src/data/fallbackWedding.ts) when no Supabase project has been
 * connected yet, so the invitation still renders during local design work.
 */
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey);

// Only the public/publishable key is ever used on the frontend.
// Never import or reference a service-role key here.
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl as string, supabaseKey as string)
  : (null as unknown as ReturnType<typeof createClient>);
