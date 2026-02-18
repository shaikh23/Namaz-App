import { useState, useRef, useEffect } from 'react';
import { format } from 'date-fns';
import { getHijriDate } from '../utils/hijriDate';
import type { Location } from '../types/prayer';
import { ThemeToggle } from './ThemeToggle';
import type { Theme } from '../hooks/useTheme';
import { GeocodingService } from '../services/geocoding';

interface HeaderProps {
  location: Location | null;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  onLocationUpdate: (loc: Location) => void;
}

export function Header({ location, theme, setTheme, onLocationUpdate }: HeaderProps) {
  const today = new Date();
  const gregorianDate = format(today, 'EEEE, MMMM d, yyyy');
  const hijriDate = getHijriDate(today);

  const [searching, setSearching] = useState(false);
  const [query, setQuery] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus when search mode opens
  useEffect(() => {
    if (searching) {
      inputRef.current?.focus();
    }
  }, [searching]);

  const openSearch = () => {
    setQuery('');
    setSearchError(null);
    setSearching(true);
  };

  const closeSearch = () => {
    setSearching(false);
    setSearchError(null);
    setQuery('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    setSearchLoading(true);
    setSearchError(null);

    try {
      const result = await GeocodingService.searchCity(trimmed);
      onLocationUpdate(result);
      closeSearch();
    } catch (err) {
      setSearchError(err instanceof Error ? err.message : 'Search failed.');
    } finally {
      setSearchLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto mb-8 text-center relative">
      <div className="absolute right-0 top-1">
        <ThemeToggle theme={theme} setTheme={setTheme} />
      </div>

      <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
        Prayer Times
      </h1>

      <div className="space-y-1">
        <p style={{ color: 'var(--text-secondary)' }}>{gregorianDate}</p>
        <p className="font-medium" style={{ color: 'var(--hijri-color)' }}>{hijriDate}</p>

        {/* Location row */}
        <div className="mt-2">
          {searching ? (
            <form onSubmit={handleSubmit} className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Search city..."
                  disabled={searchLoading}
                  className="text-sm px-3 py-1.5 rounded-lg outline-none w-44"
                  style={{
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid var(--border-card)',
                    color: 'var(--text-primary)',
                  }}
                />
                <button
                  type="submit"
                  disabled={searchLoading || !query.trim()}
                  className="text-sm px-3 py-1.5 rounded-lg font-medium transition-opacity hover:opacity-80 disabled:opacity-40"
                  style={{
                    backgroundColor: 'var(--accent)',
                    color: 'var(--bg-primary)',
                  }}
                >
                  {searchLoading ? '...' : 'Go'}
                </button>
                <button
                  type="button"
                  onClick={closeSearch}
                  className="text-lg leading-none transition-opacity hover:opacity-60"
                  style={{ color: 'var(--text-muted)' }}
                  aria-label="Cancel search"
                >
                  ×
                </button>
              </div>
              {searchError && (
                <p className="text-xs" style={{ color: 'var(--error-text)' }}>
                  {searchError}
                </p>
              )}
            </form>
          ) : (
            <button
              onClick={openSearch}
              className="inline-flex items-center gap-1.5 text-sm transition-opacity hover:opacity-70"
              style={{ color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}
              aria-label="Change location"
            >
              {location?.city ?? 'Set location'}
              {/* Pencil icon */}
              <svg
                width="12" height="12" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
