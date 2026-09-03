-- ============================================================
-- Wedding Invitation Platform — Supabase schema
-- Run this in the Supabase SQL editor (or via `supabase db push`).
-- ============================================================

create extension if not exists "uuid-ossp";

-- ------------------------------------------------------------
-- weddings
-- ------------------------------------------------------------
create table if not exists public.weddings (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  bride_name text not null,
  bride_full_name text,
  groom_name text not null,
  groom_full_name text,
  wedding_date date not null,
  wedding_day text not null,
  welcome_text text,
  story text,
  story_events jsonb default '[]'::jsonb,
  cover_image text,
  venue text not null,
  address text not null,
  maps_url text,
  ceremony_time text,
  reception_time text,
  dress_code text,
  dress_code_description text,
  dress_code_palette jsonb default '[]'::jsonb,
  music_url text,
  music_start_offset integer default 0,
  groom_message text,
  bride_message text,
  hashtag text,
  owner_id uuid references auth.users(id),
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- gallery_images
-- ------------------------------------------------------------
create table if not exists public.gallery_images (
  id uuid primary key default uuid_generate_v4(),
  wedding_id uuid not null references public.weddings(id) on delete cascade,
  image_url text not null,
  alt_text text,
  sort_order integer not null default 0,
  orientation text default 'portrait' check (orientation in ('portrait', 'landscape', 'square')),
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- wishes
-- ------------------------------------------------------------
create table if not exists public.wishes (
  id uuid primary key default uuid_generate_v4(),
  wedding_id uuid not null references public.weddings(id) on delete cascade,
  guest_name text not null check (char_length(trim(guest_name)) > 0),
  message text not null check (char_length(trim(message)) > 0),
  approved boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists idx_wishes_wedding_id on public.wishes(wedding_id);
create index if not exists idx_gallery_wedding_id on public.gallery_images(wedding_id);

-- ------------------------------------------------------------
-- Row Level Security
-- ------------------------------------------------------------
alter table public.weddings enable row level security;
alter table public.gallery_images enable row level security;
alter table public.wishes enable row level security;

-- weddings: anyone can read; only the authenticated owner can write.
create policy "Public can read weddings"
  on public.weddings for select
  using (true);

create policy "Owner can update their wedding"
  on public.weddings for update
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

create policy "Owner can insert their wedding"
  on public.weddings for insert
  with check (auth.uid() = owner_id);

-- gallery_images: anyone can read; only the wedding's owner can manage.
create policy "Public can read gallery images"
  on public.gallery_images for select
  using (true);

create policy "Owner can manage gallery images"
  on public.gallery_images for all
  using (
    exists (
      select 1 from public.weddings w
      where w.id = gallery_images.wedding_id and w.owner_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.weddings w
      where w.id = gallery_images.wedding_id and w.owner_id = auth.uid()
    )
  );

-- wishes: public can read only approved wishes, and can insert new
-- (unapproved) wishes. Only the wedding owner can approve/delete.
create policy "Public can read approved wishes"
  on public.wishes for select
  using (approved = true);

create policy "Owner can read all wishes for their wedding"
  on public.wishes for select
  using (
    exists (
      select 1 from public.weddings w
      where w.id = wishes.wedding_id and w.owner_id = auth.uid()
    )
  );

create policy "Public can submit a wish"
  on public.wishes for insert
  with check (approved = false);

create policy "Owner can update wishes for their wedding"
  on public.wishes for update
  using (
    exists (
      select 1 from public.weddings w
      where w.id = wishes.wedding_id and w.owner_id = auth.uid()
    )
  );

create policy "Owner can delete wishes for their wedding"
  on public.wishes for delete
  using (
    exists (
      select 1 from public.weddings w
      where w.id = wishes.wedding_id and w.owner_id = auth.uid()
    )
  );

-- ------------------------------------------------------------
-- Realtime
-- ------------------------------------------------------------
alter publication supabase_realtime add table public.wishes;

-- ------------------------------------------------------------
-- Seed: Mostafa & Shorouk (from the provided invitation details)
-- Replace owner_id with the admin auth.users.id after creating that user.
-- ------------------------------------------------------------
insert into public.weddings (
  slug, bride_name, bride_full_name, groom_name, groom_full_name,
  wedding_date, wedding_day, welcome_text, story, story_events,
  cover_image, venue, address, maps_url, ceremony_time,
  dress_code, dress_code_description, dress_code_palette,
  music_url, music_start_offset, groom_message, bride_message, hashtag
) values (
  'mostafa-shorouk', 'Shorouk', 'Shorouk Elshamaa', 'Mostafa', 'Mostafa Diab',
  '2026-09-30', 'Wednesday',
  'Together with their families, Mostafa and Shorouk joyfully invite you to celebrate the beginning of their story.',
  'From a circle of friends to a love story.',
  '[
    {"key":"met","label":"How We Met","description":"From a circle of friends to a love story."},
    {"key":"proposal","label":"The Proposal","description":"He hopefully asked, and she proudly said yes."},
    {"key":"engagement","label":"Engagement","date":"2026-09-30","description":"The day we promised each other forever."}
  ]'::jsonb,
  '/images/cover-illustration.png',
  'Engagement — Commercial Professionals Club',
  '6XR4+45C, Fleming, Al-Raml 1st District, Alexandria Governorate 5452042, Egypt',
  'https://www.google.com/maps?um=1&ie=UTF-8&fb=1&gl=eg&sa=X&geocode=KTtCcMAgxfUUMfg-1nbb4Nf8&daddr=6XR4%2B45C,+Fleming,+El+Raml+1,+Alexandria+Governorate+5452042',
  '8:11 PM',
  'Elegant Formal',
  'We would love to see you in warm, earthy tones that match the spirit of the evening.',
  '["#75665C", "#C5A77A", "#E8D7C4", "#4A3F37"]'::jsonb,
  '/music/wedding-song.mp3', 0, -- TODO: set the second where "I found a love for me" starts
  'I''m waiting for you all.',
  'You''re all more than welcome.',
  '#MostafaAndShorouk'
)
on conflict (slug) do nothing;
