export function LoadingScreen() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-cream text-brown">
      <div
        className="h-10 w-10 animate-spin rounded-full border border-taupe border-t-dark-brown"
        role="status"
        aria-label="Loading invitation"
      />
      <p className="mt-6 font-display text-lg italic tracking-wide">Preparing your invitation…</p>
    </div>
  );
}
