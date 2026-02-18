import { usePrayerTimes } from './hooks/usePrayerTimes';
import { useTheme } from './hooks/useTheme';
import { Header } from './components/Header';
import { NextPrayer } from './components/NextPrayer';
import { PrayerTimesList } from './components/PrayerTimesList';
import { RamadanBanner } from './components/RamadanBanner';
import { Loading } from './components/Loading';
import { PrayerCalculator } from './services/prayerCalculator';

function App() {
  const { prayerTimes, location, loading, error } = usePrayerTimes();
  const { theme, setTheme } = useTheme();

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

  return (
    <div
      className="min-h-screen py-8 px-4 transition-colors duration-300"
      style={{ backgroundColor: 'var(--bg-primary)' }}
    >
      <div className="max-w-md mx-auto">
        <Header location={location} theme={theme} setTheme={setTheme} />
        <RamadanBanner prayerTimes={prayerTimes} />
        <NextPrayer prayerTimes={prayerTimes} />
        <PrayerTimesList
          prayerTimes={prayerTimes}
          nextPrayerName={nextPrayer?.name}
        />
      </div>
    </div>
  );
}

export default App;
