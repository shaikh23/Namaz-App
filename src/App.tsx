import { useState } from 'react';
import { usePrayerTimes } from './hooks/usePrayerTimes';
import { useTheme } from './hooks/useTheme';
import { Header } from './components/Header';
import { NextPrayer } from './components/NextPrayer';
import { PrayerTimesList } from './components/PrayerTimesList';
import { RamadanBanner } from './components/RamadanBanner';
import { IslamicCalendar } from './components/IslamicCalendar';
import { QiblaCompass } from './components/QiblaCompass';
import { Loading } from './components/Loading';
import { PrayerCalculator } from './services/prayerCalculator';
import { isRamadanSeason } from './utils/hijriDate';

function App() {
  const { prayerTimes, location, loading, error, updateLocation } = usePrayerTimes();
  const { theme, setTheme } = useTheme();
  const [showIslamicCalendar, setShowIslamicCalendar] = useState(false);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: 'var(--bg-primary)' }}
      >
        <div className="text-center">
          <p className="mb-4" style={{ color: 'var(--error-text)' }}>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 rounded-lg font-medium transition-opacity hover:opacity-80"
            style={{
              backgroundColor: 'var(--accent)',
              color: 'var(--bg-primary)',
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!prayerTimes) {
    return null;
  }

  const nextPrayer = PrayerCalculator.getNextPrayer(prayerTimes);
  const showRamadanBanner = isRamadanSeason();

  return (
    <div
      className="min-h-screen py-8 pb-16 px-4 transition-colors duration-300"
      style={{ backgroundColor: 'var(--bg-primary)' }}
    >
      <div className="max-w-md mx-auto">
        <Header
          location={location}
          theme={theme}
          setTheme={setTheme}
          onLocationUpdate={updateLocation}
          showIslamicCalendar={showIslamicCalendar}
          onToggleIslamicCalendar={() => setShowIslamicCalendar(value => !value)}
        />
        {showIslamicCalendar && <IslamicCalendar />}
        {showRamadanBanner && <RamadanBanner prayerTimes={prayerTimes} />}
        <NextPrayer prayerTimes={prayerTimes} />
        <PrayerTimesList
          prayerTimes={prayerTimes}
          nextPrayerName={nextPrayer?.name}
        />
        {location && <QiblaCompass location={location} />}
      </div>
    </div>
  );
}

export default App;
