import type { UserPreferences, Location } from '../types/prayer';

const STORAGE_KEYS = {
  PREFERENCES: 'namaz-preferences',
  LOCATION: 'namaz-location',
};

export class Storage {
  /**
   * Save user preferences
   */
  static savePreferences(preferences: UserPreferences): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(preferences));
    } catch (error) {
      console.error('Failed to save preferences:', error);
    }
  }

  /**
   * Get user preferences
   */
  static getPreferences(): UserPreferences | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Failed to load preferences:', error);
      return null;
    }
  }

  /**
   * Save location
   */
  static saveLocation(location: Location): void {
    try {
      localStorage.setItem(STORAGE_KEYS.LOCATION, JSON.stringify(location));
    } catch (error) {
      console.error('Failed to save location:', error);
    }
  }

  /**
   * Get saved location
   */
  static getLocation(): Location | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.LOCATION);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Failed to load location:', error);
      return null;
    }
  }

  /**
   * Clear all saved data
   */
  static clearAll(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.PREFERENCES);
      localStorage.removeItem(STORAGE_KEYS.LOCATION);
    } catch (error) {
      console.error('Failed to clear storage:', error);
    }
  }
}
