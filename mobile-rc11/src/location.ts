import * as Location from 'expo-location';

export type Point = { latitude: number; longitude: number; timestamp: number };

export async function ensureForegroundLocation(): Promise<boolean> {
  const current = await Location.getForegroundPermissionsAsync();
  if (current.granted) return true;
  const requested = await Location.requestForegroundPermissionsAsync();
  return requested.granted;
}

export async function getCurrentPoint(): Promise<Point | null> {
  const ok = await ensureForegroundLocation();
  if (!ok) return null;
  const result = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
  return {
    latitude: result.coords.latitude,
    longitude: result.coords.longitude,
    timestamp: result.timestamp,
  };
}

export async function watchRoute(onPoint: (point: Point) => void) {
  const ok = await ensureForegroundLocation();
  if (!ok) return null;
  return Location.watchPositionAsync(
    {
      accuracy: Location.Accuracy.High,
      distanceInterval: 10,
      timeInterval: 5000,
    },
    result => onPoint({
      latitude: result.coords.latitude,
      longitude: result.coords.longitude,
      timestamp: result.timestamp,
    }),
  );
}

export function distanceMeters(a: Point, b: Point): number {
  const R = 6371000;
  const toRad = (v: number) => v * Math.PI / 180;
  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);
  const lat1 = toRad(a.latitude);
  const lat2 = toRad(b.latitude);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}
