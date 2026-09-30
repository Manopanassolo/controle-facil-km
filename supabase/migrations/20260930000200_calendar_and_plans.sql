-- Controle Fácil KM V1: Google Calendar + Plans
-- Independent from Movvant.

create table if not exists public.calendar_connections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  provider text not null default 'google'
    check (provider = 'google'),
  google_account_email text,
  calendar_id text not null default 'primary',
  calendar_name text,
  timezone text,
  scope text,
  connected_at timestamptz not null default now(),
  last_sync_at timestamptz,
  sync_status text not null default 'idle'
    check (sync_status in ('idle','syncing','synced','error','revoked')),
  sync_error text,
  next_sync_token text,
  access_token text,
  refresh_token text,
  token_expires_at timestamptz,
  revoked_at timestamptz,
  version integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, provider)
);

create table if not exists public.calendar_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  connection_id uuid not null references public.calendar_connections(id) on delete cascade,
  google_event_id text,
  google_etag text,
  local_event_id uuid,
  title text not null,
  description text,
  location text,
  start_at timestamptz,
  end_at timestamptz,
  all_day boolean not null default false,
  status text not null default 'confirmed'
    check (status in ('confirmed','tentative','cancelled')),
  html_link text,
  sync_version integer not null default 1,
  version integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  unique (connection_id, google_event_id)
);

create index if not exists calendar_connections_user_idx
  on public.calendar_connections(user_id);

create index if not exists calendar_events_user_start_idx
  on public.calendar_events(user_id, start_at);

create index if not exists calendar_events_connection_idx
  on public.calendar_events(connection_id, updated_at desc);

alter table public.calendar_connections enable row level security;
alter table public.calendar_events enable row level security;

revoke all on table public.calendar_connections, public.calendar_events from anon;
grant select, insert, update, delete on table public.calendar_connections, public.calendar_events to authenticated;

create policy calendar_connections_select_own on public.calendar_connections
for select to authenticated using ((select auth.uid()) = user_id);
create policy calendar_connections_insert_own on public.calendar_connections
for insert to authenticated with check ((select auth.uid()) = user_id);
create policy calendar_connections_update_own on public.calendar_connections
for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy calendar_connections_delete_own on public.calendar_connections
for delete to authenticated using ((select auth.uid()) = user_id);

create policy calendar_events_select_own on public.calendar_events
for select to authenticated using ((select auth.uid()) = user_id);
create policy calendar_events_insert_own on public.calendar_events
for insert to authenticated with check ((select auth.uid()) = user_id);
create policy calendar_events_update_own on public.calendar_events
for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy calendar_events_delete_own on public.calendar_events
for delete to authenticated using ((select auth.uid()) = user_id);

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan_code text not null default 'free'
    check (plan_code in ('free','premium')),
  status text not null default 'active'
    check (status in ('active','trialing','past_due','cancelled','expired')),
  provider text,
  provider_customer_id text,
  provider_subscription_id text,
  started_at timestamptz not null default now(),
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancelled_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id)
);

create table if not exists public.subscription_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  subscription_id uuid references public.subscriptions(id) on delete set null,
  provider text,
  provider_event_id text,
  event_type text not null,
  payload jsonb,
  created_at timestamptz not null default now(),
  unique (provider, provider_event_id)
);

create table if not exists public.entitlements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  feature_code text not null,
  enabled boolean not null default false,
  source text not null default 'plan',
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, feature_code)
);

create index if not exists subscriptions_user_idx on public.subscriptions(user_id);
create index if not exists subscription_events_user_idx on public.subscription_events(user_id, created_at desc);
create index if not exists entitlements_user_idx on public.entitlements(user_id);

alter table public.subscriptions enable row level security;
alter table public.subscription_events enable row level security;
alter table public.entitlements enable row level security;

revoke all on table public.subscriptions, public.subscription_events, public.entitlements from anon;
grant select on table public.subscriptions, public.subscription_events, public.entitlements to authenticated;

create policy subscriptions_select_own on public.subscriptions
for select to authenticated using ((select auth.uid()) = user_id);

create policy subscription_events_select_own on public.subscription_events
for select to authenticated using ((select auth.uid()) = user_id);

create policy entitlements_select_own on public.entitlements
for select to authenticated using ((select auth.uid()) = user_id);

create or replace function private.ensure_free_subscription()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.subscriptions(user_id, plan_code, status)
  values (new.id, 'free', 'active')
  on conflict (user_id) do nothing;

  return new;
end;
$$;

revoke execute on function private.ensure_free_subscription() from public, anon, authenticated;

drop trigger if exists profile_free_subscription_after_insert on public.profiles;
create trigger profile_free_subscription_after_insert
after insert on public.profiles
for each row execute function private.ensure_free_subscription();

create or replace function private.calendar_updated()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.version = old.version + 1;
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists calendar_connections_version on public.calendar_connections;
create trigger calendar_connections_version
before update on public.calendar_connections
for each row execute function private.calendar_updated();

drop trigger if exists calendar_events_version on public.calendar_events;
create trigger calendar_events_version
before update on public.calendar_events
for each row execute function private.calendar_updated();

drop trigger if exists subscriptions_updated_at on public.subscriptions;
create trigger subscriptions_updated_at
before update on public.subscriptions
for each row execute function private.set_updated_at();

drop trigger if exists entitlements_updated_at on public.entitlements;
create trigger entitlements_updated_at
before update on public.entitlements
for each row execute function private.set_updated_at();
