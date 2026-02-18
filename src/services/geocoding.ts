import type { Location } from '../types/prayer';

interface NominatimResult {
  lat: string;
  lon: string;
  address: {
    city?: string;
    town?: string;
    village?: string;
    county?: string;
    country?: string;
    country_code?: string;
  };
}

export class GeocodingService {
  private static readonly BASE_URL = 'https://nominatim.openstreetmap.org/search';

  static async searchCity(query: string): Promise<Location> {
    const params = new URLSearchParams({
      q: query,
      format: 'json',
      limit: '1',
      addressdetails: '1',
    });

    const response = await fetch(`${this.BASE_URL}?${params}`, {
      headers: {
        // Nominatim ToS requires a descriptive User-Agent
        'User-Agent': 'Namaz Prayer Times App (personal use)',
        'Accept-Language': 'en',
      },
    });

    if (!response.ok) {
      throw new Error('Search request failed. Please try again.');
    }

    const results: NominatimResult[] = await response.json();

    if (results.length === 0) {
      throw new Error('City not found — try a more specific name.');
    }

    const result = results[0];
    const addr = result.address;

    const cityName = addr.city ?? addr.town ?? addr.village ?? addr.county ?? query;
    const countryCode = addr.country_code?.toUpperCase() ?? addr.country ?? '';
    const displayCity = countryCode ? `${cityName}, ${countryCode}` : cityName;

    return {
      latitude: parseFloat(result.lat),
      longitude: parseFloat(result.lon),
      city: displayCity,
    };
  }
}
