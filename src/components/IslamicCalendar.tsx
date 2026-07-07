import { useMemo } from 'react';
import { format } from 'date-fns';
import { getIslamicCalendarData } from '../utils/islamicCalendar';

export function IslamicCalendar() {
  const data = useMemo(() => getIslamicCalendarData(new Date()), []);

  if (!data) {
    return (
      <div
        className="w-full max-w-md mx-auto mb-6 p-4 rounded-xl"
        style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-card)',
        }}
      >
        <p style={{ color: 'var(--error-text)' }}>
          Islamic calendar is unavailable on this device.
        </p>
      </div>
    );
  }

  return (
    <div
      className="w-full max-w-md mx-auto mb-6 p-4 rounded-xl"
      style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-card)',
      }}
    >
      <div className="mb-3">
        <p className="text-xs uppercase tracking-wide font-semibold" style={{ color: 'var(--accent)' }}>
          Islamic Calendar
        </p>
        <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
          {data.hijriYear} AH Important Dates
        </h2>
      </div>

      <div className="space-y-2">
        {data.months.map(month => (
          <div
            key={month.month}
            className="p-3 rounded-lg"
            style={{
              backgroundColor: 'var(--bg-primary)',
              border: '1px solid var(--border-card)',
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                {month.month}. {month.monthName}
              </h3>
              <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                {month.events.length} marked
              </span>
            </div>

            {month.events.length === 0 ? (
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                No major dates marked in this month.
              </p>
            ) : (
              <div className="space-y-1.5">
                {month.events.map(event => (
                  <div key={event.id} className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                        {event.hijriDay} {event.hijriMonthName}
                      </p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        {event.label}
                      </p>
                    </div>
                    <p className="text-xs text-right" style={{ color: 'var(--accent)' }}>
                      {event.gregorianDate ? format(event.gregorianDate, 'EEE, MMM d, yyyy') : 'Date unavailable'}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
