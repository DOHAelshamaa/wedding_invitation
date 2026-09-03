import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';

export function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isSupabaseConfigured) {
      setError('Connect Supabase (see .env.example) before signing in.');
      return;
    }

    setLoading(true);
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (signInError) {
      setError('Incorrect email or password.');
      return;
    }
    navigate('/admin');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm border border-taupe/30 bg-white/70 p-10 shadow-card"
      >
        <h1 className="text-center font-display text-2xl italic text-dark-brown">Admin Sign In</h1>

        <div className="mt-8 space-y-5">
          <div>
            <label htmlFor="email" className="block text-xs uppercase tracking-widest2 text-taupe">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full border-0 border-b border-taupe/50 bg-transparent py-2 text-dark-brown focus:border-clay focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-xs uppercase tracking-widest2 text-taupe">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full border-0 border-b border-taupe/50 bg-transparent py-2 text-dark-brown focus:border-clay focus:outline-none"
            />
          </div>
        </div>

        {error && (
          <p role="alert" className="mt-4 text-sm text-red-800">
            {error}
          </p>
        )}

        <Button type="submit" disabled={loading} className="mt-8 w-full">
          {loading ? 'Signing In…' : 'Sign In'}
        </Button>
      </form>
    </div>
  );
}
