import { useState, useEffect } from 'react';
import { PrayerCalculator } from '../services/prayerCalculator';
import { GeolocationService } from '../services/geolocation';
import { Storage } from '../utils/storage';
import type { PrayerTimes, Location, UserPreferences } from '../types/prayer';

export function usePrayerTimes() {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
  const [location, setLocation] = useState<Location | null>(null);
  const [preferences, setPreferences] = useState<UserPreferences>({
    calculationMethod: 'NorthAmerica',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize location and preferences
  useEffect(() => {
    const initializeLocation = async () => {
      try {
        // Try to load saved location
        const savedLocation = Storage.getLocation();
        const savedPreferences = Storage.getPreferences();

        if (savedPreferences) {
          setPreferences(savedPreferences);
        }

        if (savedLocation) {
          setLocation(savedLocation);
          setLoading(false);
          return;
        }

        // Try to get current location
        try {
          const currentLocation = await GeolocationService.getCurrentLocation();
          setLocation(currentLocation);
          Storage.saveLocation(currentLocation);
        } catch (geoError) {
          // Fall back to default NYC location
          console.warn('Using default location:', geoError);
          const defaultLocation = GeolocationService.getDefaultLocation();
          setLocation(defaultLocation);
          Storage.saveLocation(defaultLocation);
        }
      } catch (err) {
        setError('Failed to initialize location');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    initializeLocation();
  }, []);

  // Calculate prayer times when location or preferences change
  useEffect(() => {
    if (!location) return;

    try {
      const times = PrayerCalculator.calculatePrayerTimes(
        location,
        new Date(),
        preferences.calculationMethod
      );
      setPrayerTimes(times);
      setError(null);
    } catch (err) {
      setError('Failed to calculate prayer times');
      console.error(err);
    }
  }, [location, preferences.calculationMethod]);

  // Update location
  const updateLocation = async (newLocation?: Location) => {
    try {
      if (newLocation) {
        setLocation(newLocation);
        Storage.saveLocation(newLocation);
      } else {
        // Get current location
        const currentLocation = await GeolocationService.getCurrentLocation();
        setLocation(currentLocation);
        Storage.saveLocation(currentLocation);
      }
    } catch (err) {
      setError('Failed to update location');
      console.error(err);
    }
  };

  // Update calculation method
  const updateCalculationMethod = (method: UserPreferences['calculationMethod']) => {
    const newPreferences = { ...preferences, calculationMethod: method };
    setPreferences(newPreferences);
    Storage.savePreferences(newPreferences);
  };

  return {
    prayerTimes,
    location,
    preferences,
    loading,
    error,
    updateLocation,
    updateCalculationMethod,
  };
}
