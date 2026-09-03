import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import type { Wedding } from '@/types/wedding';
import type { Wish } from '@/types/wish';

const FIELDS: Array<{ key: keyof Wedding; label: string; type?: 'text' | 'textarea' | 'date' }> = [
  { key: 'groom_name', label: 'Groom Display Name' },
  { key: 'bride_name', label: 'Bride Display Name' },
  { key: 'wedding_date', label: 'Wedding Date', type: 'date' },
  { key: 'wedding_day', label: 'Day' },
  { key: 'ceremony_time', label: 'Ceremony Time' },
  { key: 'reception_time', label: 'Reception Time' },
  { key: 'venue', label: 'Venue' },
  { key: 'address', label: 'Address', type: 'textarea' },
  { key: 'maps_url', label: 'Google Maps URL' },
  { key: 'music_start_offset', label: 'Music Start Offset (seconds)' },
  { key: 'dress_code', label: 'Dress Code' },
  { key: 'dress_code_description', label: 'Dress Code Description', type: 'textarea' },
  { key: 'welcome_text', label: 'Welcome Text', type: 'textarea' },
  { key: 'story', label: 'Story Summary', type: 'textarea' },
];

export function AdminDashboard() {
  const { weddingId } = useParams<{ weddingId?: string }>();
  const navigate = useNavigate();
  const [wedding, setWedding] = useState<Wedding | null>(null);
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    async function checkAuthAndLoad() {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) {
        navigate('/admin/login');
        return;
      }

      let query = supabase.from('weddings').select('*');
      query = weddingId ? query.eq('id', weddingId) : query.order('created_at', { ascending: false }).limit(1);
      const { data: weddings } = await query;
      const current = weddings?.[0] as Wedding | undefined;
      if (current) {
        setWedding(current);
        const { data: wishData } = await supabase
          .from('wishes')
          .select('*')
          .eq('wedding_id', current.id)
          .order('created_at', { ascending: false });
        setWishes((wishData as Wish[]) ?? []);
      }
      setLoading(false);
    }

    checkAuthAndLoad();
  }, [weddingId, navigate]);

  const updateField = (key: keyof Wedding, value: string) => {
    if (!wedding) return;
    setWedding({ ...wedding, [key]: value });
    setSaved(false);
  };

  const handleSave = async () => {
    if (!wedding || !isSupabaseConfigured) return;
    setSaving(true);
    const { id, ...updates } = wedding;
    const { error } = await supabase.from('weddings').update(updates).eq('id', id);
    setSaving(false);
    if (!error) setSaved(true);
  };

  const approveWish = async (id: string) => {
    await supabase.from('wishes').update({ approved: true }).eq('id', id);
    setWishes((current) => current.map((w) => (w.id === id ? { ...w, approved: true } : w)));
  };

  const deleteWish = async (id: string) => {
    await supabase.from('wishes').delete().eq('id', id);
    setWishes((current) => current.filter((w) => w.id !== id));
  };

  if (!isSupabaseConfigured) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream px-6 text-center text-brown">
        <p className="max-w-sm text-sm">
          Connect Supabase (see .env.example and the README) to use the admin dashboard.
        </p>
      </div>
    );
  }

  if (loading) return <div className="min-h-screen bg-cream" />;
  if (!wedding) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream text-brown">
        No wedding found for this account yet.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-parchment px-6 py-14">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-3xl italic text-dark-brown">Admin Dashboard</h1>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? 'Saving…' : saved ? 'Saved' : 'Save Changes'}
          </Button>
        </div>

        <section className="mt-10 grid gap-6 border border-taupe/25 bg-white/70 p-8 sm:grid-cols-2">
          {FIELDS.map((field) => (
            <div key={String(field.key)} className={field.type === 'textarea' ? 'sm:col-span-2' : ''}>
              <label className="block text-xs uppercase tracking-widest2 text-taupe">
                {field.label}
              </label>
              {field.type === 'textarea' ? (
                <textarea
                  value={(wedding[field.key] as string) ?? ''}
                  onChange={(e) => updateField(field.key, e.target.value)}
                  rows={3}
                  className="mt-2 w-full border border-taupe/40 bg-white px-3 py-2 text-sm text-dark-brown focus:border-clay focus:outline-none"
                />
              ) : (
                <input
                  type={field.type === 'date' ? 'date' : 'text'}
                  value={(wedding[field.key] as string) ?? ''}
                  onChange={(e) => updateField(field.key, e.target.value)}
                  className="mt-2 w-full border-0 border-b border-taupe/50 bg-transparent py-2 text-sm text-dark-brown focus:border-clay focus:outline-none"
                />
              )}
            </div>
          ))}
        </section>

        <section className="mt-12">
          <h2 className="font-display text-2xl italic text-dark-brown">Wishes</h2>
          <div className="mt-6 space-y-4">
            {wishes.length === 0 && <p className="text-sm text-brown">No wishes submitted yet.</p>}
            {wishes.map((wish) => (
              <div
                key={wish.id}
                className="flex flex-col justify-between gap-3 border border-taupe/25 bg-white/70 p-5 sm:flex-row sm:items-center"
              >
                <div>
                  <p className="text-sm text-dark-brown">{wish.message}</p>
                  <p className="mt-1 text-xs uppercase tracking-widest2 text-taupe">
                    — {wish.guest_name} · {wish.approved ? 'Approved' : 'Pending'}
                  </p>
                </div>
                <div className="flex gap-3">
                  {!wish.approved && (
                    <button
                      onClick={() => approveWish(wish.id)}
                      className="text-xs uppercase tracking-widest2 text-clay underline underline-offset-4"
                    >
                      Approve
                    </button>
                  )}
                  <button
                    onClick={() => deleteWish(wish.id)}
                    className="text-xs uppercase tracking-widest2 text-red-800 underline underline-offset-4"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <p className="mt-10 max-w-lg text-xs text-taupe">
          Note: cover image and gallery uploads use Supabase Storage — see the README section
          "How to upload images" for the recommended upload flow using the Storage dashboard or
          the supabase-js `storage.upload()` API from a future gallery-manager panel.
        </p>
      </div>
    </div>
  );
}
