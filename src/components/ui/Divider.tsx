export function Divider({ label }: { label?: string }) {
  if (!label) {
    return <div className="mx-auto h-px w-16 bg-taupe/60" aria-hidden="true" />;
  }
  return (
    <div className="section-divider text-xs tracking-widest2 text-taupe" role="presentation">
      <span>{label}</span>
    </div>
  );
}
