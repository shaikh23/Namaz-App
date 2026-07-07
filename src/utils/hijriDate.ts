/**
 * Get Hijri (Islamic) date from Gregorian date
 * Uses the browser's Intl API for Islamic calendar conversion
 */
export function getHijriDate(date: Date = new Date()): string {
  try {
    // Use Intl.DateTimeFormat with Islamic calendar
    const formatter = new Intl.DateTimeFormat('en-US-u-ca-islamic', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    return formatter.format(date);
  } catch (error) {
    console.error('Failed to get Hijri date:', error);
    return '';
  }
}

/**
 * Get short Hijri date (e.g., "15 Rajab 1446")
 */
export function getHijriDateShort(date: Date = new Date()): string {
  try {
    const formatter = new Intl.DateTimeFormat('en-US-u-ca-islamic', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

    return formatter.format(date);
  } catch (error) {
    console.error('Failed to get Hijri date:', error);
    return '';
  }
}

/**
 * Get just the Islamic month name
 */
export function getIslamicMonth(date: Date = new Date()): string {
  try {
    const formatter = new Intl.DateTimeFormat('en-US-u-ca-islamic', {
      month: 'long',
    });

    return formatter.format(date);
  } catch (error) {
    console.error('Failed to get Islamic month:', error);
    return '';
  }
}

/**
 * Get the Hijri month number (1-12).
 */
export function getHijriMonthNumber(date: Date = new Date()): number | null {
  try {
    // Force Latin digits so month can be parsed reliably across environments.
    const formatter = new Intl.DateTimeFormat('en-US-u-ca-islamic-nu-latn', {
      month: 'numeric',
    });
    const parts = formatter.formatToParts(date);
    const monthPart = parts.find(part => part.type === 'month');

    if (!monthPart) {
      return null;
    }

    const month = Number(monthPart.value);
    if (!Number.isInteger(month) || month < 1 || month > 12) {
      return null;
    }

    return month;
  } catch (error) {
    console.error('Failed to get Hijri month number:', error);
    return null;
  }
}

/**
 * True only during Ramadan (Hijri month 9).
 */
export function isRamadanSeason(date: Date = new Date()): boolean {
  return getHijriMonthNumber(date) === 9;
}
