import { Coordinates, CalculationMethod, PrayerTimes as AdhanPrayerTimes } from 'adhan';
import { format, addDays } from 'date-fns';
import type { PrayerTimes, Location, UserPreferences } from '../types/prayer';

export class PrayerCalculator {
  /**
   * Calculate prayer times for a given location and date
   */
  static calculatePrayerTimes(
    location: Location,
    date: Date = new Date(),
    methodName: UserPreferences['calculationMethod'] = 'NorthAmerica'
  ): PrayerTimes {
    const coordinates = new Coordinates(location.latitude, location.longitude);
    const method = this.getCalculationMethod(methodName);
    const prayerTimes = new AdhanPrayerTimes(coordinates, date, method);

    // Tahajjud = last third of the night (Maghrib → next Fajr)
    const tomorrowTimes = new AdhanPrayerTimes(coordinates, addDays(date, 1), method);
    const tahajjud = this.calculateTahajjud(prayerTimes.maghrib, tomorrowTimes.fajr);

    return {
      fajr: prayerTimes.fajr,
      sunrise: prayerTimes.sunrise,
      dhuhr: prayerTimes.dhuhr,
      asr: prayerTimes.asr,
      maghrib: prayerTimes.maghrib,
      isha: prayerTimes.isha,
      date,
      tahajjud,
    };
  }

  /**
   * Calculate the Tahajjud window: last third of the night.
   * Night is defined as the span from Maghrib to the following Fajr.
   */
  static calculateTahajjud(maghrib: Date, nextFajr: Date): { start: Date; end: Date } {
    const nightMs = nextFajr.getTime() - maghrib.getTime();
    const start = new Date(maghrib.getTime() + (2 / 3) * nightMs);
    return { start, end: nextFajr };
  }

  /**
   * Get the calculation method object for adhan library
   */
  private static getCalculationMethod(methodName: UserPreferences['calculationMethod']) {
    switch (methodName) {
      case 'NorthAmerica':
        return CalculationMethod.NorthAmerica();
      case 'MuslimWorldLeague':
        return CalculationMethod.MuslimWorldLeague();
      case 'Egyptian':
        return CalculationMethod.Egyptian();
      case 'UmmAlQura':
        return CalculationMethod.UmmAlQura();
      case 'Karachi':
        return CalculationMethod.Karachi();
      default:
        return CalculationMethod.NorthAmerica();
    }
  }

  /**
   * Format time for display (e.g., "5:30 AM")
   */
  static formatTime(date: Date): string {
    return format(date, 'h:mm a');
  }

  /**
   * Get the next prayer time
   */
  static getNextPrayer(prayerTimes: PrayerTimes): { name: string; time: Date } | null {
    const now = new Date();
    const prayers = [
      { name: 'Fajr', time: prayerTimes.fajr },
      { name: 'Sunrise', time: prayerTimes.sunrise },
      { name: 'Dhuhr', time: prayerTimes.dhuhr },
      { name: 'Asr', time: prayerTimes.asr },
      { name: 'Maghrib', time: prayerTimes.maghrib },
      { name: 'Isha', time: prayerTimes.isha },
    ];

    // Find the next prayer
    for (const prayer of prayers) {
      if (prayer.time > now) {
        return prayer;
      }
    }

    // If all prayers have passed, return tomorrow's Fajr
    // (We'll calculate tomorrow's times for this)
    return null;
  }

  /**
   * Get time until next prayer in a human-readable format
   */
  static getTimeUntilPrayer(prayerTime: Date): string {
    const now = new Date();
    const diff = prayerTime.getTime() - now.getTime();

    if (diff < 0) return 'Now';

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  }
}
