export type Session = {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
  expires_at?: number;
  token_type?: string;
  user: {
    id: string;
    email?: string;
    user_metadata?: Record<string, unknown>;
  };
};

export type DirectoryRow = {
  user_id: string;
  full_name?: string | null;
  email?: string | null;
  job_title?: string | null;
  company_id?: string | null;
  branch_id?: string | null;
  branch_name?: string | null;
  role_slug?: string | null;
  role_name?: string | null;
  scope_level?: string | null;
  assignment_active?: boolean | null;
};

export type BranchRow = { id: string; company_id: string; code?: string | null; name: string; city?: string | null; state?: string | null; active: boolean };
export type VehicleRow = { id: string; company_id: string; branch_id?: string | null; plate: string; make?: string | null; model?: string | null; current_odometer_km?: number | string | null; active: boolean };
export type VehicleAssignmentRow = { id: string; vehicle_id: string; user_id: string; starts_at: string; ends_at?: string | null; active: boolean };
export type CustomerRow = { id: string; company_id: string; branch_id?: string | null; legal_name: string; trade_name?: string | null; city?: string | null; state?: string | null; latitude?: number | string | null; longitude?: number | string | null; active: boolean };
export type VisitRow = { id: string; company_id: string; branch_id?: string | null; customer_id: string; seller_user_id: string; scheduled_start?: string | null; scheduled_end?: string | null; status: string; purpose?: string | null; notes?: string | null; checkin_at?: string | null; checkout_at?: string | null; geofence_valid?: boolean | null };
export type NotificationRow = { id: string; company_id: string; user_id: string; notification_type: string; title: string; body?: string | null; read_at?: string | null; created_at: string; priority: string };
export type PerformanceRow = { company_id?: string | null; branch_id?: string | null; user_id?: string | null; full_name?: string | null; visits_30d?: number | string | null; validated_visits_30d?: number | string | null; visit_validation_pct?: number | string | null; actual_km_30d?: number | string | null; routes_30d?: number | string | null; completed_routes_30d?: number | string | null; avg_adherence_pct?: number | string | null; orders_30d?: number | string | null; revenue_30d?: number | string | null };
export type RoutePlanRow = { id: string; company_id: string; branch_id?: string | null; route_type: string; assigned_user_id?: string | null; route_date: string; status: string; planned_distance_m?: number | string | null; planned_duration_s?: number | null; started_at?: string | null; ended_at?: string | null; actual_distance_m?: number | string | null; actual_duration_s?: number | null; adherence_pct?: number | string | null };

export type BootstrapData = {
  directory: DirectoryRow | null;
  companyId: string | null;
  branchId: string | null;
  branches: BranchRow[];
  vehicles: VehicleRow[];
  assignments: VehicleAssignmentRow[];
  customers: CustomerRow[];
  visits: VisitRow[];
  notifications: NotificationRow[];
  performance: PerformanceRow | null;
  routes: RoutePlanRow[];
  loadedAt: string;
  errors: string[];
};

function env() {
  const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
  const key = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) throw new Error('Supabase não configurado nesta instalação.');
  return { url: url.replace(/\/$/, ''), key };
}

async function parseResponse<T>(r: Response): Promise<T> {
  const text = await r.text();
  let data: unknown = null;
  if (text) {
    try { data = JSON.parse(text); } catch { data = text; }
  }
  if (!r.ok) {
    const obj = data as Record<string, unknown> | null;
    const message = String(obj?.message || obj?.msg || obj?.error_description || obj?.error || `HTTP ${r.status}`);
    throw new Error(message);
  }
  return data as T;
}

export async function signIn(email: string, password: string): Promise<Session> {
  const { url, key } = env();
  const r = await fetch(`${url}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', apikey: key },
    body: JSON.stringify({ email: email.trim(), password }),
  });
  return parseResponse<Session>(r);
}

export async function refreshSession(session: Session): Promise<Session> {
  if (!session.refresh_token) return session;
  const { url, key } = env();
  const r = await fetch(`${url}/auth/v1/token?grant_type=refresh_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', apikey: key },
    body: JSON.stringify({ refresh_token: session.refresh_token }),
  });
  return parseResponse<Session>(r);
}

function headers(session: Session, extra?: Record<string, string>) {
  const { key } = env();
  return {
    apikey: key,
    Authorization: `Bearer ${session.access_token}`,
    'Content-Type': 'application/json',
    ...extra,
  };
}

export async function restSelect<T>(session: Session, table: string, query: string): Promise<T[]> {
  const { url } = env();
  const r = await fetch(`${url}/rest/v1/${table}?${query}`, { headers: headers(session) });
  return parseResponse<T[]>(r);
}

export async function restInsert<T>(session: Session, table: string, payload: unknown): Promise<T[]> {
  const { url } = env();
  const r = await fetch(`${url}/rest/v1/${table}`, {
    method: 'POST',
    headers: headers(session, { Prefer: 'return=representation' }),
    body: JSON.stringify(payload),
  });
  return parseResponse<T[]>(r);
}

export async function restPatch<T>(session: Session, table: string, filter: string, payload: unknown): Promise<T[]> {
  const { url } = env();
  const r = await fetch(`${url}/rest/v1/${table}?${filter}`, {
    method: 'PATCH',
    headers: headers(session, { Prefer: 'return=representation' }),
    body: JSON.stringify(payload),
  });
  return parseResponse<T[]>(r);
}

async function safe<T>(fn: () => Promise<T>, fallback: T, errors: string[], label: string): Promise<T> {
  try { return await fn(); } catch (e) { errors.push(`${label}: ${e instanceof Error ? e.message : 'falha'}`); return fallback; }
}

function enc(v: string) { return encodeURIComponent(v); }

export async function loadBootstrap(session: Session): Promise<BootstrapData> {
  const errors: string[] = [];
  const userId = session.user?.id;
  if (!userId) throw new Error('Sessão sem identificação de usuário.');

  const directoryRows = await safe(
    () => restSelect<DirectoryRow>(session, 'v_user_directory', `select=*&user_id=eq.${enc(userId)}&assignment_active=eq.true&order=starts_at.desc.nullslast&limit=10`),
    [], errors, 'perfil empresarial',
  );
  const directory = directoryRows[0] || null;
  const companyId = directory?.company_id || null;
  const branchId = directory?.branch_id || null;

  if (!companyId) {
    return { directory, companyId: null, branchId, branches: [], vehicles: [], assignments: [], customers: [], visits: [], notifications: [], performance: null, routes: [], loadedAt: new Date().toISOString(), errors: [...errors, 'Usuário sem empresa ativa vinculada.'] };
  }

  const now = new Date();
  const start = new Date(now); start.setDate(start.getDate() - 45);
  const end = new Date(now); end.setDate(end.getDate() + 90);
  const startIso = start.toISOString();
  const endIso = end.toISOString();

  const [branches, assignments, vehicles, customers, visits, notifications, performanceRows, routes] = await Promise.all([
    safe(() => restSelect<BranchRow>(session, 'branches', `select=id,company_id,code,name,city,state,active&company_id=eq.${enc(companyId)}&active=eq.true&order=name.asc`), [], errors, 'lojas'),
    safe(() => restSelect<VehicleAssignmentRow>(session, 'vehicle_assignments', `select=id,vehicle_id,user_id,starts_at,ends_at,active&user_id=eq.${enc(userId)}&active=eq.true&order=starts_at.desc`), [], errors, 'veículos atribuídos'),
    safe(() => restSelect<VehicleRow>(session, 'vehicles', `select=id,company_id,branch_id,plate,make,model,current_odometer_km,active&company_id=eq.${enc(companyId)}&active=eq.true&order=plate.asc`), [], errors, 'veículos'),
    safe(() => restSelect<CustomerRow>(session, 'customers', `select=id,company_id,branch_id,legal_name,trade_name,city,state,latitude,longitude,active&company_id=eq.${enc(companyId)}&active=eq.true&order=trade_name.asc.nullslast,legal_name.asc&limit=500`), [], errors, 'clientes'),
    safe(() => restSelect<VisitRow>(session, 'visits', `select=id,company_id,branch_id,customer_id,seller_user_id,scheduled_start,scheduled_end,status,purpose,notes,checkin_at,checkout_at,geofence_valid&seller_user_id=eq.${enc(userId)}&scheduled_start=gte.${enc(startIso)}&scheduled_start=lte.${enc(endIso)}&order=scheduled_start.asc&limit=500`), [], errors, 'agenda'),
    safe(() => restSelect<NotificationRow>(session, 'notifications', `select=id,company_id,user_id,notification_type,title,body,read_at,created_at,priority&user_id=eq.${enc(userId)}&order=created_at.desc&limit=100`), [], errors, 'notificações'),
    safe(() => restSelect<PerformanceRow>(session, 'v_field_commercial_performance_30d', `select=*&user_id=eq.${enc(userId)}&limit=1`), [], errors, 'indicadores'),
    safe(() => restSelect<RoutePlanRow>(session, 'route_plans', `select=id,company_id,branch_id,route_type,assigned_user_id,route_date,status,planned_distance_m,planned_duration_s,started_at,ended_at,actual_distance_m,actual_duration_s,adherence_pct&assigned_user_id=eq.${enc(userId)}&route_date=gte.${enc(startIso.slice(0,10))}&route_date=lte.${enc(endIso.slice(0,10))}&order=route_date.desc&limit=200`), [], errors, 'rotas'),
  ]);

  return { directory, companyId, branchId, branches, vehicles, assignments, customers, visits, notifications, performance: performanceRows[0] || null, routes, loadedAt: new Date().toISOString(), errors };
}

export async function markNotificationRead(session: Session, id: string) {
  return restPatch<NotificationRow>(session, 'notifications', `id=eq.${enc(id)}`, { read_at: new Date().toISOString() });
}

export async function enqueueRemote(session: Session, companyId: string, item: { id: string; entity: string; action: string; payload: Record<string, unknown>; createdAt: string }) {
  return restInsert(session, 'sync_queue', {
    company_id: companyId,
    user_id: session.user.id,
    entity_type: item.entity,
    entity_id: item.id,
    operation: item.action,
    payload: item.payload,
    client_created_at: item.createdAt,
    client_mutation_id: item.id,
  });
}
