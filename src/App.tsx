import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MusicProvider } from '@/context/MusicContext';
import { Home } from '@/pages/Home';
import { WeddingPage } from '@/pages/WeddingPage';
import { NotFound } from '@/pages/NotFound';
import { AdminLogin } from '@/pages/admin/AdminLogin';
import { AdminDashboard } from '@/pages/admin/AdminDashboard';

export default function App() {
  return (
    <MusicProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/w/:slug" element={<WeddingPage />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/:weddingId" element={<AdminDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </MusicProvider>
  );
}
