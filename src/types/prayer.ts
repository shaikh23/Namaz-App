export interface PrayerTime {
  name: string;
  time: Date;
  displayTime: string;
}

export interface PrayerTimes {
  fajr: Date;
  sunrise: Date;
  dhuhr: Date;
  asr: Date;
  maghrib: Date;
  isha: Date;
  date: Date;
  tahajjud: {
    start: Date; // last third of night begins
    end: Date;   // next day's Fajr
  };
}

export interface Location {
  latitude: number;
  longitude: number;
  city?: string;
}

export interface UserPreferences {
  location?: Location;
  calculationMethod: 'NorthAmerica' | 'MuslimWorldLeague' | 'Egyptian' | 'UmmAlQura' | 'Karachi';
}

export type Prayer = 'Fajr' | 'Sunrise' | 'Dhuhr' | 'Asr' | 'Maghrib' | 'Isha';
