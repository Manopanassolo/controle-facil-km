import AsyncStorage from '@react-native-async-storage/async-storage';
import { enqueueRemote, restSelect, Session } from './api';

const QUEUE_KEY = 'movvant.rc11.syncQueue';
const STATE_KEY = 'movvant.rc11.localState';
const ACTIVE_TRIP_KEY = 'movvant.rc11.activeTrip';
const LAST_SYNC_REPORT_KEY = 'movvant.rc11.lastSyncReport';
const MAX_REMOTE_GPS_POINTS = 1200;

export type SyncItem = {
  id: string;
  entity: 'appointment' | 'km' | 'trip';
  action: 'insert' | 'update' | 'finish';
  payload: Record<string, unknown>;
  createdAt: string;
};

export type LocalAppointment = {
  id: string;
  date: string;
  time: string;
  title: string;
  store: string;
  type: string;
  customerId?: string;
  synced?: boolean;
};

export type LocalKmRecord = {
  id: string;
  vehicleId?: string;
  vehicle: string;
  start: number;
  end: number;
  total: number;
  reason: string;
  photoUri?: string | null;
  createdAt: string;
  synced?: boolean;
};

export type LocalTripPoint = {
  latitude: number;
  longitude: number;
  timestamp?: number;
  accuracy?: number | null;
};

export type LocalTripRecord = {
  id: string;
  startedAt: number | null;
  finishedAt: number;
  elapsedMs: number;
  distanceMeters: number;
  returnStart: number | null;
  pointsCount: number;
  points?: LocalTripPoint[];
  synced?: boolean;
};

export type ActiveTripDraft = {
  startedAt: number;
  elapsedMs: number;
  returnStart: number | null;
  points: LocalTripPoint[];
  savedAt: number;
};

export type LocalState = {
  appointments: LocalAppointment[];
  km: LocalKmRecord[];
  trips: LocalTripRecord[];
};

type RemoteQueueRow = {
  id: string;
  status: 'pending' | 'processing' | 'synced' | 'conflict' | 'failed' | 'cancelled';
  server_entity_id?: string | null;
  error_message?: string | null;
};

type RemoteMutation = {
  id: string;
  entity: string;
  action: 'insert' | 'update' | 'delete' | 'upsert';
  payload: Record<string, unknown>;
  createdAt: string;
};

export type SyncDiagnostics = {
  total: number;
  appointment: number;
  km: number;
  trip: number;
  localOnlyAppointments: number;
};

export type SyncIssue = {
  entity: SyncItem['entity'];
  localId: string | null;
  message: string;
};

export type SyncReport = {
  attemptedAt: string;
  sent: number;
  pending: number;
  skippedLocalOnly: number;
  issues: SyncIssue[];
};

const EMPTY_STATE: LocalState = { appointments: [], km: [], trips: [] };

export async function loadLocalState<T>(fallback: T): Promise<T> {
  const raw = await AsyncStorage.getItem(STATE_KEY);
  if (!raw) return fallback;
  try { return JSON.parse(raw) as T; } catch { return fallback; }
}

export async function saveLocalState<T>(state: T): Promise<void> {
  await AsyncStorage.setItem(STATE_KEY, JSON.stringify(state));
}

export async function readLocalState(): Promise<LocalState> {
  const value = await loadLocalState<LocalState>(EMPTY_STATE);
  return {
    appointments: Array.isArray(value.appointments) ? value.appointments : [],
    km: Array.isArray(value.km) ? value.km : [],
    trips: Array.isArray(value.trips) ? value.trips : [],
  };
}

async function mutateLocal(mutator: (state: LocalState) => LocalState): Promise<LocalState> {
  const state = await readLocalState();
  const next = mutator(state);
  await saveLocalState(next);
  return next;
}

export async function saveAppointmentLocal(item: LocalAppointment) {
  return mutateLocal(state => ({ ...state, appointments: [item, ...state.appointments.filter(x => x.id !== item.id)].slice(0, 500) }));
}

export async function removeAppointmentLocal(id: string) {
  return mutateLocal(state => ({ ...state, appointments: state.appointments.filter(x => x.id !== id) }));
}

export async function saveKmLocal(item: LocalKmRecord) {
  return mutateLocal(state => ({ ...state, km: [item, ...state.km.filter(x => x.id !== item.id)].slice(0, 500) }));
}

export async function saveTripLocal(item: LocalTripRecord) {
  return mutateLocal(state => ({ ...state, trips: [item, ...state.trips.filter(x => x.id !== item.id)].slice(0, 300) }));
}

export async function saveActiveTripDraft(draft: Omit<ActiveTripDraft, 'savedAt'>) {
  await AsyncStorage.setItem(ACTIVE_TRIP_KEY, JSON.stringify({ ...draft, savedAt: Date.now() }));
}

export async function readActiveTripDraft(): Promise<ActiveTripDraft | null> {
  const raw = await AsyncStorage.getItem(ACTIVE_TRIP_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as ActiveTripDraft;
    if (!parsed.startedAt || !Array.isArray(parsed.points) || !parsed.points.length) return null;
    return parsed;
  } catch { return null; }
}

export async function clearActiveTripDraft() {
  await AsyncStorage.removeItem(ACTIVE_TRIP_KEY);
}

export async function readLastSyncReport(): Promise<SyncReport | null> {
  const raw = await AsyncStorage.getItem(LAST_SYNC_REPORT_KEY);
  if (!raw) return null;
  try { return JSON.parse(raw) as SyncReport; } catch { return null; }
}

export async function readQueue(): Promise<SyncItem[]> {
  const raw = await AsyncStorage.getItem(QUEUE_KEY);
  if (!raw) return [];
  try { return JSON.parse(raw) as SyncItem[]; } catch { return []; }
}

export async function enqueue(item: Omit<SyncItem, 'id' | 'createdAt'>): Promise<SyncItem[]> {
  const queue = await readQueue();
  const next: SyncItem = {
    ...item,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
  };
  const updated = [...queue, next];
  await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(updated));
  return updated;
}

export async function enqueueReplacingLocal(entity: SyncItem['entity'], localId: string, item: Omit<SyncItem, 'id' | 'createdAt'>): Promise<SyncItem[]> {
  const queue = await readQueue();
  const filtered = queue.filter(existing => !(existing.entity === entity && existing.payload?.localId === localId));
  const next: SyncItem = {
    ...item,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
  };
  const updated = [...filtered, next];
  await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(updated));
  return updated;
}

export async function removeQueuedForLocal(entity: SyncItem['entity'], localId: string): Promise<SyncItem[]> {
  const queue = await readQueue();
  const updated = queue.filter(existing => !(existing.entity === entity && existing.payload?.localId === localId));
  await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(updated));
  return updated;
}

export async function removeQueued(ids: string[]): Promise<SyncItem[]> {
  const queue = await readQueue();
  const updated = queue.filter(item => !ids.includes(item.id));
  await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(updated));
  return updated;
}

function isLocalOnlyAppointment(item: SyncItem) {
  return item.entity === 'appointment' && (typeof item.payload.customerId !== 'string' || !item.payload.customerId);
}

export async function readSyncDiagnostics(): Promise<SyncDiagnostics> {
  const queue = await readQueue();
  return {
    total: queue.length,
    appointment: queue.filter(x => x.entity === 'appointment').length,
    km: queue.filter(x => x.entity === 'km').length,
    trip: queue.filter(x => x.entity === 'trip').length,
    localOnlyAppointments: queue.filter(isLocalOnlyAppointment).length,
  };
}

function toIso(date: string, time: string) {
  const d = new Date(`${date}T${time}:00`);
  if (Number.isNaN(d.getTime())) throw new Error('Data ou horário inválido para sincronização.');
  return d.toISOString();
}

function sampleGpsPoints(value: unknown): LocalTripPoint[] {
  if (!Array.isArray(value)) return [];
  const points = value.filter((p): p is LocalTripPoint => Boolean(p) && Number.isFinite(Number((p as LocalTripPoint).latitude)) && Number.isFinite(Number((p as LocalTripPoint).longitude)));
  if (points.length <= MAX_REMOTE_GPS_POINTS) return points;
  const result: LocalTripPoint[] = [];
  const step = (points.length - 1) / (MAX_REMOTE_GPS_POINTS - 1);
  for (let i = 0; i < MAX_REMOTE_GPS_POINTS; i += 1) result.push(points[Math.round(i * step)]);
  return result;
}

async function uploadKmPhoto(session: Session, companyId: string, item: SyncItem): Promise<string | null> {
  const uri = typeof item.payload.photoUri === 'string' ? item.payload.photoUri : '';
  if (!uri) return null;
  const url = process.env.EXPO_PUBLIC_SUPABASE_URL?.replace(/\/$/, '');
  const key = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) throw new Error('Supabase não configurado nesta instalação.');
  const source = await fetch(uri);
  if (!source.ok) throw new Error('Não foi possível ler a foto do registro de KM.');
  const blob = await source.blob();
  const path = `${companyId}/${session.user.id}/odometer/${item.id}.jpg`;
  const upload = await fetch(`${url}/storage/v1/object/fleet-documents/${path}`, {
    method: 'POST',
    headers: {
      apikey: key,
      Authorization: `Bearer ${session.access_token}`,
      'Content-Type': blob.type || 'image/jpeg',
      'x-upsert': 'true',
    },
    body: blob,
  });
  if (!upload.ok) {
    const message = await upload.text();
    throw new Error(message || `Falha ao enviar foto HTTP ${upload.status}`);
  }
  return path;
}

async function mapMutation(item: SyncItem, session: Session, companyId: string): Promise<RemoteMutation> {
  if (item.entity === 'appointment') {
    const customerId = typeof item.payload.customerId === 'string' ? item.payload.customerId : '';
    if (!customerId) throw new Error('Compromisso sem loja vinculada permanece somente no aparelho.');
    const date = String(item.payload.date || '');
    const time = String(item.payload.time || '09:00');
    const start = toIso(date, time);
    const end = new Date(new Date(start).getTime() + 60 * 60 * 1000).toISOString();
    return {
      id: item.id,
      entity: 'visit',
      action: 'insert',
      createdAt: item.createdAt,
      payload: {
        customer_id: customerId,
        scheduled_start: start,
        scheduled_end: end,
        status: 'planned',
        purpose: String(item.payload.title || 'Visita'),
        notes: 'Criado pelo Movvant Mobile',
      },
    };
  }

  if (item.entity === 'km') {
    const vehicleId = typeof item.payload.vehicleId === 'string' ? item.payload.vehicleId : '';
    if (!vehicleId) throw new Error('Registro de KM sem veículo vinculado.');
    const photoPath = await uploadKmPhoto(session, companyId, item);
    const hasPhoto = Boolean(photoPath);
    return {
      id: item.id,
      entity: 'odometer_reading',
      action: 'insert',
      createdAt: item.createdAt,
      payload: {
        vehicle_id: vehicleId,
        reading_type: 'end',
        odometer_km: Number(item.payload.end || 0),
        photo_path: photoPath || 'not_provided',
        captured_at: String(item.payload.createdAt || item.createdAt),
        metadata: {
          source: 'movvant_mobile',
          start_km: Number(item.payload.start || 0),
          distance_km: Number(item.payload.total || 0),
          reason: String(item.payload.reason || ''),
          photo_attached_locally: hasPhoto,
        },
      },
    };
  }

  const started = Number(item.payload.startedAt || Date.now());
  const finished = Number(item.payload.finishedAt || Date.now());
  const date = new Date(started);
  const originalPoints = Array.isArray(item.payload.points) ? item.payload.points.length : 0;
  const remotePoints = sampleGpsPoints(item.payload.points);
  return {
    id: item.id,
    entity: 'route_plan',
    action: 'insert',
    createdAt: item.createdAt,
    payload: {
      route_type: 'field_trip',
      assigned_user_id: session.user.id,
      route_date: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`,
      status: 'completed',
      started_at: new Date(started).toISOString(),
      ended_at: new Date(finished).toISOString(),
      actual_distance_m: Math.max(0, Number(item.payload.distanceMeters || 0)),
      actual_duration_s: Math.max(0, Math.round(Number(item.payload.elapsedMs || 0) / 1000)),
      metadata: {
        source: 'movvant_mobile',
        return_start_index: item.payload.returnStart ?? null,
        gps_points: remotePoints,
        gps_points_original_count: originalPoints,
        gps_points_sampled: originalPoints > remotePoints.length,
      },
    },
  };
}

async function applyRemoteQueue(session: Session, queueId: string, retry: boolean) {
  const url = process.env.EXPO_PUBLIC_SUPABASE_URL?.replace(/\/$/, '');
  const key = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) throw new Error('Supabase não configurado nesta instalação.');
  const r = await fetch(`${url}/functions/v1/sync-apply`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: key,
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({ queue_id: queueId, retry }),
  });
  const text = await r.text();
  let body: Record<string, unknown> = {};
  if (text) try { body = JSON.parse(text) as Record<string, unknown>; } catch { body = { message: text }; }
  if (!r.ok || body.ok !== true) throw new Error(String(body.message || body.error || `Falha sync-apply HTTP ${r.status}`));
  return body;
}

async function findExistingRemote(session: Session, mutationId: string): Promise<RemoteQueueRow | null> {
  const rows = await restSelect<RemoteQueueRow>(session, 'sync_queue', `select=id,status,server_entity_id,error_message&client_mutation_id=eq.${encodeURIComponent(mutationId)}&user_id=eq.${encodeURIComponent(session.user.id)}&order=server_received_at.desc&limit=1`);
  return rows[0] || null;
}

async function findRemoteById(session: Session, id: string): Promise<RemoteQueueRow | null> {
  const rows = await restSelect<RemoteQueueRow>(session, 'sync_queue', `select=id,status,server_entity_id,error_message&id=eq.${encodeURIComponent(id)}&user_id=eq.${encodeURIComponent(session.user.id)}&limit=1`);
  return rows[0] || null;
}

async function pushAndApply(session: Session, companyId: string, item: SyncItem) {
  const mutation = await mapMutation(item, session, companyId);
  let row = await findExistingRemote(session, item.id);
  if (row?.status === 'synced') return;
  if (row?.status === 'processing') throw new Error('Registro já está sendo processado no servidor.');
  if (row?.status === 'cancelled') throw new Error('Registro foi cancelado no servidor.');

  if (!row) {
    const created = await enqueueRemote(session, companyId, mutation) as unknown as RemoteQueueRow[];
    row = created[0] || null;
  }
  if (!row?.id) throw new Error('Servidor não retornou o identificador da fila.');

  try {
    await applyRemoteQueue(session, row.id, row.status === 'failed' || row.status === 'conflict');
  } catch (e) {
    const latest = await findRemoteById(session, row.id).catch(() => null);
    const base = e instanceof Error ? e.message : 'Falha ao aplicar registro no servidor.';
    const serverMessage = latest?.error_message || row.error_message;
    throw new Error(serverMessage ? `${base} · servidor: ${serverMessage}` : base);
  }

  const latest = await findRemoteById(session, row.id).catch(() => null);
  if (latest?.status === 'failed' || latest?.status === 'conflict') throw new Error(latest.error_message || `Servidor retornou status ${latest.status}.`);
  if (latest?.status === 'cancelled') throw new Error('Registro foi cancelado no servidor.');
}

async function markLocalSynced(sent: SyncItem[]) {
  if (!sent.length) return;
  const ids = { appointment: new Set<string>(), km: new Set<string>(), trip: new Set<string>() };
  for (const item of sent) {
    const localId = typeof item.payload.localId === 'string' ? item.payload.localId : '';
    if (localId) ids[item.entity].add(localId);
  }
  await mutateLocal(state => ({
    appointments: state.appointments.map(x => ids.appointment.has(x.id) ? { ...x, synced: true } : x),
    km: state.km.map(x => ids.km.has(x.id) ? { ...x, synced: true } : x),
    trips: state.trips.map(x => ids.trip.has(x.id) ? { ...x, synced: true } : x),
  }));
}

export async function syncPending(session: Session, companyId: string): Promise<{ sent: number; pending: number; errors: string[]; issues: SyncIssue[]; skippedLocalOnly: number }> {
  const queue = await readQueue();
  if (!queue.length) {
    const empty: SyncReport = { attemptedAt: new Date().toISOString(), sent: 0, pending: 0, skippedLocalOnly: 0, issues: [] };
    await AsyncStorage.setItem(LAST_SYNC_REPORT_KEY, JSON.stringify(empty));
    return { sent: 0, pending: 0, errors: [], issues: [], skippedLocalOnly: 0 };
  }

  const localOnlyIds = queue.filter(isLocalOnlyAppointment).map(x => x.id);
  if (localOnlyIds.length) await removeQueued(localOnlyIds);

  const candidates = queue.filter(item => !localOnlyIds.includes(item.id));
  const sentIds: string[] = [];
  const sentItems: SyncItem[] = [];
  const issues: SyncIssue[] = [];

  for (const item of candidates) {
    try {
      await pushAndApply(session, companyId, item);
      sentIds.push(item.id);
      sentItems.push(item);
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Falha ao sincronizar registro.';
      issues.push({ entity: item.entity, localId: typeof item.payload.localId === 'string' ? item.payload.localId : null, message });
    }
  }

  if (sentIds.length) {
    await removeQueued(sentIds);
    await markLocalSynced(sentItems);
  }

  const pending = (await readQueue()).length;
  const labels = { appointment: 'agenda', km: 'km', trip: 'deslocamento' } as const;
  const errors = [...new Set(issues.map(issue => `${labels[issue.entity]}: ${issue.message}`))];
  const report: SyncReport = {
    attemptedAt: new Date().toISOString(),
    sent: sentIds.length,
    pending,
    skippedLocalOnly: localOnlyIds.length,
    issues,
  };
  await AsyncStorage.setItem(LAST_SYNC_REPORT_KEY, JSON.stringify(report));
  return { sent: sentIds.length, pending, errors, issues, skippedLocalOnly: localOnlyIds.length };
}
