export const BACKEND_RUNTIME_MODE = 'memory-only' as const;

export type BackendRuntimeMode = typeof BACKEND_RUNTIME_MODE | 'supabase-isolated';
export type EntityKind =
  | 'profile'
  | 'driver'
  | 'vehicle'
  | 'appointment'
  | 'route'
  | 'journey'
  | 'expense'
  | 'document'
  | 'maintenance'
  | 'incident';

export type AuthenticatedPrincipal = {
  userId: string;
  organizationId: string;
  role: string;
};

export type PersistenceRecord<T = unknown> = {
  id: string;
  organizationId: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  value: T;
};

export interface MovvantPersistencePort {
  mode: BackendRuntimeMode;
  load<T>(kind: EntityKind, principal: AuthenticatedPrincipal): Promise<PersistenceRecord<T>[]>;
  insert<T>(kind: EntityKind, principal: AuthenticatedPrincipal, value: T): Promise<PersistenceRecord<T>>;
  update<T>(kind: EntityKind, principal: AuthenticatedPrincipal, id: string, value: Partial<T>): Promise<PersistenceRecord<T>>;
}

export const backendReadiness = {
  runtimeMode: BACKEND_RUNTIME_MODE,
  authenticationConnected: false,
  persistenceConnected: false,
  storageConnected: false,
  mapsConnected: false,
  calendarConnected: false,
  requiresIsolatedSupabaseBranch: true
} as const;
