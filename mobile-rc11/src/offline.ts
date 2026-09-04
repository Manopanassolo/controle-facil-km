import AsyncStorage from '@react-native-async-storage/async-storage';

const QUEUE_KEY = 'movvant.rc11.syncQueue';
const STATE_KEY = 'movvant.rc11.localState';

export type SyncItem = {
  id: string;
  entity: 'appointment' | 'km' | 'trip';
  action: 'insert' | 'update' | 'finish';
  payload: Record<string, unknown>;
  createdAt: string;
};

export async function loadLocalState<T>(fallback: T): Promise<T> {
  const raw = await AsyncStorage.getItem(STATE_KEY);
  if (!raw) return fallback;
  try { return JSON.parse(raw) as T; } catch { return fallback; }
}

export async function saveLocalState<T>(state: T): Promise<void> {
  await AsyncStorage.setItem(STATE_KEY, JSON.stringify(state));
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
