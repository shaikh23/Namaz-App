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
