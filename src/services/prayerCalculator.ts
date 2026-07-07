import { Coordinates, CalculationMethod, Madhab, PrayerTimes as AdhanPrayerTimes } from 'adhan';
import { format, addDays } from 'date-fns';
import tzLookup from 'tz-lookup';
import type { PrayerTimes, Location, UserPreferences } from '../types/prayer';

export class PrayerCalculator {
  /**
   * Calculate prayer times for a given location and date
   */
  static calculatePrayerTimes(
    location: Location,
    date: Date = new Date(),
    methodName: UserPreferences['calculationMethod'] = 'Auto'
  ): PrayerTimes {
    const coordinates = new Coordinates(location.latitude, location.longitude);
    const timezone = this.resolveTimezone(location);
    const method = this.getCalculationMethod(methodName, location);
    const calculationDate = this.normalizeDateForTimezone(date, timezone);
    const prayerTimes = new AdhanPrayerTimes(coordinates, calculationDate, method);

    // Tahajjud = last third of the night (Maghrib → next Fajr)
    const tomorrowTimes = new AdhanPrayerTimes(coordinates, addDays(calculationDate, 1), method);
    const tahajjud = this.calculateTahajjud(prayerTimes.maghrib, tomorrowTimes.fajr);

    return {
      fajr: prayerTimes.fajr,
      sunrise: prayerTimes.sunrise,
      dhuhr: prayerTimes.dhuhr,
      asr: prayerTimes.asr,
      maghrib: prayerTimes.maghrib,
      isha: prayerTimes.isha,
      date: calculationDate,
      timezone,
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
  private static getCalculationMethod(
    methodName: UserPreferences['calculationMethod'],
    location: Location
  ) {
    if (methodName === 'Auto') {
      return this.getAutoCalculationMethod(location);
    }

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
        return this.getAutoCalculationMethod(location);
    }
  }

  /**
   * Pick a default method based on region, with country code first and
   * coordinate-based fallback when country metadata is unavailable.
   */
  private static getAutoCalculationMethod(location: Location) {
    const countryCode = location.countryCode?.toUpperCase();
    const applyRegionalMadhab = (method: ReturnType<typeof CalculationMethod.NorthAmerica>) => {
      // South Asian prayer schedules are commonly published with Hanafi Asr.
      if (countryCode && ['PK', 'IN', 'BD', 'AF'].includes(countryCode)) {
        method.madhab = Madhab.Hanafi;
      }
      return method;
    };

    if (countryCode) {
      // UK and Ireland are typically published using moonsighting rules,
      // especially to avoid extreme summer twilight edge cases.
      if (['GB', 'IE'].includes(countryCode)) {
        return applyRegionalMadhab(CalculationMethod.MoonsightingCommittee());
      }

      // North America (ISNA)
      if (['US', 'CA'].includes(countryCode)) {
        return applyRegionalMadhab(CalculationMethod.NorthAmerica());
      }

      // GCC + Saudi neighborhoods (Umm Al-Qura)
      if (['SA', 'AE', 'QA', 'KW', 'BH', 'OM', 'YE'].includes(countryCode)) {
        return applyRegionalMadhab(CalculationMethod.UmmAlQura());
      }

      // South Asia (Karachi)
      if (['PK', 'IN', 'BD', 'AF'].includes(countryCode)) {
        return applyRegionalMadhab(CalculationMethod.Karachi());
      }

      // North Africa commonly prefers Egyptian method
      if (['EG', 'DZ', 'LY', 'MA', 'TN', 'SD'].includes(countryCode)) {
        return applyRegionalMadhab(CalculationMethod.Egyptian());
      }

      // Europe + broad Asia fallback (MWL)
      if (this.isEuropeCountry(countryCode) || this.isAsiaCountry(countryCode)) {
        return applyRegionalMadhab(CalculationMethod.MuslimWorldLeague());
      }
    }

    const { latitude, longitude } = location;

    // Coordinate fallback for South Asia
    if (latitude >= 5 && latitude <= 37 && longitude >= 60 && longitude <= 95) {
      return applyRegionalMadhab(CalculationMethod.Karachi());
    }

    // Coordinate fallback for Europe
    if (latitude >= 35 && latitude <= 72 && longitude >= -10 && longitude <= 60) {
      return applyRegionalMadhab(CalculationMethod.MuslimWorldLeague());
    }

    // Coordinate fallback for broader Asia
    if (latitude >= 5 && latitude <= 60 && longitude >= 60 && longitude <= 150) {
      return applyRegionalMadhab(CalculationMethod.MuslimWorldLeague());
    }

    // Coordinate fallback for North America
    if (latitude >= 5 && latitude <= 85 && longitude >= -170 && longitude <= -30) {
      return applyRegionalMadhab(CalculationMethod.NorthAmerica());
    }

    // Safe global fallback
    return applyRegionalMadhab(CalculationMethod.MuslimWorldLeague());
  }

  private static isEuropeCountry(countryCode: string): boolean {
    const europe = new Set([
      'AL', 'AD', 'AT', 'BA', 'BE', 'BG', 'BY', 'CH', 'CY', 'CZ', 'DE', 'DK', 'EE', 'ES',
      'FI', 'FO', 'FR', 'GB', 'GE', 'GI', 'GR', 'HR', 'HU', 'IE', 'IS', 'IT', 'LI', 'LT',
      'LU', 'LV', 'MC', 'MD', 'ME', 'MK', 'MT', 'NL', 'NO', 'PL', 'PT', 'RO', 'RS', 'RU',
      'SE', 'SI', 'SK', 'SM', 'TR', 'UA', 'VA', 'XK'
    ]);
    return europe.has(countryCode);
  }

  private static isAsiaCountry(countryCode: string): boolean {
    const asia = new Set([
      'AF', 'AM', 'AZ', 'BD', 'BH', 'BN', 'BT', 'CN', 'GE', 'HK', 'ID', 'IL', 'IN', 'IQ',
      'IR', 'JO', 'JP', 'KG', 'KH', 'KP', 'KR', 'KW', 'KZ', 'LA', 'LB', 'LK', 'MM', 'MN',
      'MO', 'MV', 'MY', 'NP', 'OM', 'PH', 'PK', 'PS', 'QA', 'SA', 'SG', 'SY', 'TH', 'TJ',
      'TL', 'TM', 'TR', 'TW', 'UZ', 'VN', 'YE', 'AE'
    ]);
    return asia.has(countryCode);
  }

  /**
   * Format time for display (e.g., "5:30 AM")
   */
  static formatTime(date: Date, timezone?: string): string {
    if (timezone) {
      return new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
        timeZone: timezone,
      }).format(date);
    }

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

  private static resolveTimezone(location: Location): string {
    try {
      return tzLookup(location.latitude, location.longitude);
    } catch {
      return Intl.DateTimeFormat().resolvedOptions().timeZone;
    }
  }

  private static normalizeDateForTimezone(date: Date, timezone: string): Date {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).formatToParts(date);

    const year = Number(parts.find(part => part.type === 'year')?.value);
    const month = Number(parts.find(part => part.type === 'month')?.value);
    const day = Number(parts.find(part => part.type === 'day')?.value);

    if (!year || !month || !day) {
      return date;
    }

    // adhan uses local Date calendar fields; keep them aligned to target timezone date.
    return new Date(year, month - 1, day, 12, 0, 0, 0);
  }
}
