export interface StoryEvent {
  key: 'met' | 'first_date' | 'relationship' | 'engagement' | 'proposal' | 'wedding';
  label: string;
  date?: string;
  description?: string;
}

export interface Wedding {
  id: string;
  slug: string;
  bride_name: string;
  bride_full_name?: string;
  groom_name: string;
  groom_full_name?: string;
  wedding_date: string; // ISO date
  wedding_day: string;
  welcome_text?: string;
  story?: string;
  /** Two short lines used by the "hook" treatment in the Story section. */
  story_hook?: [string, string];
  story_events?: StoryEvent[];
  cover_image?: string;
  venue: string;
  address: string;
  maps_url?: string;
  ceremony_time?: string;
  reception_time?: string;
  dress_code?: string;
  dress_code_description?: string;
  dress_code_palette?: string[];
  music_url?: string;
  /** Seconds into `music_url` where playback should begin (e.g. the first lyric). */
  music_start_offset?: number;
  groom_message?: string;
  bride_message?: string;
  hashtag?: string;
  created_at?: string;
}

export interface GalleryImage {
  id: string;
  wedding_id: string;
  image_url: string;
  alt_text?: string;
  sort_order: number;
  orientation?: 'portrait' | 'landscape' | 'square';
}
