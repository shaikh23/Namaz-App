import { PrayerCalculator } from '../services/prayerCalculator';
import type { PrayerTimes } from '../types/prayer';

interface PrayerTimesListProps {
  prayerTimes: PrayerTimes;
  nextPrayerName?: string;
}

export function PrayerTimesList({ prayerTimes, nextPrayerName }: PrayerTimesListProps) {
  const prayers = [
    { name: 'Fajr',    time: prayerTimes.fajr,    description: 'Dawn'      },
    { name: 'Sunrise', time: prayerTimes.sunrise,  description: 'Sunrise'   },
    { name: 'Dhuhr',   time: prayerTimes.dhuhr,    description: 'Noon'      },
    { name: 'Asr',     time: prayerTimes.asr,       description: 'Afternoon' },
    { name: 'Maghrib', time: prayerTimes.maghrib,   description: 'Sunset'    },
    { name: 'Isha',    time: prayerTimes.isha,      description: 'Night'     },
  ];

  const { tahajjud } = prayerTimes;

  return (
    <div className="w-full max-w-md mx-auto space-y-2">
      {prayers.map((prayer) => {
        const isNext = prayer.name === nextPrayerName;
        const isPassed = prayer.time < new Date() && !isNext;

        return (
          <div
            key={prayer.name}
            className="flex justify-between items-center p-4 rounded-lg transition-all"
            style={{
              backgroundColor: 'var(--bg-card)',
              border: isNext
                ? '2px solid var(--border-next)'
                : '1px solid var(--border-card)',
              opacity: isPassed ? 0.45 : 1,
            }}
          >
            <div>
              <h3
                className="font-semibold text-lg"
                style={{ color: isNext ? 'var(--accent)' : 'var(--text-primary)' }}
              >
                {prayer.name}
              </h3>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                {prayer.description}
              </p>
            </div>
            <div className="text-right">
              <p
                className="text-xl font-bold"
                style={{ color: isNext ? 'var(--accent)' : 'var(--text-primary)' }}
              >
                {PrayerCalculator.formatTime(prayer.time, prayerTimes.timezone)}
              </p>
              {isNext && (
                <span className="text-xs font-medium" style={{ color: 'var(--accent)' }}>
                  Next
                </span>
              )}
            </div>
          </div>
        );
      })}

      {/* Tahajjud — last third of the night */}
      <div
        className="flex justify-between items-center p-4 rounded-lg"
        style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px dashed var(--border-card)',
          opacity: tahajjud.end < new Date() ? 0.45 : 1,
        }}
      >
        <div>
          <h3 className="font-semibold text-lg" style={{ color: 'var(--text-primary)' }}>
            Tahajjud
          </h3>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Last third of night
          </p>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
            {PrayerCalculator.formatTime(tahajjud.start, prayerTimes.timezone)}
          </p>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            until {PrayerCalculator.formatTime(tahajjud.end, prayerTimes.timezone)}
          </p>
        </div>
      </div>
    </div>
  );
}
