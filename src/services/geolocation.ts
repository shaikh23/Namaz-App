import type { Location } from '../types/prayer';

export class GeolocationService {
  /**
   * Get user's current location using browser's Geolocation API
   */
  static async getCurrentLocation(): Promise<Location> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          reject(new Error(`Location error: ${error.message}`));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    });
  }

  /**
   * Default location for NYC/NJ area
   */
  static getDefaultLocation(): Location {
    return {
      latitude: 40.7128,
      longitude: -74.006,
      city: 'New York, NY',
    };
  }
}
