import { useEffect, useState } from 'react';
import { Section } from '@/components/ui/Section';
import { Divider } from '@/components/ui/Divider';
import type { Wedding } from '@/types/wedding';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

/** Parses times like "8:11 PM" or "20:11" into 24h "HH:MM:00". Falls back to midnight. */
function to24Hour(time?: string): string {
  if (!time) return '00:00:00';
  const match = time.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
  if (!match) return '00:00:00';
  let hours = parseInt(match[1], 10);
  const minutes = match[2];
  const period = match[3]?.toUpperCase();
  if (period === 'PM' && hours !== 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;
  return `${String(hours).padStart(2, '0')}:${minutes}:00`;
}

function getTimeLeft(target: Date): TimeLeft {
  const diff = Math.max(0, target.getTime() - Date.now());
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export function Countdown({ wedding }: { wedding: Wedding }) {
  const target = new Date(`${wedding.wedding_date}T${to24Hour(wedding.ceremony_time)}`);
  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(target));

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(getTimeLeft(target)), 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wedding.wedding_date, wedding.ceremony_time]);

  const units: Array<{ label: string; value: number }> = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Minutes', value: timeLeft.minutes },
    { label: 'Seconds', value: timeLeft.seconds },
  ];

  return (
    <Section background="dark" className="max-w-2xl text-center">
      <Divider label="Counting Down" />

      <div className="mt-12 flex flex-wrap items-center justify-center gap-6 sm:gap-10">
        {units.map((unit) => (
          <div key={unit.label} className="w-20">
            <span className="block font-display text-5xl italic text-gold sm:text-6xl">
              {String(unit.value).padStart(2, '0')}
            </span>
            <span className="mt-2 block text-[11px] uppercase tracking-widest2 text-cream/60">
              {unit.label}
            </span>
          </div>
        ))}
      </div>

      <p className="mx-auto mt-14 max-w-md font-display text-xl italic leading-relaxed text-cream/90">
        {wedding.reception_time
          ? `Following the ceremony, we invite you to stay and celebrate with us at ${wedding.venue}.`
          : `We can't wait to celebrate this moment with you at ${wedding.venue}.`}
      </p>
    </Section>
  );
}
