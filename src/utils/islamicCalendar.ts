const HIJRI_MONTH_NAMES = [
  'Muharram',
  'Safar',
  "Rabi' al-Awwal",
  "Rabi' al-Thani",
  'Jumada al-Awwal',
  'Jumada al-Thani',
  'Rajab',
  "Sha'ban",
  'Ramadan',
  'Shawwal',
  "Dhu al-Qi'dah",
  'Dhu al-Hijjah',
] as const;

interface HijriParts {
  year: number;
  month: number;
  day: number;
}

interface ImportantDateDefinition {
  id: string;
  label: string;
  month: number;
  day: number;
}

export interface IslamicEvent {
  id: string;
  label: string;
  hijriMonth: number;
  hijriMonthName: string;
  hijriDay: number;
  gregorianDate: Date | null;
}

export interface IslamicMonthSummary {
  month: number;
  monthName: string;
  events: IslamicEvent[];
}

export interface IslamicCalendarData {
  hijriYear: number;
  months: IslamicMonthSummary[];
}

const IMPORTANT_DATES: ImportantDateDefinition[] = [
  { id: 'new-year', label: 'Islamic New Year', month: 1, day: 1 },
  { id: 'ashura', label: 'Ashura', month: 1, day: 10 },
  { id: 'mawlid', label: 'Mawlid (12 Rabi al-Awwal)', month: 3, day: 12 },
  { id: 'ramadan-start', label: 'Start of Ramadan', month: 9, day: 1 },
  { id: 'nuzul', label: 'Nuzul al-Quran', month: 9, day: 17 },
  { id: 'laylat-qadr', label: 'Laylat al-Qadr (observed)', month: 9, day: 27 },
  { id: 'eid-fitr', label: 'Eid al-Fitr', month: 10, day: 1 },
  { id: 'arafah', label: 'Day of Arafah', month: 12, day: 9 },
  { id: 'eid-adha', label: 'Eid al-Adha', month: 12, day: 10 },
];

function parseHijriParts(date: Date): HijriParts | null {
  try {
    const formatter = new Intl.DateTimeFormat('en-US-u-ca-islamic-nu-latn', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    });

    const parts = formatter.formatToParts(date);
    const year = Number(parts.find(part => part.type === 'year')?.value);
    const month = Number(parts.find(part => part.type === 'month')?.value);
    const day = Number(parts.find(part => part.type === 'day')?.value);

    if (!year || !month || !day) {
      return null;
    }

    return { year, month, day };
  } catch {
    return null;
  }
}

function buildHijriDateLookup(hijriYear: number, referenceDate: Date): Map<string, Date> {
  const lookup = new Map<string, Date>();

  // Covers one full Hijri year even when it spans two Gregorian years.
  const start = new Date(referenceDate.getFullYear() - 1, 0, 1);
  const end = new Date(referenceDate.getFullYear() + 2, 0, 1);

  for (const day = new Date(start); day < end; day.setDate(day.getDate() + 1)) {
    const parts = parseHijriParts(day);
    if (!parts || parts.year !== hijriYear) {
      continue;
    }

    const key = `${parts.year}-${parts.month}-${parts.day}`;
    if (!lookup.has(key)) {
      lookup.set(key, new Date(day));
    }
  }

  return lookup;
}

export function getIslamicCalendarData(referenceDate: Date = new Date()): IslamicCalendarData | null {
  const todayParts = parseHijriParts(referenceDate);
  if (!todayParts) {
    return null;
  }

  const hijriYear = todayParts.year;
  const lookup = buildHijriDateLookup(hijriYear, referenceDate);

  const months: IslamicMonthSummary[] = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    const events: IslamicEvent[] = IMPORTANT_DATES
      .filter(dateDef => dateDef.month === month)
      .map(dateDef => {
        const key = `${hijriYear}-${dateDef.month}-${dateDef.day}`;
        return {
          id: dateDef.id,
          label: dateDef.label,
          hijriMonth: month,
          hijriMonthName: HIJRI_MONTH_NAMES[month - 1],
          hijriDay: dateDef.day,
          gregorianDate: lookup.get(key) ?? null,
        };
      });

    return {
      month,
      monthName: HIJRI_MONTH_NAMES[i],
      events,
    };
  });

  return { hijriYear, months };
}
