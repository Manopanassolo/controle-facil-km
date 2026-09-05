import * as Location from 'expo-location';

export type Point = { latitude: number; longitude: number; timestamp: number };
export type RouteWatchOptions = { distanceIntervalMeters?: number; timeIntervalSeconds?: number };

export type LocationStartResult =
  | { ok: true; point: Point }
  | { ok: false; reason: string };

export async function ensureForegroundLocation(): Promise<{ ok: true } | { ok: false; reason: string }> {
  try {
    const servicesEnabled = await Location.hasServicesEnabledAsync();
    if (!servicesEnabled) return { ok: false, reason: 'Ative a localização do aparelho para iniciar o deslocamento.' };
    const current = await Location.getForegroundPermissionsAsync();
    if (current.granted) return { ok: true };
    const requested = await Location.requestForegroundPermissionsAsync();
    if (!requested.granted) return { ok: false, reason: 'Permita o acesso à localização durante o uso do app.' };
    return { ok: true };
  } catch {
    return { ok: false, reason: 'Não foi possível validar a permissão de localização.' };
  }
}

export async function getCurrentPoint(): Promise<LocationStartResult> {
  const permission = await ensureForegroundLocation();
  if (!permission.ok) return permission;
  try {
    const result = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High, mayShowUserSettingsDialog: true });
    return { ok: true, point: { latitude: result.coords.latitude, longitude: result.coords.longitude, timestamp: result.timestamp } };
  } catch {
    try {
      const last = await Location.getLastKnownPositionAsync({ maxAge: 30000, requiredAccuracy: 100 });
      if (last) return { ok: true, point: { latitude: last.coords.latitude, longitude: last.coords.longitude, timestamp: last.timestamp } };
    } catch {}
    return { ok: false, reason: 'GPS indisponível no momento. Verifique a localização do aparelho e tente novamente.' };
  }
}

export async function watchRoute(onPoint: (point: Point) => void, options: RouteWatchOptions = {}) {
  const permission = await ensureForegroundLocation();
  if (!permission.ok) return null;
  const distanceInterval = Math.max(1, Math.min(500, Number(options.distanceIntervalMeters) || 5));
  const timeInterval = Math.max(1000, Math.min(300000, (Number(options.timeIntervalSeconds) || 2) * 1000));
  try {
    return await Location.watchPositionAsync(
      { accuracy: Location.Accuracy.BestForNavigation, distanceInterval, timeInterval, mayShowUserSettingsDialog: true },
      result => onPoint({ latitude: result.coords.latitude, longitude: result.coords.longitude, timestamp: result.timestamp }),
    );
  } catch {
    return null;
  }
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
