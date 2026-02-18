import { useState, useEffect } from 'react';
import { PrayerCalculator } from '../services/prayerCalculator';
import type { PrayerTimes } from '../types/prayer';

interface RamadanBannerProps {
  prayerTimes: PrayerTimes;
}

function getStatus(fajr: Date, maghrib: Date): {
  label: string;
  timeLeft: string;
  progress: number; // 0–1, fraction of fast elapsed
} | null {
  const now = new Date();

  // Between Fajr and Maghrib: active fast
  if (now >= fajr && now < maghrib) {
    const totalMs = maghrib.getTime() - fajr.getTime();
    const elapsedMs = now.getTime() - fajr.getTime();
    const remainingMs = maghrib.getTime() - now.getTime();

    const hours = Math.floor(remainingMs / (1000 * 60 * 60));
    const minutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
    const timeLeft = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;

    return {
      label: 'Iftar',
      timeLeft,
      progress: elapsedMs / totalMs,
    };
  }

  // After midnight and before Fajr: suhoor window
  const midnight = new Date(fajr);
  midnight.setHours(0, 0, 0, 0);

  if (now >= midnight && now < fajr) {
    const remainingMs = fajr.getTime() - now.getTime();
    const hours = Math.floor(remainingMs / (1000 * 60 * 60));
    const minutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
    const timeLeft = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;

    return {
      label: 'Suhoor ends',
      timeLeft,
      progress: 0,
    };
  }

  return null;
}

export function RamadanBanner({ prayerTimes }: RamadanBannerProps) {
  const [status, setStatus] = useState(() =>
    getStatus(prayerTimes.fajr, prayerTimes.maghrib)
  );

  useEffect(() => {
    const update = () => setStatus(getStatus(prayerTimes.fajr, prayerTimes.maghrib));
    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, [prayerTimes]);

  if (!status) return null;

  const isActiveFast = status.label === 'Iftar';

  return (
    <div
      className="w-full max-w-md mx-auto mb-6 p-4 rounded-xl"
      style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-card)',
      }}
    >
      <div className="flex justify-between items-baseline mb-2">
        <div>
          <span className="text-xs uppercase tracking-wide font-semibold" style={{ color: 'var(--accent)' }}>
            Ramadan
          </span>
          <p className="font-semibold text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
            {isActiveFast
              ? `${PrayerCalculator.formatTime(prayerTimes.maghrib)} Iftar`
              : `Suhoor closes at ${PrayerCalculator.formatTime(prayerTimes.fajr)}`}
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            {status.timeLeft}
          </p>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            until {status.label}
          </p>
        </div>
      </div>

      {/* Progress bar — only shown during active fast */}
      {isActiveFast && (
        <div
          className="w-full rounded-full overflow-hidden"
          style={{ height: 6, backgroundColor: 'var(--border-card)' }}
        >
          <div
            className="h-full rounded-full transition-all duration-1000"
            style={{
              width: `${Math.min(status.progress * 100, 100).toFixed(1)}%`,
              backgroundColor: 'var(--accent)',
            }}
          />
        </div>
      )}
    </div>
  );
}
