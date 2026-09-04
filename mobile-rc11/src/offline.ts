import AsyncStorage from '@react-native-async-storage/async-storage';
import { enqueueRemote, Session } from './api';

const QUEUE_KEY = 'movvant.rc11.syncQueue';
const STATE_KEY = 'movvant.rc11.localState';

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

export type LocalTripRecord = {
  id: string;
  startedAt: number | null;
  finishedAt: number;
  elapsedMs: number;
  distanceMeters: number;
  returnStart: number | null;
  pointsCount: number;
  synced?: boolean;
};

export type LocalState = {
  appointments: LocalAppointment[];
  km: LocalKmRecord[];
  trips: LocalTripRecord[];
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

export async function saveKmLocal(item: LocalKmRecord) {
  return mutateLocal(state => ({ ...state, km: [item, ...state.km.filter(x => x.id !== item.id)].slice(0, 500) }));
}

export async function saveTripLocal(item: LocalTripRecord) {
  return mutateLocal(state => ({ ...state, trips: [item, ...state.trips.filter(x => x.id !== item.id)].slice(0, 300) }));
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

export async function removeQueued(ids: string[]): Promise<SyncItem[]> {
  const queue = await readQueue();
  const updated = queue.filter(item => !ids.includes(item.id));
  await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(updated));
  return updated;
}

export async function syncPending(session: Session, companyId: string): Promise<{ sent: number; pending: number; errors: string[] }> {
  const queue = await readQueue();
  if (!queue.length) return { sent: 0, pending: 0, errors: [] };
  const sentIds: string[] = [];
  const errors: string[] = [];
  for (const item of queue) {
    try {
      await enqueueRemote(session, companyId, item);
      sentIds.push(item.id);
    } catch (e) {
      errors.push(e instanceof Error ? e.message : 'Falha ao sincronizar registro.');
    }
  }
  if (sentIds.length) await removeQueued(sentIds);
  const pending = (await readQueue()).length;
  return { sent: sentIds.length, pending, errors };
}
