import AsyncStorage from '@react-native-async-storage/async-storage';

const LEGACY_KEY = 'movvant.rc11.enterprise.settings';
const companyKey = (companyId?: string | null) => companyId ? `movvant.rc11.enterprise.settings.${companyId}` : LEGACY_KEY;

export type EnterpriseSettings = {
  visit: { geofenceMeters: number; proximityCheckSeconds: number; scheduleWindowMinutes: number; suggestCheckin: boolean; requireGpsCheckin: boolean; requireGpsCheckout: boolean; minimumVisitMinutes: number };
  tracking: { gpsDistanceIntervalMeters: number; gpsTimeIntervalSeconds: number; minimumTrackStepMeters: number; maximumTrackStepMeters: number; keepFullLocalTrack: boolean };
  sync: { autoSync: boolean; retrySeconds: number; keepOfflineData: boolean };
  agenda: { reminderMinutes: number; allowLocalAppointments: boolean };
  km: { requireVehicle: boolean; requirePhoto: boolean; allowManualKm: boolean };
  notifications: { operational: boolean; agenda: boolean; syncErrors: boolean };
};

export const DEFAULT_ENTERPRISE_SETTINGS: EnterpriseSettings = {
  visit: { geofenceMeters: 200, proximityCheckSeconds: 60, scheduleWindowMinutes: 120, suggestCheckin: true, requireGpsCheckin: true, requireGpsCheckout: false, minimumVisitMinutes: 0 },
  tracking: { gpsDistanceIntervalMeters: 5, gpsTimeIntervalSeconds: 2, minimumTrackStepMeters: 2, maximumTrackStepMeters: 300, keepFullLocalTrack: true },
  sync: { autoSync: true, retrySeconds: 15, keepOfflineData: true },
  agenda: { reminderMinutes: 15, allowLocalAppointments: true },
  km: { requireVehicle: true, requirePhoto: false, allowManualKm: true },
  notifications: { operational: true, agenda: true, syncErrors: true },
};

function clamp(n: number, min: number, max: number) { return Math.min(max, Math.max(min, n)); }
export function normalizeEnterpriseSettings(value: Partial<EnterpriseSettings> | null | undefined): EnterpriseSettings {
  const v: any = value || {};
  const merged: EnterpriseSettings = { visit: { ...DEFAULT_ENTERPRISE_SETTINGS.visit, ...(v.visit || {}) }, tracking: { ...DEFAULT_ENTERPRISE_SETTINGS.tracking, ...(v.tracking || {}) }, sync: { ...DEFAULT_ENTERPRISE_SETTINGS.sync, ...(v.sync || {}) }, agenda: { ...DEFAULT_ENTERPRISE_SETTINGS.agenda, ...(v.agenda || {}) }, km: { ...DEFAULT_ENTERPRISE_SETTINGS.km, ...(v.km || {}) }, notifications: { ...DEFAULT_ENTERPRISE_SETTINGS.notifications, ...(v.notifications || {}) } };
  merged.visit.geofenceMeters = clamp(Number(merged.visit.geofenceMeters) || 200, 10, 5000);
  merged.visit.proximityCheckSeconds = clamp(Number(merged.visit.proximityCheckSeconds) || 60, 5, 3600);
  merged.visit.scheduleWindowMinutes = clamp(Number(merged.visit.scheduleWindowMinutes) || 120, 5, 1440);
  merged.visit.minimumVisitMinutes = clamp(Number(merged.visit.minimumVisitMinutes) || 0, 0, 1440);
  merged.tracking.gpsDistanceIntervalMeters = clamp(Number(merged.tracking.gpsDistanceIntervalMeters) || 5, 1, 500);
  merged.tracking.gpsTimeIntervalSeconds = clamp(Number(merged.tracking.gpsTimeIntervalSeconds) || 2, 1, 300);
  merged.sync.retrySeconds = clamp(Number(merged.sync.retrySeconds) || 15, 5, 3600);
  merged.agenda.reminderMinutes = clamp(Number(merged.agenda.reminderMinutes) || 15, 0, 1440);
  return merged;
}

export async function readEnterpriseSettings(companyId?: string | null): Promise<EnterpriseSettings> {
  const raw = await AsyncStorage.getItem(companyKey(companyId));
  if (raw) { try { return normalizeEnterpriseSettings(JSON.parse(raw)); } catch {} }
  if (companyId) {
    const legacy = await AsyncStorage.getItem(LEGACY_KEY);
    if (legacy) { try { const migrated = normalizeEnterpriseSettings(JSON.parse(legacy)); await AsyncStorage.setItem(companyKey(companyId), JSON.stringify(migrated)); return migrated; } catch {} }
  }
  return DEFAULT_ENTERPRISE_SETTINGS;
}

export async function saveEnterpriseSettings(settings: EnterpriseSettings, companyId?: string | null) {
  const normalized = normalizeEnterpriseSettings(settings);
  await AsyncStorage.setItem(companyKey(companyId), JSON.stringify(normalized));
  return normalized;
}
