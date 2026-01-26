import { PrayerCalculator } from '../services/prayerCalculator';
import type { PrayerTimes } from '../types/prayer';

interface PrayerTimesListProps {
  prayerTimes: PrayerTimes;
  nextPrayerName?: string;
}

export function PrayerTimesList({ prayerTimes, nextPrayerName }: PrayerTimesListProps) {
  const prayers = [
    { name: 'Fajr', time: prayerTimes.fajr, description: 'Dawn' },
    { name: 'Sunrise', time: prayerTimes.sunrise, description: 'Sunrise' },
    { name: 'Dhuhr', time: prayerTimes.dhuhr, description: 'Noon' },
    { name: 'Asr', time: prayerTimes.asr, description: 'Afternoon' },
    { name: 'Maghrib', time: prayerTimes.maghrib, description: 'Sunset' },
    { name: 'Isha', time: prayerTimes.isha, description: 'Night' },
  ];

  return (
    <div className="w-full max-w-md mx-auto space-y-2">
      {prayers.map((prayer) => {
        const isNext = prayer.name === nextPrayerName;
        const isPassed = prayer.time < new Date();

        return (
          <div
            key={prayer.name}
            className={`
              flex justify-between items-center p-4 rounded-lg transition-all
              ${isNext ? 'bg-blue-50 border-2 border-blue-500' : 'bg-white border border-gray-200'}
              ${isPassed && !isNext ? 'opacity-50' : ''}
            `}
          >
            <div>
              <h3
                className={`
                  font-semibold text-lg
                  ${isNext ? 'text-blue-700' : 'text-gray-800'}
                `}
              >
                {prayer.name}
              </h3>
              <p className="text-sm text-gray-500">{prayer.description}</p>
            </div>
            <div className="text-right">
              <p
                className={`
                  text-xl font-bold
                  ${isNext ? 'text-blue-700' : 'text-gray-800'}
                `}
              >
                {PrayerCalculator.formatTime(prayer.time)}
              </p>
              {isNext && (
                <span className="text-xs text-blue-600 font-medium">Next</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
