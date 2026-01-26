import { usePrayerTimes } from './hooks/usePrayerTimes';
import { Header } from './components/Header';
import { NextPrayer } from './components/NextPrayer';
import { PrayerTimesList } from './components/PrayerTimesList';
import { Loading } from './components/Loading';
import { PrayerCalculator } from './services/prayerCalculator';

function App() {
  const { prayerTimes, location, loading, error } = usePrayerTimes();

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-md mx-auto">
        <Header location={location} />
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
