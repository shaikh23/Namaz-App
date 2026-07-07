import { useState, useEffect } from 'react';
import { PrayerCalculator } from '../services/prayerCalculator';
import type { PrayerTimes } from '../types/prayer';

interface NextPrayerProps {
  prayerTimes: PrayerTimes;
}

export function NextPrayer({ prayerTimes }: NextPrayerProps) {
  const [timeUntil, setTimeUntil] = useState<string>('');
  const [nextPrayer, setNextPrayer] = useState<{ name: string; time: Date } | null>(null);

  useEffect(() => {
    const updateCountdown = () => {
      const next = PrayerCalculator.getNextPrayer(prayerTimes);
      setNextPrayer(next);

      if (next) {
        setTimeUntil(PrayerCalculator.getTimeUntilPrayer(next.time));
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000);
    return () => clearInterval(interval);
  }, [prayerTimes]);

  if (!nextPrayer) {
    return null;
  }

  return (
    <div className="w-full max-w-md mx-auto mb-6">
      <div
        className="p-6 rounded-xl shadow-lg"
        style={{
          background: 'linear-gradient(135deg, var(--next-bg-from), var(--next-bg-to))',
          border: '1px solid var(--border-next)',
        }}
      >
        <div className="text-center">
          <p
            className="text-sm uppercase tracking-wide mb-1"
            style={{ color: 'var(--next-accent)', opacity: 0.85 }}
          >
            Next Prayer
          </p>
          <h2 className="text-3xl font-bold mb-2" style={{ color: 'var(--next-text)' }}>
            {nextPrayer.name}
          </h2>
          <p className="text-xl font-medium mb-1" style={{ color: 'var(--next-text)' }}>
            {PrayerCalculator.formatTime(nextPrayer.time, prayerTimes.timezone)}
          </p>
          <p className="text-sm" style={{ color: 'var(--next-accent)', opacity: 0.85 }}>
            in {timeUntil}
          </p>
        </div>
      </div>
    </div>
  );
}
