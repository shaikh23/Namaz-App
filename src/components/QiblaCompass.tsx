import { Qibla, Coordinates } from 'adhan';
import { useDeviceOrientation } from '../hooks/useDeviceOrientation';
import type { Location } from '../types/prayer';

interface QiblaCompassProps {
  location: Location;
}

function cardinalDirection(deg: number): string {
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  return dirs[Math.round(deg / 45) % 8];
}

export function QiblaCompass({ location }: QiblaCompassProps) {
  const { heading, status, requestPermission } = useDeviceOrientation();

  const coords = new Coordinates(location.latitude, location.longitude);
  const qiblaAngle = Qibla(coords); // degrees clockwise from true North

  // Needle angle relative to current device heading
  const needleAngle = heading != null ? (qiblaAngle - heading + 360) % 360 : qiblaAngle;
  const liveTracking = heading != null;

  return (
    <div
      className="w-full max-w-md mx-auto mt-6 p-5 rounded-xl"
      style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-card)',
      }}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <p className="text-xs uppercase tracking-wide font-semibold" style={{ color: 'var(--accent)' }}>
            Qibla Direction
          </p>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
            {liveTracking
              ? 'Point your phone — needle faces Mecca'
              : `${qiblaAngle.toFixed(1)}° ${cardinalDirection(qiblaAngle)} from North`}
          </p>
        </div>
        {liveTracking && (
          <span
            className="text-xs px-2 py-1 rounded-full font-medium"
            style={{ backgroundColor: 'var(--border-card)', color: 'var(--accent)' }}
          >
            Live
          </span>
        )}
      </div>

      {/* Compass SVG */}
      <div className="flex justify-center mb-4">
        <svg
          width="200"
          height="200"
          viewBox="0 0 200 200"
          style={{ overflow: 'visible' }}
        >
          {/* Outer ring */}
          <circle
            cx="100" cy="100" r="95"
            fill="none"
            stroke="var(--border-card)"
            strokeWidth="2"
          />

          {/* Cardinal labels */}
          {[
            { label: 'N', x: 100, y: 12 },
            { label: 'E', x: 192, y: 104 },
            { label: 'S', x: 100, y: 194 },
            { label: 'W', x: 8,   y: 104 },
          ].map(({ label, x, y }) => (
            <text
              key={label}
              x={x} y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="13"
              fontWeight="600"
              fill={label === 'N' ? 'var(--accent)' : 'var(--text-muted)'}
            >
              {label}
            </text>
          ))}

          {/* Tick marks */}
          {Array.from({ length: 36 }, (_, i) => {
            const angle = i * 10;
            const rad = (angle - 90) * (Math.PI / 180);
            const inner = i % 9 === 0 ? 76 : i % 3 === 0 ? 80 : 83;
            return (
              <line
                key={i}
                x1={100 + inner * Math.cos(rad)}
                y1={100 + inner * Math.sin(rad)}
                x2={100 + 88 * Math.cos(rad)}
                y2={100 + 88 * Math.sin(rad)}
                stroke="var(--border-card)"
                strokeWidth={i % 9 === 0 ? 2 : 1}
              />
            );
          })}

          {/* Needle — rotates to point at Qibla */}
          <g transform={`rotate(${needleAngle}, 100, 100)`}>
            {/* North tip (points toward Qibla) */}
            <polygon
              points="100,28 94,100 106,100"
              fill="var(--accent)"
              opacity="0.95"
            />
            {/* South tail */}
            <polygon
              points="100,172 94,100 106,100"
              fill="var(--text-muted)"
              opacity="0.5"
            />
            {/* Center dot */}
            <circle cx="100" cy="100" r="5" fill="var(--bg-primary)" />
            <circle cx="100" cy="100" r="3" fill="var(--accent)" />
          </g>
        </svg>
      </div>

      {/* iOS permission prompt */}
      {status === 'idle' && (
        <div className="text-center">
          <p className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>
            Allow compass access for live tracking
          </p>
          <button
            onClick={requestPermission}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-opacity hover:opacity-80"
            style={{ backgroundColor: 'var(--accent)', color: 'var(--bg-primary)' }}
          >
            Enable Compass
          </button>
        </div>
      )}

      {status === 'denied' && (
        <p className="text-center text-xs" style={{ color: 'var(--text-muted)' }}>
          Compass access denied. Showing fixed bearing only.
        </p>
      )}

      {status === 'unsupported' && (
        <p className="text-center text-xs" style={{ color: 'var(--text-muted)' }}>
          No compass sensor detected on this device.
        </p>
      )}
    </div>
  );
}
