import type { Wedding, GalleryImage, StoryEvent } from '@/types/wedding';

/**
 * This is local fallback/seed data, used only when Supabase is not
 * configured (see src/lib/supabase.ts). In production, all of this
 * lives in the `weddings` table and is fetched by slug.
 */

const storyEvents: StoryEvent[] = [
  {
    key: 'met',
    label: 'How We Met',
    description: 'From a circle of friends to a love story.',
  },
  {
    key: 'proposal',
    label: 'The Proposal',
    description: 'He hopefully asked, and she proudly said yes.',
  },
  {
    key: 'engagement',
    label: 'Engagement',
    date: '2026-09-30',
    description: 'The day we promised each other forever.',
  },
];

export const fallbackWedding: Wedding = {
  id: 'local-seed',
  slug: 'mostafa-shorouk',
  groom_name: 'Mostafa',
  groom_full_name: 'Mostafa Diab',
  bride_name: 'Shorouk',
  bride_full_name: 'Shorouk Elshamaa',
  wedding_date: '2026-09-30',
  wedding_day: 'Wednesday',
  welcome_text:
    'Together with their families, Mostafa and Shorouk joyfully invite you to celebrate the beginning of their story.',
  story: 'From a circle of friends to a love story.',
  story_hook: [
    'From a circle of friends, a spark neither of us expected.',
    'He hopefully asked — she proudly said yes.',
  ],
  story_events: storyEvents,
  cover_image: '/images/couple-color.png',
  venue: 'Engagement — Commercial Professionals Club',
  address: '6XR4+45C, Fleming, Al-Raml 1st District, Alexandria Governorate 5452042, Egypt',
  maps_url:
    'https://www.google.com/maps?um=1&ie=UTF-8&fb=1&gl=eg&sa=X&geocode=KTtCcMAgxfUUMfg-1nbb4Nf8&daddr=6XR4%2B45C,+Fleming,+El+Raml+1,+Alexandria+Governorate+5452042',
  ceremony_time: '8:11 PM',
  reception_time: undefined,
  dress_code: 'Elegant Formal',
  dress_code_description:
    'We would love to see you in warm, earthy tones that match the spirit of the evening.',
  dress_code_palette: ['#75665C', '#C5A77A', '#E8D7C4', '#4A3F37'],
  music_url: '/music/wedding-song.mp3',
  // TODO: set this to the exact second where "I found a love for me" begins
  // in your file. I can't listen to audio, so I've left this at 0 — open
  // public/music/wedding-song.mp3 locally, find the timestamp, and update
  // this number (or set it from the admin dashboard once Supabase is wired up).
  music_start_offset: 0,
  groom_message: "I'm waiting for you all.",
  bride_message: "You're all more than welcome.",
  hashtag: '#MostafaAndShorouk',
};

export const fallbackGallery: GalleryImage[] = [
  {
    id: 'g1',
    wedding_id: 'local-seed',
    image_url: '/images/couple-color.png',
    alt_text: 'Mostafa and Shorouk',
    sort_order: 1,
    orientation: 'portrait',
  },
  {
    id: 'g2',
    wedding_id: 'local-seed',
    image_url: '/images/couple-lineart.png',
    alt_text: 'Mostafa and Shorouk, illustrated',
    sort_order: 2,
    orientation: 'portrait',
  },
];
