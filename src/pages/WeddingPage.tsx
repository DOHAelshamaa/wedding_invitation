import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useWedding } from '@/hooks/useWedding';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { MusicPlayer } from '@/components/ui/MusicPlayer';
import { Cover } from '@/components/invitation/Cover';
import { Welcome } from '@/components/invitation/Welcome';
import { WeddingDetails } from '@/components/invitation/WeddingDetails';
import { Story } from '@/components/invitation/Story';
import { Countdown } from '@/components/invitation/Countdown';
import { Wishes } from '@/components/invitation/Wishes';
import { Footer } from '@/components/invitation/Footer';
import { NotFound } from '@/pages/NotFound';

export function WeddingPage() {
  const { slug } = useParams<{ slug: string }>();
  const { wedding, gallery, loading, error, notFound } = useWedding(slug);
  const [isOpened, setIsOpened] = useState(false);

  if (loading) return <LoadingScreen />;
  if (notFound || !wedding) return <NotFound />;
  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-cream px-6 text-center text-brown">
        <p className="font-display text-2xl italic">Something went wrong</p>
        <p className="mt-3 max-w-sm text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      {!isOpened && <Cover wedding={wedding} onOpen={() => setIsOpened(true)} />}

      {isOpened && (
        <main>
          <Welcome wedding={wedding} />
          <WeddingDetails wedding={wedding} />
          <Story wedding={wedding} />
          <Countdown wedding={wedding} />
          <Wishes weddingId={wedding.id} />
          <Footer wedding={wedding} />
        </main>
      )}

      <MusicPlayer />
    </div>
  );
}
