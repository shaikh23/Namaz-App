import { format } from 'date-fns';
import { getHijriDate } from '../utils/hijriDate';
import type { Location } from '../types/prayer';
import { ThemeToggle } from './ThemeToggle';
import type { Theme } from '../hooks/useTheme';

interface HeaderProps {
  location: Location | null;
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export function Header({ location, theme, setTheme }: HeaderProps) {
  const today = new Date();
  const gregorianDate = format(today, 'EEEE, MMMM d, yyyy');
  const hijriDate = getHijriDate(today);

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
        {location?.city && (
          <p className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>
            {location.city}
          </p>
        )}
      </div>
    </div>
  );
}
