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

    // Update immediately
    updateCountdown();

    // Update every minute
    const interval = setInterval(updateCountdown, 60000);

    return () => clearInterval(interval);
  }, [prayerTimes]);

  if (!nextPrayer) {
    return null;
  }

  return (
    <div className="w-full max-w-md mx-auto mb-6">
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg">
        <div className="text-center">
          <p className="text-sm uppercase tracking-wide opacity-90 mb-1">Next Prayer</p>
          <h2 className="text-3xl font-bold mb-2">{nextPrayer.name}</h2>
          <p className="text-xl font-medium mb-1">
            {PrayerCalculator.formatTime(nextPrayer.time)}
          </p>
          <p className="text-sm opacity-90">in {timeUntil}</p>
        </div>
      </div>
    </div>
  );
}
