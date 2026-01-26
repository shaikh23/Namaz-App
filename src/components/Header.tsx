import { format } from 'date-fns';
import { getHijriDate } from '../utils/hijriDate';
import type { Location } from '../types/prayer';

interface HeaderProps {
  location: Location | null;
}

export function Header({ location }: HeaderProps) {
  const today = new Date();
  const gregorianDate = format(today, 'EEEE, MMMM d, yyyy');
  const hijriDate = getHijriDate(today);

  return (
    <div className="w-full max-w-md mx-auto mb-8 text-center">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Prayer Times</h1>
      <div className="space-y-1">
        <p className="text-gray-600">{gregorianDate}</p>
        <p className="text-blue-600 font-medium">{hijriDate}</p>
        {location?.city && (
          <p className="text-sm text-gray-500 mt-2">📍 {location.city}</p>
        )}
      </div>
    </div>
  );
}
