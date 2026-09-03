# Wedding Invitation Platform

A reusable, multi-tenant digital wedding invitation site. One React app, many
weddings — each lives at `/w/:slug` and is loaded entirely from Supabase.

Built for the couple **Mostafa & Shorouk** (see seed data), but not hardcoded
to them: add a new row to the `weddings` table and a new invitation exists at
its own URL, sharing the same design system.

---

## 1. Tech stack

- React 18 + Vite + TypeScript
- Tailwind CSS (design tokens in `tailwind.config.js`)
- React Router (`/`, `/w/:slug`, `/admin`, `/admin/:weddingId`)
- Framer Motion (opening transition, section reveals, gallery lightbox)
- Supabase (Postgres, Auth, Storage, Realtime)
- lucide-react icons

---

## 2. Project structure

```
src/
  components/
    invitation/   Cover, Welcome, Story, WeddingDetails, Events,
                   Gallery, DressCode, Reception, Wishes, Footer
    ui/            Button, Divider, Botanical, MusicPlayer,
                   LoadingScreen, Section
  context/
    MusicContext.tsx   single persistent <audio>, survives re-renders
  hooks/
    useWedding.ts       fetch a wedding + gallery by slug
    useWishes.ts        submit + realtime approved wishes
  lib/
    supabase.ts         Supabase client (public key only)
  data/
    fallbackWedding.ts  local seed data used before Supabase is connected
  pages/
    Home.tsx, WeddingPage.tsx, NotFound.tsx
    admin/AdminLogin.tsx, admin/AdminDashboard.tsx
  types/
    wedding.ts, wish.ts
supabase/
  schema.sql            tables, RLS policies, realtime, seed row
public/
  music/wedding-song.mp3      your uploaded track
  images/cover-illustration.png
```

---

## 3. Install & run locally

```bash
npm install
cp .env.example .env       # fill in your Supabase values (step 4)
npm run dev
```

Without a `.env`, the app runs in **local seed mode**: it renders the
Mostafa & Shorouk invitation from `src/data/fallbackWedding.ts` at
`/w/mostafa-shorouk`, using the mp3/image you uploaded, so you can preview
the design immediately. The Wishes form will simulate success but won't
persist anything until Supabase is connected.

---

## 4. Configure Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. In **SQL Editor**, run the contents of `supabase/schema.sql`. This creates:
   - `weddings`, `gallery_images`, `wishes`
   - Row Level Security policies (public read; only the wedding's
     authenticated owner can write; guests can only insert unapproved wishes)
   - Realtime on `wishes`
   - A seed row for `mostafa-shorouk`
3. In **Settings → API**, copy the Project URL and the `anon` (publishable)
   key into `.env`:
   ```
   VITE_SUPABASE_URL=https://xxxx.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOi...
   ```
   Never put the `service_role` key in this file or anywhere in the frontend.
4. In **Authentication → Users**, create an admin user (email/password), then
   run in SQL Editor:
   ```sql
   update public.weddings
   set owner_id = '<the new user's UUID>'
   where slug = 'mostafa-shorouk';
   ```
   This is what lets that user edit the wedding and approve/delete wishes
   from `/admin`.

---

## 5. Add a wedding

Insert a new row into `weddings` (or duplicate the seed insert in
`schema.sql`) with a unique `slug`. It's immediately live at `/w/<slug>`.

---

## 6. Upload images

Create a public Storage bucket, e.g. `wedding-images`, structured as:

```
wedding-images/
  {wedding_id}/
    cover.webp
    photo-01.webp
    photo-02.webp
```

Upload via the Supabase Storage dashboard, or from the admin app using
`supabase.storage.from('wedding-images').upload(path, file)`. Then:

- Set `weddings.cover_image` to the returned public URL for the hero photo.
- Insert a row per photo into `gallery_images` (`wedding_id`, `image_url`,
  `alt_text`, `sort_order`, `orientation`).

The current admin dashboard covers text fields and wish moderation; a
gallery-upload panel is the natural next addition using the same
`supabase.storage` call above.

---

## 7. Add the music

The provided track is already at `public/music/wedding-song.mp3` and the
seed row points `music_url` at `/music/wedding-song.mp3`.

**About the requested start point** ("I found a love for me"): I can't
listen to or transcribe audio, so I couldn't locate that exact timestamp in
your 15-minute file myself. Instead, the start point is a configurable field:

- `weddings.music_start_offset` — an integer number of seconds.
- Open `public/music/wedding-song.mp3`, find the timestamp where the line
  begins, and set that column (via SQL, or the "Music Start Offset" field in
  `/admin`).
- The player calls `audio.currentTime = music_start_offset` right after the
  first play, so playback always begins exactly there — and never re-seeks
  on pause/resume.

For a different wedding, replace the file at that same path (or upload to
Supabase Storage and point `music_url` at the resulting URL) and set its own
`music_start_offset`.

---

## 8. How the music behaves

- Nothing plays until the guest taps **OPEN** (a real user gesture — this
  avoids browsers blocking autoplay-with-sound).
- A single `Audio` object lives in `MusicContext` for the whole app session:
  it is created once and its `src` is only ever set on first load, so
  scrolling, section transitions, and React re-renders never restart it.
- The fixed control (bottom-right) toggles play/pause and reflects the
  current state.

---

## 9. Deploy

Any static host works (Vercel, Netlify, Cloudflare Pages):

```bash
npm run build
```

Deploy the `dist/` folder, and set `VITE_SUPABASE_URL` /
`VITE_SUPABASE_PUBLISHABLE_KEY` as environment variables in your host's
dashboard (not committed to git — `.env` is git-ignored).

---

## 10. Security notes

- Only the Supabase `anon` key is ever used in the frontend.
- RLS enforces: guests can read public wedding/gallery data and approved
  wishes, and can insert new wishes (always `approved = false`); only the
  authenticated wedding owner can update wedding fields, manage gallery rows,
  or approve/delete wishes.
- New wishes never appear publicly until approved from `/admin`.
