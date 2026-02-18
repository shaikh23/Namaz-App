import { useState, useEffect, useCallback } from 'react';

export type OrientationStatus = 'idle' | 'requesting' | 'granted' | 'denied' | 'unsupported';

interface DeviceOrientationState {
  heading: number | null; // degrees from true North, 0–360
  status: OrientationStatus;
  requestPermission: () => void;
}

export function useDeviceOrientation(): DeviceOrientationState {
  const [heading, setHeading] = useState<number | null>(null);
  const [status, setStatus] = useState<OrientationStatus>('idle');

  const handleOrientation = useCallback((event: DeviceOrientationEvent) => {
    // 'absolute' events give true-North heading via webkitCompassHeading (iOS)
    // or via alpha when absolute=true (Android)
    const ios = (event as DeviceOrientationEvent & { webkitCompassHeading?: number })
      .webkitCompassHeading;

    if (ios != null) {
      setHeading(ios);
    } else if (event.absolute && event.alpha != null) {
      // Android absolute alpha: 0° = North, increases clockwise
      setHeading((360 - event.alpha) % 360);
    }
  }, []);

  const subscribe = useCallback(() => {
    // Prefer deviceorientationabsolute when available (Chrome Android).
    // Cast through unknown to safely check this non-standard property.
    const win = window as unknown as Record<string, unknown>;
    if ('ondeviceorientationabsolute' in win) {
      window.addEventListener('deviceorientationabsolute' as 'deviceorientation', handleOrientation);
    } else {
      window.addEventListener('deviceorientation', handleOrientation);
    }
    setStatus('granted');
  }, [handleOrientation]);

  const requestPermission = useCallback(async () => {
    setStatus('requesting');

    // iOS 13+ requires explicit permission
    const DevOrEvent = DeviceOrientationEvent as typeof DeviceOrientationEvent & {
      requestPermission?: () => Promise<'granted' | 'denied'>;
    };

    if (typeof DevOrEvent.requestPermission === 'function') {
      try {
        const result = await DevOrEvent.requestPermission();
        if (result === 'granted') {
          subscribe();
        } else {
          setStatus('denied');
        }
      } catch {
        setStatus('denied');
      }
    } else if ('DeviceOrientationEvent' in window) {
      // Non-iOS — no permission needed, just subscribe
      subscribe();
    } else {
      setStatus('unsupported');
    }
  }, [subscribe]);

  // Auto-attempt on non-iOS where no permission dialog is needed
  useEffect(() => {
    const DevOrEvent = DeviceOrientationEvent as typeof DeviceOrientationEvent & {
      requestPermission?: () => Promise<'granted' | 'denied'>;
    };
    if (
      'DeviceOrientationEvent' in window &&
      typeof DevOrEvent.requestPermission !== 'function'
    ) {
      subscribe();
    } else if (!('DeviceOrientationEvent' in window)) {
      setStatus('unsupported');
    }

    return () => {
      window.removeEventListener('deviceorientationabsolute' as 'deviceorientation', handleOrientation);
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, [subscribe, handleOrientation]);

  return { heading, status, requestPermission };
}
