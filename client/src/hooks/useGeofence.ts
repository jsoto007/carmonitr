import { useMemo } from 'react';
import { useAccountContext } from '../context/AccountContext';

const RADIUS_EARTH_METERS = 6371000;

const toRadians = (value: number) => (value * Math.PI) / 180;

const haversineDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return RADIUS_EARTH_METERS * c;
};

export const useGeofence = (lat?: number, lon?: number) => {
  const { selectedAccount } = useAccountContext();
  const result = useMemo(() => {
    if (typeof lat !== 'number' || typeof lon !== 'number') {
      return {
        isOnSite: false,
        reason: 'Location required',
      };
    }

    const distance = haversineDistance(lat, lon, selectedAccount.geofence.lat, selectedAccount.geofence.lon);
    if (distance <= selectedAccount.geofence.radiusMeters) {
      return { isOnSite: true, reason: 'Inside site geofence' };
    }

    return { isOnSite: false, reason: 'Outside assigned site (geo violation)' };
  }, [lat, lon, selectedAccount]);

  return result;
};
